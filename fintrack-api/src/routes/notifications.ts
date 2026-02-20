import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../middleware/auth';

type Bindings = {
  DB: D1Database;
};

const notificationRouter = new Hono<{ Bindings: Bindings, Variables: { user: any } }>();

notificationRouter.use('*', authMiddleware);

// Get all notifications for the user
notificationRouter.get('/', async (c) => {
  const userId = c.get('user').userId;
  
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
    ).bind(userId).all();
    
    // Check for unread count
    const unread = await c.env.DB.prepare(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0'
    ).bind(userId).first('count');

    return c.json({ results, unreadCount: unread });
  } catch (error) {
    return c.json({ error: 'Failed to fetch notifications' }, 500);
  }
});

// Mark a notification as read
notificationRouter.patch('/:id/read', async (c) => {
  const userId = c.get('user').userId;
  const notificationId = c.req.param('id');

  try {
    await c.env.DB.prepare(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?'
    ).bind(notificationId, userId).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update notification' }, 500);
  }
});

// Mark ALL notifications as read
notificationRouter.patch('/read-all', async (c) => {
  const userId = c.get('user').userId;

  try {
    await c.env.DB.prepare(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ?'
    ).bind(userId).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to mark all as read' }, 500);
  }
});

// Create a notification (Internal/Admin use mostly, but good to have route for testing)
// In a real app, this might be triggered by events, not direct API call from frontend usually.
// But we'll allow it for now to test the feature.
const createNotificationSchema = z.object({
    title: z.string(),
    message: z.string(),
    type: z.enum(['info', 'success', 'warning', 'error']).optional().default('info'),
});

notificationRouter.post('/', zValidator('json', createNotificationSchema), async (c) => {
    const userId = c.get('user').userId;
    const { title, message, type } = c.req.valid('json');
    const id = crypto.randomUUID();

    try {
        await c.env.DB.prepare(
            'INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)'
        ).bind(id, userId, title, message, type).run();

        return c.json({ success: true, id }, 201);
    } catch (error) {
        return c.json({ error: 'Failed to create notification' }, 500);
    }
});

export default notificationRouter;
