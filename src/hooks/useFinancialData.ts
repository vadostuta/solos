import { useQuery, UseQueryResult } from '@tanstack/react-query'
import {
  fetchChannels,
  fetchReceivedIncome,
  fetchExpectedIncome,
  fetchExpenses,
  fetchInsights,
  shouldUseMockFallback,
  type FinancialQueryParams,
  type InsightQueryParams
} from '@/services/api'
import {
  mapChannelDto,
  mapFinancialRecordsToPayouts,
  mapFinancialRecordsToExpenses,
  mapInsightDtos
} from '@/services/dataMappers'
import { mockPayouts, mockExpenses } from '@/services/mockData'
import { generateMockInsights } from '@/services/analytics'
import { filterByDateRange, calculateKPIData } from '@/services/analytics'
import type { Channel, Payout, Expense, Insight, DateRange } from '@/types'
import { PayoutStatus } from '@/types'

/**
 * Hook to fetch channels from API or use mock data
 */
export const useChannels = (): UseQueryResult<Channel[], Error> => {
  return useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      try {
        const channels = await fetchChannels()
        return channels.map(mapChannelDto)
      } catch (error) {
        if (shouldUseMockFallback()) {
          console.warn('Using mock channels as fallback')
          // Return mock channels based on Platform enum
          return [
            { id: 1, name: 'Amazon' },
            { id: 2, name: 'Shopify' },
            { id: 3, name: 'Stripe' },
            { id: 4, name: 'Etsy' }
          ]
        }
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })
}

/**
 * Hook to fetch received income (completed payouts)
 */
export const useReceivedIncome = (
  dateRange: DateRange,
  channelIds?: number[]
): UseQueryResult<Payout[], Error> => {
  return useQuery({
    queryKey: [
      'received-income',
      dateRange.startDate,
      dateRange.endDate,
      channelIds
    ],
    queryFn: async () => {
      try {
        const params: FinancialQueryParams = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          channelIds
        }
        const records = await fetchReceivedIncome(params)
        return mapFinancialRecordsToPayouts(records, PayoutStatus.RECEIVED)
      } catch (error) {
        if (shouldUseMockFallback()) {
          console.warn('Using mock received income as fallback')
          // Filter mock data by date range
          const filtered = filterByDateRange(mockPayouts, dateRange)
          return filtered.filter(p => p.status === PayoutStatus.RECEIVED)
        }
        throw error
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2
  })
}

/**
 * Hook to fetch expected income (pending/processing payouts)
 */
export const useExpectedIncome = (
  dateRange: DateRange,
  channelIds?: number[]
): UseQueryResult<Payout[], Error> => {
  return useQuery({
    queryKey: [
      'expected-income',
      dateRange.startDate,
      dateRange.endDate,
      channelIds
    ],
    queryFn: async () => {
      try {
        const params: FinancialQueryParams = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          channelIds
        }
        const records = await fetchExpectedIncome(params)
        return mapFinancialRecordsToPayouts(records, PayoutStatus.PENDING)
      } catch (error) {
        if (shouldUseMockFallback()) {
          console.warn('Using mock expected income as fallback')
          // Filter mock data by date range
          const filtered = filterByDateRange(mockPayouts, dateRange)
          return filtered.filter(
            p =>
              p.status === PayoutStatus.PENDING ||
              p.status === PayoutStatus.PROCESSING
          )
        }
        throw error
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2
  })
}

/**
 * Hook to fetch expenses
 */
export const useExpenses = (
  dateRange: DateRange,
  channelIds?: number[]
): UseQueryResult<Expense[], Error> => {
  return useQuery({
    queryKey: ['expenses', dateRange.startDate, dateRange.endDate, channelIds],
    queryFn: async () => {
      try {
        const params: FinancialQueryParams = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          channelIds
        }
        const records = await fetchExpenses(params)
        return mapFinancialRecordsToExpenses(records, 'Expense')
      } catch (error) {
        if (shouldUseMockFallback()) {
          console.warn('Using mock expenses as fallback')
          // Filter mock data by date range
          return filterByDateRange(mockExpenses, dateRange)
        }
        throw error
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2
  })
}

/**
 * Hook to fetch all financial data (received + expected + expenses)
 * This combines the three endpoints for convenience
 */
export const useFinancialData = (
  dateRange: DateRange,
  channelIds: number[] = []
) => {
  const filter = channelIds.length > 0 ? channelIds : undefined

  const receivedQuery = useReceivedIncome(dateRange, filter)
  const expectedQuery = useExpectedIncome(dateRange, filter)
  const expensesQuery = useExpenses(dateRange, filter)

  // Combine all payouts
  const allPayouts: Payout[] = [
    ...(receivedQuery.data || []),
    ...(expectedQuery.data || [])
  ]

  const allExpenses: Expense[] = expensesQuery.data || []

  const isLoading =
    receivedQuery.isLoading ||
    expectedQuery.isLoading ||
    expensesQuery.isLoading

  const isError =
    receivedQuery.isError || expectedQuery.isError || expensesQuery.isError

  const error =
    receivedQuery.error || expectedQuery.error || expensesQuery.error

  return {
    payouts: allPayouts,
    expenses: allExpenses,
    isLoading,
    isError,
    error,
    refetch: () => {
      receivedQuery.refetch()
      expectedQuery.refetch()
      expensesQuery.refetch()
    }
  }
}

/**
 * Hook to fetch insights from backend
 */
export const useInsights = (
  dateRange: DateRange
): UseQueryResult<Insight[], Error> => {
  // We need payouts and expenses to generate fallback insights
  const { payouts, expenses } = useFinancialData(dateRange)

  return useQuery({
    queryKey: ['insights', dateRange.startDate, dateRange.endDate],
    queryFn: async () => {
      try {
        const params: InsightQueryParams = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }
        const response = await fetchInsights(params)
        return response.insights ? mapInsightDtos(response.insights) : []
      } catch (error) {
        if (shouldUseMockFallback()) {
          console.warn('Using mock insights as fallback')
          // Generate insights from current data
          const kpiData = calculateKPIData(payouts, expenses, dateRange, [])
          return generateMockInsights(payouts, expenses, dateRange, kpiData)
        }
        throw error
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    // Only run when we have payouts and expenses data
    enabled: payouts.length > 0 || expenses.length > 0
  })
}

/**
 * Hook to check if we're using fallback data
 * Useful for displaying a warning badge in the UI
 */
export const useIsFallbackMode = (
  dateRange: DateRange
): { isFallbackMode: boolean; isLoading: boolean } => {
  const receivedQuery = useReceivedIncome(dateRange)
  const expensesQuery = useExpenses(dateRange)

  // If both queries succeeded, we're not in fallback mode
  // If they failed but we have data, we're in fallback mode
  const isFallbackMode =
    (receivedQuery.isError || expensesQuery.isError) &&
    (receivedQuery.data !== undefined || expensesQuery.data !== undefined)

  const isLoading = receivedQuery.isLoading || expensesQuery.isLoading

  return { isFallbackMode, isLoading }
}

