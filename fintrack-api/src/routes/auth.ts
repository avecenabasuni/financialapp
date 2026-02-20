import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import * as bcrypt from 'bcryptjs';

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

const auth = new Hono<{ Bindings: Bindings }>();

auth.post('/register', async (c) => {
  const { username, password } = await c.req.json();

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }

  // Check if user exists
  const existingUser = await c.env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
  if (existingUser) {
    return c.json({ error: 'Username already exists' }, 400);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const id = crypto.randomUUID();

  // Create user
  try {
    await c.env.DB.prepare(
      'INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)'
    ).bind(id, username, passwordHash).run();
    
    // Create default user preferences
    await c.env.DB.prepare(
       'INSERT OR IGNORE INTO user_preferences (id, name, email, initials) VALUES (?, ?, ?, ?)'
    ).bind('user', username, '', username.substring(0, 2).toUpperCase()).run();

    return c.json({ message: 'User created successfully' }, 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

auth.post('/login', async (c) => {
  const { username, password } = await c.req.json();

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first<{ id: string, username: string, password_hash: string }>();

  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  // Generate JWT
  const payload = {
    sub: user.id,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
  };
  
  const token = await sign(payload, c.env.JWT_SECRET);

  return c.json({ token, user: { id: user.id, username: user.username } });
});

auth.get('/me', async (c) => {
  // This route should be protected by middleware in the main app
  const payload = c.get('jwtPayload');
  if (!payload) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  return c.json({ user: payload });
});

export default auth;
