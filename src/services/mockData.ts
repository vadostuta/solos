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
    'https://pacificnwreviews.wordpress.com/wp-content/uploads/2013/04/ryan-gosling-place-beyond-the-pines.jpg',
  email: 'andrzej@example.com'
}

// Parse Amazon CSV data and convert to Payouts
const parseAmazonOrders = (): Payout[] => {
  const csvData = `24746291521,114-8371645-4419464,Order,2025-10-30,,332.58,-71.42,261.16
24746291521,114-9116493-8452212,Order,2025-10-29,,128.17,-28.5,99.67
24746291521,111-2492492-2368203,Order,2025-10-29,,720.9,-148.2,572.7
24746291521,113-7770286-9420258,Order,2025-10-29,,187.66,-38.06,149.6
24746291521,111-6549721-4591457,Order,2025-10-29,,576.72,-118.56,458.16
24746291521,114-8631167-0539412,Order,2025-10-28,,224.69,-46.2,178.49
24746291521,114-3124257-3397019,Order,2025-10-28,,234.29,-65.37,168.92
24746291521,112-6082282-2333800,Order,2025-10-28,,237.04,-68.12,168.92
24746291521,112-1776731-9181848,Order,2025-10-27,,388.48,-82.74,305.74
24746291521,111-0077670-0280233,Order,2025-10-27,,167.45,-36.87,130.58
24746291521,114-6196745-4838642,Order,2025-10-25,,720.9,-148.2,572.7
24746291521,111-2899732-4253014,Order,2025-10-25,,720.9,-148.2,572.7
24746291521,113-5341196-7505022,Refund,2025-10-24,,46.77,-209.22,-162.45
24746291521,114-4365649-1689865,Order,2025-10-23,,151.41,-30.57,120.84
24746291521,111-6986201-1950603,Order,2025-10-21,,376.26,-74.54,301.72
24746291521,111-6765691-2549865,Order,2025-10-21,,194.24,-41.37,152.87
24746291521,112-1220193-4329842,Order,2025-10-20,,243.79,-48.3,195.49
24746291521,112-9271285-9698660,Order,2025-10-20,,211.98,-42.0,169.98
24746291521,111-1447126-0553061,Order,2025-10-20,,141.63,-28.59,113.04
24746291521,111-1172774-4712231,Refund,2025-10-20,,45.63,-213.96,-168.33
24746291521,112-8631378-0875425,Order,2025-10-19,,240.56,-71.64,168.92
24746291521,113-8783758-5482602,Order,2025-10-19,,241.44,-72.52,168.92
24746291521,113-7988588-8341057,Order,2025-10-17,,720.9,-148.2,572.7
24746291521,113-8117875-3015454,Order,2025-10-17,,273.26,-40.98,232.28
24746291521,111-7006447-5918624,Order,2025-10-17,,164.37,-33.79,130.58
24646454811,112-8171640-4813005,Order,2025-10-15,2025-10-18,191.53,-39.38,152.15
24646454811,113-8783758-5482602,Order,2025-10-15,2025-10-18,482.88,-145.04,337.84
24646454811,111-0707639-2892221,Order,2025-10-14,2025-10-18,227.31,-48.82,178.49
24646454811,113-3857224-9524219,Order,2025-10-14,2025-10-18,300.12,-60.26,239.86
24646454811,112-2527682-8689806,Order,2025-10-13,2025-10-18,149.27,-33.13,116.14
24646454811,113-4427459-3217063,Order,2025-10-13,2025-10-18,234.29,-47.3,186.99
24646454811,113-8452539-9806645,Order,2025-10-13,2025-10-18,224.69,-46.2,178.49
24646454811,113-1128270-7657847,Order,2025-10-13,2025-10-18,197.84,-44.97,152.87
24646454811,111-9597306-7283428,Refund,2025-10-13,2025-10-18,30.95,-154.76,-123.81
24646454811,111-3281571-4766668,Order,2025-10-13,2025-10-18,229.41,-50.92,178.49
24646454811,111-6029529-3733824,Order,2025-10-12,2025-10-18,470.78,-130.86,339.92
24646454811,111-3286312-0827422,Order,2025-10-11,2025-10-18,239.24,-69.28,169.96
24646454811,111-1430556-1200225,Order,2025-10-11,2025-10-18,232.09,-62.13,169.96
24646454811,111-9376411-7905061,Order,2025-10-09,2025-10-18,382.16,-77.86,304.3
24646454811,111-8270450-3966621,Order,2025-10-09,2025-10-18,191.54,-38.67,152.87
24646454811,114-3376402-7058653,Order,2025-10-08,2025-10-18,240.01,-70.05,169.96
24646454811,112-3744980-2341001,Order,2025-10-08,2025-10-18,213.98,-44.0,169.98
24646454811,112-2611814-0898648,Refund,2025-10-08,2025-10-18,38.93,-196.08,-157.15
24646454811,111-5562252-1485031,Order,2025-10-08,2025-10-18,192.44,-39.57,152.87
24646454811,114-1529308-3127450,Refund,2025-10-08,2025-10-18,38.32,-198.41,-160.09
24646454811,111-7272285-4797042,Order,2025-10-08,2025-10-18,194.69,-41.82,152.87
24646454811,111-7003473-3797043,Refund,2025-10-07,2025-10-18,65.62,-310.48,-244.86
24646454811,111-6922746-4635443,Order,2025-10-07,2025-10-18,150.98,-31.05,119.93
24646454811,114-9676626-9479422,Order,2025-10-06,2025-10-18,224.69,-46.2,178.49
24646454811,114-6179101-7334612,Order,2025-10-06,2025-10-18,485.08,-145.16,339.92
24646454811,111-1172774-4712231,Order,2025-10-06,2025-10-18,208.96,-45.63,163.33
24646454811,114-1613430-2227404,Order,2025-10-05,2025-10-18,192.44,-39.57,152.87
24646454811,111-8914527-0560211,Order,2025-10-05,2025-10-18,720.9,-148.2,572.7
24646454811,111-7652815-9639425,Order,2025-10-05,2025-10-18,720.9,-148.2,572.7
24646454811,113-9102415-4089804,Order,2025-10-05,2025-10-18,195.14,-42.27,152.87
24646454811,112-6065566-7021034,Order,2025-10-03,2025-10-18,148.86,-28.93,119.93
24646454811,113-0561927-8835423,Order,2025-10-03,2025-10-18,236.49,-66.53,169.96
24646454811,114-8722740-1345806,Order,2025-10-03,2025-10-18,215.58,-45.6,169.98
24646454811,113-9254016-8256229,Order,2025-10-03,2025-10-18,192.43,-40.28,152.15
24646454811,111-9373404-0359439,Order,2025-10-03,2025-10-18,191.77,-38.9,152.87
24539101731,112-9280046-6921833,Order,2025-10-01,2025-10-04,240.56,-70.6,169.96
24539101731,113-2670951-7139431,Order,2025-10-01,2025-10-04,699.57,-189.69,509.88
24539101731,114-7801836-6570633,Order,2025-09-30,2025-10-04,973.45,-209.1,764.35
24539101731,113-2636248-3569069,Order,2025-09-30,2025-10-04,184.0,-40.35,143.65
24539101731,112-6574680-3489000,Order,2025-09-29,2025-10-04,191.99,-39.12,152.87
24539101731,111-3817072-2034640,Order,2025-09-29,2025-10-04,470.78,-130.86,339.92
24539101731,113-8576738-1513855,Refund,2025-09-28,2025-10-04,45.41,-228.9,-183.49
24539101731,114-6265435-6938661,Order,2025-09-28,2025-10-04,194.24,-41.37,152.87
24539101731,112-5234945-9447461,Order,2025-09-27,2025-10-04,223.9,-45.41,178.49
24539101731,114-6087028-8398656,Order,2025-09-26,2025-10-04,205.2,-44.07,161.13
24539101731,111-0713681-0058624,Refund,2025-09-25,2025-10-04,38.19,-190.74,-152.55
24539101731,112-1899782-4656222,Refund,2025-09-25,2025-10-04,64.5,-295.58,-231.08
24539101731,114-3965177-0925033,Refund,2025-09-25,2025-10-04,28.0,-148.24,-120.24
24539101731,112-0801913-1460251,Order,2025-09-22,2025-10-04,192.44,-39.57,152.87
24539101731,111-5119697-5019432,Order,2025-09-22,2025-10-04,189.74,-37.59,152.15
24539101731,112-4484075-1510636,Order,2025-09-22,2025-10-04,235.39,-65.43,169.96
24539101731,113-6001328-1325014,Order,2025-09-22,2025-10-04,154.79,-32.4,122.39
24539101731,112-7788217-6357857,Order,2025-09-22,2025-10-04,152.63,-30.24,122.39
24539101731,113-8333470-1757816,Order,2025-09-22,2025-10-04,384.88,-79.14,305.74
24539101731,114-0489656-2061858,Order,2025-09-22,2025-10-04,223.63,-45.98,177.65
24539101731,111-2689159-9627414,Order,2025-09-21,2025-10-04,466.38,-126.46,339.92
24539101731,114-5637861-2638650,Order,2025-09-20,2025-10-04,229.23,-59.27,169.96
24539101731,113-5341196-7505022,Order,2025-09-19,2025-10-04,204.22,-46.77,157.45
24439213131,114-1529308-3127450,Order,2025-09-17,2025-09-20,193.41,-38.32,155.09
24439213131,112-2611814-0898648,Order,2025-09-17,2025-09-20,191.08,-38.93,152.15
24439213131,111-9597306-7283428,Order,2025-09-17,2025-09-20,150.54,-30.95,119.59
24439213131,114-7535384-6956255,Order,2025-09-12,2025-09-20,195.17,-42.3,152.87
24439213131,113-8489404-3281051,Order,2025-09-11,2025-09-20,226.79,-48.3,178.49
24439213131,111-0713681-0058624,Order,2025-09-11,2025-09-20,185.74,-38.19,147.55
24439213131,111-8363794-6251442,Order,2025-09-11,2025-09-20,219.99,-33.0,186.99
24439213131,111-6041210-9301058,Order,2025-09-10,2025-09-20,238.14,-51.15,186.99
24439213131,114-4938372-1309839,Order,2025-09-10,2025-09-20,447.26,-91.96,355.3
24439213131,111-0185371-4114609,Order,2025-09-08,2025-09-20,147.06,-30.24,116.82
24439213131,113-8576738-1513855,Order,2025-09-08,2025-09-20,223.9,-45.41,178.49
24439213131,113-4642213-5505834,Order,2025-09-05,2025-09-20,389.38,-83.64,305.74
24331066851,114-0890964-8633841,Order,2025-09-03,2025-09-06,472.98,-133.06,339.92
24331066851,112-6209541-7753814,Order,2025-09-02,2025-09-06,207.04,-43.71,163.33
24331066851,112-0927878-2139415,Order,2025-09-01,2025-09-06,151.2,-30.36,120.84`

  const payouts: Payout[] = []
  const lines = csvData.trim().split('\n')

  lines.forEach(line => {
    const parts = line.split(',')
    if (parts.length < 8) return

    const [
      ,
      orderId,
      type,
      orderDateStr,
      depositDateStr,
      potentialIncome,
      potentialLoss,
      actualProfit
    ] = parts

    // Parse date
    const orderDate = new Date(orderDateStr)

    // Determine status based on deposit date
    const hasDepositDate = depositDateStr && depositDateStr.trim() !== ''
    const today = new Date()
    let status: PayoutStatus

    if (hasDepositDate) {
      status = PayoutStatus.RECEIVED
    } else if (orderDate < today) {
      status = PayoutStatus.PROCESSING
    } else {
      status = PayoutStatus.PENDING
    }

    // Parse amounts
    const grossAmount = Math.abs(parseFloat(potentialIncome))
    const fees = Math.abs(parseFloat(potentialLoss))
    const netAmount = parseFloat(actualProfit)

    // Skip invalid entries
    if (isNaN(grossAmount) || isNaN(fees) || isNaN(netAmount)) return

    payouts.push({
      id: `amazon-${orderId}`,
      platform: Platform.AMAZON,
      grossAmount,
      fees,
      netAmount,
      date: orderDate,
      status,
      probability: status === PayoutStatus.PENDING ? 0.85 : undefined,
      transactionId: orderId,
      description: `Amazon ${type}`
    })
  })

  return payouts.sort((a, b) => a.date.getTime() - b.date.getTime())
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

// Initialize mock data - Use real Amazon data + generated data for other platforms
const amazonPayouts = parseAmazonOrders()
const otherPlatformsPayouts = generateMockPayouts(200) // Add some from other platforms
export const mockPayouts = [...amazonPayouts, ...otherPlatformsPayouts].sort(
  (a, b) => a.date.getTime() - b.date.getTime()
)

// Generate expenses based on Amazon fees
const amazonExpenses: Expense[] = amazonPayouts
  .filter(p => p.fees > 0)
  .map(payout => ({
    id: `amazon-fee-${payout.id}`,
    amount: payout.fees,
    date: payout.date,
    category: 'Platform Fees',
    description: `Amazon fees for ${payout.transactionId}`,
    platform: Platform.AMAZON
  }))

const otherExpenses = generateMockExpenses(100)
export const mockExpenses = [...amazonExpenses, ...otherExpenses].sort(
  (a, b) => a.date.getTime() - b.date.getTime()
)
