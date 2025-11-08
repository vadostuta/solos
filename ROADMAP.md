# Solos Development Roadmap

## Phase 1: Data Layer & Mock Data (Foundation)
**Goal:** Create the data structures and mock data that simulate real payout information

### 1.1 Define TypeScript Types
- [ ] **Platform types** (Shopify, Stripe, Etsy, Amazon, etc.)
- [ ] **Payout status enum** (received, pending, processing, failed)
- [ ] **Payout interface**
  - amount (gross)
  - platform
  - date
  - fees
  - net amount
  - status
  - probability (for expected payouts)
- [ ] **Transaction/Expense interface**
  - amount
  - date
  - category
  - description
  - platform (if applicable)
- [ ] **KPI Data interface**
  - received: { total, change, changePercentage }
  - expected: { total, change, changePercentage }
  - expenses: { total, change, changePercentage }
- [ ] **Date Range interface**
  - startDate
  - endDate
  - label (e.g., "Last 30 days")
- [ ] **Chart Data Point interface**
  - date
  - received (optional)
  - expected (optional)
  - expenses (optional)
- [ ] **User interface**
  - name
  - avatar URL
  - email (optional)

### 1.2 Create Mock Data Services
- [ ] **Mock User Data**
  - Username
  - Avatar image
- [ ] **Mock Payout Data Generator**
  - Multiple platforms (Shopify, Stripe, Etsy, Amazon)
  - Different payout cycles (daily, weekly, bi-weekly, monthly)
  - Various statuses (received, pending, processing)
  - Realistic fees and deductions
  - Probability scores for expected payouts
  - Date spread: historical (last 60-90 days) + future (next 30 days)
- [ ] **Mock Expenses Data**
  - Platform fees
  - Operational costs
  - Date spread matching payout timeframe
- [ ] **Chart Data Generator**
  - Daily/weekly aggregated data points
  - Separate values for received, expected, expenses
  - Covers selected date range

### 1.3 Business Logic Layer
- [ ] **KPI Calculation Functions**
  - Calculate total Received for date range
  - Calculate total Expected for date range
  - Calculate total Expenses for date range
  - Calculate change from previous period (same duration)
  - Calculate percentage change
- [ ] **Filter Functions**
  - Filter by date range
  - Filter by platform(s)
  - Filter by status
- [ ] **Aggregation Functions**
  - Group by date (daily, weekly, monthly)
  - Group by platform
  - Aggregate payouts, expenses for chart data
- [ ] **Comparison Functions**
  - Compare current period vs previous period
  - Calculate trends

---

## Phase 2: Core UI Components (Building Blocks)
**Goal:** Build reusable UI components using shadcn/ui

### 2.1 Install Required shadcn/ui Components
- [ ] `npx shadcn-ui@latest add card`
- [ ] `npx shadcn-ui@latest add badge`
- [ ] `npx shadcn-ui@latest add button`
- [ ] `npx shadcn-ui@latest add avatar`
- [ ] `npx shadcn-ui@latest add popover` (for date picker)
- [ ] `npx shadcn-ui@latest add calendar` (for date range)
- [ ] `npx shadcn-ui@latest add select`
- [ ] `npx shadcn-ui@latest add dropdown-menu`
- [ ] `npx shadcn-ui@latest add skeleton`

### 2.2 Custom Components
- [ ] **KPICard**: Interactive card for Received/Expected/Expenses
  - Clickable/toggleable
  - Row 1: Label/title
  - Row 2: Formatted amount
  - Row 3: Change indicator (percentage + arrow + color)
  - Active state styling
- [ ] **DateRangePicker**: Date range selection component
  - Calendar popup
  - Preset options
  - Custom range input
- [ ] **PlatformFilter**: Multi-select platform filter
  - Dropdown or chip-based
  - Show selected count
- [ ] **PlatformBadge**: Color-coded platform identifier
- [ ] **MoneyDisplay**: Formatted currency component
- [ ] **ChangeIndicator**: Shows percentage/amount change with arrow and color

---

## Phase 3: Dashboard Layout (Main View)
**Goal:** Create the main dashboard structure

### 3.1 Header Component
- [ ] Fixed/sticky header bar
- [ ] Left side: "Solos" app name/logo
- [ ] Right side: User section with:
  - [ ] User avatar (profile picture)
  - [ ] Username/display name
  - [ ] Optional: dropdown menu for user actions
- [ ] Responsive design (collapse user info on mobile)

### 3.2 Filter Section
- [ ] **Date Range Picker Component**
  - [ ] Select start and end dates
  - [ ] Preset options (Last 7 days, Last 30 days, This month, etc.)
  - [ ] Custom date range selection
- [ ] **Platform Filter**
  - [ ] Multi-select dropdown or chips
  - [ ] Options: Shopify, Stripe, Etsy, Amazon, etc.
  - [ ] "All platforms" option
  - [ ] Show selected count

### 3.3 KPI Cards Section (Interactive)
Three clickable cards that control chart data display:

- [ ] **Received Card** (clickable)
  - [ ] Row 1: "Received" label
  - [ ] Row 2: Total amount for selected date range
  - [ ] Row 3: Percentage/amount change from previous same period
    - [ ] Green/red indicator for positive/negative change
    - [ ] Arrow icon (up/down)
- [ ] **Expected Card** (clickable)
  - [ ] Row 1: "Expected" label
  - [ ] Row 2: Total expected amount for selected date range
  - [ ] Row 3: Percentage/amount change from previous same period
- [ ] **Expenses Card** (clickable)
  - [ ] Row 1: "Expenses" label
  - [ ] Row 2: Total expenses for selected date range
  - [ ] Row 3: Percentage/amount change from previous same period

**Interaction:**
- [ ] Click a card to toggle its data layer in the chart below
- [ ] Visual indication of selected/active cards
- [ ] Multiple cards can be active simultaneously

### 3.4 Chart Section
- [ ] Main chart component (Recharts)
- [ ] Displays data based on selected KPI cards
- [ ] Responsive to date range filter
- [ ] Responsive to platform filter
- [ ] Shows combined view of selected metrics (Received, Expected, Expenses)

---

## Phase 4: Payout Timeline (Visualization)
**Goal:** Visual timeline showing when money arrives

### 4.1 Timeline Component
- [ ] Horizontal timeline with date markers
- [ ] Payout events positioned by date
- [ ] Differentiate by status (received vs pending)
- [ ] Platform color coding
- [ ] Hover tooltips with payout details

### 4.2 Timeline Interactions
- [ ] Zoom in/out on timeline
- [ ] Filter by platform
- [ ] Filter by status
- [ ] Click payout for detailed view

---

## Phase 5: Charts & Analytics (Data Visualization)
**Goal:** Use Recharts to visualize cash flow trends

### 5.1 Cash Flow Chart
- [ ] Area chart showing cumulative cash flow over time
- [ ] Multiple lines for worst/expected/best scenarios
- [ ] Color-coded to match scenario cards
- [ ] Interactive tooltips
- [ ] Responsive design

### 5.2 Platform Breakdown Chart
- [ ] Pie chart or bar chart by platform
- [ ] Shows contribution of each platform
- [ ] Click to filter main view

### 5.3 Payout Cycle Chart
- [ ] Visualize payout patterns over time
- [ ] Identify trends and cycles
- [ ] Help users plan around payout dates

---

## Phase 6: Platform Details (Breakdown View)
**Goal:** Detailed view of each platform's payouts

### 6.1 Platform List
- [ ] Card or table showing all platforms
- [ ] Platform logo/icon
- [ ] Total pending amount
- [ ] Number of pending payouts
- [ ] Next expected payout date
- [ ] Click to expand details

### 6.2 Platform Detail View
- [ ] All payouts for this platform
- [ ] Payout history
- [ ] Average payout amount
- [ ] Payout frequency stats
- [ ] Fee breakdown

---

## Phase 7: Payout Detail View
**Goal:** Detailed information for individual payouts

### 7.1 Payout Modal/Drawer
- [ ] Full payout details:
  - Platform
  - Amount (gross)
  - Fees breakdown
  - Amount (net)
  - Status
  - Expected date
  - Actual date (if received)
  - Transaction ID
  - Related orders/transactions

### 7.2 Status Tracking
- [ ] Visual status progress indicator
- [ ] Status history timeline
- [ ] Estimated arrival time

---

## Phase 8: Filtering & Search
**Goal:** Help users find specific payouts and data

### 8.1 Filter Controls
- [ ] Filter by platform
- [ ] Filter by status
- [ ] Filter by date range
- [ ] Filter by amount range
- [ ] Combined filters (multiple active)

### 8.2 Search
- [ ] Search by transaction ID
- [ ] Search by amount
- [ ] Quick filter presets (e.g., "This week", "Pending only")

---

## Phase 9: Settings & Preferences
**Goal:** Allow users to customize their experience

### 9.1 Display Settings
- [ ] Currency format preference
- [ ] Date format preference
- [ ] Time zone setting
- [ ] Theme toggle (light/dark mode)

### 9.2 Platform Settings
- [ ] Add/remove platforms
- [ ] Set platform colors
- [ ] Configure payout cycles

### 9.3 Notification Preferences (Future)
- [ ] Alert when payout received
- [ ] Remind when payout delayed
- [ ] Weekly summary email

---

## Phase 10: Polish & Optimization
**Goal:** Refine UX and performance

### 10.1 Loading States
- [ ] Skeleton loaders for all components
- [ ] Smooth transitions
- [ ] Error boundaries

### 10.2 Empty States
- [ ] No data illustrations
- [ ] Helpful onboarding messages
- [ ] Call-to-action prompts

### 10.3 Responsive Design
- [ ] Mobile optimization
- [ ] Tablet optimization
- [ ] Desktop optimization
- [ ] Touch-friendly interactions

### 10.4 Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] ARIA labels
- [ ] Color contrast compliance
- [ ] Focus indicators

### 10.5 Performance
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Optimize re-renders
- [ ] Bundle size analysis

---

## Future Backend Integration (Not in Current Scope)
- API integration layer
- Authentication
- Real platform connections (Shopify, Stripe APIs, etc.)
- Data persistence
- User accounts
- Multi-user support

---

## Current Priority: Start with Phase 1
Let's begin by building the data foundation with TypeScript types and mock data services.
