import { useState } from 'react'
import { type Insight, InsightCategory, INSIGHT_CATEGORY_LABELS } from '@/types'
import { InsightCard } from './InsightCard'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
  Lightbulb,
  ChevronDown,
  Settings2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface InsightsSidebarProps {
  insights: Insight[]
  onDismiss?: (insightId: string) => void
  selectedCategories: Set<InsightCategory>
  onCategoryToggle: (category: InsightCategory) => void
  isLoading?: boolean
}

export function InsightsSidebar ({
  insights,
  onDismiss,
  selectedCategories,
  onCategoryToggle,
  isLoading = false
}: InsightsSidebarProps) {
  const [visibleCount, setVisibleCount] = useState(6)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  const visibleInsights = insights.slice(0, visibleCount)
  const hasMore = visibleCount < insights.length

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, insights.length))
  }

  const allCategories = Object.values(InsightCategory)

  return (
    <aside
      className={`transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-full lg:w-80' : 'w-12'
      } space-y-3`}
    >
      {isExpanded ? (
        <>
          {/* Header - Expanded */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Lightbulb className='h-4 w-4 text-primary' />
              <h2 className='text-base font-semibold'>Insights</h2>
              <span className='text-xs text-muted-foreground'>
                {insights.length}
              </span>
            </div>

            <div className='flex items-center gap-1'>
              {/* Settings Popover */}
              <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <PopoverTrigger asChild>
                  <Button variant='ghost' size='sm' className='h-7 w-7 p-0'>
                    <Settings2 className='h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-64' align='end'>
                  <div className='space-y-3'>
                    <div>
                      <h4 className='font-medium text-sm mb-2'>
                        Filter Categories
                      </h4>
                      <p className='text-xs text-muted-foreground mb-3'>
                        Select which insight types to display
                      </p>
                    </div>

                    <div className='space-y-2'>
                      {allCategories.map(category => (
                        <label
                          key={category}
                          className='flex items-center gap-2 cursor-pointer hover:bg-accent/50 p-1.5 rounded transition-colors'
                        >
                          <input
                            type='checkbox'
                            checked={selectedCategories.has(category)}
                            onChange={() => onCategoryToggle(category)}
                            className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer'
                          />
                          <span className='text-sm flex-1'>
                            {INSIGHT_CATEGORY_LABELS[category]}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className='pt-2 border-t flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1 h-7 text-xs'
                        onClick={() => {
                          allCategories.forEach(cat => {
                            if (!selectedCategories.has(cat)) {
                              onCategoryToggle(cat)
                            }
                          })
                        }}
                      >
                        Select All
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1 h-7 text-xs'
                        onClick={() => {
                          allCategories.forEach(cat => {
                            if (selectedCategories.has(cat)) {
                              onCategoryToggle(cat)
                            }
                          })
                        }}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Collapse Button */}
              <Button
                variant='ghost'
                size='sm'
                className='h-7 w-7 p-0'
                onClick={() => setIsExpanded(false)}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Insights list */}
          <div className='space-y-2'>
            {isLoading ? (
              <>
                <Skeleton className='h-[100px] w-full' />
                <Skeleton className='h-[100px] w-full' />
                <Skeleton className='h-[100px] w-full' />
                <Skeleton className='h-[100px] w-full' />
                <Skeleton className='h-[100px] w-full' />
                <Skeleton className='h-[100px] w-full' />
              </>
            ) : visibleInsights.length > 0 ? (
              visibleInsights.map(insight => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onDismiss={onDismiss}
                />
              ))
            ) : (
              <div className='text-center py-8 text-sm text-muted-foreground'>
                No insights match selected categories
              </div>
            )}
          </div>

          {/* Load More button */}
          {hasMore && (
            <Button
              variant='outline'
              size='sm'
              className='w-full'
              onClick={handleLoadMore}
            >
              <ChevronDown className='h-4 w-4 mr-2' />
              Load More ({insights.length - visibleCount} remaining)
            </Button>
          )}
        </>
      ) : (
        /* Collapsed State */
        <div className='flex flex-col items-center gap-3 pt-3'>
          <Button
            variant='ghost'
            size='sm'
            className='h-9 w-9 p-0'
            onClick={() => setIsExpanded(true)}
            title='Expand Insights'
          >
            <ChevronLeft className='h-5 w-5' />
          </Button>

          <div className='flex flex-col items-center gap-2'>
            <Lightbulb className='h-4 w-4 text-primary' />
            <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center'>
              <span className='text-[10px] font-semibold text-primary'>
                {insights.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
