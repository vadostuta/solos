// Backend API DTOs based on Swagger specification

/**
 * Channel DTO - represents a sales channel/platform
 */
export interface ChannelDto {
  id: number
  name: string | null
}

/**
 * Financial Record DTO - represents income or expense data point
 */
export interface FinancialRecordDto {
  date: string // ISO 8601 date-time format
  value: number
  channelId: number
  channelName: string | null
}

/**
 * Insight Period DTO - date range for insight analysis
 */
export interface InsightPeriodDto {
  from: string | null // YYYY-MM-DD format
  to: string | null // YYYY-MM-DD format
}

/**
 * Insight DTO - represents a single insight/recommendation
 */
export interface InsightDto {
  id: string | null
  category: string | null
  title: string | null
  message: string | null
  severity: string | null
  metric: string | null
  value: number
  delta: number | null
  period: InsightPeriodDto
  confidence: number
  evidence: string[] | null
  actions: string[] | null
}

/**
 * Insight Response DTO - wrapper for insights array
 */
export interface InsightResponseDto {
  insights: InsightDto[] | null
}

/**
 * Product DTO - represents a product (not currently used in dashboard)
 */
export interface ProductDto {
  id: number
  name: string | null
  description: string | null
  price: number
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  message: string
  status: number
  errors?: Record<string, string[]>
}

