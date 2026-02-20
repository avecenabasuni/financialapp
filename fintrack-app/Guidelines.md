# Project Guidelines & Standards

This document outlines the coding standards, design patterns, and best practices for the **FinTrack** application. Adhere to these guidelines to ensure consistency, maintainability, and a premium user experience.

## 1. Typography & Spacing

Consistency in typography and spacing is critical for the "MoneyFlow" aesthetic.

### **Headers & Titles**

- **Section Headers**: Use `text-lg font-bold` with `mb-1`.

### Typography

- **Page Titles**: `h1` `text-3xl font-bold tracking-tight`.
- **Section Headers**: `CardTitle` `text-lg font-bold`.
- **Subtitles/Descriptions**: `text-muted-foreground` (usually `text-sm`).
- **Font Family**: Inter (default via Shadcn).

### Spacing & Layout

- **Page Container**: `space-y-6` or `space-y-8`.
- **Grid Layouts**:
  - Desktop: `grid-cols-12` (with col-spans) or `grid-cols-4`.
  - Mobile: `grid-cols-1`.
- **Card Padding**: Use standard `Card`, `CardHeader` (p-6), `CardContent` (p-6).
  - _Exception_: Charts in `CardContent` may use `pl-0` if needed, but strive for consistency.
- **Section Margins**: `mb-6` or `mb-8` for major separations.
- **Element Margins**: `mb-4` or `mb-5` for inner-card groupings.
- **Border Radius**: `rounded-xl` for cards and containers.
- **Shadows**: `shadow-sm` for subtle depth.

### **Data Display**

- **Primary Values** (e.g., Balances, Budget Limits): `text-2xl font-bold tracking-tight`.
- **Secondary/Context Labels**: `text-sm font-medium text-muted-foreground`.
- **Status/Alert Text**: `text-xs` or `text-sm` with specific colors (Destructive/Amber/Emerald).
- **Currency**: Always use `formatCurrency` utility.

---

## 2. Components & UI Patterns

### **Interactive Elements**

- **Primary Actions**: Use **Floating Action Buttons (FAB)** for main "Create" actions (Add Transaction, Add Budget).
  - Position: `fixed bottom-8 right-8 z-50`.
  - Style: `rounded-full shadow-lg h-14 w-14`.
- **Item Actions**: Use **Dropdown Menus** (Three-dot `MoreVertical` icon) for item-specific actions like **Edit** and **Delete**.
- **Buttons**: Use `shadcn/ui` variants (`default`, `outline`, `ghost`, `destructive`).

### **Feedback & Notifications**

- **Toasts**: Use `useToast` hook from `@/context/toast-context`.
  - _Do NOT use `sonner` or `react-hot-toast` directly._
  - Success: `addToast('Message', 'success')`
  - Error: `addToast('Message', 'error')`
- **Destructive Actions**: Always require **Confirmation** (Alert Dialog or `window.confirm`) before deleting.
- **Empty States**: Use the shared `EmptyState` component with a relevant icon and action button.

### **Charts (Recharts)**

- **Colors**:
  - **Income/Good/Success**: Emerald (`text-emerald-500`, `bg-emerald-500`).
  - **Expense/Bad/Danger**: Rose (`text-destructive`, `bg-destructive`).
  - **Warning/Approaching**: Amber (`text-amber-500`, `bg-amber-500`).
- **Tooltips**: Custom styled to match the theme (Rounded, Shadow, Background).

---

## 3. Architecture & State

### **State Management**

- Use **Zustand** stores for global state (`useBudgetStore`, `useTransactionStore`).
- **Do not** explicitly calculate derived data in components if it can be derived in the store or backend.

### **API & Backend**

- **Calculations**: Heavy lifting (sums, aggregations) should be done on the Backend (D1/Worker) when possible.
- **Data Fetching**: Fetch data in `useEffect` or React Query (if migrated) using the Store's actions.

---

## 4. Icons

- Use `lucide-react` for all icons.
- Standard size: `h-4 w-4` for buttons/menus, `h-5 w-5` or `h-6 w-6` for features.

## 5. File Structure

- **Pages**: `src/pages/`
- **Components**:
  - Shared: `src/components/shared/`
  - UI Primitives: `src/components/ui/`
  - Modals: `src/components/modals/`
- **Stores**: `src/store/`
- **API**: `src/services/api.ts`
