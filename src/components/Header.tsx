import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { User } from '@/types'

interface HeaderProps {
  user: User
  isFallbackMode?: boolean
}

export function Header ({ user, isFallbackMode = false }: HeaderProps) {
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-14 items-center justify-between px-4'>
        {/* Left: Logo/App Name */}
        <div className='flex items-center gap-2'>
          <h1 className='text-xl font-bold'>Solos</h1>
          {isFallbackMode && (
            <Badge variant='outline' className='text-xs'>
              Offline Mode
            </Badge>
          )}
        </div>

        {/* Right: User Section */}
        <div className='flex items-center gap-2'>
          <span className='hidden sm:inline-block text-sm font-medium'>
            {user.name}
          </span>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatar.png' alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
