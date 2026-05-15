import { Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import UserAvatar from './UserAvatar'
import NotificationBell from './NotificationBell'

interface TopbarProps {
  title: string
  onMenuClick: () => void
}

export default function Topbar({ title, onMenuClick }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="h-14 bg-white border-b border-gray-100 px-4 flex items-center justify-between shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 text-gray-500 hover:text-charcoal hover:bg-gray-100 rounded-sm"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-charcoal">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
        {user && (
          <Link to="/dashboard/profile" className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1.5 rounded-sm transition-colors">
            <UserAvatar user={user} size="sm" />
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user.email}
            </span>
          </Link>
        )}
      </div>
    </header>
  )
}
