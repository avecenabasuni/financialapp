import { Hono } from 'hono';
import { z } from 'zod';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

const transactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  amount: z.number().int().positive(),
  category_id: z.string().optional(),
  wallet_id: z.string(),
  to_wallet_id: z.string().optional(),
  date: z.string(),
  note: z.string().optional(),
});

// GET /transactions
app.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT 
      t.id, t.type, t.amount, t.date, t.note,
      t.category_id as categoryId, t.wallet_id as walletId, t.to_wallet_id as toWalletId,
      c.name as categoryName, c.icon as categoryIcon, c.color as categoryColor,
      w.name as walletName,
      wt.name as toWalletName
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    JOIN wallets w ON t.wallet_id = w.id
    LEFT JOIN wallets wt ON t.to_wallet_id = wt.id
    ORDER BY t.date DESC, t.created_at DESC 
    LIMIT 100
  `).all();
  return c.json({ success: true, data: results });
});

// POST /transactions
app.post('/', async (c) => {
  const body = await c.req.json();
  const result = transactionSchema.safeParse(body);

  if (!result.success) {
    return c.json({ success: false, error: result.error }, 400);
  }

  const { type, amount, category_id, wallet_id, to_wallet_id, date, note } = result.data;
  const id = crypto.randomUUID();

  const statements = [];

  // Insert Transaction
  statements.push(
    c.env.DB.prepare(
      'INSERT INTO transactions (id, type, amount, category_id, wallet_id, to_wallet_id, date, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, type, amount, category_id || null, wallet_id, to_wallet_id || null, date, note || null)
  );

  // Update Wallet Balance(s)
  if (type === 'income') {
    statements.push(
      c.env.DB.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?').bind(amount, wallet_id)
    );
  } else if (type === 'expense') {
    statements.push(
      c.env.DB.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ?').bind(amount, wallet_id)
    );
  } else if (type === 'transfer' && to_wallet_id) {
    statements.push(
      c.env.DB.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ?').bind(amount, wallet_id)
    );
    statements.push(
      c.env.DB.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?').bind(amount, to_wallet_id)
    );
  }

  try {
    await c.env.DB.batch(statements);
    // Fetch result to return
    const transaction = await c.env.DB.prepare('SELECT * FROM transactions WHERE id = ?').bind(id).first();
    return c.json({ success: true, data: transaction }, 201);
  } catch (e: any) {
    return c.json({ success: false, error: e.message || String(e) }, 500);
  }
});

// PUT /transactions/:id
app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const result = transactionSchema.safeParse(body);

  if (!result.success) {
    return c.json({ success: false, error: result.error }, 400);
  }

  const { type, amount, category_id, wallet_id, to_wallet_id, date, note } = result.data;
  
  // Get old transaction to revert balance
  const oldTxn = await c.env.DB.prepare('SELECT * FROM transactions WHERE id = ?').bind(id).first();
  if (!oldTxn) return c.json({ success: false, error: 'Not found' }, 404);

  const statements = [];

  // 1. Revert Old Balance
  if (oldTxn.type === 'income') {
    statements.push(c.env.DB.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ?').bind(oldTxn.amount, oldTxn.wallet_id));
  } else if (oldTxn.type === 'expense') {
    statements.push(c.env.DB.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?').bind(oldTxn.amount, oldTxn.wallet_id));
  } else if (oldTxn.type === 'transfer' && oldTxn.to_wallet_id) {
    statements.push(c.env.DB.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?').bind(oldTxn.amount, oldTxn.wallet_id));
    statements.push(c.env.DB.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ?').bind(oldTxn.amount, oldTxn.to_wallet_id));
  }

  // 2. Update Transaction
  statements.push(
    c.env.DB.prepare(
      'UPDATE transactions SET type=?, amount=?, category_id=?, wallet_id=?, to_wallet_id=?, date=?, note=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
    ).bind(type, amount, category_id || null, wallet_id, to_wallet_id || null, date, note || null, id)
  );

  // 3. Apply New Balance
  if (type === 'income') {
    statements.push(c.env.DB.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?').bind(amount, wallet_id));
  } else if (type === 'expense') {
    statements.push(c.env.DB.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ?').bind(amount, wallet_id));
  } else if (type === 'transfer' && to_wallet_id) {
    statements.push(c.env.DB.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ?').bind(amount, wallet_id));
    statements.push(c.env.DB.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?').bind(amount, to_wallet_id));
  }

  try {
    await c.env.DB.batch(statements);
    const updated = await c.env.DB.prepare('SELECT * FROM transactions WHERE id = ?').bind(id).first();
    return c.json({ success: true, data: updated });
  } catch (e: any) {
    return c.json({ success: false, error: e.message || String(e) }, 500);
  }
});

// DELETE /transactions/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  
  // Get transaction first to know what to revert
  const txn = await c.env.DB.prepare('SELECT * FROM transactions WHERE id = ?').bind(id).first();
  if (!txn) return c.json({ success: false, error: 'Not found' }, 404);

  const statements = [];
  
  // Revert Balance
  if (txn.type === 'income') {
    statements.push(c.env.DB.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ?').bind(txn.amount, txn.wallet_id));
  } else if (txn.type === 'expense') {
    statements.push(c.env.DB.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?').bind(txn.amount, txn.wallet_id));
  } else if (txn.type === 'transfer' && txn.to_wallet_id) {
    statements.push(c.env.DB.prepare('UPDATE wallets SET balance = balance + ? WHERE id = ?').bind(txn.amount, txn.wallet_id));
    statements.push(c.env.DB.prepare('UPDATE wallets SET balance = balance - ? WHERE id = ?').bind(txn.amount, txn.to_wallet_id));
  }

  // Delete Transaction
  statements.push(c.env.DB.prepare('DELETE FROM transactions WHERE id = ?').bind(id));

  await c.env.DB.batch(statements);
  return c.json({ success: true });
});

export default app;
