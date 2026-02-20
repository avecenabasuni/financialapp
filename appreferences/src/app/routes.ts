import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { Dashboard } from "./components/dashboard";
import { TransactionsPage } from "./components/transactions-page";
import { BudgetsPage } from "./components/budgets-page";
import { AnalyticsPage } from "./components/analytics-page";
import { AccountsPage } from "./components/accounts-page";
import { GoalsPage } from "./components/goals-page";
import { SettingsPage } from "./components/settings-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "transactions", Component: TransactionsPage },
      { path: "budgets", Component: BudgetsPage },
      { path: "analytics", Component: AnalyticsPage },
      { path: "accounts", Component: AccountsPage },
      { path: "goals", Component: GoalsPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
