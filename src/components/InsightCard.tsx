import { type Insight, InsightSeverity, INSIGHT_CATEGORY_LABELS } from '@/types'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { AlertCircle, TrendingUp, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'

interface InsightCardProps {
  insight: Insight
  onDismiss?: (insightId: string) => void
}

const severityConfig = {
  [InsightSeverity.DANGER]: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-l-red-500',
    textColor: 'text-red-700',
    badgeVariant: 'destructive' as const,
    iconColor: 'text-red-500',
  },
  [InsightSeverity.WARNING]: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-l-yellow-500',
    textColor: 'text-yellow-800',
    badgeVariant: 'default' as const,
    iconColor: 'text-yellow-600',
  },
  [InsightSeverity.SUCCESS]: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-l-green-500',
    textColor: 'text-green-700',
    badgeVariant: 'default' as const,
    iconColor: 'text-green-600',
  },
  [InsightSeverity.INFO]: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-l-blue-500',
    textColor: 'text-blue-700',
    badgeVariant: 'secondary' as const,
    iconColor: 'text-blue-500',
  },
}

export function InsightCard({ insight, onDismiss }: InsightCardProps) {
  const config = severityConfig[insight.severity]
  const Icon = config.icon

  return (
    <Card className={`${config.bgColor} border-l-4 ${config.borderColor} border-t border-r border-b relative group`}>
      <div className='p-2.5 space-y-1.5'>
        {/* Dismiss button */}
        {onDismiss && (
          <Button
            variant='ghost'
            size='sm'
            className='absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity'
            onClick={() => onDismiss(insight.id)}
          >
            <X className='h-3 w-3' />
          </Button>
        )}

        {/* Header with icon and category badge */}
        <div className='flex items-start justify-between gap-2 pr-6'>
          <div className='flex items-center gap-1.5 min-w-0'>
            <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${config.iconColor}`} />
            <h3 className={`text-xs font-semibold ${config.textColor} truncate`}>
              {insight.title}
            </h3>
          </div>
          <Badge variant={config.badgeVariant} className='text-[10px] px-1.5 py-0 flex-shrink-0'>
            {INSIGHT_CATEGORY_LABELS[insight.category]}
          </Badge>
        </div>

        {/* Message */}
        <p className='text-xs text-foreground leading-snug'>
          {insight.message}
        </p>

        {/* Actions if present */}
        {insight.actions && insight.actions.length > 0 && (
          <div className='pt-0.5'>
            {insight.actions.map((action, index) => (
              <p key={index} className='text-[10px] text-muted-foreground italic leading-tight'>
                💡 {action}
              </p>
            ))}
          </div>
        )}

        {/* Confidence indicator (subtle) */}
        {insight.confidence < 0.6 && (
          <div className='pt-0.5'>
            <p className='text-[10px] text-muted-foreground'>
              Confidence: {(insight.confidence * 100).toFixed(0)}%
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
