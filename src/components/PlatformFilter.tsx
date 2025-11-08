import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Filter } from 'lucide-react'
import { Platform, PLATFORM_LABELS, PLATFORM_COLORS } from '@/types'

interface PlatformFilterProps {
  selectedPlatforms: Platform[]
  onPlatformChange: (platforms: Platform[]) => void
}

export function PlatformFilter ({
  selectedPlatforms,
  onPlatformChange
}: PlatformFilterProps) {
  const allPlatforms = Object.values(Platform)
  const isAllSelected = selectedPlatforms.length === 0

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      onPlatformChange(selectedPlatforms.filter(p => p !== platform))
    } else {
      onPlatformChange([...selectedPlatforms, platform])
    }
  }

  const selectAll = () => {
    onPlatformChange([])
  }

  const isPlatformSelected = (platform: Platform) => {
    return isAllSelected || selectedPlatforms.includes(platform)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='gap-1.5 h-8 hover:bg-accent transition-colors'
        >
          <Filter className='h-3.5 w-3.5' />
          <span className='text-sm'>Platforms</span>
          {!isAllSelected && (
            <Badge
              variant='secondary'
              className='ml-0.5 px-1 py-0 h-4 text-[10px] font-semibold'
            >
              {selectedPlatforms.length}
            </Badge>
          )}
          <ChevronDown className='h-3.5 w-3.5 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-auto p-3'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between mb-1'>
            <span className='text-xs font-medium text-muted-foreground'>Select platforms</span>
            {!isAllSelected && (
              <button
                onClick={selectAll}
                className='text-[10px] text-muted-foreground hover:text-foreground transition-colors'
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className='flex flex-wrap gap-1.5'>
            {allPlatforms.map(platform => (
              <Badge
                key={platform}
                variant={isPlatformSelected(platform) ? 'default' : 'outline'}
                className='cursor-pointer gap-1.5 px-2 py-1 transition-all hover:scale-105'
                style={
                  isPlatformSelected(platform)
                    ? {
                        backgroundColor: PLATFORM_COLORS[platform],
                        borderColor: PLATFORM_COLORS[platform],
                        color: 'white'
                      }
                    : {
                        borderColor: PLATFORM_COLORS[platform],
                        color: PLATFORM_COLORS[platform]
                      }
                }
                onClick={() => togglePlatform(platform)}
              >
                <div
                  className='w-1.5 h-1.5 rounded-full'
                  style={{ backgroundColor: isPlatformSelected(platform) ? 'white' : PLATFORM_COLORS[platform] }}
                />
                <span className='text-xs font-medium'>{PLATFORM_LABELS[platform]}</span>
              </Badge>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
