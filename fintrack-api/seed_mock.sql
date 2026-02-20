
DELETE FROM users WHERE username = 'test';
INSERT INTO users (id, username, password_hash, email) VALUES ('d30a226b-0201-4bc1-ae4d-ee24e0290c12', 'test', '$2b$10$eQrBdSqpBXHmGIM/j9C49un..qdiUltdwR.ONmvAtXsb/h11PUz4O', 'test@example.com');

INSERT INTO wallets (id, name, type, initial_balance, balance, currency) VALUES ('1b94480c-7847-4fc6-bcf0-9235a60f98cb', 'Main Bank', 'bank', 15000000, 25000000, 'IDR');
INSERT INTO wallets (id, name, type, initial_balance, balance, currency) VALUES ('b7f5cc52-d081-4758-9329-2e80b9b1039a', 'E-Wallet', 'e-wallet', 1000000, 2500000, 'IDR');

INSERT INTO categories (id, name, type, icon, color, is_system) VALUES 
('f28e7509-eed5-4eeb-b01a-c3bf74257012', 'Salary', 'income', 'Briefcase', '#10b981', 1),
('6de4db2b-3536-4d05-a413-a38c307a296f', 'Subscriptions', 'expense', 'Zap', '#8b5cf6', 1),
('bbc57daf-2529-4ee3-be25-9f2c75ddc17d', 'Savings', 'expense', 'PiggyBank', '#3b82f6', 1);

INSERT INTO transactions (id, type, amount, category_id, wallet_id, date, note) VALUES 
('65fbeadc-018a-44b4-b853-1c760ad77e21', 'income', 30000000, 'f28e7509-eed5-4eeb-b01a-c3bf74257012', '1b94480c-7847-4fc6-bcf0-9235a60f98cb', '2026-02-20T13:47:35.233Z', 'February Salary'),
('12f7e0f0-03aa-4e1b-8843-202e0adcca53', 'expense', 1500000, '6de4db2b-3536-4d05-a413-a38c307a296f', 'b7f5cc52-d081-4758-9329-2e80b9b1039a', '2026-02-20T13:47:35.233Z', 'Monthly Bills');

INSERT INTO goals (id, name, target_amount, current_amount, deadline, color, icon, user_id) VALUES 
('52db357d-5d06-4fbc-af68-5da5884ecde6', 'Emergency Fund', 50000000, 20000000, '2026-12-31T00:00:00.000Z', 'bg-blue-500', 'PiggyBank', 'd30a226b-0201-4bc1-ae4d-ee24e0290c12'),
('005351ea-ceb4-4040-af9e-237b40492938', 'New Laptop', 25000000, 5000000, '2026-06-30T00:00:00.000Z', 'bg-emerald-500', 'Laptop', 'd30a226b-0201-4bc1-ae4d-ee24e0290c12');

INSERT INTO subscriptions (id, name, amount, category_id, frequency, next_billing_date, status, user_id) VALUES 
('049d42c4-67cd-4225-8454-09059a69868c', 'Netflix Family', 186000, '6de4db2b-3536-4d05-a413-a38c307a296f', 'monthly', '2026-02-27T13:47:35.233Z', 'active', 'd30a226b-0201-4bc1-ae4d-ee24e0290c12'),
('7835daea-0189-4395-9828-55042b97f133', 'Spotify Premium', 54900, '6de4db2b-3536-4d05-a413-a38c307a296f', 'monthly', '2026-03-22T13:47:35.233Z', 'active', 'd30a226b-0201-4bc1-ae4d-ee24e0290c12'),
('c04012a7-8424-48b1-b69d-bf2fcb346b6d', 'Gym Membership', 450000, '6de4db2b-3536-4d05-a413-a38c307a296f', 'monthly', '2026-03-07T13:47:35.233Z', 'active', 'd30a226b-0201-4bc1-ae4d-ee24e0290c12');
