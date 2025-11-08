# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Solos** is a cash-flow forecasting dashboard for small e-commerce owners selling across multiple platforms (Shopify, Etsy, Amazon, Stripe, etc.).

### Problem
E-commerce sellers struggle to see when and how much money will actually arrive in their bank accounts. Each platform has different payout cycles, fees, and delays — making cash-flow planning chaotic.

### Solution
Solos aggregates payout data from all sales channels into one unified dashboard, showing:
- **Received income (X)** — money already in the bank
- **Expected/in-process payouts (Y)** — money on the way
- **Expenses (Z)** — costs and fees

### Cash-Flow Scenarios
The app visualizes three scenarios to help users plan:
- 🔴 **Worst case:** X − Z (if no pending payouts clear)
- 🟡 **Expected case:** X + (Y × probability) − Z (realistic forecast)
- 🟢 **Best case:** X + Y − Z (if all payouts clear)

### Core Value
One place to understand "how much money I'll really have next week" — enabling smarter budgeting, ad spend, and supplier decisions.

**Tagline:** "Your payouts, all in one timeline — forecasted, normalized, and under control."

### Current Phase
This is a **frontend-only implementation** focused on building the UI dashboard. Backend integration will be added later. The app currently uses mock data to demonstrate the UI and user experience.

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **TanStack Query** - Data fetching and state management
- **Recharts** - Data visualization for cash-flow charts
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library

## Development Commands

### Setup
```bash
npm install
```

### Development
```bash
npm run dev          # Start Vite dev server
```

### Building
```bash
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Linting
```bash
npm run lint         # Run ESLint
```

## Architecture

### High-Level Structure

**Frontend-Only Dashboard** - The app is structured as a client-side React application with no backend (yet). Data flows through:

1. **Mock Data Layer** - Simulated payout data from various platforms (Shopify, Etsy, Amazon, Stripe)
2. **TanStack Query** - Manages data fetching, caching, and state synchronization
3. **UI Components** - shadcn/ui components styled with Tailwind CSS
4. **Data Visualization** - Recharts displays cash-flow scenarios and timelines

### Key Concepts

**Cash-Flow Calculation:**
- **X (Received)** - Money already in bank account
- **Y (Expected)** - Pending payouts from all platforms
- **Z (Expenses)** - Platform fees, costs, expenses

**Three Scenarios:**
- Worst: X - Z
- Expected: X + (Y × probability) - Z
- Best: X + Y - Z

**Data Model:**
Each payout entry should include:
- Platform (Shopify, Etsy, Amazon, Stripe, etc.)
- Amount
- Status (received, pending, processing)
- Expected arrival date
- Fees/deductions
- Probability of clearing (for forecasting)

### Component Structure

When building, organize components by feature:
- **Dashboard** - Main view with KPI cards, chart, and insights sidebar
- **Header** - Top navigation with user info
- **KPICard** - Displays received, expected, and expenses metrics
- **CashFlowChart** - Interactive cash-flow visualization using Recharts
- **TransactionDetails** - Shows detailed transactions for a selected date
- **DateRangePicker** - Filter for selecting date ranges
- **InsightsSidebar** - Right sidebar displaying 6 AI-generated insights
- **InsightCard** - Individual insight card with category, message, and actions
- **PlatformFilter** - Filter for selecting platforms (for future use)

### Insights Feature

The dashboard includes an intelligent insights system that analyzes cash-flow data and surfaces actionable information:

**Insight Categories (6 types):**
1. **Anomalies** - Unusual patterns in income or expenses
2. **Platform Performance** - Which sales channels are performing best
3. **Fees & Refunds** - Analysis of platform fees and refund rates
4. **Forecast What-Ifs** - Predictions about pending income and cash position
5. **Timing Reliability** - Payout timing and completion rates
6. **Trend Momentum** - Growth trends in profit and revenue

**Insight Properties:**
- Title and descriptive message (8-20 words)
- Severity level: info (blue), success (green), warning (yellow), danger (red)
- Confidence score (0-1)
- Evidence references
- Optional action suggestions

**Behavior:**
- Insights automatically recalculate when date range changes
- Always displays exactly 6 insights
- Ensures category diversity (at least 4 different categories)
- Uses mock data generation based on actual financial metrics
- Future: Will call backend API with aggregated data

**Implementation:**
- `generateMockInsights()` in `services/analytics.ts` - Generates insights from financial data
- `InsightCard` component - Displays individual insight with color-coded styling
- `InsightsSidebar` component - Fixed-width sidebar (320px on desktop, full width on mobile)

## Important Notes

### shadcn/ui Setup
Components are copied into the project (not installed as dependencies). Add components using:
```bash
npx shadcn-ui@latest add [component-name]
```

### Mock Data Strategy
Since there's no backend yet, create realistic mock data that:
- Simulates multiple platforms with different payout cycles
- Includes various payout statuses (received, pending, processing)
- Shows realistic fees and deductions
- Demonstrates the cash-flow scenarios effectively

### Styling Approach
- Use Tailwind utility classes for layout and spacing
- Leverage shadcn/ui components for consistent design
- Keep the interface clean and focused on the financial data
- Use color coding: 🔴 red (worst), 🟡 yellow (expected), 🟢 green (best)
