import { useState, useMemo } from 'react'
import { Header } from './Header'
import { DateRangePicker } from './DateRangePicker'
import { KPICard } from './KPICard'
import { CashFlowChart } from './CashFlowChart'
import { TransactionDetails } from './TransactionDetails'
import { InsightsSidebar } from './InsightsSidebar'
import { Skeleton } from './ui/skeleton'
import { Button } from './ui/button'
import { Download } from 'lucide-react'
import { calculateKPIData, generateChartData } from '@/services/analytics'
import {
  useChannels,
  useFinancialData,
  useInsights,
  useIsFallbackMode
} from '@/hooks/useFinancialData'
import {
  KPIMetricType,
  InsightCategory,
  Platform,
  type DateRange,
  type User
} from '@/types'

const SUPPORTED_PLATFORMS = new Set(Object.values(Platform))

const PLACEHOLDER_USER: User = {
  name: 'Andrzej',
  avatarUrl: '/avatar.png'
}

export function Dashboard () {
  // State for filters
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date()
    const firstDayLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    )
    const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    return {
      startDate: firstDayLastMonth,
      endDate: lastDayLastMonth,
      label: 'Last month'
    }
  })

  // State for active KPI metrics (which to show in chart)
  const [activeMetrics, setActiveMetrics] = useState<Set<KPIMetricType>>(
    new Set([KPIMetricType.RECEIVED])
  )

  // State for selected date (for transaction details)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // State for dismissed insights
  const [dismissedInsightIds, setDismissedInsightIds] = useState<Set<string>>(
    new Set()
  )

  const { data: channels = [] } = useChannels()

  const channelFilterIds = useMemo(() => {
    return channels
      .filter(channel => {
        if (!channel.name) return false
        const normalized = channel.name.toLowerCase()
        if (!SUPPORTED_PLATFORMS.has(normalized as Platform)) {
          return false
        }
        return true
      })
      .map(channel => channel.id)
  }, [channels])

  // State for selected insight categories
  const [selectedCategories, setSelectedCategories] = useState<
    Set<InsightCategory>
  >(new Set(Object.values(InsightCategory)))

  // Fetch financial data from API (with fallback to mock data)
  const {
    payouts,
    expenses,
    isLoading: isLoadingFinancial
  } = useFinancialData(dateRange, channelFilterIds)

  // Fetch insights from API (with fallback to mock insights)
  const { data: allInsights = [], isLoading: isLoadingInsights } =
    useInsights(dateRange)

  // Check if we're in fallback mode
  const { isFallbackMode } = useIsFallbackMode(dateRange)

  // Calculate KPI data
  const kpiData = useMemo(() => {
    return calculateKPIData(payouts, expenses, dateRange, [Platform.AMAZON])
  }, [payouts, expenses, dateRange])

  // Generate chart data
  const chartData = useMemo(() => {
    return generateChartData(payouts, expenses, dateRange, 'daily')
  }, [payouts, expenses, dateRange])

  // Filter out dismissed insights and filter by selected categories
  const insights = useMemo(() => {
    return allInsights.filter(
      insight =>
        !dismissedInsightIds.has(insight.id) &&
        selectedCategories.has(insight.category)
    )
  }, [allInsights, dismissedInsightIds, selectedCategories])

  // Handle dismissing an insight
  const handleDismissInsight = (insightId: string) => {
    setDismissedInsightIds(prev => new Set(prev).add(insightId))
  }

  // Handle toggling insight category
  const handleCategoryToggle = (category: InsightCategory) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

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

  // Handle chart data point click
  const handleDataPointClick = (dateString: string) => {
    // Ensure we interpret the chart date label in local time to avoid timezone shifts
    const clickedDate = new Date(`${dateString}T00:00:00`)
    setSelectedDate(clickedDate)
  }

  // Filter transactions for selected date
  const selectedDateTransactions = useMemo(() => {
    if (!selectedDate) return { payouts: [], expenses: [] }

    const selectedKey = selectedDate.toISOString().split('T')[0]

    const filteredPayouts = payouts.filter(
      payout =>
        payout.date.toISOString().split('T')[0] === selectedKey &&
        payout.platform === Platform.AMAZON
    )

    return { payouts: filteredPayouts, expenses: expenses }
  }, [selectedDate, payouts, expenses])

  const headerUser = PLACEHOLDER_USER

  return (
    <div className='min-h-screen bg-background'>
      <Header user={headerUser} isFallbackMode={isFallbackMode} />

      <div className='container mx-auto px-4 py-4'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Main Content */}
          <main className='flex-1 space-y-4 min-w-0'>
            {/* Filter Section */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
              <div className='space-y-0.5'>
                <h1 className='text-2xl font-bold tracking-tight'>
                  Hello {headerUser.name}
                </h1>
                <p className='text-sm text-muted-foreground'>
                  This is what's happening around your payout date range
                </p>
              </div>
              <div className='flex items-center gap-2 sm:gap-3'>
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                />
                <a href='/big_picture.pdf' download className='inline-flex'>
                  <Button variant='outline' size='sm'>
                    <Download className='h-3.5 w-3.5 mr-2' />
                    Big Picture
                  </Button>
                </a>
              </div>
            </div>

            {/* KPI Cards Section */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {isLoadingFinancial ? (
                <>
                  <Skeleton className='h-[120px] w-full' />
                  <Skeleton className='h-[120px] w-full' />
                  <Skeleton className='h-[120px] w-full' />
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Chart Section */}
            {isLoadingFinancial ? (
              <Skeleton className='h-[400px] w-full' />
            ) : (
              <CashFlowChart
                data={chartData}
                activeMetrics={activeMetrics}
                onDataPointClick={handleDataPointClick}
              />
            )}

            {/* Transaction Details Section */}
            {selectedDate && (
              <TransactionDetails
                date={selectedDate}
                payouts={selectedDateTransactions.payouts}
                expenses={selectedDateTransactions.expenses}
                activeMetrics={activeMetrics}
                onClose={() => setSelectedDate(null)}
              />
            )}
          </main>

          {/* Insights Sidebar */}
          <InsightsSidebar
            insights={insights}
            onDismiss={handleDismissInsight}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            isLoading={isLoadingInsights}
          />
        </div>
      </div>
    </div>
  )
}
