import {
  Platform,
  PayoutStatus,
  type Payout,
  type Expense,
  type User
} from '@/types'

// Mock user
export const mockUser: User = {
  name: 'Andrzej',
  avatarUrl:
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Andrzej&backgroundColor=b6e3f4&skinColor=ffdbb4',
  email: 'andrzej@example.com'
}

// Helper to generate random amount
const randomAmount = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

// Generate mock payouts for a specific month with even distribution
const generateMockPayoutsForMonth = (
  year: number,
  month: number,
  count: number,
  startId: number
): Payout[] => {
  const payouts: Payout[] = []
  const today = new Date()
  const endDate = new Date(year, month + 1, 0) // Last day of the month
  const daysInMonth = endDate.getDate()

  const platforms = Object.values(Platform)

  // Distribute transactions evenly across all days
  const transactionsPerDay = Math.floor(count / daysInMonth)
  const remainder = count % daysInMonth

  for (let day = 1; day <= daysInMonth; day++) {
    // Determine how many transactions for this day
    const dayTransactions = transactionsPerDay + (day <= remainder ? 1 : 0)

    for (let i = 0; i < dayTransactions; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)]

      // Create date with random time during the day
      const date = new Date(year, month, day)
      date.setHours(Math.floor(Math.random() * 24))
      date.setMinutes(Math.floor(Math.random() * 60))
      date.setSeconds(Math.floor(Math.random() * 60))

      const isPast = date < today

      // Past dates are mostly received, future dates are pending/processing
      let status: PayoutStatus
      if (isPast) {
        status =
          Math.random() > 0.1 ? PayoutStatus.RECEIVED : PayoutStatus.PROCESSING
      } else {
        status =
          Math.random() > 0.5 ? PayoutStatus.PENDING : PayoutStatus.PROCESSING
      }

      const grossAmount = randomAmount(100, 5000)
      const feePercentage = randomAmount(0.02, 0.05) // 2-5% fees
      const fees = Math.round(grossAmount * feePercentage * 100) / 100
      const netAmount = grossAmount - fees

      payouts.push({
        id: `payout-${startId + payouts.length}`,
        platform,
        grossAmount,
        fees,
        netAmount,
        date,
        status,
        probability:
          status === PayoutStatus.PENDING ? randomAmount(0.7, 0.95) : undefined,
        transactionId: `TXN-${Math.random()
          .toString(36)
          .substring(2, 9)
          .toUpperCase()}`,
        description: `${
          platform.charAt(0).toUpperCase() + platform.slice(1)
        } payout`
      })
    }
  }

  return payouts
}

// Generate mock payouts for all months
export const generateMockPayouts = (countPerMonth: number = 50): Payout[] => {
  const payouts: Payout[] = []

  // September (month 8), October (month 9), November (month 10), December (month 11)
  const months = [8, 9, 10, 11]

  months.forEach((month, index) => {
    const monthPayouts = generateMockPayoutsForMonth(
      2025,
      month,
      countPerMonth,
      index * countPerMonth + 1
    )
    payouts.push(...monthPayouts)
  })

  return payouts.sort((a, b) => a.date.getTime() - b.date.getTime())
}

// Generate mock expenses for a specific month with even distribution
const generateMockExpensesForMonth = (
  year: number,
  month: number,
  count: number,
  startId: number
): Expense[] => {
  const expenses: Expense[] = []
  const endDate = new Date(year, month + 1, 0) // Last day of the month
  const daysInMonth = endDate.getDate()

  const categories = [
    'Platform Fees',
    'Marketing',
    'Software',
    'Shipping',
    'Supplies',
    'Other'
  ]
  const platforms = Object.values(Platform)

  // Distribute expenses evenly across all days
  const expensesPerDay = Math.floor(count / daysInMonth)
  const remainder = count % daysInMonth

  for (let day = 1; day <= daysInMonth; day++) {
    // Determine how many expenses for this day
    const dayExpenses = expensesPerDay + (day <= remainder ? 1 : 0)

    for (let i = 0; i < dayExpenses; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const hasPlatform = Math.random() > 0.5
      const platform = hasPlatform
        ? platforms[Math.floor(Math.random() * platforms.length)]
        : undefined

      // Create date with random time during the day
      const date = new Date(year, month, day)
      date.setHours(Math.floor(Math.random() * 24))
      date.setMinutes(Math.floor(Math.random() * 60))
      date.setSeconds(Math.floor(Math.random() * 60))

      expenses.push({
        id: `expense-${startId + expenses.length}`,
        amount: randomAmount(50, 1000),
        date,
        category,
        description: `${category} ${platform ? `- ${platform}` : ''}`,
        platform
      })
    }
  }

  return expenses
}

// Generate mock expenses for all months
export const generateMockExpenses = (countPerMonth: number = 30): Expense[] => {
  const expenses: Expense[] = []

  // September (month 8), October (month 9), November (month 10), December (month 11)
  const months = [8, 9, 10, 11]

  months.forEach((month, index) => {
    const monthExpenses = generateMockExpensesForMonth(
      2025,
      month,
      countPerMonth,
      index * countPerMonth + 1
    )
    expenses.push(...monthExpenses)
  })

  return expenses.sort((a, b) => a.date.getTime() - b.date.getTime())
}

// Initialize mock data
export const mockPayouts = generateMockPayouts(500)
export const mockExpenses = generateMockExpenses(300)
