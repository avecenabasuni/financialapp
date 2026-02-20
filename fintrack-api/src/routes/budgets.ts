import { Hono } from 'hono';
import { z } from 'zod';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

const budgetSchema = z.object({
  category_id: z.string(),
  amount: z.number().int().positive(),
  month: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM
});

// GET /budgets?month=YYYY-MM
app.get('/', async (c) => {
  const month = c.req.query('month');
  if (!month) return c.json({ success: false, error: 'Month required' }, 400);

  const { results } = await c.env.DB.prepare(
    `SELECT 
       b.*, 
       c.name as category_name, 
       c.icon as category_icon, 
       c.color as category_color,
       (
         SELECT COALESCE(SUM(amount), 0)
         FROM transactions t
         WHERE t.category_id = b.category_id
           AND t.type = 'expense'
           AND t.date LIKE ? || '%'
       ) as spent
     FROM budgets b 
     JOIN categories c ON b.category_id = c.id 
     WHERE b.month = ?`
  ).bind(month, month).all();
  
  return c.json({ success: true, data: results });
});

// POST /budgets (Upsert)
app.post('/', async (c) => {
  const body = await c.req.json();
  const result = budgetSchema.safeParse(body);

  if (!result.success) {
    return c.json({ success: false, error: result.error }, 400);
  }

  const { category_id, amount, month } = result.data;
  const id = crypto.randomUUID();

  // Upsert: Insert or Update if exists
  await c.env.DB.prepare(`
    INSERT INTO budgets (id, category_id, amount, month) VALUES (?, ?, ?, ?)
    ON CONFLICT(category_id, month) DO UPDATE SET amount = excluded.amount, updated_at = datetime('now')
  `).bind(id, category_id, amount, month).run();

  const budget = await c.env.DB.prepare(`
    SELECT 
      b.*, 
      c.name as category_name, 
      c.icon as category_icon, 
      c.color as category_color,
      (
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions t
        WHERE t.category_id = b.category_id
          AND t.type = 'expense'
          AND t.date LIKE ? || '%'
      ) as spent
    FROM budgets b 
    JOIN categories c ON b.category_id = c.id 
    WHERE b.category_id = ? AND b.month = ?
  `).bind(month, category_id, month).first();
  return c.json({ success: true, data: budget });
});

// PUT /budgets/:id (Update Amount)
app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const amount = body.amount;

  if (!amount || amount <= 0) {
      return c.json({ success: false, error: 'Invalid amount' }, 400);
  }

  await c.env.DB.prepare('UPDATE budgets SET amount = ?, updated_at = datetime("now") WHERE id = ?').bind(amount, id).run();
  
  // Return updated budget
  // Return updated budget
  const budget = await c.env.DB.prepare(`
    SELECT 
      b.*, 
      c.name as category_name, 
      c.icon as category_icon, 
      c.color as category_color,
      (
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions t
        WHERE t.category_id = b.category_id
          AND t.type = 'expense'
          AND t.date LIKE b.month || '%'
      ) as spent
    FROM budgets b 
    JOIN categories c ON b.category_id = c.id 
    WHERE b.id = ?
  `).bind(id).first();
  return c.json({ success: true, data: budget });
});

// DELETE /budgets/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM budgets WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

export default app;
