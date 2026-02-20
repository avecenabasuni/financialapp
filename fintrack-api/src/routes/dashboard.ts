import { Hono } from 'hono';

type Env = {
  DB: D1Database;
};

export const dashboardRouter = new Hono<{ Bindings: Env }>();

dashboardRouter.get('/', async (c) => {
  const db = c.env.DB;
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // 1. Total Balance (Sum of all wallets)
  const balanceResult = await db.prepare('SELECT SUM(balance) as total FROM wallets').first();
  const totalBalance = balanceResult?.total || 0;

  // 2. Monthly Income & Expense
  const monthlyResult = await db.prepare(`
    SELECT type, SUM(amount) as total 
    FROM transactions 
    WHERE strftime('%Y-%m', date) = ? AND type IN ('income', 'expense')
    GROUP BY type
  `).bind(currentMonth).all();

  let monthlyIncome = 0;
  let monthlyExpense = 0;

  if (monthlyResult.results) {
    for (const row of monthlyResult.results) {
       if (row.type === 'income') monthlyIncome = row.total as number;
       if (row.type === 'expense') monthlyExpense = row.total as number;
    }
  }

  // 3. Chart Data (Last 6 months)
  // We need to generate the list of last 6 months to ensure we have entries even if no transactions
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
     const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
     const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
     const monthLabel = d.toLocaleDateString('en-US', { month: 'short' });

     const result = await db.prepare(`
       SELECT type, SUM(amount) as total 
       FROM transactions 
       WHERE strftime('%Y-%m', date) = ? AND type IN ('income', 'expense')
       GROUP BY type
     `).bind(monthKey).all();

     let income = 0;
     let expense = 0;
     if (result.results) {
        for (const row of result.results) {
           if (row.type === 'income') income = row.total as number;
           if (row.type === 'expense') expense = row.total as number;
        }
     }
     chartData.push({ name: monthLabel, income, expense, fullDate: monthKey });
  }

  return c.json({
    data: {
      totalBalance,
      monthlyIncome,
      monthlyExpense,
      chartData
    }
  });
});
