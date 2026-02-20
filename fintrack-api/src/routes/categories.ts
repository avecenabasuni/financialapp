import { Hono } from 'hono';
import { z } from 'zod';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

const categorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(['income', 'expense']),
  icon: z.string().optional(),
  color: z.string().optional(),
  group: z.enum(['needs', 'wants', 'savings']).optional().default('wants'),
});

// GET /categories
app.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM categories ORDER BY type, "group", name'
  ).all();
  return c.json({ success: true, data: results });
});

// POST /categories
app.post('/', async (c) => {
  const body = await c.req.json();
  const result = categorySchema.safeParse(body);

  if (!result.success) {
    return c.json({ success: false, error: result.error }, 400);
  }

  const { name, type, icon, color, group } = result.data;
  const id = crypto.randomUUID();

  await c.env.DB.prepare(
    'INSERT INTO categories (id, name, type, icon, color, "group") VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, name, type, icon, color, group || 'wants').run();

  const category = await c.env.DB.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: category }, 201);
});

// PUT /categories/:id
app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const result = categorySchema.partial().safeParse(body);

  if (!result.success) { return c.json({ success: false, error: result.error }, 400); }

  const updates: string[] = [];
  const values: any[] = [];
  Object.entries(result.data).forEach(([key, value]) => {
    if (key === 'group') {
       updates.push(`"group" = ?`);
    } else {
       updates.push(`${key} = ?`);
    }
    values.push(value);
  });

  if (updates.length > 0) {
    values.push(new Date().toISOString());
    values.push(id);
    await c.env.DB.prepare(`UPDATE categories SET ${updates.join(', ')}, updated_at = ? WHERE id = ?`).bind(...values).run();
  }

  const category = await c.env.DB.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first();
  return c.json({ success: true, data: category });
});

// DELETE /categories/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  // Check for usage
  const used = await c.env.DB.prepare('SELECT 1 FROM transactions WHERE category_id = ?').bind(id).first();
  if (used) {
    return c.json({ success: false, error: 'Category is in use' }, 400);
  }
  await c.env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

export default app;
