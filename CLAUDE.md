# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Solos** is a cash-flow analytics and insights dashboard for small e-commerce owners selling across multiple platforms (Shopify, Etsy, Amazon, Stripe, etc.).

### Problem
E-commerce sellers struggle to track and understand their cash flow across multiple sales channels. Each platform has different payout cycles, fees, and delays — making it difficult to get a clear picture of financial health and make informed business decisions.

### Solution
Solos aggregates payout data from all sales channels into one unified dashboard, providing:
- **Received income** — money already in the bank (completed transactions)
- **Expected payouts** — pending/processing payouts (weighted by probability)
- **Expenses** — platform fees, marketing, and operational costs
- **Intelligent insights** — AI-generated analysis of financial patterns, anomalies, and opportunities

### Core Features
1. **KPI Tracking**: Real-time metrics with period-over-period comparison
2. **Interactive Cash Flow Chart**: Visualize trends over time with clickable data points
3. **Transaction Details**: Drill down into specific dates to see all payouts and expenses
4. **Smart Insights**: Automated analysis across 6 categories (Anomalies, Platform Performance, Fees, Forecasts, Timing, Trends)
5. **Flexible Date Filtering**: Quick presets (This month, Last 7/30/90 days) or custom date ranges

### Core Value
One unified dashboard to track cash flow, understand financial patterns, and make data-driven decisions about budgeting, ad spend, and supplier payments.

**Tagline:** "Your payouts, all in one timeline — tracked, analyzed, and under control."

### Current Phase
This is a **frontend-only implementation** with no backend. The app uses real Amazon order data (embedded CSV) combined with generated mock data for other platforms to demonstrate full functionality.

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

**Frontend-Only Dashboard** - The app is structured as a client-side React application with no backend. Data flows through:

1. **Mock Data Layer** (`services/mockData.ts`) - Real Amazon CSV data + generated mock data for other platforms
2. **Analytics Engine** (`services/analytics.ts`) - Calculations for KPIs, chart data, and insights generation
3. **React State** - Local component state with useMemo for performance optimization
4. **UI Components** - shadcn/ui components styled with Tailwind CSS
5. **Data Visualization** - Recharts for interactive area charts

### Key Concepts

**Cash-Flow Metrics:**
- **Received** - Money already received (status = received)
- **Expected** - Pending/processing payouts weighted by probability (default 80%)
- **Expenses** - All expenses including platform fees, marketing, etc.

**Period Comparison:**
- Each KPI shows absolute change and percentage change vs previous equivalent period
- Previous period is calculated dynamically based on selected date range duration

**Data Model:**

Payout interface:
- `id`, `platform`, `grossAmount`, `fees`, `netAmount`
- `date`, `status` (received/pending/processing/failed)
- `probability` (0-1 for expected calculation)
- `transactionId`, `description`

Expense interface:
- `id`, `amount`, `date`, `category`, `description`
- `platform` (optional)

**Data Sources:**
- Real Amazon order data (116 orders) parsed from embedded CSV
- Generated mock data for Shopify, Stripe, Etsy (200+ transactions per platform)
- Mock expenses derived from platform fees + generated categories (Marketing, Software, Shipping, Supplies)
- Date range: September - December 2025

### Component Structure

**Core Components:**

- **Dashboard** (`Dashboard.tsx`) - Main container component that:
  - Manages all application state (date range, active metrics, selected date, dismissed insights, category filters)
  - Calculates KPI data, chart data, and generates insights using useMemo
  - Orchestrates all child components
  - Handles user interactions (metric toggles, data point clicks, insight dismissals)

- **Header** (`Header.tsx`) - Top navigation bar:
  - Shows app branding "Solos"
  - Displays user name and avatar
  - Sticky positioning with backdrop blur

- **KPICard** (`KPICard.tsx`) - Metric display cards (3 cards: Received, Expected, Expenses):
  - Shows current period total in large text
  - Displays change vs previous period (absolute + percentage with up/down arrow)
  - Clickable to toggle metric visibility in chart
  - Visual indicator (ring) when active

- **DateRangePicker** (`DateRangePicker.tsx`) - Date range selector with:
  - Calendar popover with dual-month view
  - Quick select presets (This month, Last 7/30/90 days)
  - Custom date range selection
  - Formatted display of selected range

- **CashFlowChart** (`CashFlowChart.tsx`) - Interactive area chart:
  - Shows trends for active metrics (Received, Expected, Expenses)
  - Color-coded: green (received), blue (expected), red (expenses)
  - Clickable data points open transaction details
  - Empty state when no metrics selected
  - Responsive tooltips with formatted values

- **TransactionDetails** (`TransactionDetails.tsx`) - Expandable transaction breakdown:
  - Shows all transactions for selected date
  - Filtered by active metrics
  - Sections: Received Payouts, Expected Payouts, Expenses
  - Summary cards with totals
  - Detailed transaction list with platform, status, fees, amounts
  - Close button to dismiss

- **InsightsSidebar** (`InsightsSidebar.tsx`) - Right sidebar for insights:
  - Collapsible (full width or icon-only)
  - Settings popover to filter by insight categories
  - Shows 6 insights initially with "Load More" button
  - Category filter checkboxes with Select All/Clear All
  - Insight count badge

- **InsightCard** (`InsightCard.tsx`) - Individual insight display:
  - Color-coded by severity (danger/warning/success/info)
  - Shows icon, title, category badge
  - Displays message and optional action suggestions
  - Dismissable (X button on hover)
  - Confidence score shown if < 60%

### Insights Feature

The dashboard includes an intelligent insights system that analyzes cash-flow data and surfaces actionable information:

**Insight Categories (6 types):**
1. **Anomalies** - Unusual patterns in income or expenses (e.g., expense spikes, volatility)
2. **Platform Performance** - Which sales channels are performing best, platform diversity analysis
3. **Fees & Refunds** - Analysis of platform fees, fee rates, total fees paid
4. **Forecast What-Ifs** - Predictions about pending income, weekly run rates, cash position
5. **Timing Reliability** - Payout timing, completion rates, pending payout values
6. **Trend Momentum** - Growth trends in profit, revenue, profit margins

**Insight Properties:**
- `id` - unique identifier
- `category` - one of 6 categories above
- `title` - short headline
- `message` - detailed explanation with metrics
- `severity` - info (blue), success (green), warning (yellow), danger (red)
- `metric` - potential_income, potential_loss, actual_profit, or mixed
- `value` - numeric value
- `delta` - change amount (can be null)
- `period` - date range analyzed
- `confidence` - score from 0-1 (only displayed if < 0.6)
- `evidence` - array of data sources used
- `actions` - optional array of actionable suggestions

**Generated Insights (examples):**
- Profit momentum tracking (period-over-period comparison)
- Leading platform identification (income share analysis)
- Platform fee analysis (fee rates by platform)
- Pending income warnings
- Payout reliability tracking
- Platform diversity assessment
- Profit margin calculations
- Average transaction value
- Top growth platforms
- Weekly run rates
- Total fees analysis

**Behavior:**
- Insights automatically regenerate when date range changes
- Generates ~10-15 insights, displays 6 initially with "Load More" option
- User can filter by category (multi-select)
- User can dismiss individual insights
- Sidebar is collapsible to icon-only view
- All insights based on actual financial data in selected date range

**Implementation:**
- `generateMockInsights()` in `services/analytics.ts` - Generates insights from actual payout/expense data
- Uses real calculations: period comparisons, platform stats, fee rates, timing analysis
- `InsightCard` component - Color-coded card with severity-based styling
- `InsightsSidebar` component - Collapsible sidebar (320px when expanded, 48px collapsed)

## Important Notes

### shadcn/ui Setup
Components are copied into the project (not installed as dependencies). Add components using:
```bash
npx shadcn-ui@latest add [component-name]
```

Currently installed shadcn/ui components:
- Avatar, Badge, Button, Calendar, Card, Dropdown Menu, Popover, Select, Skeleton

### Mock Data Strategy
The app uses a hybrid approach:
- **Real Amazon data**: 116 actual orders from CSV embedded in `mockData.ts`
- **Generated data**: Realistic mock transactions for Shopify, Stripe, Etsy (200 per month)
- **Expenses**: Platform fees extracted from Amazon data + generated expenses across categories
- **Date coverage**: September - December 2025
- **Distribution**: Evenly distributed across days in each month
- **Status logic**: Past dates mostly "received", future dates "pending" or "processing"

### Data Flow
1. User selects date range (default: current month)
2. `Dashboard` component filters payouts/expenses by date range
3. `analytics.ts` functions calculate:
   - KPI metrics with period-over-period comparison
   - Chart data points (daily buckets)
   - Insights based on filtered data
4. All calculations use `useMemo` for performance
5. User interactions (metric toggles, date clicks) update local state
6. Insights sidebar has separate state for dismissed insights and category filters

### Styling Approach
- Tailwind utility classes for all layout and spacing
- shadcn/ui components for consistent design system
- Clean, data-focused interface
- Color coding: 🟢 green (received/positive), 🔵 blue (expected/info), 🔴 red (expenses/negative), 🟡 yellow (warnings)
- Responsive design with mobile-first approach
- Dark mode support via Tailwind classes

### User Interaction Patterns
1. **KPI Cards**: Click to toggle metric visibility in chart (visual ring when active)
2. **Chart**: Click any data point to open transaction details for that date
3. **Transaction Details**: Shows filtered view based on active metrics, close with X button
4. **Insights**: Dismiss individual insights, filter by categories, load more, collapse sidebar
5. **Date Range**: Quick presets or custom calendar selection

## Current Implementation Status

### ✅ Fully Implemented
- KPI tracking with period-over-period comparison (Received, Expected, Expenses)
- Interactive cash flow chart with multiple metrics
- Transaction drill-down by date
- Intelligent insights system with 6 categories and ~15 different insight types
- Date range filtering with quick presets
- Collapsible insights sidebar with category filtering
- Responsive design (desktop, tablet, mobile)
- Real Amazon order data integration
- Multi-platform mock data generation
- Expense tracking with categories

### ⚠️ Not Yet Implemented
- **Platform filter**: `PlatformFilter` component is mentioned but not used in Dashboard
- **Scenario visualization**: Original concept of Worst/Expected/Best case scenarios is not visualized (only Expected calculation used internally)
- **Backend integration**: No API calls, authentication, or data persistence
- **Currency consistency**: Chart uses $ but insights show €
- **Export functionality**: No CSV/PDF export
- **User settings**: No preferences or configuration
- **Real-time updates**: No websocket or polling
- **Historical trend analysis**: No year-over-year or custom period comparisons beyond immediate previous period

### 🔄 Future Enhancements (Suggested)
- Add platform filter to Dashboard to allow filtering by specific platforms
- Implement scenario comparison view (Worst/Expected/Best side-by-side)
- Backend API integration for real data
- User authentication and multi-user support
- Data export functionality
- Advanced filtering (by status, platform, amount range)
- Notification system for important insights
- Customizable insight preferences
- Weekly/monthly email summaries
- Integration with actual platform APIs (Shopify, Amazon, Stripe)

## File Structure Reference

### Key Application Files
- `src/App.tsx` - Root component, renders Dashboard
- `src/main.tsx` - Entry point, React mounting and QueryClient setup
- `src/index.css` - Global styles and Tailwind imports

### Component Files
- `src/components/Dashboard.tsx` - Main container with all state management
- `src/components/Header.tsx` - Top navigation bar
- `src/components/KPICard.tsx` - Individual KPI metric card
- `src/components/DateRangePicker.tsx` - Date range selector with calendar
- `src/components/CashFlowChart.tsx` - Recharts area chart component
- `src/components/TransactionDetails.tsx` - Transaction breakdown panel
- `src/components/InsightsSidebar.tsx` - Collapsible insights sidebar
- `src/components/InsightCard.tsx` - Individual insight display card
- `src/components/PlatformFilter.tsx` - Platform filter (not currently used)
- `src/components/ui/*` - shadcn/ui base components

### Service Files
- `src/services/mockData.ts` - Data generation and Amazon CSV parsing
- `src/services/analytics.ts` - All calculation logic (KPIs, charts, insights)

### Type Definitions
- `src/types/index.ts` - All TypeScript interfaces and enums

### Utility Files
- `src/lib/utils.ts` - Utility functions (classname merging)
- `src/lib/queryClient.ts` - TanStack Query client configuration

### Configuration Files
- `vite.config.ts` - Vite build configuration with path aliases
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui configuration
- `package.json` - Dependencies and scripts
