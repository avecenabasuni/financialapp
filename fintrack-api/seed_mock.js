const { execSync } = require('child_process');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const userId = uuidv4();
const passwordHash = bcrypt.hashSync('P@ssw0rd', 10);

const wallet1Id = uuidv4();
const wallet2Id = uuidv4();

const catIncomeId = uuidv4();
const catSubsId = uuidv4();
const catSavingId = uuidv4();

const goal1Id = uuidv4();
const goal2Id = uuidv4();

const sub1Id = uuidv4();
const sub2Id = uuidv4();
const sub3Id = uuidv4();

// Use the explicit UTC format for current date to ensure valid entries
const now = new Date();
const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

const sql = `
DELETE FROM users WHERE username = 'test';
INSERT INTO users (id, username, password_hash) VALUES ('${userId}', 'test', '${passwordHash}');

INSERT INTO wallets (id, name, type, initial_balance, balance, currency) VALUES ('${wallet1Id}', 'Main Bank', 'bank', 15000000, 25000000, 'IDR');
INSERT INTO wallets (id, name, type, initial_balance, balance, currency) VALUES ('${wallet2Id}', 'E-Wallet', 'e-wallet', 1000000, 2500000, 'IDR');

INSERT INTO categories (id, name, type, icon, color, is_system) VALUES 
('${catIncomeId}', 'Salary', 'income', 'Briefcase', '#10b981', 1),
('${catSubsId}', 'Subscriptions', 'expense', 'Zap', '#8b5cf6', 1),
('${catSavingId}', 'Savings', 'expense', 'PiggyBank', '#3b82f6', 1);

INSERT INTO transactions (id, type, amount, category_id, wallet_id, date, note) VALUES 
('${uuidv4()}', 'income', 30000000, '${catIncomeId}', '${wallet1Id}', '${now.toISOString()}', 'February Salary'),
('${uuidv4()}', 'expense', 1500000, '${catSubsId}', '${wallet2Id}', '${now.toISOString()}', 'Monthly Bills');

INSERT INTO goals (id, name, target_amount, current_amount, deadline, color, icon, user_id) VALUES 
('${goal1Id}', 'Emergency Fund', 50000000, 20000000, '2026-12-31T00:00:00.000Z', 'bg-blue-500', 'PiggyBank', '${userId}'),
('${goal2Id}', 'New Laptop', 25000000, 5000000, '2026-06-30T00:00:00.000Z', 'bg-emerald-500', 'Laptop', '${userId}');

INSERT INTO subscriptions (id, name, amount, category_id, frequency, next_billing_date, status, user_id) VALUES 
('${sub1Id}', 'Netflix Family', 186000, '${catSubsId}', 'monthly', '${nextWeek.toISOString()}', 'active', '${userId}'),
('${sub2Id}', 'Spotify Premium', 54900, '${catSubsId}', 'monthly', '${nextMonth.toISOString()}', 'active', '${userId}'),
('${sub3Id}', 'Gym Membership', 450000, '${catSubsId}', 'monthly', '${new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString()}', 'active', '${userId}');
`;

fs.writeFileSync('seed_mock.sql', sql);
console.log('Generating Mock SQL done. Executing wrangler...');

try {
  execSync('npx wrangler d1 execute fintrack-db --local --file=seed_mock.sql', { stdio: 'inherit' });
  console.log('Seed mockup finished successfully.');
} catch (e) {
  console.error('Failed to run wrangler', e.message);
}
