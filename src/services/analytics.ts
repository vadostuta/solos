import {
  Platform,
  PayoutStatus,
  type Payout,
  type Expense,
  type DateRange,
  type KPIData,
  type KPIMetric,
  type ChartDataPoint,
} from '@/types'

// Filter payouts by date range
export const filterByDateRange = <T extends { date: Date }>(
  items: T[],
  dateRange: DateRange
): T[] => {
  return items.filter(
    (item) => item.date >= dateRange.startDate && item.date <= dateRange.endDate
  )
}

// Filter payouts by platform
export const filterByPlatform = <T extends { platform?: Platform }>(
  items: T[],
  platforms: Platform[]
): T[] => {
  if (platforms.length === 0) return items
  return items.filter((item) => item.platform && platforms.includes(item.platform))
}

// Filter payouts by status
export const filterByStatus = (
  payouts: Payout[],
  statuses: PayoutStatus[]
): Payout[] => {
  if (statuses.length === 0) return payouts
  return payouts.filter((payout) => statuses.includes(payout.status))
}

// Calculate total received (status = received)
export const calculateReceived = (payouts: Payout[]): number => {
  return payouts
    .filter((p) => p.status === PayoutStatus.RECEIVED)
    .reduce((sum, p) => sum + p.netAmount, 0)
}

// Calculate total expected (status = pending or processing, weighted by probability)
export const calculateExpected = (payouts: Payout[]): number => {
  return payouts
    .filter(
      (p) =>
        p.status === PayoutStatus.PENDING || p.status === PayoutStatus.PROCESSING
    )
    .reduce((sum, p) => {
      const probability = p.probability ?? 0.8 // Default 80% probability
      return sum + p.netAmount * probability
    }, 0)
}

// Calculate total expenses
export const calculateExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((sum, e) => sum + e.amount, 0)
}

// Calculate KPI metric with comparison to previous period
const calculateKPIMetric = (
  current: number,
  previous: number
): KPIMetric => {
  const change = current - previous
  const changePercentage =
    previous === 0 ? 0 : ((change / previous) * 100)

  return {
    total: current,
    change,
    changePercentage,
  }
}

// Get previous period date range
export const getPreviousPeriod = (dateRange: DateRange): DateRange => {
  const duration =
    dateRange.endDate.getTime() - dateRange.startDate.getTime()
  const startDate = new Date(dateRange.startDate.getTime() - duration)
  const endDate = new Date(dateRange.endDate.getTime() - duration)

  return { startDate, endDate }
}

// Calculate KPI data with period comparison
export const calculateKPIData = (
  payouts: Payout[],
  expenses: Expense[],
  dateRange: DateRange,
  selectedPlatforms: Platform[]
): KPIData => {
  // Filter current period data
  const currentPayouts = filterByPlatform(
    filterByDateRange(payouts, dateRange),
    selectedPlatforms
  )
  const currentExpenses = filterByPlatform(
    filterByDateRange(expenses, dateRange),
    selectedPlatforms
  )

  // Filter previous period data
  const previousPeriod = getPreviousPeriod(dateRange)
  const previousPayouts = filterByPlatform(
    filterByDateRange(payouts, previousPeriod),
    selectedPlatforms
  )
  const previousExpenses = filterByPlatform(
    filterByDateRange(expenses, previousPeriod),
    selectedPlatforms
  )

  // Calculate current values
  const currentReceived = calculateReceived(currentPayouts)
  const currentExpected = calculateExpected(currentPayouts)
  const currentExpensesTotal = calculateExpenses(currentExpenses)

  // Calculate previous values
  const previousReceived = calculateReceived(previousPayouts)
  const previousExpected = calculateExpected(previousPayouts)
  const previousExpensesTotal = calculateExpenses(previousExpenses)

  return {
    received: calculateKPIMetric(currentReceived, previousReceived),
    expected: calculateKPIMetric(currentExpected, previousExpected),
    expenses: calculateKPIMetric(currentExpensesTotal, previousExpensesTotal),
  }
}

// Generate chart data points
export const generateChartData = (
  payouts: Payout[],
  expenses: Expense[],
  dateRange: DateRange,
  selectedPlatforms: Platform[],
  interval: 'daily' | 'weekly' = 'daily'
): ChartDataPoint[] => {
  const dataPoints: ChartDataPoint[] = []

  // Filter data
  const filteredPayouts = filterByPlatform(
    filterByDateRange(payouts, dateRange),
    selectedPlatforms
  )
  const filteredExpenses = filterByPlatform(
    filterByDateRange(expenses, dateRange),
    selectedPlatforms
  )

  // Generate date buckets
  const current = new Date(dateRange.startDate)
  const end = new Date(dateRange.endDate)

  while (current <= end) {
    const bucketStart = new Date(current)
    const bucketEnd = new Date(current)

    if (interval === 'daily') {
      bucketEnd.setDate(bucketEnd.getDate() + 1)
    } else {
      bucketEnd.setDate(bucketEnd.getDate() + 7)
    }

    const bucketDateRange: DateRange = {
      startDate: bucketStart,
      endDate: bucketEnd,
    }

    const bucketPayouts = filterByDateRange(filteredPayouts, bucketDateRange)
    const bucketExpenses = filterByDateRange(filteredExpenses, bucketDateRange)

    dataPoints.push({
      date: bucketStart.toISOString().split('T')[0],
      received: calculateReceived(bucketPayouts),
      expected: calculateExpected(bucketPayouts),
      expenses: calculateExpenses(bucketExpenses),
    })

    if (interval === 'daily') {
      current.setDate(current.getDate() + 1)
    } else {
      current.setDate(current.getDate() + 7)
    }
  }

  return dataPoints
}
