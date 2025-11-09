import axios, { AxiosInstance, AxiosError } from 'axios'
import type {
  ChannelDto,
  FinancialRecordDto,
  InsightResponseDto,
  ApiErrorResponse
} from '@/types/api'

/**
 * API Configuration
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const USE_MOCK_FALLBACK = import.meta.env.VITE_USE_MOCK_FALLBACK === 'true'

/**
 * Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds
})

/**
 * Request interceptor for adding auth headers in the future
 */
apiClient.interceptors.request.use(
  config => {
    // Future: Add authentication token here
    // const token = getAuthToken()
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error: No response from server')
    } else {
      // Error in request configuration
      console.error('Request Error:', error.message)
    }
    return Promise.reject(error)
  }
)

/**
 * Helper to check if we should use mock fallback
 */
export const shouldUseMockFallback = (): boolean => {
  return USE_MOCK_FALLBACK
}

/**
 * Channels API
 */

export const fetchChannels = async (): Promise<ChannelDto[]> => {
  try {
    const response = await apiClient.get<ChannelDto[]>('/api/Channels')
    return response.data
  } catch (error) {
    console.warn('Failed to fetch channels from API:', error)
    throw error
  }
}

export const fetchChannelById = async (id: number): Promise<ChannelDto> => {
  try {
    const response = await apiClient.get<ChannelDto>(`/api/Channels/${id}`)
    return response.data
  } catch (error) {
    console.warn(`Failed to fetch channel ${id} from API:`, error)
    throw error
  }
}

export const fetchChannelByName = async (name: string): Promise<ChannelDto> => {
  try {
    const response = await apiClient.get<ChannelDto>(
      `/api/Channels/by-name/${encodeURIComponent(name)}`
    )
    return response.data
  } catch (error) {
    console.warn(`Failed to fetch channel by name ${name} from API:`, error)
    throw error
  }
}

export const createChannel = async (
  channel: Omit<ChannelDto, 'id'>
): Promise<ChannelDto> => {
  try {
    const response = await apiClient.post<ChannelDto>('/api/Channels', channel)
    return response.data
  } catch (error) {
    console.warn('Failed to create channel:', error)
    throw error
  }
}

export const updateChannel = async (
  id: number,
  channel: ChannelDto
): Promise<void> => {
  try {
    await apiClient.put(`/api/Channels/${id}`, channel)
  } catch (error) {
    console.warn(`Failed to update channel ${id}:`, error)
    throw error
  }
}

export const deleteChannel = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/Channels/${id}`)
  } catch (error) {
    console.warn(`Failed to delete channel ${id}:`, error)
    throw error
  }
}

/**
 * Financial API
 */

export interface FinancialQueryParams {
  startDate?: Date
  endDate?: Date
  channelIds?: number[]
}

const formatDateForApi = (date: Date): string => {
  return date.toISOString()
}

export const fetchReceivedIncome = async (
  params: FinancialQueryParams
): Promise<FinancialRecordDto[]> => {
  try {
    const queryParams = new URLSearchParams()
    if (params.startDate) {
      queryParams.append('startDate', formatDateForApi(params.startDate))
    }
    if (params.endDate) {
      queryParams.append('endDate', formatDateForApi(params.endDate))
    }
    if (params.channelIds && params.channelIds.length > 0) {
      params.channelIds.forEach(id => {
        queryParams.append('channelIds', id.toString())
      })
    }

    const response = await apiClient.get<FinancialRecordDto[]>(
      `/api/Financial/received-income?${queryParams.toString()}`
    )
    return response.data
  } catch (error) {
    console.warn('Failed to fetch received income from API:', error)
    throw error
  }
}

export const fetchExpectedIncome = async (
  params: FinancialQueryParams
): Promise<FinancialRecordDto[]> => {
  try {
    const queryParams = new URLSearchParams()
    if (params.startDate) {
      queryParams.append('startDate', formatDateForApi(params.startDate))
    }
    if (params.endDate) {
      queryParams.append('endDate', formatDateForApi(params.endDate))
    }
    if (params.channelIds && params.channelIds.length > 0) {
      params.channelIds.forEach(id => {
        queryParams.append('channelIds', id.toString())
      })
    }

    const response = await apiClient.get<FinancialRecordDto[]>(
      `/api/Financial/expected-income?${queryParams.toString()}`
    )
    return response.data
  } catch (error) {
    console.warn('Failed to fetch expected income from API:', error)
    throw error
  }
}

export const fetchExpenses = async (
  params: FinancialQueryParams
): Promise<FinancialRecordDto[]> => {
  try {
    const queryParams = new URLSearchParams()
    if (params.startDate) {
      queryParams.append('startDate', formatDateForApi(params.startDate))
    }
    if (params.endDate) {
      queryParams.append('endDate', formatDateForApi(params.endDate))
    }
    if (params.channelIds && params.channelIds.length > 0) {
      params.channelIds.forEach(id => {
        queryParams.append('channelIds', id.toString())
      })
    }

    const response = await apiClient.get<FinancialRecordDto[]>(
      `/api/Financial/expenses?${queryParams.toString()}`
    )
    return response.data
  } catch (error) {
    console.warn('Failed to fetch expenses from API:', error)
    throw error
  }
}

/**
 * Insights API
 */

export interface InsightQueryParams {
  startDate?: Date
  endDate?: Date
}

export const fetchInsights = async (
  params: InsightQueryParams
): Promise<InsightResponseDto> => {
  try {
    const queryParams = new URLSearchParams()
    if (params.startDate) {
      queryParams.append('startDate', formatDateForApi(params.startDate))
    }
    if (params.endDate) {
      queryParams.append('endDate', formatDateForApi(params.endDate))
    }

    const response = await apiClient.get<InsightResponseDto>(
      `/api/Insights/financial?${queryParams.toString()}`
    )
    return response.data
  } catch (error) {
    console.warn('Failed to fetch insights from API:', error)
    throw error
  }
}

/**
 * Export the configured axios instance for advanced usage
 */
export { apiClient }

