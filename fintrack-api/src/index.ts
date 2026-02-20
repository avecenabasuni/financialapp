import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

import wallets from './routes/wallets';
import categories from './routes/categories';
import transactions from './routes/transactions';
import budgets from './routes/budgets';
import recurring from './routes/recurring';
import user from './routes/user';
import auth from './routes/auth'; // Import auth routes
import { dashboardRouter } from './routes/dashboard';
import { statsRouter } from './routes/stats';
import { authMiddleware } from './middleware/auth'; // Import middleware
import notificationRouter from './routes/notifications';
import goals from './routes/goals';
import subscriptions from './routes/subscriptions';
import exportCSV from './routes/export';

// Middleware
app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'https://fintrack-frontend.pages.dev'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
);

// Public Routes
app.route('/auth', auth);

// Protected Routes
app.use('/*', authMiddleware); // Apply to all subsequent routes

app.route('/wallets', wallets);
app.route('/categories', categories);
app.route('/transactions', transactions);
app.route('/budgets', budgets);
app.route('/dashboard', dashboardRouter);
app.route('/stats', statsRouter);
app.route('/recurring', recurring);
app.route('/notifications', notificationRouter);
app.route('/user', user);
app.route('/goals', goals);
app.route('/subscriptions', subscriptions);
app.route('/export', exportCSV);

// Health check
app.get('/', (c) => c.text('FinTrack API is running!'));

export default app;
