import { useState, useMemo } from 'react'
import { Header } from './Header'
import { DateRangePicker } from './DateRangePicker'
import { PlatformFilter } from './PlatformFilter'
import { KPICard } from './KPICard'
import { CashFlowChart } from './CashFlowChart'
import { mockUser, mockPayouts, mockExpenses } from '@/services/mockData'
import { calculateKPIData, generateChartData } from '@/services/analytics'
import { Platform, KPIMetricType, type DateRange } from '@/types'

export function Dashboard() {
  // State for filters
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date()
    const last30 = new Date(today)
    last30.setDate(today.getDate() - 30)
    return {
      startDate: last30,
      endDate: today,
      label: 'Last 30 days',
    }
  })

  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])

  // State for active KPI metrics (which to show in chart)
  const [activeMetrics, setActiveMetrics] = useState<Set<KPIMetricType>>(
    new Set([KPIMetricType.RECEIVED])
  )

  // Calculate KPI data
  const kpiData = useMemo(() => {
    return calculateKPIData(
      mockPayouts,
      mockExpenses,
      dateRange,
      selectedPlatforms
    )
  }, [dateRange, selectedPlatforms])

  // Generate chart data
  const chartData = useMemo(() => {
    return generateChartData(
      mockPayouts,
      mockExpenses,
      dateRange,
      selectedPlatforms,
      'daily'
    )
  }, [dateRange, selectedPlatforms])

  // Toggle metric in chart
  const toggleMetric = (metric: KPIMetricType) => {
    const newMetrics = new Set(activeMetrics)
    if (newMetrics.has(metric)) {
      newMetrics.delete(metric)
    } else {
      newMetrics.add(metric)
    }
    setActiveMetrics(newMetrics)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <PlatformFilter
            selectedPlatforms={selectedPlatforms}
            onPlatformChange={setSelectedPlatforms}
          />
        </div>

        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            label="Received"
            amount={kpiData.received.total}
            change={kpiData.received.change}
            changePercentage={kpiData.received.changePercentage}
            isActive={activeMetrics.has(KPIMetricType.RECEIVED)}
            onClick={() => toggleMetric(KPIMetricType.RECEIVED)}
          />
          <KPICard
            label="Expected"
            amount={kpiData.expected.total}
            change={kpiData.expected.change}
            changePercentage={kpiData.expected.changePercentage}
            isActive={activeMetrics.has(KPIMetricType.EXPECTED)}
            onClick={() => toggleMetric(KPIMetricType.EXPECTED)}
          />
          <KPICard
            label="Expenses"
            amount={kpiData.expenses.total}
            change={kpiData.expenses.change}
            changePercentage={kpiData.expenses.changePercentage}
            isActive={activeMetrics.has(KPIMetricType.EXPENSES)}
            onClick={() => toggleMetric(KPIMetricType.EXPENSES)}
          />
        </div>

        {/* Chart Section */}
        <CashFlowChart data={chartData} activeMetrics={activeMetrics} />
      </main>
    </div>
  )
}
