import type { AuthUser } from '../../types'

interface UserAvatarProps {
  user: AuthUser | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }

export default function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
  if (!user) {
    return (
      <div className={`${sizes[size]} rounded-full bg-gray-200 flex items-center justify-center text-gray-400 shrink-0 ${className}`}>
        ?
      </div>
    )
  }

  const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('').toUpperCase()
    || user.email[0].toUpperCase()

  return (
    <div
      className={`${sizes[size]} rounded-full bg-primary flex items-center justify-center font-semibold text-white shrink-0 ${className}`}
      title={`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email}
    >
      {initials}
    </div>
  )
}
