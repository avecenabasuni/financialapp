import { Hono } from 'hono';
import { z } from 'zod';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

const goalSchema = z.object({
  name: z.string().min(1),
  target_amount: z.number().int().positive(),
  current_amount: z.number().int().min(0).optional().default(0),
  deadline: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  user_id: z.string().optional(), // In a real app this would come from auth context
});

const contributeSchema = z.object({
  amount: z.number().int().positive(),
  wallet_id: z.string(), // We need a wallet to withdraw funds from
  date: z.string(),
});

// GET /goals
app.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT 
      id, name, target_amount as targetAmount, current_amount as currentAmount,
      deadline, color, icon, created_at, updated_at
    FROM goals
    ORDER BY created_at DESC
  `).all();
  return c.json({ success: true, data: results });
});

// POST /goals
app.post('/', async (c) => {
  const body = await c.req.json();
  const result = goalSchema.safeParse(body);

  if (!result.success) {
    return c.json({ success: false, error: result.error }, 400);
  }

  const { name, target_amount, current_amount, deadline, color, icon, user_id } = result.data;
  const id = crypto.randomUUID();

  try {
    await c.env.DB.prepare(
      'INSERT INTO goals (id, name, target_amount, current_amount, deadline, color, icon, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, name, target_amount, current_amount, deadline || null, color || null, icon || null, user_id || null).run();

    return c.json({ success: true, id }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// PUT /goals/:id
app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const result = goalSchema.safeParse(body);

  if (!result.success) {
    return c.json({ success: false, error: result.error }, 400);
  }

  const { name, target_amount, current_amount, deadline, color, icon } = result.data;

  try {
    const { success } = await c.env.DB.prepare(
      'UPDATE goals SET name = ?, target_amount = ?, current_amount = ?, deadline = ?, color = ?, icon = ?, updated_at = datetime("now") WHERE id = ?'
    ).bind(name, target_amount, current_amount, deadline || null, color || null, icon || null, id).run();

    if (success) {
      return c.json({ success: true });
    } else {
      return c.json({ success: false, error: 'Goal not found' }, 404);
    }
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// DELETE /goals/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const { success } = await c.env.DB.prepare('DELETE FROM goals WHERE id = ?').bind(id).run();
    if (success) {
      return c.json({ success: true });
    } else {
      return c.json({ success: false, error: 'Goal not found' }, 404);
    }
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// POST /goals/:id/contribute
app.post('/:id/contribute', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const result = contributeSchema.safeParse(body);

  if (!result.success) {
    return c.json({ success: false, error: result.error }, 400);
  }

  const { amount, wallet_id, date } = result.data;

  // We need to fetch the goal and the wallet to ensure they exist and have sufficient funds
  const goal: any = await c.env.DB.prepare('SELECT name FROM goals WHERE id = ?').bind(id).first();
  if (!goal) return c.json({ success: false, error: 'Goal not found' }, 404);

  const wallet: any = await c.env.DB.prepare('SELECT balance FROM wallets WHERE id = ?').bind(wallet_id).first();
  if (!wallet) return c.json({ success: false, error: 'Wallet not found' }, 404);
  if (wallet.balance < amount) return c.json({ success: false, error: 'Insufficient funds in wallet' }, 400);

  // We are treating a goal contribution as a specialized "expense" from the wallet 
  // and adding the balance into the goal's `current_amount`.
  const transactionId = crypto.randomUUID();
  try {
    const batch = await c.env.DB.batch([
      // 1. Create the outgoing transaction
      c.env.DB.prepare(
        'INSERT INTO transactions (id, type, amount, wallet_id, date, note) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(transactionId, 'expense', amount, wallet_id, date, `Contribution to goal: ${goal.name}`),
      
      // 2. Derease wallet balance
      c.env.DB.prepare(
        'UPDATE wallets SET balance = balance - ?, updated_at = datetime("now") WHERE id = ?'
      ).bind(amount, wallet_id),
      
      // 3. Increase goal current_amount
      c.env.DB.prepare(
        'UPDATE goals SET current_amount = current_amount + ?, updated_at = datetime("now") WHERE id = ?'
      ).bind(amount, id)
    ]);
    
    return c.json({ success: true });
  } catch(error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default app;
