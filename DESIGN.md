# DESIGN.md — Financial Tracker Design System

## 1. Brand Identity

- **Name:** Financial Tracker
- **Tone:** Professional, calm, information-dense
- **Primary Use:** Personal financial management dashboard
- **Design Philosophy:** Dark-mode-first, desktop-first, long-session comfort

## 2. Typography

- **Font Family:** Inter (Google Fonts) — clean, modern, highly readable on screens
- **Heading Scale:** 28px / 24px / 20px / 16px (H1–H4)
- **Body:** 14px regular
- **Small Text:** 12px for timestamps, metadata
- **Monetary Amounts:** 20–28px, semi-bold, tabular numerals

## 3. Color System

### Background Hierarchy

- **Base (App Background):** Very dark blue-gray (e.g., hsl(222, 20%, 8%))
- **Surface (Cards, Sidebar):** Dark blue-gray (e.g., hsl(222, 18%, 12%))
- **Elevated (Modals, Dropdowns):** Slightly lighter (e.g., hsl(222, 16%, 16%))
- **Sunken (Inputs):** Darker than surface (e.g., hsl(222, 20%, 6%))

### Text

- **Primary:** Off-white (e.g., hsl(210, 20%, 92%))
- **Secondary:** Light gray (e.g., hsl(215, 15%, 65%))
- **Muted:** Medium gray (e.g., hsl(218, 10%, 45%))

### Accents

- **Income Green:** Muted emerald (e.g., hsl(152, 55%, 50%))
- **Expense Red:** Desaturated coral (e.g., hsl(0, 60%, 60%))
- **Transfer Blue:** Soft steel blue (e.g., hsl(215, 50%, 55%))
- **Primary Accent:** Teal/blue-violet (e.g., hsl(230, 70%, 60%))
- **Warning:** Warm amber (e.g., hsl(38, 85%, 55%))
- **Danger:** Soft red (e.g., hsl(0, 65%, 55%))
- **Success:** Toned green (e.g., hsl(145, 50%, 45%))

### Borders & Dividers

- **Default Border:** Very subtle (e.g., hsl(220, 15%, 18%))
- **Strong Border:** Slightly brighter (e.g., hsl(220, 20%, 28%))
- **Dividers:** Nearly invisible (e.g., hsl(220, 12%, 15%))

## 4. Layout

- **App Shell:** Fixed sidebar (240px) + top bar + scrollable content area
- **Content Grid:** 12-column grid, 24px gutters
- **Card Radius:** 12px
- **Spacing Unit:** 4px base (4, 8, 12, 16, 24, 32, 48)
- **Sidebar:** Dark surface with nav items, icon + label, active state with left accent bar

## 5. Component Patterns

- **Cards:** Surface background, 1px subtle border, 12px radius, optional shadow
- **Buttons:** Primary (accent fill), Secondary (outlined), Ghost (text only), Danger (red tinted)
- **Inputs:** Filled style with sunken background, accent border on focus
- **Progress Bars:** Thin, rounded, on sunken track, animated fill
- **Modals:** Elevated surface, dark overlay at 60%, centered on desktop
- **Tables:** Subtle zebra striping, hover rows, sticky date headers

## 6. Design System Notes for Stitch Generation

**IMPORTANT: Include this section in ALL Stitch prompts to ensure visual consistency.**

Use these guidelines for every generated screen:

**OVERALL FEEL:** Modern, professional financial SaaS dashboard. Dark mode only. Clean and spacious with clear visual hierarchy. Think Linear, Vercel Dashboard, or Stripe Dashboard vibes — but for personal finance.

**BACKGROUND:** Very dark blue-gray base (NOT pure black). Cards and panels sit on a slightly lighter dark surface. Modals and dropdowns use an elevated (lighter) dark surface.

**TYPOGRAPHY:** Inter font. Off-white primary text. Light gray secondary text. Medium gray for muted/metadata. Monetary amounts are large, semi-bold, and use tabular numerals. Use the income green for positive amounts and expense red/coral for negative amounts.

**NAVIGATION:** Fixed left sidebar with dark surface background. Navigation items have icons (Lucide-style) + text labels. Active item has a left accent bar and highlighted background. A prominent "+ Add Transaction" button at the bottom of the sidebar.

**CARDS:** 12px rounded corners. Subtle 1px border (very low contrast). Surface-colored background. Summary/metric cards can have slightly more elevation.

**CHARTS:** Use desaturated colors (not neon). Donut chart for category breakdowns. Bar chart for trends. Grid lines are nearly invisible. Legend uses colored dots + text.

**DATA TABLES:** Subtle alternating rows. Hover highlights. Income amounts in green, expense in coral-red, transfers in blue. Date group headers are sticky.

**INPUTS:** Dark sunken background. Accent-colored focus border. Off-white text.

**BUTTONS:** Primary = accent-colored fill. Secondary = outlined. Ghost = text only. Danger = red-tinted.

**ICONS:** Lucide-style monoline icons. 20px standard size. Medium brightness, not full saturation.

**SPACING:** Generous whitespace. 4px/8px base grid. 24px gutters. Avoid cramming.

**SHADOWS:** Minimal. Use pure black at very low opacity for subtle depth. Never use gray shadows on dark backgrounds.

**ACCESSIBILITY:** WCAG AA contrast minimum. Never use color alone to convey meaning — always pair with icons or text labels.
