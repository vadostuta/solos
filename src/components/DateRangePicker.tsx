import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import type { DateRange as DateRangeType } from '@/types'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  dateRange: DateRangeType
  onDateRangeChange: (range: DateRangeType) => void
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange ? (
              <>
                {format(dateRange.startDate, 'LLL dd, y')} -{' '}
                {format(dateRange.endDate, 'LLL dd, y')}
              </>
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b space-y-1">
            <div className="text-sm font-medium">Quick Select</div>
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  const today = new Date()
                  const lastWeek = new Date(today)
                  lastWeek.setDate(today.getDate() - 7)
                  onDateRangeChange({
                    startDate: lastWeek,
                    endDate: today,
                    label: 'Last 7 days',
                  })
                }}
              >
                Last 7 days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  const today = new Date()
                  const lastMonth = new Date(today)
                  lastMonth.setDate(today.getDate() - 30)
                  onDateRangeChange({
                    startDate: lastMonth,
                    endDate: today,
                    label: 'Last 30 days',
                  })
                }}
              >
                Last 30 days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  const today = new Date()
                  const last90 = new Date(today)
                  last90.setDate(today.getDate() - 90)
                  onDateRangeChange({
                    startDate: last90,
                    endDate: today,
                    label: 'Last 90 days',
                  })
                }}
              >
                Last 90 days
              </Button>
            </div>
          </div>
          <Calendar
            mode="range"
            selected={{
              from: dateRange.startDate,
              to: dateRange.endDate,
            }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onDateRangeChange({
                  startDate: range.from,
                  endDate: range.to,
                })
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
