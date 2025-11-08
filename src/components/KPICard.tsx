import { Card } from '@/components/ui/card'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  label: string
  amount: number
  change: number
  changePercentage: number
  isActive: boolean
  onClick: () => void
}

export function KPICard({
  label,
  amount,
  change,
  changePercentage,
  isActive,
  onClick,
}: KPICardProps) {
  const isPositive = change >= 0
  const isNegative = change < 0

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all hover:shadow-md',
        isActive && 'ring-2 ring-primary shadow-md'
      )}
      onClick={onClick}
    >
      <div className="space-y-1.5">
        {/* Row 1: Label */}
        <div className="text-xs font-medium text-muted-foreground">{label}</div>

        {/* Row 2: Amount */}
        <div className="text-2xl font-bold">
          ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        {/* Row 3: Change indicator */}
        <div className="flex items-center gap-1 text-xs">
          {isPositive && (
            <>
              <ArrowUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600 font-medium">
                +{changePercentage.toFixed(1)}%
              </span>
            </>
          )}
          {isNegative && (
            <>
              <ArrowDown className="h-3 w-3 text-red-600" />
              <span className="text-red-600 font-medium">
                {changePercentage.toFixed(1)}%
              </span>
            </>
          )}
          {change === 0 && (
            <span className="text-muted-foreground font-medium">No change</span>
          )}
          <span className="text-muted-foreground ml-1">vs previous period</span>
        </div>
      </div>
    </Card>
  )
}
