import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, X } from 'lucide-react'
import { Platform, PLATFORM_LABELS } from '@/types'

interface PlatformFilterProps {
  selectedPlatforms: Platform[]
  onPlatformChange: (platforms: Platform[]) => void
}

export function PlatformFilter({
  selectedPlatforms,
  onPlatformChange,
}: PlatformFilterProps) {
  const allPlatforms = Object.values(Platform)
  const isAllSelected = selectedPlatforms.length === 0

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      onPlatformChange(selectedPlatforms.filter((p) => p !== platform))
    } else {
      onPlatformChange([...selectedPlatforms, platform])
    }
  }

  const clearAll = () => {
    onPlatformChange([])
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Platforms
            {!isAllSelected && (
              <Badge variant="secondary" className="ml-2">
                {selectedPlatforms.length}
              </Badge>
            )}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by Platform</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allPlatforms.map((platform) => (
            <DropdownMenuCheckboxItem
              key={platform}
              checked={
                isAllSelected || selectedPlatforms.includes(platform)
              }
              onCheckedChange={() => togglePlatform(platform)}
            >
              {PLATFORM_LABELS[platform]}
            </DropdownMenuCheckboxItem>
          ))}
          {!isAllSelected && (
            <>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={clearAll}
              >
                <X className="mr-2 h-4 w-4" />
                Clear all
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
