const API_URL = 'https://fintrack-api.avecenalegacy.workers.dev';

async function seed() {
  console.log('Seeding mock data for user "test"...');
  let token = '';

  // 1. Register or Login
  try {
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test', password: 'P@ssw0rd' })
    });
    const regData = await regRes.json();
    console.log('Register response:', regData);
  } catch(e) { console.log('Already registered?'); }

  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'test', password: 'P@ssw0rd' })
  });
  const loginData = await loginRes.json();
  if (!loginData.token) {
    console.error('Login failed!', loginData);
    return;
  }
  token = loginData.token;
  console.log('Logged in successfully.');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 2. Add Wallets
  const wallets = [
    { name: 'Bank BCA', type: 'bank', currency: 'IDR', color: '#1d4ed8', icon: 'Landmark', balance: 0 },
    { name: 'Cash', type: 'cash', currency: 'IDR', color: '#059669', icon: 'Banknote', balance: 0 },
    { name: 'GoPay', type: 'ewallet', currency: 'IDR', color: '#2563eb', icon: 'Smartphone', balance: 0 }
  ];

  const createdWallets = [];
  for (const w of wallets) {
    const res = await fetch(`${API_URL}/wallets`, { method: 'POST', headers, body: JSON.stringify(w) });
    const data = await res.json();
    if (data.data) {
        createdWallets.push(data.data);
        console.log('Added Wallet:', data.data.name);
    }
  }

  // 3. Add Categories
  const categories = [
    { name: 'Salary', type: 'income', icon: 'Briefcase', color: '#16a34a', group: 'needs' },
    { name: 'Freelance', type: 'income', icon: 'Laptop', color: '#2563eb', group: 'wants' },
    { name: 'Groceries', type: 'expense', icon: 'ShoppingCart', color: '#f59e0b', group: 'needs' },
    { name: 'Rent', type: 'expense', icon: 'Home', color: '#ef4444', group: 'needs' },
    { name: 'Dining Out', type: 'expense', icon: 'Utensils', color: '#f97316', group: 'wants' },
    { name: 'Transportation', type: 'expense', icon: 'Car', color: '#8b5cf6', group: 'needs' },
    { name: 'Entertainment', type: 'expense', icon: 'Film', color: '#ec4899', group: 'wants' },
    { name: 'Savings Account', type: 'expense', icon: 'PiggyBank', color: '#10b981', group: 'savings' }
  ];

  const createdCategories = [];
  for (const c of categories) {
    const res = await fetch(`${API_URL}/categories`, { method: 'POST', headers, body: JSON.stringify(c) });
    const data = await res.json();
    if (data.data) {
        createdCategories.push(data.data);
        console.log('Added Category:', data.data.name);
    }
  }

  if (createdWallets.length === 0 || createdCategories.length === 0) {
    console.error("Missing wallets or categories");
    return;
  }

  const bank = createdWallets.find(w => w.type === 'bank').id;
  const cash = createdWallets.find(w => w.type === 'cash').id;
  const ewallet = createdWallets.find(w => w.type === 'ewallet').id;

  const catSalary = createdCategories.find(c => c.name === 'Salary').id;
  const catGroceries = createdCategories.find(c => c.name === 'Groceries').id;
  const catRent = createdCategories.find(c => c.name === 'Rent').id;
  const catDining = createdCategories.find(c => c.name === 'Dining Out').id;
  const catTransport = createdCategories.find(c => c.name === 'Transportation').id;
  const catEntertain = createdCategories.find(c => c.name === 'Entertainment').id;
  const catSavings = createdCategories.find(c => c.name === 'Savings Account').id;

  // 4. Create Transactions (Distribution over 6 months to populate charts)
  const today = new Date();
  
  const transactions = [];
  
  for (let i = 5; i >= 0; i--) {
    const targetMonth = new Date(today.getFullYear(), today.getMonth() - i, 15);
    const monthStr = targetMonth.toISOString();
    
    // Monthly Salary
    transactions.push({ type: 'income', amount: 15000000, category_id: catSalary, wallet_id: bank, date: targetMonth.toISOString(), note: 'Monthly Salary' });
    
    // Rent
    transactions.push({ type: 'expense', amount: 3000000, category_id: catRent, wallet_id: bank, date: targetMonth.toISOString(), note: 'Rent' });
    
    // Savings
    transactions.push({ type: 'expense', amount: 2000000, category_id: catSavings, wallet_id: bank, date: targetMonth.toISOString(), note: 'Transfer to Savings' });
    
    // Groceries (Spread loosely across month)
    transactions.push({ type: 'expense', amount: 500000 + Math.floor(Math.random() * 200000), category_id: catGroceries, wallet_id: ewallet, date: new Date(targetMonth.getTime() + 86400000 * 2).toISOString(), note: 'Weekly Groceries' });
    transactions.push({ type: 'expense', amount: 400000 + Math.floor(Math.random() * 200000), category_id: catGroceries, wallet_id: ewallet, date: new Date(targetMonth.getTime() + 86400000 * 10).toISOString(), note: 'Weekly Groceries' });
    
    // Dining
    transactions.push({ type: 'expense', amount: 150000 + Math.floor(Math.random() * 100000), category_id: catDining, wallet_id: ewallet, date: new Date(targetMonth.getTime() + 86400000 * 5).toISOString(), note: 'Dinner' });
    transactions.push({ type: 'expense', amount: 80000 + Math.floor(Math.random() * 100000), category_id: catDining, wallet_id: cash, date: new Date(targetMonth.getTime() + 86400000 * 18).toISOString(), note: 'Lunch' });

    // Transport
    transactions.push({ type: 'expense', amount: 50000, category_id: catTransport, wallet_id: ewallet, date: new Date(targetMonth.getTime() + 86400000 * 3).toISOString(), note: 'Train ticket' });
    transactions.push({ type: 'expense', amount: 300000, category_id: catTransport, wallet_id: cash, date: new Date(targetMonth.getTime() + 86400000 * 15).toISOString(), note: 'Gas' });

    // Entertainment
    transactions.push({ type: 'expense', amount: 350000, category_id: catEntertain, wallet_id: cash, date: new Date(targetMonth.getTime() + 86400000 * 25).toISOString(), note: 'Movies & Snacks' });
    
    // Transfer from Bank to E-wallet
    transactions.push({ type: 'transfer', amount: 2500000, category_id: null, wallet_id: bank, to_wallet_id: ewallet, date: new Date(targetMonth.getTime() + 86400000 * 1).toISOString(), note: 'Topup E-wallet' });
    
    // Transfer from Bank to Cash
    transactions.push({ type: 'transfer', amount: 1000000, category_id: null, wallet_id: bank, to_wallet_id: cash, date: new Date(targetMonth.getTime() + 86400000 * 2).toISOString(), note: 'ATM Withdrawal' });
  }

  console.log(`Sending ${transactions.length} transactions...`);
  for (const t of transactions) {
    const res = await fetch(`${API_URL}/transactions`, { method: 'POST', headers, body: JSON.stringify(t) });
    const json = await res.json();
    if(!json.success) console.error("Error adding transaction:", json.error);
  }
  console.log('Finished adding transactions.');

  // 5. Add Budgets for current month
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const budgets = [
    { category_id: catGroceries, amount: 2000000, period: 'monthly', month: currentMonth },
    { category_id: catDining, amount: 1000000, period: 'monthly', month: currentMonth },
    { category_id: catTransport, amount: 500000, period: 'monthly', month: currentMonth },
    { category_id: catSavings, amount: 2500000, period: 'monthly', month: currentMonth },
    { category_id: catEntertain, amount: 800000, period: 'monthly', month: currentMonth }
  ];

  console.log('Adding Budgets...');
  for (const b of budgets) {
    const res = await fetch(`${API_URL}/budgets`, { method: 'POST', headers, body: JSON.stringify(b) });
    const json = await res.json();
    if(!json.success) console.error("Error adding budget:", json.error);
    else console.log("Added Budget for category ID:", b.category_id);
  }

  console.log('Seed Complete!');
}

seed().catch(console.error);
