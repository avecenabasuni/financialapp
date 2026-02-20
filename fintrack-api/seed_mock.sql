
DELETE FROM users WHERE username = 'test';
INSERT INTO users (id, username, password_hash) VALUES ('d46d2f6b-8c40-4a36-862a-d5ecc9ec9804', 'test', '$2b$10$FXJeZz2EjWplkm6wFDbpDO8pWxnKjbxXPyYQJtUrKdVZlPEJXclya');

INSERT INTO wallets (id, name, type, initial_balance, balance, currency) VALUES ('3d6b4b32-7af8-4d75-9660-0f2c72a0c400', 'Main Bank', 'bank', 15000000, 25000000, 'IDR');
INSERT INTO wallets (id, name, type, initial_balance, balance, currency) VALUES ('2370960c-6e06-45f2-8ed2-7922a1f5ee4c', 'E-Wallet', 'e-wallet', 1000000, 2500000, 'IDR');

INSERT INTO categories (id, name, type, icon, color, is_system) VALUES 
('d3dbaa95-b580-4bd7-8f55-3513a8adc557', 'Salary', 'income', 'Briefcase', '#10b981', 1),
('9adb8647-e478-4fa6-85f9-ad3d246d4c7d', 'Subscriptions', 'expense', 'Zap', '#8b5cf6', 1),
('22f8ea9c-edce-4ab6-bd8e-5a0cd7bf3629', 'Savings', 'expense', 'PiggyBank', '#3b82f6', 1);

INSERT INTO transactions (id, type, amount, category_id, wallet_id, date, note) VALUES 
('66f9cfce-4424-4db4-bad9-64607422c4bd', 'income', 30000000, 'd3dbaa95-b580-4bd7-8f55-3513a8adc557', '3d6b4b32-7af8-4d75-9660-0f2c72a0c400', '2026-02-20T14:00:19.121Z', 'February Salary'),
('d17843c9-9cf5-427f-b26c-895e6f9c7276', 'expense', 1500000, '9adb8647-e478-4fa6-85f9-ad3d246d4c7d', '2370960c-6e06-45f2-8ed2-7922a1f5ee4c', '2026-02-20T14:00:19.121Z', 'Monthly Bills');

INSERT INTO goals (id, name, target_amount, current_amount, deadline, color, icon, user_id) VALUES 
('d4de6335-2cad-487b-94b1-bd7ef2ffcc4d', 'Emergency Fund', 50000000, 20000000, '2026-12-31T00:00:00.000Z', 'bg-blue-500', 'PiggyBank', 'd46d2f6b-8c40-4a36-862a-d5ecc9ec9804'),
('e92d9b9d-53d0-476e-8427-a248f6d1074e', 'New Laptop', 25000000, 5000000, '2026-06-30T00:00:00.000Z', 'bg-emerald-500', 'Laptop', 'd46d2f6b-8c40-4a36-862a-d5ecc9ec9804');

INSERT INTO subscriptions (id, name, amount, category_id, frequency, next_billing_date, status, user_id) VALUES 
('83812ee5-d25b-4082-9e3d-8e6962395eb1', 'Netflix Family', 186000, '9adb8647-e478-4fa6-85f9-ad3d246d4c7d', 'monthly', '2026-02-27T14:00:19.121Z', 'active', 'd46d2f6b-8c40-4a36-862a-d5ecc9ec9804'),
('108562f3-e10d-4b9e-ba05-22f79979f0a6', 'Spotify Premium', 54900, '9adb8647-e478-4fa6-85f9-ad3d246d4c7d', 'monthly', '2026-03-22T14:00:19.121Z', 'active', 'd46d2f6b-8c40-4a36-862a-d5ecc9ec9804'),
('ad03a166-54aa-4986-b2bf-4c65eaccc9c2', 'Gym Membership', 450000, '9adb8647-e478-4fa6-85f9-ad3d246d4c7d', 'monthly', '2026-03-07T14:00:19.121Z', 'active', 'd46d2f6b-8c40-4a36-862a-d5ecc9ec9804');
