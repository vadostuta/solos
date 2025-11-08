import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/ui/card'
import type { ChartDataPoint } from '@/types'
import { KPIMetricType } from '@/types'

interface CashFlowChartProps {
  data: ChartDataPoint[]
  activeMetrics: Set<KPIMetricType>
  onDataPointClick?: (date: string) => void
}

export function CashFlowChart({ data, activeMetrics, onDataPointClick }: CashFlowChartProps) {
  const showReceived = activeMetrics.has(KPIMetricType.RECEIVED)
  const showExpected = activeMetrics.has(KPIMetricType.EXPECTED)
  const showExpenses = activeMetrics.has(KPIMetricType.EXPENSES)

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold">Cash Flow Trends</h3>
          <p className="text-xs text-muted-foreground">
            {activeMetrics.size === 0
              ? 'Select metrics above to view chart data'
              : 'Click on any data point to view transaction details'}
          </p>
        </div>

        {activeMetrics.size > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart 
              data={data}
              onClick={(data) => {
                if (data && data.activeLabel && onDataPointClick) {
                  onDataPointClick(data.activeLabel)
                }
              }}
              style={{ cursor: onDataPointClick ? 'pointer' : 'default' }}
            >
              <defs>
                <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getMonth() + 1}/${date.getDate()}`
                }}
              />
              <YAxis
                className="text-xs"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <div className="text-sm font-medium mb-2">
                        {new Date(payload[0].payload.date).toLocaleDateString()}
                      </div>
                      {payload.map((entry) => (
                        <div
                          key={entry.name}
                          className="flex items-center justify-between gap-4 text-sm"
                        >
                          <span className="capitalize">{entry.name}:</span>
                          <span className="font-medium">
                            ${Number(entry.value).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }}
              />
              {showReceived && (
                <Area
                  type="monotone"
                  dataKey="received"
                  stroke="#10b981"
                  fill="url(#colorReceived)"
                  strokeWidth={2}
                  activeDot={{ r: 6, style: { cursor: 'pointer' } }}
                />
              )}
              {showExpected && (
                <Area
                  type="monotone"
                  dataKey="expected"
                  stroke="#3b82f6"
                  fill="url(#colorExpected)"
                  strokeWidth={2}
                  activeDot={{ r: 6, style: { cursor: 'pointer' } }}
                />
              )}
              {showExpenses && (
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  fill="url(#colorExpenses)"
                  strokeWidth={2}
                  activeDot={{ r: 6, style: { cursor: 'pointer' } }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
            Click on the KPI cards above to display chart data
          </div>
        )}
      </div>
    </Card>
  )
}
