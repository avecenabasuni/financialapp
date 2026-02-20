---
page: loading-skeletons
---

Design a "Loading Skeleton" state for the Dashboard page of FinTrack. This shows what the user sees during data loading — skeleton placeholders instead of real content.

**DESIGN SYSTEM (REQUIRED):**

OVERALL FEEL: Modern, professional financial SaaS dashboard. Dark mode only. Clean and spacious with clear visual hierarchy. Think Linear, Vercel Dashboard, or Stripe Dashboard vibes — but for personal finance.

BACKGROUND: Very dark blue-gray base (NOT pure black). Cards and panels sit on a slightly lighter dark surface.

TYPOGRAPHY: Inter font. Off-white primary text. Light gray secondary text. Medium gray for muted/metadata.

NAVIGATION: Fixed left sidebar with dark surface background. Navigation items have icons (Lucide-style) + text labels. Active item has a left accent bar and highlighted background.

CARDS: 12px rounded corners. Subtle 1px border (very low contrast). Surface-colored background.

SPACING: Generous whitespace. 4px/8px base grid. 24px gutters.

**Page Structure:**

1. Fixed left sidebar with "Dashboard" active (fully rendered, not skeleton)
2. Top bar rendered normally
3. Summary cards row: 3 cards with pulsing/shimmer skeleton rectangles for amounts and labels
4. Chart area: large rectangle skeleton placeholder with subtle shimmer animation
5. Budget overview: skeleton bars instead of progress bars
6. Recent transactions: 5 skeleton rows with circles for icons and rectangles for text
7. All skeleton elements use a subtle shimmer/pulse effect — slightly lighter surface color animated horizontally
