// Platform types
export enum Platform {
  SHOPIFY = 'shopify',
  STRIPE = 'stripe',
  ETSY = 'etsy',
  AMAZON = 'amazon',
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  [Platform.SHOPIFY]: 'Shopify',
  [Platform.STRIPE]: 'Stripe',
  [Platform.ETSY]: 'Etsy',
  [Platform.AMAZON]: 'Amazon',
}

export const PLATFORM_COLORS: Record<Platform, string> = {
  [Platform.SHOPIFY]: '#96bf48',
  [Platform.STRIPE]: '#635bff',
  [Platform.ETSY]: '#f1641e',
  [Platform.AMAZON]: '#ff9900',
}

// Payout status
export enum PayoutStatus {
  RECEIVED = 'received',
  PENDING = 'pending',
  PROCESSING = 'processing',
  FAILED = 'failed',
}

export const STATUS_LABELS: Record<PayoutStatus, string> = {
  [PayoutStatus.RECEIVED]: 'Received',
  [PayoutStatus.PENDING]: 'Pending',
  [PayoutStatus.PROCESSING]: 'Processing',
  [PayoutStatus.FAILED]: 'Failed',
}

// Payout interface
export interface Payout {
  id: string
  platform: Platform
  grossAmount: number
  fees: number
  netAmount: number
  date: Date
  status: PayoutStatus
  probability?: number // For expected payouts (0-1)
  transactionId?: string
  description?: string
}

// Transaction/Expense interface
export interface Expense {
  id: string
  amount: number
  date: Date
  category: string
  description: string
  platform?: Platform
}

// KPI metric
export interface KPIMetric {
  total: number
  change: number // Absolute change from previous period
  changePercentage: number // Percentage change
}

// KPI data
export interface KPIData {
  received: KPIMetric
  expected: KPIMetric
  expenses: KPIMetric
}

// Date range
export interface DateRange {
  startDate: Date
  endDate: Date
  label?: string
}

// Chart data point
export interface ChartDataPoint {
  date: string // ISO string for chart x-axis
  received?: number
  expected?: number
  expenses?: number
}

// User interface
export interface User {
  name: string
  avatarUrl?: string
  email?: string
}

// Active KPI metrics (which ones to display in chart)
export enum KPIMetricType {
  RECEIVED = 'received',
  EXPECTED = 'expected',
  EXPENSES = 'expenses',
}
