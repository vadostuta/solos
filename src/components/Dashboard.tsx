import { useState, useMemo } from 'react'
import { Header } from './Header'
import { DateRangePicker } from './DateRangePicker'
import { KPICard } from './KPICard'
import { CashFlowChart } from './CashFlowChart'
import { mockUser, mockPayouts, mockExpenses } from '@/services/mockData'
import { calculateKPIData, generateChartData } from '@/services/analytics'
import { KPIMetricType, type DateRange } from '@/types'

export function Dashboard () {
  // State for filters
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return {
      startDate: firstDay,
      endDate: lastDay,
      label: 'This month'
    }
  })

  // State for active KPI metrics (which to show in chart)
  const [activeMetrics, setActiveMetrics] = useState<Set<KPIMetricType>>(
    new Set([KPIMetricType.RECEIVED])
  )

  // Calculate KPI data
  const kpiData = useMemo(() => {
    return calculateKPIData(mockPayouts, mockExpenses, dateRange, [])
  }, [dateRange])

  // Generate chart data
  const chartData = useMemo(() => {
    return generateChartData(mockPayouts, mockExpenses, dateRange, [], 'daily')
  }, [dateRange])

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
    <div className='min-h-screen bg-background'>
      <Header user={mockUser} />

      <main className='container mx-auto px-4 py-8 space-y-8'>
        {/* Filter Section */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
          <div className='space-y-1'>
            <h1 className='text-3xl font-bold tracking-tight'>
              Hello {mockUser.name}
            </h1>
            <p className='text-muted-foreground'>
              This is what's happening around your payout date range
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
        </div>

        {/* KPI Cards Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <KPICard
            label='Received'
            amount={kpiData.received.total}
            change={kpiData.received.change}
            changePercentage={kpiData.received.changePercentage}
            isActive={activeMetrics.has(KPIMetricType.RECEIVED)}
            onClick={() => toggleMetric(KPIMetricType.RECEIVED)}
          />
          <KPICard
            label='Expected'
            amount={kpiData.expected.total}
            change={kpiData.expected.change}
            changePercentage={kpiData.expected.changePercentage}
            isActive={activeMetrics.has(KPIMetricType.EXPECTED)}
            onClick={() => toggleMetric(KPIMetricType.EXPECTED)}
          />
          <KPICard
            label='Expenses'
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
