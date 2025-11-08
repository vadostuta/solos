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
- **Dashboard** - Main view with scenario cards and timeline
- **PayoutTimeline** - Visual representation of when money arrives
- **ScenarioCards** - 🔴🟡🟢 worst/expected/best case displays
- **PlatformList** - Breakdown by sales channel
- **Charts** - Cash-flow visualization using Recharts

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
