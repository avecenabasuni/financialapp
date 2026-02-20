import { Hono } from 'hono';
import { z } from 'zod';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

const subscriptionSchema = z.object({
  name: z.string().min(1),
  amount: z.number().int().positive(),
  category_id: z.string().optional(),
  frequency: z.enum(['monthly', 'yearly']),
  next_billing_date: z.string(),
  status: z.enum(['active', 'paused', 'cancelled']).optional().default('active'),
  user_id: z.string().optional(),
});

// GET /subscriptions
app.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT 
      s.id, s.name, s.amount, s.frequency, s.next_billing_date as nextBillingDate,
      s.status, s.created_at, s.updated_at,
      s.category_id as categoryId, c.name as categoryName, c.icon as categoryIcon, c.color as categoryColor
    FROM subscriptions s
    LEFT JOIN categories c ON s.category_id = c.id
    ORDER BY s.next_billing_date ASC
  `).all();
  return c.json({ success: true, data: results });
});

// POST /subscriptions
app.post('/', async (c) => {
  const body = await c.req.json();
  const result = subscriptionSchema.safeParse(body);

  if (!result.success) {
    return c.json({ success: false, error: result.error }, 400);
  }

  const { name, amount, category_id, frequency, next_billing_date, status, user_id } = result.data;
  const id = crypto.randomUUID();

  try {
    await c.env.DB.prepare(
      'INSERT INTO subscriptions (id, name, amount, category_id, frequency, next_billing_date, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, name, amount, category_id || null, frequency, next_billing_date, status, user_id || null).run();

    return c.json({ success: true, id }, 201);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// PUT /subscriptions/:id
app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const result = subscriptionSchema.safeParse(body);

  if (!result.success) {
    return c.json({ success: false, error: result.error }, 400);
  }

  const { name, amount, category_id, frequency, next_billing_date, status } = result.data;

  try {
    const { success } = await c.env.DB.prepare(
      'UPDATE subscriptions SET name = ?, amount = ?, category_id = ?, frequency = ?, next_billing_date = ?, status = ?, updated_at = datetime("now") WHERE id = ?'
    ).bind(name, amount, category_id || null, frequency, next_billing_date, status, id).run();

    if (success) {
      return c.json({ success: true });
    } else {
      return c.json({ success: false, error: 'Subscription not found' }, 404);
    }
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// DELETE /subscriptions/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const { success } = await c.env.DB.prepare('DELETE FROM subscriptions WHERE id = ?').bind(id).run();
    if (success) {
      return c.json({ success: true });
    } else {
      return c.json({ success: false, error: 'Subscription not found' }, 404);
    }
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default app;
