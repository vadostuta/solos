import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@/types'

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left: Logo/App Name */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Solos</h1>
        </div>

        {/* Right: User Section */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-sm font-medium">
            {user.name}
          </span>
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
