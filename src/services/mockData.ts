import {
  Platform,
  PayoutStatus,
  type Payout,
  type Expense,
  type User,
} from '@/types'

// Mock user
export const mockUser: User = {
  name: 'Alex Morgan',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  email: 'alex@example.com',
}

// Helper to generate random date within range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

// Helper to generate random amount
const randomAmount = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

// Generate mock payouts
export const generateMockPayouts = (count: number = 50): Payout[] => {
  const payouts: Payout[] = []
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 90) // 90 days ago
  const endDate = new Date(today)
  endDate.setDate(today.getDate() + 30) // 30 days in future

  const platforms = Object.values(Platform)
  const statuses = Object.values(PayoutStatus)

  for (let i = 0; i < count; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)]
    const date = randomDate(startDate, endDate)
    const isPast = date < today

    // Past dates are mostly received, future dates are pending/processing
    let status: PayoutStatus
    if (isPast) {
      status = Math.random() > 0.1 ? PayoutStatus.RECEIVED : PayoutStatus.PROCESSING
    } else {
      status = Math.random() > 0.5 ? PayoutStatus.PENDING : PayoutStatus.PROCESSING
    }

    const grossAmount = randomAmount(100, 5000)
    const feePercentage = randomAmount(0.02, 0.05) // 2-5% fees
    const fees = Math.round(grossAmount * feePercentage * 100) / 100
    const netAmount = grossAmount - fees

    payouts.push({
      id: `payout-${i + 1}`,
      platform,
      grossAmount,
      fees,
      netAmount,
      date,
      status,
      probability: status === PayoutStatus.PENDING ? randomAmount(0.7, 0.95) : undefined,
      transactionId: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} payout`,
    })
  }

  return payouts.sort((a, b) => a.date.getTime() - b.date.getTime())
}

// Generate mock expenses
export const generateMockExpenses = (count: number = 30): Expense[] => {
  const expenses: Expense[] = []
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 90)

  const categories = [
    'Platform Fees',
    'Marketing',
    'Software',
    'Shipping',
    'Supplies',
    'Other',
  ]
  const platforms = Object.values(Platform)

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const hasPlatform = Math.random() > 0.5
    const platform = hasPlatform
      ? platforms[Math.floor(Math.random() * platforms.length)]
      : undefined

    expenses.push({
      id: `expense-${i + 1}`,
      amount: randomAmount(50, 1000),
      date: randomDate(startDate, today),
      category,
      description: `${category} ${platform ? `- ${platform}` : ''}`,
      platform,
    })
  }

  return expenses.sort((a, b) => a.date.getTime() - b.date.getTime())
}

// Initialize mock data
export const mockPayouts = generateMockPayouts(50)
export const mockExpenses = generateMockExpenses(30)
