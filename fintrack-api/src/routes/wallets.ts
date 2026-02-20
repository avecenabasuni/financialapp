import { Hono } from 'hono';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Schemas
const walletSchema = z.object({
  name: z.string().min(1),
  type: z.string().default('other'),
  initial_balance: z.number().int().default(0),
  currency: z.string().default('IDR'),
  balance: z.number().int().optional(),
});

// GET /wallets
app.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM wallets WHERE is_archived = 0 ORDER BY created_at DESC'
  ).all();
  return c.json({ success: true, data: results });
});

// POST /wallets
app.post('/', async (c) => {
  const body = await c.req.json();
  const result = walletSchema.safeParse(body);
  
  if (!result.success) {
    return c.json({ success: false, error: result.error }, 400);
  }

  const { name, type, initial_balance, currency } = result.data;
  const id = crypto.randomUUID();
  const balance = result.data.balance ?? initial_balance;

  await c.env.DB.prepare(
    'INSERT INTO wallets (id, name, type, initial_balance, balance, currency) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, name, type, initial_balance, balance, currency).run();

  const wallet = await c.env.DB.prepare('SELECT * FROM wallets WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: wallet }, 201);
});

// PUT /wallets/:id
app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const result = walletSchema.partial().safeParse(body);

  if (!result.success) {
    return c.json({ success: false, error: result.error }, 400);
  }

  // Build dynamic update query
  const updates: string[] = [];
  const values: any[] = [];
  
  Object.entries(result.data).forEach(([key, value]) => {
    updates.push(`${key} = ?`);
    values.push(value);
  });
  
  if (updates.length === 0) return c.json({ success: true });

  values.push(new Date().toISOString()); // updated_at
  values.push(id);

  const query = `UPDATE wallets SET ${updates.join(', ')}, updated_at = ? WHERE id = ?`;
  await c.env.DB.prepare(query).bind(...values).run();

  const wallet = await c.env.DB.prepare('SELECT * FROM wallets WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: wallet });
});

// DELETE /wallets/:id (Soft delete)
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('UPDATE wallets SET is_archived = 1 WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

export default app;
