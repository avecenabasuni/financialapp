import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// GET /export/csv
app.get('/csv', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        t.date, t.type, t.amount, t.note,
        c.name as categoryName,
        w.name as walletName,
        wt.name as toWalletName,
        t.id
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      JOIN wallets w ON t.wallet_id = w.id
      LEFT JOIN wallets wt ON t.to_wallet_id = wt.id
      ORDER BY t.date DESC
    `).all();

    // Setup CSV Header
    let csvString = 'Date,Type,Amount (IDR),Category,From Wallet,To Wallet,Note,Transaction ID\n';

    // Build row lines
    for (const record of results as any[]) {
      // Escape commas & quotes in user strings
      const note = record.note ? `"${record.note.replace(/"/g, '""')}"` : '';
      const amount = (record.amount / 1000).toString(); // Example conversion to readable format if needed? Stored amount is raw, assuming no decimals.

      const cols = [
        record.date,
        record.type,
        record.amount,
        record.categoryName || '',
        record.walletName,
        record.toWalletName || '',
        note,
        record.id
      ];

      csvString += cols.join(',') + '\n';
    }

    // Set headers to trigger a download window in frontend
    c.header('Content-Type', 'text/csv; charset=utf-8');
    c.header('Content-Disposition', 'attachment; filename="transactions_export.csv"');
    
    return c.body(csvString);

  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default app;
