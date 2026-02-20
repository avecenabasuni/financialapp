# Financial Tracker — Technical & Product Plan

A complete technical and product plan for a **web-based personal financial tracker** inspired by Money Manager. This document defines the MVP scope, architecture, data model, and implementation roadmap for a single-developer build.

---

## 1. Overview

This project is a **desktop-first, responsive web application** that empowers users to track personal income, expenses, and transfers across multiple wallets. It draws inspiration from the Money Manager mobile app, adapting its core feature set for the browser.

**Key capabilities:**

- Record transactions (income, expense, transfer) quickly
- Manage multiple wallets/accounts with real-time balance tracking
- Categorize transactions with a two-level category hierarchy
- Visualize spending and income via charts and statistics
- Filter, search, and browse transaction history
- Set and monitor monthly budgets per category

The entire stack runs on the **Cloudflare ecosystem** (Pages + Workers + D1) to achieve zero-cost hosting at MVP scale.

---

## 2. Assumptions & Constraints

### Platform

- Web-only; no native mobile or desktop app
- Desktop-first design with responsive breakpoints for tablet/mobile
- Modern evergreen browsers (Chrome, Firefox, Edge, Safari)

### Technical Constraints

| Constraint       | Decision                                    |
| ---------------- | ------------------------------------------- |
| Frontend hosting | Cloudflare Pages (static SPA)               |
| Backend runtime  | Cloudflare Workers (edge serverless)        |
| Primary database | Cloudflare D1 (SQLite-based, free tier)     |
| Database cost    | Zero — must use D1 free tier only           |
| No self-hosting  | No VPS, no Docker, no managed DB services   |
| No paid SaaS DB  | No Supabase paid, no PlanetScale paid, etc. |

### D1 Free-Tier Limits (as of 2025)

| Resource     | Limit             |
| ------------ | ----------------- |
| Storage      | 5 GB total        |
| Reads        | 5 million / day   |
| Writes       | 100,000 / day     |
| Rows read    | 5 billion / month |
| Rows written | 1 million / month |

> [!NOTE]
> These limits are generous for a single-user or small-user-base personal finance tool. The app should be designed with these ceilings in mind but will not approach them at MVP scale.

### Product Assumptions

- **Single-user MVP**: no multi-user collaboration, no shared budgets
- Auth is deferred in the MVP; access is either unprotected (local use) or behind a simple password/token gate
- Currency is user-configurable but the app does not perform currency conversion
- All monetary values are stored as integers (cents/smallest unit) to avoid floating-point issues
- Time zone handling is client-side; the server stores UTC timestamps

---

## 3. MVP Scope

### Included Features

| #   | Feature                      | Description                                                                                                                                                   |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Dashboard**                | Overview card showing total balance, income vs. expense for selected period (day/week/month/year), quick-access menu, and recent transactions                 |
| 2   | **Quick Transaction Record** | Modal/panel to add expense, income, or transfer with category, sub-category, amount, note, wallet, and date/time                                              |
| 3   | **Categories Management**    | CRUD for expense/income categories and sub-categories; system-default categories pre-seeded; user custom categories; icon and color assignment                |
| 4   | **Statistics & Analytics**   | Donut/pie chart of expense breakdown by category; bar chart for income vs. expense over time; weekly, monthly, yearly period selectors; income/expense toggle |
| 5   | **Transaction History**      | Chronological list grouped by date; filters by type (income/expense/transfer), wallet, category, date range; search by note text                              |
| 6   | **Wallets / Accounts**       | CRUD for wallets (e.g., Cash, Bank Mandiri, E-Wallet); individual and total balance display; wallet selector during transaction entry                         |
| 7   | **Budgeting (MVP)**          | Set monthly budget per category; progress bar showing spent vs. budget; simple over-budget visual warning                                                     |

### Explicit Exclusions (Post-MVP)

- Multi-user / authentication system with registration
- Recurring/scheduled transactions
- Bill reminders and due date tracking
- Savings goals with dedicated tracking
- Data export/import (CSV, PDF)
- Receipt scanning / OCR
- Multi-currency conversion
- Gamification (levels, badges)
- Voice/chat input
- Push notifications
- Offline-first / service worker sync
- Light mode toggle (dark mode is the primary design; light mode deferred)

---

## 4. User Personas (Lightweight)

### Persona 1: Budget-Conscious Professional

- **Name:** Rina, 28
- **Behavior:** Records every expense immediately; checks weekly spending summary each Sunday; uses 3 wallets (cash, debit card, e-wallet)
- **Goal:** Stay within monthly budget and understand where money goes
- **Frustration:** Loses track of small daily expenses; spreadsheets feel tedious

### Persona 2: Freelancer with Variable Income

- **Name:** Adi, 32
- **Behavior:** Irregular income from multiple clients; needs to track income sources and plan expenses around variable cash flow
- **Goal:** See monthly income trends and control spending during lean months
- **Frustration:** Most finance apps assume fixed monthly salary

---

## 5. User Flows

### 5.1 Add Expense

```
1. User is on Dashboard
2. Clicks "+ Add Transaction" FAB or quick-record button
3. Transaction modal opens (default tab: Expense)
4. User selects category → sub-category (optional)
5. User enters amount via numpad or keyboard
6. User optionally adds a note
7. User selects wallet (default: last used or primary)
8. User confirms date/time (default: now)
9. Clicks "Save"
10. Modal closes → Dashboard balance updates → Transaction appears in recent list
```

### 5.2 View Statistics

```
1. User clicks "Statistics" in sidebar/nav
2. Statistics page loads with current month's data (default)
3. User sees donut chart of expenses by category
4. User toggles between Income / Expense
5. User changes period via Weekly / Monthly / Yearly tabs
6. User navigates to previous/next period using arrows
7. Below chart: ranked list of categories with percentage bars
8. User clicks a category → filtered transaction list for that category
```

### 5.3 Manage Categories

```
1. User clicks "Categories" in sidebar/nav
2. Tabs: Expense | Income
3. User sees list of parent categories with sub-category counts
4. User expands a parent category to see sub-categories
5. User clicks "Add Category" → form: name, icon, color, type
6. To edit: clicks category → inline edit or edit modal
7. To delete: clicks delete icon → confirmation dialog
   - If category has transactions: reassign prompt or soft-delete
8. Changes saved immediately
```

---

## 6. Information Architecture

### Pages & Routes

| Page                | Route                                  | Description                                                         |
| ------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| Dashboard           | `/`                                    | Home page with balance overview, quick actions, recent transactions |
| Add Transaction     | `/transactions/new` (or modal overlay) | Quick record form                                                   |
| Transaction History | `/transactions`                        | Full list with filters and search                                   |
| Transaction Detail  | `/transactions/:id`                    | View/edit a single transaction                                      |
| Statistics          | `/statistics`                          | Charts and analytics                                                |
| Categories          | `/categories`                          | Category management                                                 |
| Wallets             | `/wallets`                             | Wallet/account management                                           |
| Wallet Detail       | `/wallets/:id`                         | Transactions filtered by wallet                                     |
| Budgets             | `/budgets`                             | Budget setup and tracking                                           |
| Settings            | `/settings`                            | Currency, preferences                                               |

### Navigation Structure

**Desktop — Sidebar Navigation:**

```
┌─────────────────────────────────────────────┐
│  [Logo]  Financial Tracker                  │
│                                             │
│  📊  Dashboard                              │
│  📝  Transactions                           │
│  📈  Statistics                             │
│  🏷️  Categories                             │
│  💳  Wallets                                │
│  🎯  Budgets                                │
│  ⚙️  Settings                               │
│                                             │
│  [+ Add Transaction]  (prominent CTA)       │
└─────────────────────────────────────────────┘
```

**Mobile — Bottom Tab Bar:**

- Dashboard | Transactions | [+] Add | Statistics | More (Categories, Wallets, Budgets, Settings)

---

## 7. System Architecture

### High-Level Architecture

```
┌──────────────┐      HTTPS / REST       ┌────────────────────┐
│   Browser    │ ◄──────────────────────► │ Cloudflare Workers │
│  (React SPA) │                          │   (API Server)     │
│              │                          │                    │
│  Cloudflare  │                          │   Bindings:        │
│    Pages     │                          │   - D1 Database    │
└──────────────┘                          └────────────────────┘
                                                   │
                                                   ▼
                                          ┌────────────────────┐
                                          │   Cloudflare D1    │
                                          │    (SQLite)        │
                                          └────────────────────┘
```

### Frontend

- **React SPA** deployed as static assets on **Cloudflare Pages**
- Client-side routing via React Router
- State management: React Context + `useReducer` for global state (or Zustand for simplicity)
- All API calls via `fetch()` to the Workers backend
- Charts rendered client-side (no SSR needed)

### Backend

- **Cloudflare Workers** — single Worker project serving the REST API
- Structured as a modular router (using `itty-router` or Hono)
- D1 binding for all database operations
- Input validation on every endpoint
- JSON request/response format
- CORS configured for the Pages domain

### Database

- **Cloudflare D1** (SQLite dialect)
- Schema managed via D1 migrations (SQL files)
- All monetary values stored as `INTEGER` (cents)
- Timestamps stored as ISO 8601 strings (UTC)
- IDs: ULIDs or UUIDs stored as `TEXT`

### Auth Assumptions (MVP)

For MVP, the app targets single-user personal use. Two options:

| Option              | How                                                                               | Pros              | Cons                      |
| ------------------- | --------------------------------------------------------------------------------- | ----------------- | ------------------------- |
| **A. No auth**      | Open access; rely on obscurity or Cloudflare Access (free for 1 user)             | Simplest          | Not secure without Access |
| **B. Simple token** | Single API key / password stored as Worker secret; sent as `Authorization` header | Easy to implement | Not scalable              |

**Recommended for MVP:** Option A with **Cloudflare Access** (free for up to 50 users) to gate the entire app. Zero code changes needed.

---

## 8. Technology Stack

### Frontend

| Layer            | Technology                                     | Rationale                                                    |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| UI Framework     | **React 18+**                                  | Required per constraints; rich ecosystem                     |
| Build Tool       | **Vite**                                       | Fast dev server, optimized builds, first-class React support |
| Routing          | **React Router v6**                            | Standard SPA routing                                         |
| State Management | **Zustand**                                    | Lightweight, minimal boilerplate, no providers               |
| HTTP Client      | **Native fetch**                               | No need for axios; Workers return JSON                       |
| Charts           | **Recharts** or **Chart.js (react-chartjs-2)** | Donut, bar, line charts with React integration               |
| Date Handling    | **date-fns**                                   | Lightweight, tree-shakable date utilities                    |
| Icons            | **Lucide React** or **react-icons**            | Clean, customizable icon set                                 |
| Forms            | **React Hook Form**                            | Performant form handling with validation                     |
| CSS              | **CSS Modules** or **Vanilla CSS**             | Scoped styling without runtime overhead                      |

### Backend

| Layer       | Technology                            | Rationale                                                    |
| ----------- | ------------------------------------- | ------------------------------------------------------------ |
| Runtime     | **Cloudflare Workers**                | Edge serverless, free tier, D1 integration                   |
| Router      | **Hono**                              | Ultra-lightweight, Workers-native, middleware support        |
| Validation  | **Zod**                               | TypeScript-first schema validation, small bundle             |
| ORM / Query | **Raw D1 SQL** via `env.DB.prepare()` | D1 has limited ORM support; raw SQL is most reliable         |
| Dev Tooling | **Wrangler**                          | Official Cloudflare CLI for local dev, deploy, D1 management |

### Database

| Layer      | Technology                             |
| ---------- | -------------------------------------- |
| Primary DB | **Cloudflare D1** (SQLite)             |
| Migrations | D1 migration files via Wrangler        |
| Seed data  | SQL seed script for default categories |

### Supporting Libraries & Tools

| Tool                  | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| **TypeScript**        | Type safety across frontend and backend        |
| **ESLint + Prettier** | Code quality and formatting                    |
| **Vitest**            | Unit testing (Vite-native)                     |
| **pnpm**              | Fast, disk-efficient package manager           |
| **GitHub Actions**    | CI/CD pipeline for linting, testing, deploying |

---

## 9. Data Model (Logical)

### Entity-Relationship Overview

```
User (implicit, single-user MVP)
  │
  ├── has many ─► Wallet
  │                 │
  │                 └── referenced by ─► Transaction
  │
  ├── has many ─► Category
  │                 │
  │                 ├── has many ─► SubCategory
  │                 │
  │                 └── referenced by ─► Transaction
  │
  ├── has many ─► Transaction
  │
  └── has many ─► Budget
                    │
                    └── references ─► Category
```

### Entities

#### `wallets`

| Column        | Type    | Constraints         | Description                  |
| ------------- | ------- | ------------------- | ---------------------------- |
| `id`          | TEXT    | PK                  | ULID                         |
| `name`        | TEXT    | NOT NULL            | e.g., "Cash", "Bank Mandiri" |
| `icon`        | TEXT    |                     | Emoji or icon identifier     |
| `color`       | TEXT    |                     | Hex color code               |
| `balance`     | INTEGER | NOT NULL, DEFAULT 0 | Current balance in cents     |
| `is_archived` | INTEGER | DEFAULT 0           | Soft delete flag (0/1)       |
| `sort_order`  | INTEGER | DEFAULT 0           | Display ordering             |
| `created_at`  | TEXT    | NOT NULL            | ISO 8601 UTC                 |
| `updated_at`  | TEXT    | NOT NULL            | ISO 8601 UTC                 |

#### `categories`

| Column       | Type    | Constraints | Description                    |
| ------------ | ------- | ----------- | ------------------------------ |
| `id`         | TEXT    | PK          | ULID                           |
| `name`       | TEXT    | NOT NULL    | e.g., "Food & Drink"           |
| `type`       | TEXT    | NOT NULL    | `expense` or `income`          |
| `icon`       | TEXT    |             | Emoji or icon identifier       |
| `color`      | TEXT    |             | Hex color code                 |
| `is_system`  | INTEGER | DEFAULT 0   | System default (non-deletable) |
| `sort_order` | INTEGER | DEFAULT 0   | Display ordering               |
| `created_at` | TEXT    | NOT NULL    | ISO 8601 UTC                   |
| `updated_at` | TEXT    | NOT NULL    | ISO 8601 UTC                   |

#### `sub_categories`

| Column        | Type    | Constraints                  | Description                |
| ------------- | ------- | ---------------------------- | -------------------------- |
| `id`          | TEXT    | PK                           | ULID                       |
| `category_id` | TEXT    | FK → categories.id, NOT NULL | Parent category            |
| `name`        | TEXT    | NOT NULL                     | e.g., "Breakfast", "Lunch" |
| `icon`        | TEXT    |                              | Emoji or icon identifier   |
| `sort_order`  | INTEGER | DEFAULT 0                    | Display ordering           |
| `created_at`  | TEXT    | NOT NULL                     | ISO 8601 UTC               |
| `updated_at`  | TEXT    | NOT NULL                     | ISO 8601 UTC               |

#### `transactions`

| Column             | Type    | Constraints               | Description                         |
| ------------------ | ------- | ------------------------- | ----------------------------------- |
| `id`               | TEXT    | PK                        | ULID                                |
| `type`             | TEXT    | NOT NULL                  | `income`, `expense`, or `transfer`  |
| `amount`           | INTEGER | NOT NULL                  | Amount in cents (always positive)   |
| `category_id`      | TEXT    | FK → categories.id        | NULL for transfers                  |
| `sub_category_id`  | TEXT    | FK → sub_categories.id    | Optional                            |
| `wallet_id`        | TEXT    | FK → wallets.id, NOT NULL | Source wallet                       |
| `to_wallet_id`     | TEXT    | FK → wallets.id           | Destination wallet (transfers only) |
| `note`             | TEXT    |                           | Optional user note                  |
| `transaction_date` | TEXT    | NOT NULL                  | ISO 8601 date+time (user's local)   |
| `created_at`       | TEXT    | NOT NULL                  | ISO 8601 UTC                        |
| `updated_at`       | TEXT    | NOT NULL                  | ISO 8601 UTC                        |

#### `budgets`

| Column        | Type    | Constraints                  | Description            |
| ------------- | ------- | ---------------------------- | ---------------------- |
| `id`          | TEXT    | PK                           | ULID                   |
| `category_id` | TEXT    | FK → categories.id, NOT NULL | Budget target category |
| `amount`      | INTEGER | NOT NULL                     | Budget limit in cents  |
| `period`      | TEXT    | NOT NULL                     | `monthly` (MVP only)   |
| `year`        | INTEGER | NOT NULL                     | e.g., 2026             |
| `month`       | INTEGER | NOT NULL                     | 1–12                   |
| `created_at`  | TEXT    | NOT NULL                     | ISO 8601 UTC           |
| `updated_at`  | TEXT    | NOT NULL                     | ISO 8601 UTC           |

> **UNIQUE constraint** on `budgets`: (`category_id`, `period`, `year`, `month`)

### Key Relationships

- A **Transaction** belongs to one **Wallet** (source) and optionally one **Wallet** (destination, for transfers)
- A **Transaction** belongs to one **Category** and optionally one **SubCategory**
- A **Budget** is scoped to one **Category** for a specific month
- **Wallet balances** are denormalized for read performance; updated transactionally on each insert/update/delete of a transaction

### Indexes

```sql
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_date_type ON transactions(transaction_date, type);
CREATE INDEX idx_budgets_period ON budgets(category_id, year, month);
CREATE INDEX idx_sub_categories_parent ON sub_categories(category_id);
```

---

## 10. API Design (High-Level)

All endpoints are prefixed with `/api/v1`. Request and response bodies are JSON.

### Wallets

| Method | Endpoint       | Description                    |
| ------ | -------------- | ------------------------------ |
| GET    | `/wallets`     | List all wallets               |
| POST   | `/wallets`     | Create a wallet                |
| GET    | `/wallets/:id` | Get wallet details             |
| PUT    | `/wallets/:id` | Update a wallet                |
| DELETE | `/wallets/:id` | Archive a wallet (soft delete) |

### Categories

| Method | Endpoint                           | Description                                 |
| ------ | ---------------------------------- | ------------------------------------------- |
| GET    | `/categories?type=expense\|income` | List categories (with sub-categories)       |
| POST   | `/categories`                      | Create a category                           |
| PUT    | `/categories/:id`                  | Update a category                           |
| DELETE | `/categories/:id`                  | Delete a category (with reassignment check) |
| POST   | `/categories/:id/subcategories`    | Add a sub-category                          |
| PUT    | `/subcategories/:id`               | Update a sub-category                       |
| DELETE | `/subcategories/:id`               | Delete a sub-category                       |

### Transactions

| Method | Endpoint            | Description                               |
| ------ | ------------------- | ----------------------------------------- |
| GET    | `/transactions`     | List transactions (paginated, filterable) |
| POST   | `/transactions`     | Create a transaction                      |
| GET    | `/transactions/:id` | Get transaction details                   |
| PUT    | `/transactions/:id` | Update a transaction                      |
| DELETE | `/transactions/:id` | Delete a transaction                      |

**Query Parameters for `GET /transactions`:**

| Param         | Type   | Description                               |
| ------------- | ------ | ----------------------------------------- |
| `type`        | string | Filter by `income`, `expense`, `transfer` |
| `wallet_id`   | string | Filter by wallet                          |
| `category_id` | string | Filter by category                        |
| `from`        | string | Start date (ISO 8601)                     |
| `to`          | string | End date (ISO 8601)                       |
| `search`      | string | Search in note field                      |
| `page`        | number | Page number (default: 1)                  |
| `limit`       | number | Items per page (default: 50, max: 100)    |

### Statistics

| Method | Endpoint                  | Description                                 |
| ------ | ------------------------- | ------------------------------------------- |
| GET    | `/statistics/summary`     | Total income, expense, balance for a period |
| GET    | `/statistics/by-category` | Breakdown by category for a period          |
| GET    | `/statistics/trend`       | Income vs. expense over time buckets        |

**Query Parameters:**

| Param    | Type   | Description                   |
| -------- | ------ | ----------------------------- |
| `period` | string | `weekly`, `monthly`, `yearly` |
| `year`   | number | Year                          |
| `month`  | number | Month (for weekly/monthly)    |
| `type`   | string | `income` or `expense`         |

### Budgets

| Method | Endpoint                            | Description                             |
| ------ | ----------------------------------- | --------------------------------------- |
| GET    | `/budgets?year=2026&month=2`        | List budgets for a month                |
| POST   | `/budgets`                          | Create/update a budget                  |
| DELETE | `/budgets/:id`                      | Delete a budget                         |
| GET    | `/budgets/status?year=2026&month=2` | Budget vs. actual spending per category |

### Dashboard

| Method | Endpoint     | Description                                                         |
| ------ | ------------ | ------------------------------------------------------------------- |
| GET    | `/dashboard` | Aggregated data: total balance, period summary, recent transactions |

### Standard Response Envelope

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 342
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Amount must be a positive integer",
    "details": [ ... ]
  }
}
```

---

## 11. Non-Functional Requirements

### Performance

- **Dashboard load:** < 500ms (aggregated query + cached where possible)
- **Transaction save:** < 200ms perceived latency
- **Page transitions:** instant (SPA client-side routing)
- **API cold start:** Cloudflare Workers cold starts are ~5ms; negligible
- **Pagination:** all list endpoints must be paginated; no unbounded queries
- **Frontend bundle:** target < 200 KB gzipped for initial load

### Security

- Input validation on every API endpoint (Zod schemas)
- SQL parameterization for all D1 queries (no raw string interpolation)
- CORS restricted to the Pages domain
- Rate limiting via Cloudflare's built-in tools (optional, recommended)
- No sensitive data stored; financial data is personal but non-PII
- HTTPS enforced by default on Cloudflare

### Data Integrity

- **Wallet balance consistency:** balance updates wrapped in D1 batch transactions
  - On transaction create: adjust source wallet (and destination for transfers)
  - On transaction update: reverse old adjustment, apply new
  - On transaction delete: reverse adjustment
- **Referential integrity:** enforced via `FOREIGN KEY` constraints (D1 supports them with `PRAGMA foreign_keys = ON`)
- **Soft deletes:** wallets and system categories are soft-deleted (archived) to preserve transaction references
- **Idempotency:** POST endpoints should be safely retryable (ULID generated client-side as idempotency key)

---

## 12. Limitations & Trade-offs

| Area                     | Limitation / Trade-off                                                                      | Rationale                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Database**             | D1 is eventually consistent for reads in some configurations                                | Acceptable for personal finance; no concurrent writes                      |
| **Query complexity**     | SQLite lacks some advanced analytics SQL (window functions are supported since SQLite 3.25) | Sufficient for MVP aggregations                                            |
| **Offline support**      | No offline-first capability                                                                 | Adds significant complexity; defer to post-MVP                             |
| **Multi-user**           | Single-user only; no tenant isolation                                                       | MVP is personal-use; multi-user requires auth, row-level security          |
| **Backup**               | D1 has automatic backups but no user-triggered export                                       | Post-MVP feature; user can rely on D1's built-in backup                    |
| **Denormalized balance** | Wallet `balance` column is denormalized (duplicated from sum of transactions)               | Needed for O(1) balance reads; requires careful transactional updates      |
| **No SSR**               | Pure SPA; no server-side rendering                                                          | SEO is irrelevant for a personal finance app behind auth                   |
| **Testing**              | Limited E2E testing in Workers environment                                                  | Use Vitest + Miniflare for local Worker testing; manual E2E                |
| **D1 free tier**         | 100K writes/day, 5M reads/day                                                               | More than sufficient for personal use; would need paid tier for multi-user |

---

## 13. Future Enhancements (Post-MVP)

| Priority  | Feature                    | Notes                                                                              |
| --------- | -------------------------- | ---------------------------------------------------------------------------------- |
| 🔴 High   | **Authentication**         | Email/password or OAuth via Cloudflare Access or custom JWT                        |
| 🔴 High   | **Data Export**            | CSV and PDF export of transactions and reports                                     |
| 🔴 High   | **Recurring Transactions** | Auto-create transactions on a schedule (cron trigger on Workers)                   |
| 🟡 Medium | **Light Mode Toggle**      | Dark mode is the primary design; light mode can be added via CSS custom properties |
| 🟡 Medium | **Multi-currency**         | Currency field per wallet; display conversion for reporting                        |
| 🟡 Medium | **Bill Reminders**         | Due date tracking with in-app notifications                                        |
| 🟡 Medium | **Savings Goals**          | Dedicated goal tracking with progress visualization                                |
| 🟡 Medium | **Data Import**            | CSV import for migrating from other apps                                           |
| 🟢 Low    | **Receipt Scanning**       | OCR via Workers AI or third-party API                                              |
| 🟢 Low    | **PWA + Offline**          | Service worker for offline transaction entry, sync on reconnect                    |
| 🟢 Low    | **Gamification**           | Levels, streaks, badges for consistent tracking                                    |
| 🟢 Low    | **AI Insights**            | Spending pattern detection via Workers AI                                          |
| 🟢 Low    | **Mobile App**             | React Native or Capacitor wrapper                                                  |

---

## 14. Frontend Design & UX Architecture (Dark Mode)

This section defines the complete visual and interaction design language for the financial tracker. The UI follows a **dark-mode-first** philosophy — the dark theme is the primary visual language, designed for long-session comfort during financial data analysis. Light mode is considered an optional secondary theme for post-MVP.

### 14.1 Dark Mode Design Principles

**Background Hierarchy — Three-Layer System**

The interface uses a layered depth model with progressively lighter dark tones to communicate elevation and focus:

| Layer        | Role                                  | Description                                                        |
| ------------ | ------------------------------------- | ------------------------------------------------------------------ |
| **Base**     | App background, page canvas           | The deepest, darkest surface; the default "floor" of the interface |
| **Surface**  | Cards, sidebar, panels                | One step lighter than base; indicates a distinct content region    |
| **Elevated** | Modals, dropdowns, tooltips, popovers | The lightest dark tone; floats visually above surface elements     |

**Text Contrast Strategy**

| Level         | Use Case                                | Contrast                              |
| ------------- | --------------------------------------- | ------------------------------------- |
| **Primary**   | Headings, amounts, key data             | Highest contrast — near-white on dark |
| **Secondary** | Labels, descriptions, timestamps        | Slightly reduced — light gray         |
| **Muted**     | Placeholders, disabled states, metadata | Low contrast — medium gray            |

**Core Principles:**

- **Never use pure black** as a background — pure black creates harsh contrast against text and causes visual vibration. Use very dark grays with a subtle cool or warm undertone instead
- **Never use pure white** for text — off-white is gentler on the eyes during extended use
- **Maintain WCAG AA minimum** — all primary and secondary text must achieve at least 4.5:1 contrast ratio against their background; large text (headings, amounts) must achieve at least 3:1
- **Reduce luminance range** — keep the total difference between the darkest background and the brightest text within a comfortable range; avoid stark white-on-black
- **Favor blue-shifted dark tones** — cool-tinted dark backgrounds feel modern and reduce the perception of "heaviness" associated with warm darks
- **Long-session comfort** — the overall luminance of the screen should remain low enough that the UI can be used in dim environments without eye strain

---

### 14.2 Color System (Dark Mode)

#### Background & Surface Colors

| Token Name            | Role                                   |
| --------------------- | -------------------------------------- |
| `--color-bg-base`     | App background, page canvas            |
| `--color-bg-surface`  | Cards, sidebar, content panels         |
| `--color-bg-elevated` | Modals, dropdowns, floating panels     |
| `--color-bg-sunken`   | Inset areas, input fields, code blocks |
| `--color-bg-hover`    | Surface on hover                       |
| `--color-bg-active`   | Surface on active/click                |

#### Border & Divider Colors

| Token Name               | Role                                                   |
| ------------------------ | ------------------------------------------------------ |
| `--color-border-default` | Standard card and panel borders (subtle, low contrast) |
| `--color-border-strong`  | Focused input borders, active element outlines         |
| `--color-divider`        | Horizontal rules, list separators (very subtle)        |

#### Text Colors

| Token Name               | Role                                    |
| ------------------------ | --------------------------------------- |
| `--color-text-primary`   | Headings, monetary amounts, key data    |
| `--color-text-secondary` | Labels, descriptions, supporting text   |
| `--color-text-muted`     | Placeholders, timestamps, disabled text |
| `--color-text-inverse`   | Text on accent-colored backgrounds      |

#### Accent Colors — Financial Semantics

These colors carry meaning and must be instantly recognizable:

| Token Name                 | Semantic               | Usage                                                                                            |
| -------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| `--color-income`           | **Income / positive**  | Income amounts, positive balance changes, income chart segments; a calm, muted emerald green     |
| `--color-expense`          | **Expense / negative** | Expense amounts, negative balance changes, expense chart segments; a warm, desaturated coral-red |
| `--color-transfer`         | **Transfer / neutral** | Transfer indicators, neutral operations; a soft steel blue                                       |
| `--color-accent-primary`   | **Primary action**     | Primary buttons, active nav items, focus rings; a distinct brand-accent blue-violet or teal      |
| `--color-accent-secondary` | **Secondary action**   | Secondary buttons, tags; a muted complement to the primary accent                                |

> [!IMPORTANT]
> On dark backgrounds, saturated colors appear more vibrant and can cause visual fatigue. All accent colors must be **desaturated by 15–25%** compared to their light-mode equivalents. Pure neon greens and bright reds must be avoided.

#### Semantic State Colors

| Token Name        | Semantic      | Usage                                                |
| ----------------- | ------------- | ---------------------------------------------------- |
| `--color-success` | Success       | Confirmation, completed actions; a toned-down green  |
| `--color-warning` | Warning       | Nearing budget limit, attention needed; a warm amber |
| `--color-danger`  | Danger        | Overspent, delete confirmations, errors; a soft red  |
| `--color-info`    | Informational | Tips, neutral alerts; a muted blue                   |

#### Chart Palette

- Use a curated set of 8–10 distinguishable category colors, each with reduced saturation for dark backgrounds
- Colors must pass contrast checks against both the dark chart background and adjacent segments in pie/donut charts
- Category colors are stored per-category in the database and applied consistently across charts, lists, and tags
- When more than 10 categories exist, group the smallest into "Other" with a neutral gray

---

### 14.3 Global Layout Structure

**App Shell — Desktop (≥ 1024px)**

```
┌───────────┬──────────────────────────────────────────────┐
│           │  Top Bar (date range, search, profile)       │
│  Sidebar  ├──────────────────────────────────────────────┤
│  (fixed)  │                                              │
│           │  Content Area (scrollable)                   │
│  nav +    │                                              │
│  CTA      │  ┌────────┐ ┌────────┐ ┌────────┐           │
│           │  │ Card   │ │ Card   │ │ Card   │           │
│           │  └────────┘ └────────┘ └────────┘           │
│           │                                              │
│           │  ┌─────────────────────────────┐             │
│           │  │ Chart / Table / List        │             │
│           │  └─────────────────────────────┘             │
│           │                                              │
└───────────┴──────────────────────────────────────────────┘
```

| Region             | Surface Level | Behavior                                                                            |
| ------------------ | ------------- | ----------------------------------------------------------------------------------- |
| **App background** | Base          | Full viewport, behind everything                                                    |
| **Sidebar**        | Surface       | Fixed left, 240px wide; dark surface with subtle left-border or no border           |
| **Top bar**        | Surface       | Sticky top; contains global filters (period selector), search input, profile avatar |
| **Content area**   | Base          | Scrollable; cards and panels rendered on surface-level backgrounds                  |
| **Cards**          | Surface       | Rounded corners, subtle border, slight shadow in elevated variant                   |

**Responsive Behavior:**

| Breakpoint          | Layout Change                                               |
| ------------------- | ----------------------------------------------------------- |
| ≥ 1024px (desktop)  | Full sidebar + content grid                                 |
| 768–1023px (tablet) | Sidebar collapses to icon-only rail (56px); content expands |
| < 768px (mobile)    | No sidebar; bottom tab bar with 5 items; full-width content |

**Content Grid:**

- Desktop: 12-column CSS grid within the content area
- Dashboard summary cards: 3-up or 4-up row
- Charts and tables: span full content width or 8/12 columns
- Gutters: consistent spacing using a 4px/8px base unit

---

### 14.4 Navigation & Routing UX

**Sidebar Structure (Desktop)**

```
┌─────────────────────────┐
│  [App Logo]             │
│  Financial Tracker      │
│─────────────────────────│
│  ○  Dashboard           │
│  ○  Transactions        │
│  ○  Statistics          │
│  ○  Categories          │
│  ○  Wallets             │
│  ○  Budgets             │
│─────────────────────────│
│  ○  Settings            │
│─────────────────────────│
│  [+ Add Transaction]    │   ← Primary CTA
└─────────────────────────┘
```

**State Treatments (Dark Mode):**

| State                | Visual Treatment                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| **Default**          | Icon + label in secondary text color; transparent background                                             |
| **Hover**            | Background shifts to `--color-bg-hover`; text brightens to primary                                       |
| **Active / Current** | Left accent-color bar (3px); background at `--color-bg-active`; text at primary; icon tinted with accent |
| **Focus (keyboard)** | Visible focus ring using `--color-accent-primary` with 2px offset; no background change                  |
| **Disabled**         | Muted text; no pointer cursor                                                                            |

**Icon + Label Guidelines:**

- Every nav item has a monoline icon (Lucide or similar) paired with a text label
- Icons are rendered at 20px; labels in the standard body font size
- In collapsed mode (tablet rail), only icons are shown; a tooltip reveals the label on hover

**Collapsible Sidebar:**

- Collapse trigger: chevron icon at the bottom of the sidebar, or automatic based on breakpoint
- Transition: smooth width animation (240px → 56px) over ~200ms
- Content area expands to fill the reclaimed space
- The "+ Add Transaction" button shrinks to a "+" icon-only FAB in collapsed mode

**Mobile Bottom Tab Bar:**

- 5 items: Dashboard, Transactions, Add (+), Statistics, More
- The center Add button is visually elevated (larger, accent-colored circle)
- "More" opens a drawer with: Categories, Wallets, Budgets, Settings

---

### 14.5 Dashboard (Overview)

The dashboard is the landing page and the most information-dense screen. It must feel calm and scannable despite the data volume.

**Summary Cards Row:**

- Three or four cards in a horizontal row: **Total Balance**, **Income (period)**, **Expense (period)**, and optionally **Net (period)**
- Each card: surface background, rounded corners, subtle border
- The monetary amount is rendered in primary text at a larger font weight
- Income amount uses `--color-income`; expense amount uses `--color-expense`
- A small trend indicator arrow (↑ or ↓) with percentage change from the previous period, in muted text
- Period selector (Day / Week / Month / Year) sits in the top bar or inline above the cards

**Budget Allocation Bar:**

- A segmented horizontal bar showing budget allocation across top categories
- Each segment uses the category's assigned color
- Below the bar: a vertical list of categories with spent amount, remaining amount, budget total, and a percentage
- Overspent categories show the percentage in `--color-warning` or `--color-danger`

**Line / Bar Chart — Income vs. Expense Trend:**

- A small sparkline or bar chart showing the last 6–12 periods
- Two data series: income (green-toned) and expense (red-toned) with reduced opacity fills
- Chart background matches the card surface; grid lines are rendered in `--color-divider` (very faint)
- Axis labels in muted text

**Recent Transactions List:**

- The last 5–10 transactions, grouped by date
- Date headers in secondary text, slightly bolder
- Each row: category icon, category name, note (truncated), wallet tag, amount
- Amounts are right-aligned; income in `--color-income`, expense in `--color-expense`
- Row hover: background shifts to `--color-bg-hover`; subtle transition

**Progress Indicators:**

- Budget progress bars use a thin horizontal bar on a sunken-background track
- Fill color: accent when under budget, warning when 80–99%, danger when over 100%
- Label shows "spent / total" in secondary text

---

### 14.6 Transactions UI

**Layout: Table on Desktop, List on Mobile**

| Column (Desktop Table) | Alignment | Notes                                    |
| ---------------------- | --------- | ---------------------------------------- |
| Date & Time            | Left      | Grouped by date with sticky date headers |
| Category (icon + name) | Left      | Colored icon badge                       |
| Note                   | Left      | Truncated with tooltip on overflow       |
| Wallet                 | Left      | Small tag/chip                           |
| Amount                 | Right     | Color-coded: income/expense/transfer     |

**Dark Mode Contrast Handling:**

- Table rows alternate between `--color-bg-base` and `--color-bg-surface` for subtle zebra striping
- Row borders use `--color-divider` — barely visible, just enough to separate rows
- **Row hover**: full-row highlight to `--color-bg-hover` with a smooth 100ms transition
- **Selected row** (if multi-select is added later): outlined with `--color-accent-primary`

**Positive vs. Negative Amounts:**

- Income: prefixed with `+`, rendered in `--color-income`
- Expense: prefixed with `−`, rendered in `--color-expense`
- Transfer: no prefix, rendered in `--color-transfer`
- Font weight: semi-bold for amounts to aid scannability

**Filter Panel:**

- A collapsible filter bar above the table
- Contains: type pills (Income / Expense / Transfer / All), wallet dropdown, category dropdown, date range picker, search input
- All filter controls use dark-appropriate styling: sunken-background inputs, light placeholder text, accent-colored active pills
- Active filters show a subtle count badge
- "Clear all filters" link in muted text

**Pagination:**

- Below the table: page number controls with text-button styling
- Current page is accent-highlighted
- Or use infinite scroll with a "load more" trigger

---

### 14.7 Quick Add Transaction UX

**Trigger:**

- Persistent "+ Add Transaction" CTA button in the sidebar (desktop) or center FAB (mobile)
- Keyboard shortcut: `N` key when not focused on an input field

**Modal Behavior:**

- Opens as a **centered modal** on desktop; **full-screen drawer** sliding up on mobile
- Dark modal overlay at ~60% opacity black, dimming the background content
- The modal itself uses `--color-bg-elevated` — the lightest dark surface
- Focus is trapped within the modal; `Escape` key or clicking the overlay dismisses it

**Form Layout:**

```
┌─────────────────────────────────────┐
│  [Expense]  [Income]  [Transfer]    │   ← Type tabs
│─────────────────────────────────────│
│  Category:  [Food & Drink ▾]        │
│  Sub-cat:   [Breakfast ▾]           │
│                                     │
│  Amount:    ┌──────────────┐        │
│             │  Rp 25,000   │        │   ← Large, prominent input
│             └──────────────┘        │
│                                     │
│  Note:      [Add a note...]         │
│  Wallet:    [Cash ▾]                │
│  Date:      [Feb 16, 2026  22:30]   │
│                                     │
│         [Cancel]  [Save]            │
└─────────────────────────────────────┘
```

**Dark Mode Input Styling:**

- Input fields use `--color-bg-sunken` background with `--color-border-default` border
- On focus: border transitions to `--color-border-strong` (accent-tinted); subtle glow ring
- Text inside inputs is primary-colored for readability
- Placeholder text is muted-colored
- The amount input is visually emphasized: larger font size, center-aligned, currency symbol left-aligned

**Numeric Input Visibility:**

- The amount field should display in a larger, semi-bold font to be the visual focal point
- On mobile, consider triggering the numeric keyboard (`inputmode="decimal"`)
- Formatted with locale-appropriate thousands separators as the user types

**Keyboard-First Interaction:**

- `Tab` navigates between fields in logical order
- `Enter` on the last field submits the form
- Category and wallet selectors can be navigated with arrow keys and filtered by typing
- After save, the modal can optionally remain open for rapid sequential entry ("Save & Add Another" checkbox)

---

### 14.8 Statistics & Analytics

**Chart Color Palette for Dark Backgrounds:**

- All chart colors must be **desaturated and medium-brightness** — vibrant neon colors are prohibited
- Each category uses its assigned color token, with ~70–80% saturation on dark backgrounds
- Chart backgrounds are transparent, blending with the card surface
- Grid lines use `--color-divider` (nearly invisible); axis labels in muted text

**Donut / Pie Chart (Expense Breakdown):**

- Centered within a card; total amount displayed in the center hole in primary text, large weight
- Legend displayed below or beside the chart as a list of category names with color dots and percentage
- On hover/click of a segment: segment slightly offsets outward (2–3px); tooltip shows category name, amount, percentage
- On click: drills down to filtered transaction list for that category

**Bar Chart (Income vs. Expense Trend):**

- Grouped or side-by-side bars for each period bucket
- Income bar uses `--color-income` at ~60% opacity; expense bar uses `--color-expense` at ~60% opacity
- Hover reveals exact values in a tooltip with a subtle dark background

**Legend Readability:**

- Legend items: colored dot (8px), category name in secondary text, value/percentage in primary text
- Legends should be outside the chart area to prevent overlap
- If more than 6 items, the legend becomes scrollable or wraps to multiple rows

**Drill-Down Interactions:**

- Clicking a chart segment or legend item navigates to the Transactions page pre-filtered by that category and the current period
- A breadcrumb or back-link appears on the filtered view to return to statistics

**Avoiding Visual Noise:**

- No 3D chart effects
- No background patterns or textures
- Minimal axis ticks — only label the first, middle, and last period
- Hover effects are the only interactive embellishment

---

### 14.9 Categories & Wallets UI

**Categories Page:**

- Two tabs at the top: **Expense** | **Income**
- List of parent categories, each rendered as a surface-colored card-row
- Each row: category color dot, icon (rendered at medium brightness, not full saturation), category name, sub-category count, expand chevron
- Expanded view reveals sub-categories indented below with lighter treatment
- Add / Edit / Delete actions via icon buttons at the right end of each row; buttons are muted until hover

**Icon Contrast on Dark Surfaces:**

- Category icons should not be rendered in their full-saturation category color; instead, use the icon as a monochrome shape inside a small colored circular badge
- The badge background uses the category color at ~20% opacity; the icon inside uses the category color at ~80% brightness
- This prevents colored icons from "burning" against the dark background

**Wallets Page:**

- Grid or list of wallet cards
- Each card: wallet icon, wallet name, current balance in large primary text
- Balance uses `--color-income` if positive, `--color-expense` if negative
- Card background is uniform `--color-bg-surface`; differentiation comes from the icon and name, not from background color
- A total balance card at the top aggregates all wallet balances

**Wallet Differentiation Without Bright Colors:**

- Wallets are distinguished by icon choice (bank icon, cash icon, card icon, phone icon for e-wallet) and name — not by painting each card a different background color
- A small colored dot or left-border accent can hint at wallet identity without overwhelming the dark theme

---

### 14.10 Budgeting UI (MVP)

**Budget Overview:**

- A list of budget rows, one per category with a set budget
- Each row contains: category icon+name, progress bar, spent amount, budget amount, percentage

**Progress Bars on Dark Background:**

- The track (background) uses `--color-bg-sunken` — a darker, inset tone that recedes visually
- The fill color transitions based on utilization:
  - 0–69%: `--color-accent-primary` (calm, neutral)
  - 70–89%: `--color-warning` (warm amber, signaling caution)
  - 90–99%: A blend/transition toward `--color-danger`
  - ≥ 100%: `--color-danger` fill, but softened — not a harsh bright red
- Progress bars have rounded ends and animate smoothly when values change

**Overspending Visual Signals:**

- When a category exceeds its budget, the progress bar fill extends past 100% with a subtle overflow pattern or glow
- The percentage label switches to `--color-danger` text
- A small warning icon (⚠) appears next to the category name in `--color-warning`
- No harsh alert banners, pop-ups, or flashing — the indicators are embedded within the row itself

**Subtle Warning Indicators:**

- Use icon tinting and text color changes, not background color flooding
- Tooltips provide specific context: "Over budget by Rp 150,000 this month"
- Optional: a small summary banner at the top of the budget page: "2 categories over budget this month" in a soft warning-tinted surface card

---

### 14.11 Component Design System

#### Card Elevation Strategy

| Variant      | Background            | Border                         | Shadow                                        | Use Case                               |
| ------------ | --------------------- | ------------------------------ | --------------------------------------------- | -------------------------------------- |
| **Flat**     | `--color-bg-surface`  | `--color-border-default` (1px) | None                                          | Default content cards, list containers |
| **Raised**   | `--color-bg-surface`  | None                           | Subtle dark shadow (low spread, high opacity) | Summary cards, dashboard modules       |
| **Elevated** | `--color-bg-elevated` | `--color-border-default` (1px) | Medium shadow                                 | Modals, dropdowns, floating panels     |

> [!NOTE]
> Shadows on dark backgrounds behave differently than on light. Instead of gray shadows, use pure black shadows at very low opacity. The visual effect is subtler but still provides depth cues.

#### Button Variants

| Variant       | Background                       | Text                    | Border            | Use Case                             |
| ------------- | -------------------------------- | ----------------------- | ----------------- | ------------------------------------ |
| **Primary**   | `--color-accent-primary` (solid) | Inverse (dark on light) | None              | Main CTAs: "Save", "Add Transaction" |
| **Secondary** | Transparent                      | Accent-colored          | 1px accent border | Cancel, secondary actions            |
| **Ghost**     | Transparent                      | Secondary text          | None              | Tertiary actions, inline links       |
| **Danger**    | `--color-danger` at 15% opacity  | Danger-colored text     | 1px danger border | Delete, destructive actions          |

- All buttons: rounded corners (6–8px radius), minimum 36px height for touch targets
- Hover: slight brightness increase on background; smooth 100ms transition
- Focus: visible focus ring (2px `--color-accent-primary`), offset by 2px
- Active/pressed: slight scale-down (0.98) for tactile feedback

#### Input Fields

| Style        | Background          | Border                                                      | When to Use                                      |
| ------------ | ------------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| **Filled**   | `--color-bg-sunken` | None (or 1px transparent, transitioning to accent on focus) | Default for most forms; blends with card surface |
| **Outlined** | Transparent         | 1px `--color-border-default`                                | Settings, less-dense forms                       |

- Focus state: border transitions to `--color-border-strong`; optional subtle glow
- Error state: border turns `--color-danger`; error message below in danger-colored muted text
- Disabled state: reduced opacity (50%); no interaction

#### Modal & Drawer Patterns

| Pattern    | Trigger                        | Desktop                                 | Mobile                   |
| ---------- | ------------------------------ | --------------------------------------- | ------------------------ |
| **Modal**  | Add transaction, confirmations | Centered overlay, max-width 480px       | Full-screen bottom sheet |
| **Drawer** | Filters, category detail       | Right-side slide-in, 360px              | Full-screen slide-up     |
| **Dialog** | Delete confirmation, alerts    | Small centered overlay, max-width 360px | Same                     |

- Overlay: black at ~60% opacity; click-to-dismiss (unless destructive confirmation)
- Enter animation: fade + slight upward slide (120ms ease-out)
- Exit animation: fade out (80ms ease-in)

#### Skeleton Loaders (Dark Mode)

- Skeleton shapes replace content during loading: rectangular for text lines, circular for icons/avatars
- Base skeleton color: slightly lighter than `--color-bg-surface`
- Shimmer animation: a subtle gradient sweep moving left-to-right, using a slightly lighter tone
- Avoid bright shimmer — the pulse should be barely perceptible, not flashy
- Skeleton shapes match the expected content dimensions to prevent layout shifts

---

### 14.12 Motion & Feedback

**Subtle Animations — Philosophy:**

- Motion should inform, not decorate. Every animation must communicate a state change, spatial relationship, or action confirmation
- Keep durations short: 100–200ms for micro-interactions, 200–300ms for panel transitions
- Easing: use `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for transforms

**Animation Inventory:**

| Interaction        | Animation                      | Duration       |
| ------------------ | ------------------------------ | -------------- |
| Page transition    | Fade crossfade                 | 150ms          |
| Modal open         | Fade in + translate-Y from 8px | 120ms          |
| Modal close        | Fade out                       | 80ms           |
| Sidebar collapse   | Width transition               | 200ms          |
| Card hover         | Background color shift         | 100ms          |
| Button press       | Scale to 0.98                  | 80ms           |
| Progress bar fill  | Width transition               | 300ms ease-out |
| Toast notification | Slide in from top-right + fade | 200ms          |
| Skeleton shimmer   | Infinite gradient sweep        | 1500ms linear  |

**Reduced Motion Preference:**

- Respect `prefers-reduced-motion: reduce` media query
- When active: disable all transform-based and translate-based animations
- Keep opacity transitions (fades) but make them instantaneous (~1ms)
- Skeleton loaders switch from shimmer to a static pulse (opacity 0.5 → 0.7 → 0.5, slower cycle)

**Hover & Focus Feedback:**

- Every interactive element must have a visible hover state (background shift or underline)
- Every focusable element must have a visible focus ring for keyboard navigation
- Focus rings use the `--color-accent-primary` with a 2px offset, visible against both surface and base backgrounds
- Avoid focus styles that only work on light backgrounds (e.g., blue outlines that vanish on dark blue surfaces)

**State Transition Feedback:**

- On save: brief success toast ("Transaction saved") slides in from the top-right, auto-dismisses after 3 seconds
- On delete: confirmation dialog; after confirmation, the row fades out (150ms) and the list reflows
- On error: inline error messages below the relevant field; the field border changes to danger color
- Loading states: skeleton loaders replace content; the CTA button shows a spinner and disables during API calls

---

### 14.13 UX Trade-offs & Dark Mode Constraints

**Intentionally Simplified for MVP:**

| Decision                     | Rationale                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| No light mode toggle         | Dark mode is the only theme; implementing a full theme toggle doubles the design and QA surface              |
| No custom theming            | Users cannot change accent colors or background tones; reduces complexity                                    |
| Limited chart types          | Only donut and bar charts; no line, area, or heatmap variants to keep the chart library footprint small      |
| No animated data transitions | Chart data swaps instantly (fade at most); complex data-driven animations add library weight and bug surface |
| No drag-and-drop             | Category and wallet reordering uses up/down arrows, not drag-and-drop; avoids accessibility complexity       |
| Minimal onboarding           | No guided tour or overlay tutorials; the UI should be self-explanatory                                       |

**Known Dark Mode Pitfalls:**

| Pitfall                             | Mitigation                                                                                                                                                                         |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Color-only differentiation**      | Never rely on color alone to convey meaning; always pair with icons, text labels, or position                                                                                      |
| **Invisible borders**               | Dark borders on dark backgrounds can vanish; use a minimum 8% lightness difference between border and background                                                                   |
| **Image handling**                  | If user-uploaded images are ever supported (post-MVP), they may have white backgrounds that "blow out" on dark UI; consider adding a subtle rounded-corner mask with a dark border |
| **Saturated colors appearing neon** | Pre-defined category colors must be tested on dark backgrounds; provide a constrained color picker in post-MVP                                                                     |
| **Print unfriendly**                | Dark-mode UIs print poorly; defer to post-MVP print stylesheet or PDF export                                                                                                       |
| **Shadow imperceptibility**         | Traditional gray shadows are invisible on dark surfaces; use black shadows at very low opacity for depth, or rely on border + background layering instead                          |

**MVP Limitations:**

- No light mode fallback — users in bright outdoor environments may find contrast insufficient. This is accepted for MVP and mitigated by targeting desktop-first (indoor) usage
- No per-component dark mode testing suite — visual regression testing is manual in MVP; a tool like Chromatic can be adopted post-MVP
- No theme token documentation site — design tokens are documented in this section only; a living style guide (Storybook) is a post-MVP investment
- No high-contrast mode for visually impaired users — WCAG AA is the floor; AAA contrast and forced-colors support are deferred

---

## Appendix A: Default Expense Categories (Seed Data)

| Parent Category | Sub-Categories                                           |
| --------------- | -------------------------------------------------------- |
| Food & Drink    | Breakfast, Lunch, Dinner, Snacks, Coffee, Groceries      |
| Transport       | Fuel, Public Transit, Parking, Ride-hailing, Maintenance |
| Shopping        | Clothing, Electronics, Household, Online Shopping        |
| Housing         | Rent, Utilities, Internet, Repairs, Furniture            |
| Entertainment   | Movies, Games, Streaming, Hobbies, Events                |
| Health          | Medicine, Doctor, Gym, Insurance                         |
| Education       | Books, Courses, Tuition, Supplies                        |
| Personal        | Haircut, Laundry, Gifts, Charity/Zakat                   |
| Bills           | Phone, Insurance, Subscriptions, Taxes                   |
| Other           | Miscellaneous                                            |

## Appendix B: Default Income Categories (Seed Data)

| Parent Category | Sub-Categories                     |
| --------------- | ---------------------------------- |
| Salary          | Monthly Salary, Bonus, Overtime    |
| Freelance       | Project Payment, Consulting        |
| Investment      | Dividends, Interest, Capital Gains |
| Business        | Sales, Services                    |
| Gifts           | Received Gifts, Refunds            |
| Other           | Miscellaneous Income               |

---

_Document version: 1.1 — February 2026 (added §14 Frontend Design & UX Architecture)_
_Author: Single-developer project plan_
