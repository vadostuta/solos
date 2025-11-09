import {
  Platform,
  PayoutStatus,
  type Payout,
  type Expense,
  type DateRange,
  type KPIData,
  type KPIMetric,
  type ChartDataPoint,
  type Insight,
  InsightCategory,
  InsightSeverity,
  InsightMetric,
  PLATFORM_LABELS
} from '@/types'

// Filter payouts by date range
export const filterByDateRange = <T extends { date: Date }>(
  items: T[],
  dateRange: DateRange
): T[] => {
  return items.filter(
    item => item.date >= dateRange.startDate && item.date <= dateRange.endDate
  )
}

// Filter payouts by platform
export const filterByPlatform = <T extends { platform?: Platform }>(
  items: T[],
  platforms: Platform[]
): T[] => {
  if (platforms.length === 0) return items
  return items.filter(
    item => item.platform && platforms.includes(item.platform)
  )
}

// Filter payouts by status
export const filterByStatus = (
  payouts: Payout[],
  statuses: PayoutStatus[]
): Payout[] => {
  if (statuses.length === 0) return payouts
  return payouts.filter(payout => statuses.includes(payout.status))
}

// Calculate total received (status = received)
export const calculateReceived = (payouts: Payout[]): number => {
  return payouts
    .filter(p => p.status === PayoutStatus.RECEIVED)
    .reduce((sum, p) => sum + p.netAmount, 0)
}

// Calculate total expected (status = pending or processing, weighted by probability)
export const calculateExpected = (payouts: Payout[]): number => {
  return payouts
    .filter(
      p =>
        p.status === PayoutStatus.PENDING ||
        p.status === PayoutStatus.PROCESSING
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
const calculateKPIMetric = (current: number, previous: number): KPIMetric => {
  const change = current - previous
  const changePercentage = previous === 0 ? 0 : (change / previous) * 100

  return {
    total: current,
    change,
    changePercentage
  }
}

// Get previous period date range
export const getPreviousPeriod = (dateRange: DateRange): DateRange => {
  const duration = dateRange.endDate.getTime() - dateRange.startDate.getTime()
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
    expenses: calculateKPIMetric(currentExpensesTotal, previousExpensesTotal)
  }
}

// Generate chart data points
export const generateChartData = (
  payouts: Payout[],
  expenses: Expense[],
  dateRange: DateRange,
  interval: 'daily' | 'weekly' = 'daily'
): ChartDataPoint[] => {
  const dataPoints: ChartDataPoint[] = []

  // Filter data
  const filteredPayouts = filterByPlatform(
    filterByDateRange(payouts, dateRange),
    [Platform.AMAZON]
  )
  const filteredExpenses = filterByPlatform(
    filterByDateRange(expenses, dateRange),
    [Platform.AMAZON]
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

    const bucketPayouts = filteredPayouts.filter(
      payout => payout.date >= bucketStart && payout.date < bucketEnd
    )
    const bucketExpenses = filteredExpenses.filter(
      expense => expense.date >= bucketStart && expense.date < bucketEnd
    )

    dataPoints.push({
      date: bucketStart.toISOString().split('T')[0],
      received: calculateReceived(bucketPayouts),
      expected: calculateExpected(bucketPayouts),
      expenses: calculateExpenses(bucketExpenses)
    })

    if (interval === 'daily') {
      current.setDate(current.getDate() + 1)
    } else {
      current.setDate(current.getDate() + 7)
    }
  }

  return dataPoints
}

// Generate mock insights based on financial data
const legacyGenerateMockInsights = (
  payouts: Payout[],
  expenses: Expense[],
  dateRange: DateRange,
  kpiData: KPIData
): Insight[] => {
  const insights: Insight[] = []

  // Format dates for period
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  const period = {
    from: formatDate(dateRange.startDate),
    to: formatDate(dateRange.endDate)
  }

  // Filter data for current period
  const currentPayouts = filterByDateRange(payouts, dateRange)
  const currentExpenses = filterByDateRange(expenses, dateRange)

  // Calculate actual profit
  const received = calculateReceived(currentPayouts)
  const expected = calculateExpected(currentPayouts)
  const expensesTotal = calculateExpenses(currentExpenses)
  const actualProfit = received - expensesTotal

  // Get previous period for comparison
  const previousPeriod = getPreviousPeriod(dateRange)
  const previousPayouts = filterByDateRange(payouts, previousPeriod)
  const previousExpenses = filterByDateRange(expenses, previousPeriod)
  const previousReceived = calculateReceived(previousPayouts)
  const previousExpensesTotal = calculateExpenses(previousExpenses)
  const previousProfit = previousReceived - previousExpensesTotal

  // Calculate platform stats
  const platformStats = Object.values(Platform)
    .map(platform => {
      const platformPayouts = currentPayouts.filter(
        p => p.platform === platform
      )
      const platformIncome =
        calculateReceived(platformPayouts) + calculateExpected(platformPayouts)
      const totalIncome = received + expected
      const incomeShare = totalIncome > 0 ? platformIncome / totalIncome : 0

      const prevPlatformPayouts = previousPayouts.filter(
        p => p.platform === platform
      )
      const prevPlatformIncome =
        calculateReceived(prevPlatformPayouts) +
        calculateExpected(prevPlatformPayouts)
      const incomeGrowth =
        prevPlatformIncome > 0
          ? ((platformIncome - prevPlatformIncome) / prevPlatformIncome) * 100
          : 0

      return { platform, incomeShare, incomeGrowth, platformIncome }
    })
    .sort((a, b) => b.incomeShare - a.incomeShare)

  // Calculate fee rates by platform
  const feeRates = Object.values(Platform).map(platform => {
    const platformPayouts = currentPayouts.filter(p => p.platform === platform)
    const totalFees = platformPayouts.reduce((sum, p) => sum + p.fees, 0)
    const totalGross = platformPayouts.reduce(
      (sum, p) => sum + p.grossAmount,
      0
    )
    const feeRate = totalGross > 0 ? totalFees / totalGross : 0
    return { platform, feeRate, totalFees }
  })

  // 1. TREND_MOMENTUM - Profit momentum
  if (previousProfit > 0) {
    const profitChange = actualProfit - previousProfit
    const profitChangePercentage = (profitChange / previousProfit) * 100

    if (Math.abs(profitChangePercentage) > 5) {
      insights.push({
        id: 'profit_momentum',
        category: InsightCategory.TREND_MOMENTUM,
        title:
          profitChangePercentage > 0 ? 'Profit momentum' : 'Profit decline',
        message: `Actual profit ${
          profitChangePercentage > 0 ? '+' : ''
        }${profitChangePercentage.toFixed(0)}% vs previous period (€${Math.abs(
          profitChange
        ).toFixed(0)} ${profitChangePercentage > 0 ? 'gain' : 'loss'}).`,
        severity:
          profitChangePercentage >= 20
            ? InsightSeverity.SUCCESS
            : profitChangePercentage >= 10
            ? InsightSeverity.INFO
            : profitChangePercentage <= -20
            ? InsightSeverity.DANGER
            : InsightSeverity.WARNING,
        metric: InsightMetric.ACTUAL_PROFIT,
        value: profitChangePercentage / 100,
        delta: profitChange,
        period,
        confidence: 0.85,
        evidence: ['kpis.actual_profit', 'baseline.profit'],
        actions:
          profitChangePercentage < -10
            ? ['Review expense categories and platform fees for anomalies.']
            : undefined
      })
    }
  }

  // 2. PLATFORM_PERFORMANCE - Leading platform
  if (platformStats.length > 0 && platformStats[0].incomeShare > 0.3) {
    const topPlatform = platformStats[0]
    const prevTopPlatformPayouts = previousPayouts.filter(
      p => p.platform === topPlatform.platform
    )
    const prevIncome =
      calculateReceived(prevTopPlatformPayouts) +
      calculateExpected(prevTopPlatformPayouts)
    const totalPrevIncome =
      calculateReceived(previousPayouts) + calculateExpected(previousPayouts)
    const prevShare = totalPrevIncome > 0 ? prevIncome / totalPrevIncome : 0
    const shareDelta = topPlatform.incomeShare - prevShare

    insights.push({
      id: 'platform_leading',
      category: InsightCategory.PLATFORM_PERFORMANCE,
      title: `${
        topPlatform.platform.charAt(0).toUpperCase() +
        topPlatform.platform.slice(1)
      } leading`,
      message: `${
        topPlatform.platform.charAt(0).toUpperCase() +
        topPlatform.platform.slice(1)
      } drives ${(topPlatform.incomeShare * 100).toFixed(0)}% of income${
        Math.abs(shareDelta) > 0.05
          ? ` (${shareDelta > 0 ? '+' : ''}${(shareDelta * 100).toFixed(0)}pp)`
          : ''
      }.`,
      severity:
        topPlatform.incomeGrowth > 10
          ? InsightSeverity.SUCCESS
          : InsightSeverity.INFO,
      metric: InsightMetric.POTENTIAL_INCOME,
      value: topPlatform.incomeShare,
      delta: shareDelta,
      period,
      confidence: 0.82,
      evidence: [`platform_stats:${topPlatform.platform}`],
      actions:
        topPlatform.incomeGrowth > 15
          ? [
              `Prioritize inventory and marketing for ${topPlatform.platform} SKUs.`
            ]
          : undefined
    })
  }

  // 3. FEES_REFUNDS - Fee analysis
  const highestFeeRate = feeRates.reduce(
    (max, curr) => (curr.feeRate > max.feeRate ? curr : max),
    feeRates[0]
  )
  if (highestFeeRate && highestFeeRate.feeRate > 0.02) {
    const baselineFeeRate = 0.03 // Baseline 3%
    const feeRateDelta = highestFeeRate.feeRate - baselineFeeRate

    insights.push({
      id: 'fee_analysis',
      category: InsightCategory.FEES_REFUNDS,
      title: `${
        highestFeeRate.platform.charAt(0).toUpperCase() +
        highestFeeRate.platform.slice(1)
      } fees`,
      message: `${
        highestFeeRate.platform.charAt(0).toUpperCase() +
        highestFeeRate.platform.slice(1)
      } fee rate at ${(highestFeeRate.feeRate * 100).toFixed(1)}%${
        Math.abs(feeRateDelta) > 0.003
          ? ` (${feeRateDelta > 0 ? '↑' : '↓'} ${(
              Math.abs(feeRateDelta) * 100
            ).toFixed(1)}pp)`
          : ''
      }, totaling €${highestFeeRate.totalFees.toFixed(0)}.`,
      severity:
        highestFeeRate.feeRate > 0.04
          ? InsightSeverity.WARNING
          : InsightSeverity.INFO,
      metric: InsightMetric.POTENTIAL_LOSS,
      value: highestFeeRate.feeRate,
      delta: feeRateDelta,
      period,
      confidence: 0.75,
      evidence: [`fees:${highestFeeRate.platform}`],
      actions:
        highestFeeRate.feeRate > 0.04
          ? ['Review pricing strategy to absorb higher processing costs.']
          : undefined
    })
  }

  // 4. FORECAST_WHATIFS - Expected income analysis
  const totalIncome = received + expected
  const expectedRatio = totalIncome > 0 ? expected / totalIncome : 0

  if (expectedRatio > 0.3) {
    insights.push({
      id: 'expected_income_pending',
      category: InsightCategory.FORECAST_WHATIFS,
      title: 'Pending income',
      message: `€${expected.toFixed(0)} pending (${(
        expectedRatio * 100
      ).toFixed(0)}% of total expected income this period).`,
      severity:
        expectedRatio > 0.6 ? InsightSeverity.WARNING : InsightSeverity.INFO,
      metric: InsightMetric.POTENTIAL_INCOME,
      value: expected,
      delta: null,
      period,
      confidence: 0.7,
      evidence: ['kpis.expected', 'scenario:expected'],
      actions:
        expectedRatio > 0.6
          ? ['Consider delaying large expenses until more payouts clear.']
          : undefined
    })
  }

  // 5. TIMING_RELIABILITY - Payout timing
  const pendingPayouts = currentPayouts.filter(
    p =>
      p.status === PayoutStatus.PENDING || p.status === PayoutStatus.PROCESSING
  )
  const receivedPayouts = currentPayouts.filter(
    p => p.status === PayoutStatus.RECEIVED
  )
  const onTimeRate =
    currentPayouts.length > 0
      ? receivedPayouts.length / currentPayouts.length
      : 0

  if (pendingPayouts.length > 0) {
    insights.push({
      id: 'payout_timing',
      category: InsightCategory.TIMING_RELIABILITY,
      title: 'Payout reliability',
      message: `${receivedPayouts.length} of ${
        currentPayouts.length
      } payouts received (${(onTimeRate * 100).toFixed(0)}% completion rate).`,
      severity:
        onTimeRate < 0.5 ? InsightSeverity.WARNING : InsightSeverity.INFO,
      metric: InsightMetric.MIXED,
      value: onTimeRate,
      delta: null,
      period,
      confidence: 0.68,
      evidence: ['timing_reliability', 'payout_status'],
      actions:
        onTimeRate < 0.5
          ? ['Monitor pending payouts closely for delays.']
          : undefined
    })
  }

  // 6. ANOMALIES - Income volatility or expense spike
  if (
    kpiData.expenses.changePercentage > 20 ||
    kpiData.expenses.changePercentage < -20
  ) {
    insights.push({
      id: 'expense_anomaly',
      category: InsightCategory.ANOMALIES,
      title: 'Expense change',
      message: `Expenses ${
        kpiData.expenses.changePercentage > 0 ? 'up' : 'down'
      } ${Math.abs(kpiData.expenses.changePercentage).toFixed(0)}% (€${Math.abs(
        kpiData.expenses.change
      ).toFixed(0)}) vs previous period.`,
      severity:
        kpiData.expenses.changePercentage > 30
          ? InsightSeverity.WARNING
          : InsightSeverity.INFO,
      metric: InsightMetric.POTENTIAL_LOSS,
      value: kpiData.expenses.total,
      delta: kpiData.expenses.change,
      period,
      confidence: 0.77,
      evidence: ['kpis.expenses', 'expense_trend'],
      actions:
        kpiData.expenses.changePercentage > 30
          ? ['Investigate expense categories for unexpected charges.']
          : undefined
    })
  }

  // Add more insights to reach a good set
  if (kpiData.received.changePercentage !== 0) {
    insights.push({
      id: 'received_change',
      category: InsightCategory.TREND_MOMENTUM,
      title: 'Received income trend',
      message: `Received income ${
        kpiData.received.changePercentage > 0 ? 'up' : 'down'
      } ${Math.abs(kpiData.received.changePercentage).toFixed(
        0
      )}% to €${kpiData.received.total.toFixed(0)}.`,
      severity:
        kpiData.received.changePercentage > 15
          ? InsightSeverity.SUCCESS
          : InsightSeverity.INFO,
      metric: InsightMetric.POTENTIAL_INCOME,
      value: kpiData.received.total,
      delta: kpiData.received.change,
      period,
      confidence: 0.8,
      evidence: ['kpis.received']
    })
  }

  // Add expected income trend
  if (
    kpiData.expected.changePercentage !== 0 &&
    Math.abs(kpiData.expected.changePercentage) > 10
  ) {
    insights.push({
      id: 'expected_change',
      category: InsightCategory.FORECAST_WHATIFS,
      title: 'Expected income shift',
      message: `Expected payouts ${
        kpiData.expected.changePercentage > 0 ? 'increased' : 'decreased'
      } by ${Math.abs(kpiData.expected.changePercentage).toFixed(
        0
      )}% vs previous period.`,
      severity:
        kpiData.expected.changePercentage < -20
          ? InsightSeverity.WARNING
          : InsightSeverity.INFO,
      metric: InsightMetric.POTENTIAL_INCOME,
      value: kpiData.expected.total,
      delta: kpiData.expected.change,
      period,
      confidence: 0.72,
      evidence: ['kpis.expected']
    })
  }

  // Add platform diversity insight
  const activeplatforms = platformStats.filter(p => p.platformIncome > 0).length
  if (activeplatforms > 0) {
    insights.push({
      id: 'platform_diversity',
      category: InsightCategory.PLATFORM_PERFORMANCE,
      title: 'Platform diversity',
      message: `Revenue across ${activeplatforms} active ${
        activeplatforms === 1 ? 'platform' : 'platforms'
      }. ${
        activeplatforms === 1
          ? 'Consider diversifying.'
          : 'Good diversification.'
      }`,
      severity:
        activeplatforms === 1
          ? InsightSeverity.WARNING
          : InsightSeverity.SUCCESS,
      metric: InsightMetric.MIXED,
      value: activeplatforms,
      delta: null,
      period,
      confidence: 0.88,
      evidence: ['platform_stats'],
      actions:
        activeplatforms === 1
          ? ['Consider expanding to additional sales channels to reduce risk.']
          : undefined
    })
  }

  // Add cash flow health insight
  const netProfit = actualProfit
  const profitMargin = received > 0 ? (netProfit / received) * 100 : 0
  if (received > 0) {
    insights.push({
      id: 'profit_margin',
      category: InsightCategory.TREND_MOMENTUM,
      title: 'Profit margin',
      message: `Current profit margin at ${profitMargin.toFixed(
        1
      )}% (€${netProfit.toFixed(0)} profit on €${received.toFixed(
        0
      )} received).`,
      severity:
        profitMargin > 30
          ? InsightSeverity.SUCCESS
          : profitMargin > 15
          ? InsightSeverity.INFO
          : InsightSeverity.WARNING,
      metric: InsightMetric.ACTUAL_PROFIT,
      value: profitMargin / 100,
      delta: null,
      period,
      confidence: 0.84,
      evidence: ['kpis.received', 'kpis.expenses'],
      actions:
        profitMargin < 15
          ? ['Review expense optimization opportunities.']
          : undefined
    })
  }

  // Add average transaction value insight
  const receivedPayoutsCount = currentPayouts.filter(
    p => p.status === PayoutStatus.RECEIVED
  ).length
  const avgTransactionValue =
    receivedPayoutsCount > 0 ? received / receivedPayoutsCount : 0
  if (avgTransactionValue > 0) {
    insights.push({
      id: 'avg_transaction',
      category: InsightCategory.PLATFORM_PERFORMANCE,
      title: 'Average payout',
      message: `Average payout value: €${avgTransactionValue.toFixed(
        0
      )} across ${receivedPayoutsCount} ${
        receivedPayoutsCount === 1 ? 'transaction' : 'transactions'
      }.`,
      severity: InsightSeverity.INFO,
      metric: InsightMetric.POTENTIAL_INCOME,
      value: avgTransactionValue,
      delta: null,
      period,
      confidence: 0.79,
      evidence: ['transaction_stats']
    })
  }

  // Add top platform by growth
  const topGrowthPlatform = platformStats.find(p => p.incomeGrowth > 20)
  if (topGrowthPlatform) {
    insights.push({
      id: 'top_growth_platform',
      category: InsightCategory.PLATFORM_PERFORMANCE,
      title: `${
        topGrowthPlatform.platform.charAt(0).toUpperCase() +
        topGrowthPlatform.platform.slice(1)
      } surging`,
      message: `${
        topGrowthPlatform.platform.charAt(0).toUpperCase() +
        topGrowthPlatform.platform.slice(1)
      } revenue up ${topGrowthPlatform.incomeGrowth.toFixed(
        0
      )}% - strongest growth this period.`,
      severity: InsightSeverity.SUCCESS,
      metric: InsightMetric.POTENTIAL_INCOME,
      value: topGrowthPlatform.incomeGrowth / 100,
      delta: topGrowthPlatform.incomeGrowth / 100,
      period,
      confidence: 0.81,
      evidence: [`platform_stats:${topGrowthPlatform.platform}`]
    })
  }

  // Add weekly run rate insight
  const daysInPeriod = Math.ceil(
    (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  )
  const dailyAvg = daysInPeriod > 0 ? received / daysInPeriod : 0
  const weeklyRunRate = dailyAvg * 7
  if (weeklyRunRate > 0) {
    insights.push({
      id: 'weekly_run_rate',
      category: InsightCategory.FORECAST_WHATIFS,
      title: 'Weekly run rate',
      message: `Current run rate: €${weeklyRunRate.toFixed(
        0
      )} per week based on received income.`,
      severity: InsightSeverity.INFO,
      metric: InsightMetric.POTENTIAL_INCOME,
      value: weeklyRunRate,
      delta: null,
      period,
      confidence: 0.76,
      evidence: ['daily_average', 'kpis.received']
    })
  }

  // Add timing insight for pending payouts
  const avgPendingAmount =
    pendingPayouts.length > 0
      ? pendingPayouts.reduce((sum, p) => sum + p.netAmount, 0) /
        pendingPayouts.length
      : 0
  if (pendingPayouts.length > 0) {
    insights.push({
      id: 'pending_value',
      category: InsightCategory.TIMING_RELIABILITY,
      title: 'Pending payout value',
      message: `${pendingPayouts.length} pending ${
        pendingPayouts.length === 1 ? 'payout' : 'payouts'
      } worth €${(avgPendingAmount * pendingPayouts.length).toFixed(
        0
      )} (avg €${avgPendingAmount.toFixed(0)} each).`,
      severity: InsightSeverity.INFO,
      metric: InsightMetric.POTENTIAL_INCOME,
      value: avgPendingAmount * pendingPayouts.length,
      delta: null,
      period,
      confidence: 0.74,
      evidence: ['payout_status', 'pending_payouts']
    })
  }

  // Add total fee amount insight
  const totalFees = currentPayouts.reduce((sum, p) => sum + p.fees, 0)
  const feePercentage =
    received + expected > 0 ? (totalFees / (received + expected)) * 100 : 0
  if (totalFees > 0) {
    insights.push({
      id: 'total_fees',
      category: InsightCategory.FEES_REFUNDS,
      title: 'Total fees paid',
      message: `€${totalFees.toFixed(
        0
      )} in platform fees this period (${feePercentage.toFixed(
        1
      )}% of gross income).`,
      severity:
        feePercentage > 4 ? InsightSeverity.WARNING : InsightSeverity.INFO,
      metric: InsightMetric.POTENTIAL_LOSS,
      value: totalFees,
      delta: null,
      period,
      confidence: 0.86,
      evidence: ['fees_total']
    })
  }

  return insights
}

export const generateMockInsights = (
  payouts: Payout[],
  expenses: Expense[],
  dateRange: DateRange,
  _kpiData: KPIData
): Insight[] => {
  const currencySymbol = '€'
  const period = {
    from: dateRange.startDate.toISOString().split('T')[0],
    to: dateRange.endDate.toISOString().split('T')[0]
  }
  const previousPeriod = getPreviousPeriod(dateRange)

  const currentPayouts = filterByDateRange(payouts, dateRange)
  const previousPayouts = filterByDateRange(payouts, previousPeriod)
  const currentExpenses = filterByDateRange(expenses, dateRange)
  const previousExpenses = filterByDateRange(expenses, previousPeriod)

  const received = calculateReceived(currentPayouts)
  const expected = calculateExpected(currentPayouts)
  const expensesTotal = calculateExpenses(currentExpenses)
  const actualProfit = received - expensesTotal

  const previousReceived = calculateReceived(previousPayouts)
  const previousExpected = calculateExpected(previousPayouts)
  const previousExpensesTotal = calculateExpenses(previousExpenses)
  const previousProfit = previousReceived - previousExpensesTotal

  const totalIncome = received + expected
  const previousTotalIncome = previousReceived + previousExpected

  const dayKey = (date: Date) => date.toISOString().split('T')[0]

  const groupByDate = <T extends { date: Date }>(items: T[]) => {
    return items.reduce<Record<string, T[]>>((acc, item) => {
      const key = dayKey(item.date)
      acc[key] = acc[key] || []
      acc[key].push(item)
      return acc
    }, {})
  }

  const payoutByDate = groupByDate(currentPayouts)
  const expenseByDate = groupByDate(currentExpenses)
  const allDates = new Set<string>([
    ...Object.keys(payoutByDate),
    ...Object.keys(expenseByDate)
  ])

  const dailyProfit = Array.from(allDates).map(date => {
    const dayPayouts = payoutByDate[date] || []
    const dayExpenses = expenseByDate[date] || []
    const net = dayPayouts.reduce((sum, payout) => sum + payout.netAmount, 0)
    const expenseSum = dayExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    )
    return {
      date,
      actualProfit: net - expenseSum
    }
  })

  const mean =
    dailyProfit.reduce((sum, entry) => sum + entry.actualProfit, 0) /
    (dailyProfit.length || 1)
  const variance =
    dailyProfit.reduce((sum, entry) => {
      const diff = entry.actualProfit - mean
      return sum + diff * diff
    }, 0) / (dailyProfit.length || 1)
  const stdDev = Math.sqrt(variance)

  const previousShareByPlatform = Object.values(Platform).reduce<
    Record<Platform, number>
  >((acc, platform) => {
    const platformPayouts = previousPayouts.filter(
      payout => payout.platform === platform
    )
    const platformIncome =
      calculateReceived(platformPayouts) + calculateExpected(platformPayouts)
    acc[platform] =
      previousTotalIncome > 0 ? platformIncome / previousTotalIncome : 0
    return acc
  }, {} as Record<Platform, number>)

  const feeStatsByPlatform = (payoutList: Payout[]) =>
    Object.values(Platform).map(platform => {
      const platformPayouts = payoutList.filter(
        payout => payout.platform === platform
      )
      const totalFees = platformPayouts.reduce(
        (sum, payout) => sum + payout.fees,
        0
      )
      const totalGross = platformPayouts.reduce(
        (sum, payout) => sum + payout.grossAmount,
        0
      )
      return {
        platform,
        feeAmount: totalFees,
        feeRate: totalGross > 0 ? totalFees / totalGross : 0,
        sampleSize: platformPayouts.length
      }
    })

  const currentFeeStats = feeStatsByPlatform(currentPayouts)
  const previousFeeStats = feeStatsByPlatform(previousPayouts).reduce<
    Record<Platform, { feeRate: number }>
  >((acc, stat) => {
    acc[stat.platform] = { feeRate: stat.feeRate }
    return acc
  }, {} as Record<Platform, { feeRate: number }>)

  type Candidate = {
    category: InsightCategory
    insight: Insight
    score: number
  }

  const candidates: Candidate[] = []
  const recencyWeight = 1.2

  const platformPretty = (platform: Platform) =>
    PLATFORM_LABELS?.[platform] ?? platform

  const formatCurrency = (value: number) =>
    `${currencySymbol}${value.toLocaleString('en-US', {
      maximumFractionDigits: 0
    })}`

  const anomalyEntry = dailyProfit
    .map(entry => ({
      ...entry,
      zScore: stdDev > 0 ? (entry.actualProfit - mean) / stdDev : 0
    }))
    .sort((a, b) => a.zScore - b.zScore)[0]

  if (anomalyEntry && anomalyEntry.zScore <= -1.5) {
    const impactWeighted = Math.abs(anomalyEntry.zScore) >= 3 ? 5 : 4
    const confidence = Math.min(0.9, Math.max(0.4, currentPayouts.length / 50))

    candidates.push({
      category: InsightCategory.ANOMALIES,
      score: impactWeighted * recencyWeight * confidence,
      insight: {
        id: `anomaly_${anomalyEntry.date}`,
        category: InsightCategory.ANOMALIES,
        title: 'Profit anomaly detected',
        message: `${formatCurrency(anomalyEntry.actualProfit)} profit on ${
          anomalyEntry.date
        } (z=${anomalyEntry.zScore.toFixed(
          1
        )}) triggers urgent variance review.`,
        severity:
          Math.abs(anomalyEntry.zScore) >= 3
            ? InsightSeverity.DANGER
            : InsightSeverity.WARNING,
        metric: InsightMetric.ACTUAL_PROFIT,
        value: anomalyEntry.actualProfit,
        delta: anomalyEntry.actualProfit - mean,
        period,
        confidence,
        evidence: [`daily:${anomalyEntry.date}`],
        actions:
          anomalyEntry.actualProfit < 0
            ? ['Audit orders and expenses for that date to confirm accuracy.']
            : undefined
      }
    })
  }

  const platformStats = Object.values(Platform).map(platform => {
    const platformPayouts = currentPayouts.filter(
      payout => payout.platform === platform
    )
    const platformIncome =
      calculateReceived(platformPayouts) + calculateExpected(platformPayouts)
    const share = totalIncome > 0 ? platformIncome / totalIncome : 0
    const previousShare = previousShareByPlatform[platform] ?? 0
    return {
      platform,
      share,
      previousShare,
      incomeGrowth:
        previousShare > 0
          ? ((share - previousShare) / previousShare) * 100
          : share > 0
          ? 100
          : 0,
      platformIncome
    }
  })

  const leadingPlatform = [...platformStats].sort(
    (a, b) => b.share - a.share
  )[0]

  if (leadingPlatform && leadingPlatform.share > 0) {
    const shareDelta = leadingPlatform.share - leadingPlatform.previousShare
    const impactWeighted =
      Math.abs(shareDelta) >= 0.05 || leadingPlatform.incomeGrowth >= 20 ? 2 : 1
    const confidence = Math.min(0.9, Math.max(0.5, currentPayouts.length / 60))

    candidates.push({
      category: InsightCategory.PLATFORM_PERFORMANCE,
      score: impactWeighted * recencyWeight * confidence,
      insight: {
        id: `platform_${leadingPlatform.platform}`,
        category: InsightCategory.PLATFORM_PERFORMANCE,
        title: `${platformPretty(leadingPlatform.platform)} share`,
        message: `${platformPretty(leadingPlatform.platform)} holds ${(
          leadingPlatform.share * 100
        ).toFixed(0)}% income share, shift ${(shareDelta * 100).toFixed(
          1
        )}pp vs prior.`,
        severity:
          shareDelta >= 0.05
            ? InsightSeverity.SUCCESS
            : shareDelta <= -0.05
            ? InsightSeverity.WARNING
            : InsightSeverity.INFO,
        metric: InsightMetric.POTENTIAL_INCOME,
        value: leadingPlatform.share,
        delta: shareDelta,
        period,
        confidence,
        evidence: [`platform:${leadingPlatform.platform}`],
        actions:
          shareDelta >= 0.05
            ? [
                `Allocate inventory to ${platformPretty(
                  leadingPlatform.platform
                )} to keep momentum.`
              ]
            : shareDelta <= -0.05
            ? [
                `Review campaigns on ${platformPretty(
                  leadingPlatform.platform
                )} to stabilise share.`
              ]
            : undefined
      }
    })
  }

  currentFeeStats.forEach(stat => {
    const previous = previousFeeStats[stat.platform]?.feeRate ?? stat.feeRate
    const delta = stat.feeRate - previous
    if (Math.abs(delta) >= 0.003 && stat.sampleSize >= 3) {
      const impactWeighted = 3
      const confidence = Math.min(0.9, Math.max(0.5, stat.sampleSize / 20))

      candidates.push({
        category: InsightCategory.FEES_REFUNDS,
        score: impactWeighted * recencyWeight * confidence,
        insight: {
          id: `fees_${stat.platform}`,
          category: InsightCategory.FEES_REFUNDS,
          title: `${platformPretty(stat.platform)} fee shift`,
          message: `${platformPretty(stat.platform)} fee rate ${(
            stat.feeRate * 100
          ).toFixed(2)}% (${(delta * 100).toFixed(
            2
          )}pp vs prior) needs cost review.`,
          severity:
            stat.feeRate > 0.04
              ? InsightSeverity.WARNING
              : InsightSeverity.INFO,
          metric: InsightMetric.POTENTIAL_LOSS,
          value: stat.feeRate,
          delta,
          period,
          confidence,
          evidence: [`fee_rate:${stat.platform}`],
          actions:
            stat.feeRate > 0.04
              ? [
                  `Consider routing ${platformPretty(
                    stat.platform
                  )} payments to lower-cost processors.`
                ]
              : undefined
        }
      })
    }
  })

  if (
    !candidates.some(
      candidate => candidate.category === InsightCategory.FEES_REFUNDS
    )
  ) {
    const fallbackStat = [...currentFeeStats].sort(
      (a, b) => b.feeRate - a.feeRate
    )[0]
    if (fallbackStat) {
      candidates.push({
        category: InsightCategory.FEES_REFUNDS,
        score: 1 * recencyWeight * 0.3,
        insight: {
          id: `fees_learning_${fallbackStat.platform}`,
          category: InsightCategory.FEES_REFUNDS,
          title: 'Fee learning insight',
          message: `Fee data limited; keep monitoring ${platformPretty(
            fallbackStat.platform
          )} processing rate.`,
          severity: InsightSeverity.INFO,
          metric: InsightMetric.POTENTIAL_LOSS,
          value: fallbackStat.feeRate,
          delta: null,
          period,
          confidence: 0.3,
          evidence: [`fee_rate:${fallbackStat.platform}`]
        }
      })
    }
  }

  const expectedNet = received + expected - expensesTotal
  if (expectedNet < 0) {
    const impactWeighted = 5
    const confidence = Math.min(
      0.85,
      Math.max(0.5, (currentPayouts.length + currentExpenses.length) / 80)
    )

    candidates.push({
      category: InsightCategory.FORECAST_WHATIFS,
      score: impactWeighted * recencyWeight * confidence,
      insight: {
        id: 'forecast_shortfall',
        category: InsightCategory.FORECAST_WHATIFS,
        title: 'Cash shortfall risk',
        message: `${formatCurrency(
          Math.abs(expectedNet)
        )} shortfall expected unless discretionary spend is delayed.`,
        severity: InsightSeverity.DANGER,
        metric: InsightMetric.MIXED,
        value: expectedNet,
        delta:
          expectedNet -
          (previousReceived + previousExpected - previousExpensesTotal),
        period,
        confidence,
        evidence: ['scenario:expected', 'kpis.actual_profit'],
        actions: ['Delay discretionary spend until major deposits clear.']
      }
    })
  } else if (expected > 0) {
    const expectedRatio = totalIncome > 0 ? expected / totalIncome : 0
    const impactWeighted = expectedRatio > 0.6 ? 2 : 1
    const confidence = Math.min(0.8, Math.max(0.4, currentPayouts.length / 70))

    candidates.push({
      category: InsightCategory.FORECAST_WHATIFS,
      score: impactWeighted * recencyWeight * confidence,
      insight: {
        id: 'forecast_pending',
        category: InsightCategory.FORECAST_WHATIFS,
        title: 'Pending payout reliance',
        message: `${formatCurrency(expected)} still pending this period, ${(
          expectedRatio * 100
        ).toFixed(0)}% of projected income.`,
        severity:
          expectedRatio > 0.6 ? InsightSeverity.WARNING : InsightSeverity.INFO,
        metric: InsightMetric.POTENTIAL_INCOME,
        value: expected,
        delta: expected - previousExpected,
        period,
        confidence,
        evidence: ['scenario:expected'],
        actions:
          expectedRatio > 0.6
            ? ['Sequence outbound payments once the largest deposits settle.']
            : undefined
      }
    })
  }

  const pendingCount = currentPayouts.filter(
    payout =>
      payout.status === PayoutStatus.PENDING ||
      payout.status === PayoutStatus.PROCESSING
  ).length
  const completionRate =
    currentPayouts.length > 0
      ? (currentPayouts.length - pendingCount) / currentPayouts.length
      : 0

  if (currentPayouts.length > 0) {
    const severity =
      completionRate < 0.75 ? InsightSeverity.WARNING : InsightSeverity.INFO
    const impactWeighted =
      completionRate < 0.75 ? 4 : completionRate < 0.85 ? 3 : 1
    const confidence = Math.min(0.85, Math.max(0.4, currentPayouts.length / 40))

    candidates.push({
      category: InsightCategory.TIMING_RELIABILITY,
      score: impactWeighted * recencyWeight * confidence,
      insight: {
        id: 'timing_completion',
        category: InsightCategory.TIMING_RELIABILITY,
        title: 'Payout completion',
        message: `${(completionRate * 100).toFixed(
          0
        )}% payouts cleared; ${pendingCount} pending need scheduling follow-up.`,
        severity,
        metric: InsightMetric.MIXED,
        value: completionRate,
        delta: null,
        period,
        confidence,
        evidence: ['timing:completion_rate'],
        actions:
          completionRate < 0.75
            ? ['Follow up with platforms to confirm pending payout ETAs.']
            : undefined
      }
    })
  }

  if (previousProfit !== 0) {
    const profitGrowth =
      (actualProfit - previousProfit) / Math.abs(previousProfit)
    const impactWeighted =
      profitGrowth >= 0.2 ? 1 : profitGrowth <= -0.2 ? 4 : 1
    const severity =
      profitGrowth >= 0.2
        ? InsightSeverity.SUCCESS
        : profitGrowth <= -0.2
        ? InsightSeverity.DANGER
        : InsightSeverity.INFO
    const confidence = Math.min(
      0.8,
      Math.max(0.4, (currentPayouts.length + currentExpenses.length) / 100)
    )

    candidates.push({
      category: InsightCategory.TREND_MOMENTUM,
      score: impactWeighted * recencyWeight * confidence,
      insight: {
        id: 'trend_profit',
        category: InsightCategory.TREND_MOMENTUM,
        title: 'Profit momentum',
        message: `Profit ${profitGrowth >= 0 ? '+' : ''}${(
          profitGrowth * 100
        ).toFixed(0)}% vs prior period; sustain disciplined reinvestment.`,
        severity,
        metric: InsightMetric.ACTUAL_PROFIT,
        value: actualProfit,
        delta: actualProfit - previousProfit,
        period,
        confidence,
        evidence: ['kpis.actual_profit']
      }
    })
  }

  const requiredCategories: InsightCategory[] = [
    InsightCategory.ANOMALIES,
    InsightCategory.PLATFORM_PERFORMANCE,
    InsightCategory.FEES_REFUNDS,
    InsightCategory.FORECAST_WHATIFS
  ]

  requiredCategories.forEach(category => {
    if (!candidates.some(candidate => candidate.category === category)) {
      candidates.push({
        category,
        score: 0.3,
        insight: {
          id: `learning_${category}`,
          category,
          title: 'Learning insight',
          message: 'Not enough signal; continue collecting data this period.',
          severity: InsightSeverity.INFO,
          metric: InsightMetric.MIXED,
          value: 0,
          delta: null,
          period,
          confidence: 0.3,
          evidence: []
        }
      })
    }
  })

  const selected: Insight[] = []
  const usedCategories = new Set<InsightCategory>()

  requiredCategories.forEach(category => {
    const best = candidates
      .filter(candidate => candidate.category === category)
      .sort((a, b) => b.score - a.score)[0]
    if (best) {
      selected.push(best.insight)
      usedCategories.add(category)
    }
  })

  const remainingCandidates = candidates
    .filter(candidate => !usedCategories.has(candidate.category))
    .sort((a, b) => b.score - a.score)

  for (const candidate of remainingCandidates) {
    if (selected.length >= 6) break
    selected.push(candidate.insight)
  }

  while (selected.length < 6) {
    selected.push({
      id: `learning_fill_${selected.length}`,
      category: InsightCategory.TREND_MOMENTUM,
      title: 'Learning insight',
      message: 'Not enough signal; continue collecting data this period.',
      severity: InsightSeverity.INFO,
      metric: InsightMetric.MIXED,
      value: 0,
      delta: null,
      period,
      confidence: 0.3,
      evidence: []
    })
  }

  if (candidates.length === 0) {
    return legacyGenerateMockInsights(payouts, expenses, dateRange, _kpiData)
  }

  const finalInsights = selected.slice(0, 6)
  return finalInsights
}
