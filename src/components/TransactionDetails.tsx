import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Payout, Expense } from '@/types'
import { PLATFORM_LABELS, STATUS_LABELS, KPIMetricType } from '@/types'

interface TransactionDetailsProps {
  date: Date
  payouts: Payout[]
  expenses: Expense[]
  activeMetrics: Set<KPIMetricType>
  onClose: () => void
}

export function TransactionDetails({
  date,
  payouts,
  expenses,
  activeMetrics,
  onClose,
}: TransactionDetailsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const totalReceived = payouts
    .filter((p) => p.status === 'received')
    .reduce((sum, p) => sum + p.netAmount, 0)
  
  const totalExpected = payouts
    .filter((p) => p.status === 'pending' || p.status === 'processing')
    .reduce((sum, p) => sum + p.netAmount, 0)
  
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const showReceived = activeMetrics.has(KPIMetricType.RECEIVED)
  const showExpected = activeMetrics.has(KPIMetricType.EXPECTED)
  const showExpenses = activeMetrics.has(KPIMetricType.EXPENSES)

  const receivedPayouts = payouts.filter((p) => p.status === 'received')
  const expectedPayouts = payouts.filter((p) => p.status === 'pending' || p.status === 'processing')

  // Calculate how many columns to show based on active metrics
  const activeMetricCount = activeMetrics.size
  const gridCols = activeMetricCount === 1 ? 'md:grid-cols-1' : activeMetricCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'

  return (
    <Card className='border-2'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4'>
        <div>
          <CardTitle className='text-base'>Transaction Details</CardTitle>
          <p className='text-xs text-muted-foreground mt-0.5'>
            {date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Button variant='ghost' size='icon' onClick={onClose}>
          <X className='h-4 w-4' />
        </Button>
      </CardHeader>
      <CardContent className='space-y-4 px-4 pb-4'>
        {/* Summary */}
        <div className={`grid grid-cols-1 ${gridCols} gap-3`}>
          {showReceived && (
            <div className='bg-green-50 dark:bg-green-950/20 rounded-lg p-3'>
              <div className='text-xs text-muted-foreground'>Received</div>
              <div className='text-xl font-bold text-green-600 dark:text-green-400'>
                {formatCurrency(totalReceived)}
              </div>
              <div className='text-[10px] text-muted-foreground'>
                {receivedPayouts.length} transactions
              </div>
            </div>
          )}
          {showExpected && (
            <div className='bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3'>
              <div className='text-xs text-muted-foreground'>Expected</div>
              <div className='text-xl font-bold text-blue-600 dark:text-blue-400'>
                {formatCurrency(totalExpected)}
              </div>
              <div className='text-[10px] text-muted-foreground'>
                {expectedPayouts.length} transactions
              </div>
            </div>
          )}
          {showExpenses && (
            <div className='bg-red-50 dark:bg-red-950/20 rounded-lg p-3'>
              <div className='text-xs text-muted-foreground'>Expenses</div>
              <div className='text-xl font-bold text-red-600 dark:text-red-400'>
                {formatCurrency(totalExpenses)}
              </div>
              <div className='text-[10px] text-muted-foreground'>
                {expenses.length} transactions
              </div>
            </div>
          )}
        </div>

        {/* Received Payouts */}
        {showReceived && receivedPayouts.length > 0 && (
          <div className='space-y-2'>
            <h4 className='font-semibold text-xs'>Received Payouts</h4>
            <div className='space-y-1.5'>
              {receivedPayouts.map((payout) => (
                <div
                  key={payout.id}
                  className='flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-accent/50 transition-colors'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-1.5'>
                      <span className='text-sm font-medium'>
                        {PLATFORM_LABELS[payout.platform]}
                      </span>
                      <Badge variant='default' className='text-[10px] px-1.5 py-0'>
                        {STATUS_LABELS[payout.status]}
                      </Badge>
                    </div>
                    {payout.description && (
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        {payout.description}
                      </p>
                    )}
                    {payout.transactionId && (
                      <p className='text-[10px] text-muted-foreground mt-0.5'>
                        ID: {payout.transactionId}
                      </p>
                    )}
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-semibold'>
                      {formatCurrency(payout.netAmount)}
                    </div>
                    <div className='text-[10px] text-muted-foreground'>
                      Fee: {formatCurrency(payout.fees)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expected Payouts */}
        {showExpected && expectedPayouts.length > 0 && (
          <div className='space-y-2'>
            <h4 className='font-semibold text-xs'>Expected Payouts</h4>
            <div className='space-y-1.5'>
              {expectedPayouts.map((payout) => (
                <div
                  key={payout.id}
                  className='flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-accent/50 transition-colors'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-1.5'>
                      <span className='text-sm font-medium'>
                        {PLATFORM_LABELS[payout.platform]}
                      </span>
                      <Badge
                        variant={payout.status === 'pending' ? 'secondary' : 'outline'}
                        className='text-[10px] px-1.5 py-0'
                      >
                        {STATUS_LABELS[payout.status]}
                      </Badge>
                    </div>
                    {payout.description && (
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        {payout.description}
                      </p>
                    )}
                    {payout.transactionId && (
                      <p className='text-[10px] text-muted-foreground mt-0.5'>
                        ID: {payout.transactionId}
                      </p>
                    )}
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-semibold'>
                      {formatCurrency(payout.netAmount)}
                    </div>
                    <div className='text-[10px] text-muted-foreground'>
                      Fee: {formatCurrency(payout.fees)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expenses */}
        {showExpenses && expenses.length > 0 && (
          <div className='space-y-2'>
            <h4 className='font-semibold text-xs'>Expenses</h4>
            <div className='space-y-1.5'>
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className='flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-accent/50 transition-colors'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-1.5'>
                      <span className='text-sm font-medium'>{expense.category}</span>
                      {expense.platform && (
                        <Badge variant='outline' className='text-[10px] px-1.5 py-0'>
                          {PLATFORM_LABELS[expense.platform]}
                        </Badge>
                      )}
                    </div>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      {expense.description}
                    </p>
                  </div>
                  <div className='text-sm font-semibold text-red-600 dark:text-red-400'>
                    -{formatCurrency(expense.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMetrics.size === 0 && (
          <div className='text-center py-6 text-sm text-muted-foreground'>
            No metrics selected. Click on KPI cards above to view transactions.
          </div>
        )}
        
        {activeMetrics.size > 0 && 
         (showReceived ? receivedPayouts.length : 0) === 0 && 
         (showExpected ? expectedPayouts.length : 0) === 0 && 
         (showExpenses ? expenses.length : 0) === 0 && (
          <div className='text-center py-6 text-sm text-muted-foreground'>
            No transactions found for the selected metrics on this date
          </div>
        )}
      </CardContent>
    </Card>
  )
}

