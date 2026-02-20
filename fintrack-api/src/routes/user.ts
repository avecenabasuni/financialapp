import { Hono } from 'hono';
import { z } from 'zod';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// GET /user
app.get('/', async (c) => {
  const user = await c.env.DB.prepare("SELECT * FROM user_preferences WHERE id = 'user'").first();
  
  if (!user) {
    // Return default if not found
    return c.json({ 
      success: true, 
      data: { 
        name: 'User', 
        email: 'user@example.com', 
        initials: 'US', 
        currency: 'IDR', 
        preferences: {} 
      } 
    });
  }

  return c.json({ 
    success: true, 
    data: {
      ...user,
      preferences: user.notifications_json ? JSON.parse(user.notifications_json as string) : {}
    } 
  });
});

// PUT /user
app.put('/', async (c) => {
  const body = await c.req.json();
  
  // Upsert logic
  const { name, email, initials, currency, preferences } = body;
  const notifications_json = preferences ? JSON.stringify(preferences) : null;

  try {
    await c.env.DB.prepare(`
      INSERT INTO user_preferences (id, name, email, initials, currency, notifications_json, updated_at)
      VALUES ('user', ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        email = excluded.email,
        initials = excluded.initials,
        currency = excluded.currency,
        notifications_json = excluded.notifications_json,
        updated_at = datetime('now')
    `).bind(name, email, initials, currency, notifications_json).run();

    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

export default app;
