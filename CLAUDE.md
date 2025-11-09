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
This is a **frontend with backend API integration**. The app can connect to a .NET backend API (Swagger-documented) for real data, with automatic fallback to mock data when the backend is unavailable. This provides a seamless development experience and graceful degradation in production.

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **TanStack Query** - Data fetching, caching, and state management (now actively used)
- **Axios** - HTTP client for API requests
- **Recharts** - Data visualization for cash-flow charts
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library

## Development Commands

### Setup
```bash
npm install
cp .env.example .env  # Create environment file (already done)
```

### Environment Configuration
Edit `.env` to configure the backend API:
```
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK_FALLBACK=true
```

### Development
```bash
npm run dev          # Start Vite dev server (default: http://localhost:5173)
```

The app will attempt to connect to the backend API specified in `VITE_API_BASE_URL`. If the backend is unavailable, it automatically falls back to mock data.

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

**Frontend with Backend Integration** - The app is structured as a client-side React application with optional backend API integration. Data flows through:

1. **Backend API** (`services/api.ts`) - Axios-based HTTP client connecting to .NET backend
   - Channels API: GET /api/Channels (fetch sales channels)
   - Financial API: GET /api/Financial/received-income, expected-income, expenses
   - Insights API: GET /api/Insights/financial
2. **TanStack Query Hooks** (`hooks/useFinancialData.ts`) - React Query hooks for data fetching with caching
3. **Data Transformation** (`services/dataMappers.ts`) - Maps backend DTOs to frontend types
4. **Fallback Mock Data** (`services/mockData.ts`) - Real Amazon CSV + generated mock data (used when API unavailable)
5. **Analytics Engine** (`services/analytics.ts`) - KPI calculations, chart data generation, mock insights
6. **React State** - Local component state with useMemo for performance optimization
7. **UI Components** - shadcn/ui components styled with Tailwind CSS with loading states
8. **Data Visualization** - Recharts for interactive area charts

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

Primary (Backend API when available):
- Channels from `/api/Channels`
- Received income from `/api/Financial/received-income`
- Expected income from `/api/Financial/expected-income`
- Expenses from `/api/Financial/expenses`
- Insights from `/api/Insights/financial`

Fallback (Mock Data when API unavailable):
- Real Amazon order data (116 orders) parsed from embedded CSV
- Generated mock data for Shopify, Stripe, Etsy (200+ transactions per platform)
- Mock expenses derived from platform fees + generated categories (Marketing, Software, Shipping, Supplies)
- Mock insights generated from financial data
- Date range: September - December 2025

**Backend API Schema (Swagger):**
- `ChannelDto`: { id: number, name: string }
- `FinancialRecordDto`: { date: datetime, value: double, channelId: number, channelName: string }
- `InsightDto`: { id, category, title, message, severity, metric, value, delta, period, confidence, evidence, actions }
- Query parameters: startDate, endDate, channelIds (optional filters)

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
- **Backend API Integration** with automatic fallback to mock data
  - Channels API (GET /api/Channels)
  - Financial API (received-income, expected-income, expenses)
  - Insights API (GET /api/Insights/financial)
  - Graceful error handling and fallback logic
- **TanStack Query** for data fetching, caching, and state management
- **Loading states** with skeleton loaders for all major components
- **Fallback mode indicator** in header when using mock data
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
- Data transformation layer (backend DTOs → frontend types)

### ⚠️ Not Yet Implemented
- **Authentication**: Backend API currently has no auth (headers ready for future implementation)
- **Platform filter**: `PlatformFilter` component exists but not integrated into Dashboard
- **Channel-based filtering**: Backend supports channelIds filter but not exposed in UI yet
- **Scenario visualization**: Original concept of Worst/Expected/Best case scenarios is not visualized
- **Currency consistency**: Chart uses $ but insights show € (needs standardization)
- **Export functionality**: No CSV/PDF export
- **User settings**: No preferences or configuration
- **Real-time updates**: No websocket or polling
- **Historical trend analysis**: No year-over-year or custom period comparisons beyond immediate previous period
- **Backend channel management**: POST/PUT/DELETE endpoints exist but no UI for managing channels

### 🔄 Future Enhancements (Suggested)
- **Add authentication layer** (JWT tokens, login/logout)
- **Expose channel filter** in Dashboard UI (backend already supports channelIds param)
- **Channel management UI** for creating/editing channels
- **Implement scenario comparison** view (Worst/Expected/Best side-by-side)
- **Standardize currency** across the application
- **User settings panel** for preferences and configuration
- **Data export** functionality (CSV/PDF)
- **Advanced filtering** UI (by status, platform, amount range)
- **Notification system** for important insights
- **Customizable insight preferences**
- **Real-time updates** (websocket or polling)
- **Weekly/monthly email summaries**
- **Direct platform API integration** (Shopify, Amazon, Stripe OAuth flows)

## File Structure Reference

### Key Application Files
- `src/App.tsx` - Root component, renders Dashboard
- `src/main.tsx` - Entry point, React mounting and QueryClient setup
- `src/index.css` - Global styles and Tailwind imports

### Component Files
- `src/components/Dashboard.tsx` - Main container with state management and API hooks
- `src/components/Header.tsx` - Top navigation bar with fallback mode indicator
- `src/components/KPICard.tsx` - Individual KPI metric card
- `src/components/DateRangePicker.tsx` - Date range selector with calendar
- `src/components/CashFlowChart.tsx` - Recharts area chart component
- `src/components/TransactionDetails.tsx` - Transaction breakdown panel
- `src/components/InsightsSidebar.tsx` - Collapsible insights sidebar with loading states
- `src/components/InsightCard.tsx` - Individual insight display card
- `src/components/PlatformFilter.tsx` - Platform filter (not currently used)
- `src/components/ui/*` - shadcn/ui base components (including Skeleton for loading states)

### API Integration Files
- `src/services/api.ts` - Axios client and all API endpoint functions
- `src/services/dataMappers.ts` - Transform backend DTOs to frontend types
- `src/hooks/useFinancialData.ts` - TanStack Query hooks with automatic fallback

### Service Files
- `src/services/mockData.ts` - Mock data generation and Amazon CSV parsing (fallback)
- `src/services/analytics.ts` - All calculation logic (KPIs, charts, mock insights)

### Type Definitions
- `src/types/index.ts` - Frontend TypeScript interfaces and enums (Channel, Payout, Expense, Insight, etc.)
- `src/types/api.ts` - Backend DTO interfaces from Swagger (ChannelDto, FinancialRecordDto, InsightDto, etc.)

### Utility Files
- `src/lib/utils.ts` - Utility functions (classname merging)
- `src/lib/queryClient.ts` - TanStack Query client configuration

### Configuration Files
- `.env` - Environment variables (API base URL, fallback settings)
- `.env.example` - Environment template (committed to repo)
- `vite.config.ts` - Vite build configuration with path aliases
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui configuration
- `package.json` - Dependencies and scripts

## Backend API Integration

### Overview
The app integrates with a .NET backend API using Axios and TanStack Query. All API calls have automatic fallback to mock data when the backend is unavailable, providing seamless offline functionality.

### API Configuration

**Environment Variables (.env):**
```
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK_FALLBACK=true
```

**Axios Client Setup** (`src/services/api.ts`):
- Base URL from environment variable
- 10-second timeout
- JSON content-type headers
- Request/response interceptors for future authentication
- Comprehensive error handling with console warnings

### Available Endpoints

#### 1. Channels API
**GET /api/Channels**
- Returns: `ChannelDto[]`
- Usage: Fetch all sales channels/platforms
- Hook: `useChannels()`

**GET /api/Channels/{id}**
- Returns: `ChannelDto`
- Usage: Fetch single channel by ID

**GET /api/Channels/by-name/{name}**
- Returns: `ChannelDto`
- Usage: Fetch channel by name

**POST /api/Channels**
- Body: `ChannelDto` (without id)
- Returns: `ChannelDto`
- Usage: Create new channel

**PUT /api/Channels/{id}**
- Body: `ChannelDto`
- Returns: void
- Usage: Update existing channel

**DELETE /api/Channels/{id}**
- Returns: void
- Usage: Delete channel

#### 2. Financial API
**GET /api/Financial/received-income**
- Query params: `startDate`, `endDate`, `channelIds[]` (all optional)
- Returns: `FinancialRecordDto[]`
- Usage: Fetch completed payouts
- Hook: `useReceivedIncome(dateRange, channelIds?)`

**GET /api/Financial/expected-income**
- Query params: `startDate`, `endDate`, `channelIds[]` (all optional)
- Returns: `FinancialRecordDto[]`
- Usage: Fetch pending/processing payouts
- Hook: `useExpectedIncome(dateRange, channelIds?)`

**GET /api/Financial/expenses**
- Query params: `startDate`, `endDate`, `channelIds[]` (all optional)
- Returns: `FinancialRecordDto[]`
- Usage: Fetch expenses
- Hook: `useExpenses(dateRange, channelIds?)`

#### 3. Insights API
**GET /api/Insights/financial**
- Query params: `startDate`, `endDate` (both optional)
- Returns: `InsightResponseDto` (contains `insights` array)
- Usage: Fetch AI-generated insights
- Hook: `useInsights(dateRange)`

### Data Transformation

**Backend DTOs → Frontend Types** (`src/services/dataMappers.ts`):

1. **ChannelDto → Channel**
   - Direct mapping: id, name

2. **FinancialRecordDto → Payout**
   - Maps `channelName` to `Platform` enum (case-insensitive)
   - Calculates realistic `fees` (3-5% of value)
   - Derives `grossAmount` and `netAmount`
   - Generates transaction ID
   - Sets status (RECEIVED or PENDING based on context)

3. **FinancialRecordDto → Expense**
   - Maps `channelName` to `Platform` enum
   - Uses absolute value for amount
   - Sets category (Platform Fees, Marketing, etc.)

4. **InsightDto → Insight**
   - Maps string categories to `InsightCategory` enum
   - Maps string severities to `InsightSeverity` enum
   - Maps string metrics to `InsightMetric` enum
   - Preserves all other fields

### TanStack Query Hooks

**Configuration:**
- Automatic caching (stale times: 1-5 minutes)
- Retry logic (2 retries on failure)
- Loading states
- Error handling with fallback

**Available Hooks:**

1. **useChannels()**
   - Fetches available channels
   - Fallback: Returns default channels (Amazon, Shopify, Stripe, Etsy)
   - Cache: 5 minutes

2. **useReceivedIncome(dateRange, channelIds?)**
   - Fetches completed payouts for date range
   - Fallback: Filters mock payouts by status=RECEIVED
   - Cache: 1 minute

3. **useExpectedIncome(dateRange, channelIds?)**
   - Fetches pending/processing payouts
   - Fallback: Filters mock payouts by status=PENDING/PROCESSING
   - Cache: 1 minute

4. **useExpenses(dateRange, channelIds?)**
   - Fetches expenses for date range
   - Fallback: Filters mock expenses
   - Cache: 1 minute

5. **useFinancialData(dateRange, selectedPlatforms?)**
   - Combined hook that fetches all financial data
   - Returns: { payouts, expenses, isLoading, isError, error, refetch }
   - Automatically combines received + expected payouts

6. **useInsights(dateRange)**
   - Fetches backend-generated insights
   - Fallback: Generates mock insights from current financial data
   - Cache: 2 minutes
   - Enabled only when financial data is available

7. **useIsFallbackMode(dateRange)**
   - Utility hook to detect if app is using fallback data
   - Returns: { isFallbackMode, isLoading }
   - Used to display "Offline Mode" badge in header

### Fallback Strategy

**When API Fails:**
1. Error is logged to console with warning
2. Hook catches error in try/catch
3. If `VITE_USE_MOCK_FALLBACK=true`, returns mock data
4. If fallback disabled, error is thrown
5. UI remains functional with mock data
6. "Offline Mode" badge appears in header

**Mock Data Sources:**
- `mockPayouts` - Real Amazon CSV + generated data
- `mockExpenses` - Platform fees + generated expenses
- `generateMockInsights()` - Generated from current financial data
- Default channels - Hardcoded list of 4 platforms

### Testing Backend Integration

**1. Test with Backend Unavailable:**
```bash
# Backend not running, fallback mode should activate
npm run dev
# Expected: App loads with mock data, "Offline Mode" badge visible
```

**2. Test with Backend Available:**
```bash
# Start .NET backend on port 5000
# Start frontend
npm run dev
# Expected: App loads with real API data, no offline badge
```

**3. Test with Empty Backend Data:**
```bash
# Backend running but returns empty arrays
# Expected: App displays "No data" states gracefully
```

### Troubleshooting

**Problem: "Network Error" in console**
- Solution: Check `VITE_API_BASE_URL` in `.env`
- Verify backend is running on correct port
- Check CORS settings on backend

**Problem: Data not updating**
- Solution: Check TanStack Query cache (React DevTools)
- Force refetch: Click date range again
- Clear cache: Restart dev server

**Problem: Type errors**
- Solution: Ensure backend DTOs match `src/types/api.ts`
- Run `npm run lint` to check TypeScript errors
- Verify data transformation in `dataMappers.ts`

**Problem: Fallback not working**
- Solution: Check `VITE_USE_MOCK_FALLBACK` in `.env`
- Verify mock data exists in `mockData.ts`
- Check console for error logs

### Future Enhancements

**Authentication:**
- JWT token storage (localStorage)
- Add `Authorization: Bearer ${token}` header in request interceptor
- Login/logout flows
- Token refresh logic

**Real-time Updates:**
- WebSocket connection for live data
- Polling with shorter intervals
- Optimistic updates on mutations

**Error Handling:**
- User-friendly error messages
- Retry with exponential backoff
- Toast notifications for errors
- Error boundary components

**Performance:**
- Implement pagination for large datasets
- Add infinite scroll for insights
- Optimize re-renders with React.memo
- Prefetch data on hover
