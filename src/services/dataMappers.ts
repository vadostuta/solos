import type { ChannelDto, FinancialRecordDto, InsightDto } from '@/types/api'
import {
  Platform,
  PayoutStatus,
  InsightCategory,
  InsightSeverity,
  InsightMetric,
  type Channel,
  type Payout,
  type Expense,
  type Insight
} from '@/types'

/**
 * Map channel name to Platform enum
 * Case-insensitive matching
 */
export const mapChannelToPlatform = (channelName: string): Platform => {
  const normalized = channelName.toLowerCase().trim()

  switch (normalized) {
    case 'shopify':
      return Platform.SHOPIFY
    case 'stripe':
      return Platform.STRIPE
    case 'etsy':
      return Platform.ETSY
    case 'amazon':
      return Platform.AMAZON
    default:
      // Default to first platform if unknown
      console.warn(
        `Unknown channel name: ${channelName}, defaulting to Shopify`
      )
      return Platform.SHOPIFY
  }
}

/**
 * Map ChannelDto to Channel interface
 */
export const mapChannelDto = (dto: ChannelDto): Channel => {
  return {
    id: dto.id,
    name: dto.name || 'Unknown'
  }
}

/**
 * Map FinancialRecordDto to Payout
 * Assumes records with positive values are income
 */
export const mapFinancialRecordToPayout = (
  record: FinancialRecordDto,
  status: PayoutStatus = PayoutStatus.RECEIVED
): Payout => {
  const platform = record.channelName
    ? mapChannelToPlatform(record.channelName)
    : Platform.SHOPIFY

  // Calculate realistic fees (3-5% of value)
  const feeRate = 0.03 + Math.random() * 0.02
  const fees = Math.abs(record.value * feeRate)
  const grossAmount = Math.abs(record.value)
  const netAmount = grossAmount - fees

  return {
    id: `payout-${record.channelId}-${record.date}`,
    platform,
    channelId: record.channelId,
    grossAmount,
    fees,
    netAmount,
    date: new Date(record.date),
    status,
    probability: status === PayoutStatus.PENDING ? 0.85 : undefined,
    transactionId: `TXN-${record.channelId}-${Date.parse(record.date)}`,
    description: `${record.channelName || 'Unknown'} payout`
  }
}

/**
 * Map FinancialRecordDto to Expense
 */
export const mapFinancialRecordToExpense = (
  record: FinancialRecordDto,
  category: string = 'Platform Fees'
): Expense => {
  const platform = record.channelName
    ? mapChannelToPlatform(record.channelName)
    : undefined

  return {
    id: `expense-${record.channelId}-${record.date}`,
    amount: Math.abs(record.value),
    date: new Date(record.date),
    category,
    description: `${category} - ${record.channelName || 'Unknown'}`,
    platform,
    channelId: record.channelId
  }
}

/**
 * Map array of FinancialRecordDto to Payout array
 */
export const mapFinancialRecordsToPayouts = (
  records: FinancialRecordDto[],
  status: PayoutStatus = PayoutStatus.RECEIVED
): Payout[] => {
  return records.map(record => mapFinancialRecordToPayout(record, status))
}

/**
 * Map array of FinancialRecordDto to Expense array
 */
export const mapFinancialRecordsToExpenses = (
  records: FinancialRecordDto[],
  category: string = 'Platform Fees'
): Expense[] => {
  return records.map(record => mapFinancialRecordToExpense(record, category))
}

/**
 * Map backend insight category string to InsightCategory enum
 */
const mapInsightCategory = (category: string | null): InsightCategory => {
  if (!category) return InsightCategory.ANOMALIES

  const normalized = category.toLowerCase().replace(/[_\s]/g, '')

  if (normalized.includes('anomal')) return InsightCategory.ANOMALIES
  if (normalized.includes('platform') || normalized.includes('performance'))
    return InsightCategory.PLATFORM_PERFORMANCE
  if (normalized.includes('fee') || normalized.includes('refund'))
    return InsightCategory.FEES_REFUNDS
  if (normalized.includes('forecast') || normalized.includes('whatif'))
    return InsightCategory.FORECAST_WHATIFS
  if (normalized.includes('timing') || normalized.includes('reliab'))
    return InsightCategory.TIMING_RELIABILITY
  if (normalized.includes('trend') || normalized.includes('momentum'))
    return InsightCategory.TREND_MOMENTUM

  return InsightCategory.ANOMALIES
}

/**
 * Map backend insight severity string to InsightSeverity enum
 */
const mapInsightSeverity = (severity: string | null): InsightSeverity => {
  if (!severity) return InsightSeverity.INFO

  const normalized = severity.toLowerCase()

  if (normalized === 'danger' || normalized === 'error')
    return InsightSeverity.DANGER
  if (normalized === 'warning' || normalized === 'warn')
    return InsightSeverity.WARNING
  if (normalized === 'success') return InsightSeverity.SUCCESS

  return InsightSeverity.INFO
}

/**
 * Map backend insight metric string to InsightMetric enum
 */
const mapInsightMetric = (metric: string | null): InsightMetric => {
  if (!metric) return InsightMetric.MIXED

  const normalized = metric.toLowerCase().replace(/[_\s]/g, '')

  if (normalized.includes('income') || normalized.includes('potential'))
    return InsightMetric.POTENTIAL_INCOME
  if (normalized.includes('loss')) return InsightMetric.POTENTIAL_LOSS
  if (normalized.includes('profit') || normalized.includes('actual'))
    return InsightMetric.ACTUAL_PROFIT

  return InsightMetric.MIXED
}

/**
 * Map InsightDto to Insight
 */
export const mapInsightDto = (dto: InsightDto): Insight => {
  return {
    id: dto.id || `insight-${Date.now()}-${Math.random()}`,
    category: mapInsightCategory(dto.category),
    title: dto.title || 'Insight',
    message: dto.message || '',
    severity: mapInsightSeverity(dto.severity),
    metric: mapInsightMetric(dto.metric),
    value: dto.value,
    delta: dto.delta,
    period: {
      from: dto.period?.from || '',
      to: dto.period?.to || ''
    },
    confidence: dto.confidence,
    evidence: dto.evidence || [],
    actions: dto.actions || undefined
  }
}

/**
 * Map array of InsightDto to Insight array
 */
export const mapInsightDtos = (dtos: InsightDto[]): Insight[] => {
  return dtos.map(mapInsightDto)
}

/**
 * Group financial records by channel
 */
export const groupRecordsByChannel = (
  records: FinancialRecordDto[]
): Map<number, FinancialRecordDto[]> => {
  const grouped = new Map<number, FinancialRecordDto[]>()

  records.forEach(record => {
    const existing = grouped.get(record.channelId) || []
    existing.push(record)
    grouped.set(record.channelId, existing)
  })

  return grouped
}

/**
 * Calculate total from financial records
 */
export const calculateTotalFromRecords = (
  records: FinancialRecordDto[]
): number => {
  return records.reduce((sum, record) => sum + Math.abs(record.value), 0)
}

