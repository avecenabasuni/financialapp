export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
  account: string;
  icon: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
  icon: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  institution: string;
  lastFour: string;
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  icon: string;
}

export const transactions: Transaction[] = [
  { id: "1", description: "Salary Deposit", amount: 5200, date: "2026-02-18", category: "Salary", type: "income", account: "Checking", icon: "Briefcase" },
  { id: "2", description: "Whole Foods Market", amount: -127.45, date: "2026-02-17", category: "Groceries", type: "expense", account: "Credit Card", icon: "ShoppingCart" },
  { id: "3", description: "Netflix Subscription", amount: -15.99, date: "2026-02-16", category: "Entertainment", type: "expense", account: "Credit Card", icon: "Tv" },
  { id: "4", description: "Uber Ride", amount: -24.50, date: "2026-02-16", category: "Transport", type: "expense", account: "Checking", icon: "Car" },
  { id: "5", description: "Freelance Payment", amount: 850, date: "2026-02-15", category: "Freelance", type: "income", account: "Checking", icon: "Laptop" },
  { id: "6", description: "Electric Bill", amount: -142.30, date: "2026-02-14", category: "Utilities", type: "expense", account: "Checking", icon: "Zap" },
  { id: "7", description: "Coffee Shop", amount: -6.75, date: "2026-02-14", category: "Food & Drink", type: "expense", account: "Credit Card", icon: "Coffee" },
  { id: "8", description: "Amazon Purchase", amount: -89.99, date: "2026-02-13", category: "Shopping", type: "expense", account: "Credit Card", icon: "Package" },
  { id: "9", description: "Gym Membership", amount: -49.99, date: "2026-02-12", category: "Health", type: "expense", account: "Checking", icon: "Dumbbell" },
  { id: "10", description: "Investment Dividend", amount: 320, date: "2026-02-11", category: "Investment", type: "income", account: "Investment", icon: "TrendingUp" },
  { id: "11", description: "Restaurant Dinner", amount: -78.50, date: "2026-02-10", category: "Food & Drink", type: "expense", account: "Credit Card", icon: "UtensilsCrossed" },
  { id: "12", description: "Gas Station", amount: -52.30, date: "2026-02-09", category: "Transport", type: "expense", account: "Credit Card", icon: "Fuel" },
  { id: "13", description: "Spotify Premium", amount: -9.99, date: "2026-02-08", category: "Entertainment", type: "expense", account: "Credit Card", icon: "Music" },
  { id: "14", description: "Rent Payment", amount: -1800, date: "2026-02-01", category: "Housing", type: "expense", account: "Checking", icon: "Home" },
  { id: "15", description: "Side Project Income", amount: 450, date: "2026-02-05", category: "Freelance", type: "income", account: "Checking", icon: "Code" },
];

export const budgetCategories: BudgetCategory[] = [
  { id: "1", name: "Housing", allocated: 2000, spent: 1800, color: "#6366f1", icon: "Home" },
  { id: "2", name: "Groceries", allocated: 500, spent: 387.45, color: "#10b981", icon: "ShoppingCart" },
  { id: "3", name: "Transport", allocated: 300, spent: 276.80, color: "#f59e0b", icon: "Car" },
  { id: "4", name: "Entertainment", allocated: 150, spent: 125.98, color: "#ec4899", icon: "Tv" },
  { id: "5", name: "Utilities", allocated: 250, spent: 142.30, color: "#8b5cf6", icon: "Zap" },
  { id: "6", name: "Food & Drink", allocated: 400, spent: 285.25, color: "#f97316", icon: "UtensilsCrossed" },
  { id: "7", name: "Shopping", allocated: 200, spent: 189.99, color: "#14b8a6", icon: "ShoppingBag" },
  { id: "8", name: "Health", allocated: 100, spent: 49.99, color: "#ef4444", icon: "Heart" },
];

export const accounts: Account[] = [
  { id: "1", name: "Main Checking", type: "Checking", balance: 8452.30, institution: "Chase Bank", lastFour: "4521", color: "#6366f1" },
  { id: "2", name: "Savings Account", type: "Savings", balance: 24680.00, institution: "Chase Bank", lastFour: "7832", color: "#10b981" },
  { id: "3", name: "Credit Card", type: "Credit", balance: -2340.67, institution: "Amex", lastFour: "1098", color: "#f59e0b" },
  { id: "4", name: "Investment Portfolio", type: "Investment", balance: 45230.50, institution: "Fidelity", lastFour: "3344", color: "#8b5cf6" },
];

export const goals: Goal[] = [
  { id: "1", name: "Emergency Fund", target: 15000, current: 12400, icon: "Shield", deadline: "2026-06-01" },
  { id: "2", name: "Vacation Fund", target: 5000, current: 2800, icon: "Palmtree", deadline: "2026-08-15" },
  { id: "3", name: "New Car", target: 30000, current: 8500, icon: "Car", deadline: "2027-01-01" },
  { id: "4", name: "Home Down Payment", target: 60000, current: 21000, icon: "Home", deadline: "2027-12-31" },
];

export const monthlyData = [
  { month: "Sep", income: 5800, expenses: 4200 },
  { month: "Oct", income: 6100, expenses: 4500 },
  { month: "Nov", income: 5900, expenses: 3800 },
  { month: "Dec", income: 7200, expenses: 5100 },
  { month: "Jan", income: 6050, expenses: 4300 },
  { month: "Feb", income: 6820, expenses: 3957 },
];

export const weeklySpending = [
  { day: "Mon", amount: 85 },
  { day: "Tue", amount: 142 },
  { day: "Wed", amount: 56 },
  { day: "Thu", amount: 198 },
  { day: "Fri", amount: 245 },
  { day: "Sat", amount: 310 },
  { day: "Sun", amount: 128 },
];

export const categoryBreakdown = [
  { name: "Housing", value: 1800, color: "#6366f1" },
  { name: "Groceries", value: 387, color: "#10b981" },
  { name: "Transport", value: 277, color: "#f59e0b" },
  { name: "Entertainment", value: 126, color: "#ec4899" },
  { name: "Utilities", value: 142, color: "#8b5cf6" },
  { name: "Food & Drink", value: 285, color: "#f97316" },
  { name: "Shopping", value: 190, color: "#14b8a6" },
  { name: "Health", value: 50, color: "#ef4444" },
];
