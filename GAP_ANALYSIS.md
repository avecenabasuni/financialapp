# Gap Analysis: Fintrack vs Standard Money Manager App

This document compares the current functionality of Fintrack against standard features found in popular personal finance applications (e.g., Money Manager).

## 📊 Feature Comparison Matrix

| Core Feature               | Standard Expectation                               | Fintrack Current State                                       |   Status   | Severity | Notes                                                                    |
| :------------------------- | :------------------------------------------------- | :----------------------------------------------------------- | :--------: | :------: | :----------------------------------------------------------------------- |
| **Input Transaction**      | Income/Expense per Category, Amount, Date, Note.   | Fully implemented.                                           |  ✅ Done   |    -     | Supports strict integer inputs.                                          |
| **Custom Categories**      | Customize Name, Icon, Color.                       | Fully implemented.                                           |  ✅ Done   |    -     | Includes "Undo" for deletion.                                            |
| **Multiple Accounts**      | Cash, Bank, Card, etc. with separate balances.     | "Wallets" system implemented.                                |  ✅ Done   |    -     | Auto-reconciliation included.                                            |
| **Transfer**               | Move funds between accounts.                       | Fully implemented.                                           |  ✅ Done   |    -     | -                                                                        |
| **Total Balance**          | Sum of all accounts.                               | Real-time calculation.                                       |  ✅ Done   |    -     | -                                                                        |
| **Search**                 | Search transactions by keyword.                    | Implemented (Note & Category).                               |  ✅ Done   |    -     | -                                                                        |
| **Budgeting**              | Monthly limit per category with progress tracking. | Real data visualized. **Month Nav is UI-only.**              | ⚠️ Partial |  Medium  | Users cannot switch to view budgets for previous/next months.            |
| **Charts & Reports**       | Pie/Bar charts filtering by specific periods.      | Charts exist. **Period Filter is UI-only.**                  | ⚠️ Partial | **High** | Dashboard chart is **MOCK DATA**. Statistic filters don't update charts. |
| **Transaction Filters**    | Filter by Date, Category, and **Account**.         | Date (Month/Range) & Type works. **Missing Account Filter.** | ⚠️ Partial |  Medium  | Users cannot view history for a specific wallet (e.g., "BCA only").      |
| **Export Data**            | CSV/Excel for manual analysis.                     | **Broken**. UI shows CSV/PDF but logic exports JSON.         | ⚠️ Broken  |   Low    | Current export is only useful for Backup/Restore (JSON).                 |
| **Recurring Transactions** | Auto-add bills/salary (Daily/Weekly/Monthly).      | **Not Implemented.**                                         | ❌ Missing |   Low    | -                                                                        |

## 🚨 Critical Action Items (Daily Use Priorities)

These items directly impact the trustworthiness and usability of the application for daily tracking.

### 1. Fix Dashboard & Statistics Logic (High)

- **Dashboard**: The "Income vs Expenses" bar chart uses **Mock Data**. It must be connected to the real `transactionStore`.
- **Statistics**: The Period Filter (Day/Week/Month/Year) does not filter the data. Charts always show _all_ history or a fixed slice.

### 2. Implement Real Filters (Medium)

- **Transactions Page**: Add a "Wallet" dropdown filter to allow viewing specific account history.
- **Budgets Page**: Connect the "Month Navigation" to filter budget calculations by date.

### 3. Fix Export Formats (Low)

- The "Export" modal offers CSV and PDF options, but the code forces a JSON dump renamed as a `.csv` file. This creates corrupt/unreadable files for users expecting Excel compatibility.

## 🛠 Plan for Next Phase

1.  **Dashboard Chart**: Connect to `useTransactionStore` to show real daily/monthly data.
2.  **Fix Stats Filters**: Implement logic for Day/Week/Month/Year grouping.
3.  **Add Wallet Filter**: Update `transactions.tsx` filtering logic.
4.  **Real CSV Export**: Implement a utility to convert JSON -> CSV string.
