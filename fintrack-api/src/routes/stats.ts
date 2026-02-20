import { Hono } from 'hono';

type Env = {
  DB: D1Database;
};

export const statsRouter = new Hono<{ Bindings: Env }>();

statsRouter.get('/', async (c) => {
  const db = c.env.DB;
  const period = c.req.query('period') || 'Month'; // Day, Week, Month, Year
  const dateParam = c.req.query('date') || new Date().toISOString().slice(0, 10);
  
  // Determine date range based on period
  // For simplicity MVP, we'll just support 'Month' for now or handle basic filtering
  // The query param 'period' matches frontend tabs
  
  // Logic for filtering:
  // If period=Month, filter by YYYY-MM
  // If period=Year, filter by YYYY
  
  // Default to current month if strict filtering needed
  // But let's look at how frontend uses it. 
  // Frontend sends `period` state (Day/Week/Month/Year).
  // Does frontend send `date`? No, currently it just toggles tabs.
  // So it implies "Current Day", "Current Week", etc.
  
  let dateFilter = '';
  // Simple implementation for Month (default) and Year
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentYear = `${now.getFullYear()}`;

  let query = `
    SELECT c.name, c.color, c.icon, SUM(t.amount) as value 
    FROM transactions t 
    JOIN categories c ON t.category_id = c.id 
    WHERE t.type='expense' 
  `;
  
  const params: string[] = [];

  if (period === 'Year') {
    query += ` AND strftime('%Y', t.date) = ?`;
    params.push(currentYear);
  } else {
    // Default to Month
    query += ` AND strftime('%Y-%m', t.date) = ?`;
    params.push(currentMonth);
  }

  query += ` GROUP BY c.id ORDER BY value DESC`;

  const result = await db.prepare(query).bind(...params).all();

  return c.json({
    data: {
      expenseByCategory: result.results || []
    }
  });
});
