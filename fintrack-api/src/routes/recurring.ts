import { Hono } from 'hono';
import { z } from 'zod';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

const recurringRuleSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number().int().positive().default(1),
  start_date: z.string(),
  next_due: z.string(),
  template_json: z.string(), // Client sends JSON string
  is_active: z.boolean().default(true),
});

// GET /recurring
app.get('/', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM recurring_rules ORDER BY next_due ASC').all();
  
  // Parse JSON for client
  const parsed = results.map((r: any) => ({
    ...r,
    template: JSON.parse(r.template_json),
    active: r.is_active === 1
  }));
  
  return c.json({ success: true, data: parsed });
});

// POST /recurring
app.post('/', async (c) => {
  const body = await c.req.json();
  const result = recurringRuleSchema.safeParse(body);

  if (!result.success) {
    return c.json({ success: false, error: result.error }, 400);
  }

  const { frequency, interval, start_date, next_due, template_json, is_active } = result.data;
  const id = crypto.randomUUID();

  try {
    await c.env.DB.prepare(
      'INSERT INTO recurring_rules (id, frequency, interval, start_date, next_due, template_json, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, frequency, interval, start_date, next_due, template_json, is_active ? 1 : 0).run();

    return c.json({ success: true, data: { id, ...result.data } }, 201);
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

// PUT /recurring/:id
app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  // Allow partial updates
  const schema = recurringRuleSchema.partial();
  const result = schema.safeParse(body);

  if (!result.success) return c.json({ success: false, error: result.error }, 400);

  const updates = result.data;
  const keys = Object.keys(updates);
  if (keys.length === 0) return c.json({ success: true });

  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => {
    // Map boolean to integer for sqlite
    if (k === 'is_active') return (updates as any)[k] ? 1 : 0;
    return (updates as any)[k];
  });

  try {
    await c.env.DB.prepare(`UPDATE recurring_rules SET ${setClause}, updated_at = datetime('now') WHERE id = ?`)
      .bind(...values, id).run();
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

// DELETE /recurring/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM recurring_rules WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

export default app;
