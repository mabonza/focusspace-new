import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Ticket, FileText, ClipboardList,
  Receipt, Bell, User, LogOut, X, Shield,
  CreditCard, Award, QrCode, BarChart2, UsersRound, Megaphone,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import UserAvatar from './UserAvatar'

interface NavItem {
  label: string
  to: string
  icon: React.ElementType
  roles?: string[]
  dividerBefore?: boolean
}

const navItems: NavItem[] = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'My Conferences', to: '/dashboard/conferences', icon: Calendar },
  { label: 'Registrations', to: '/dashboard/registrations', icon: Ticket },
  { label: 'Payments', to: '/dashboard/payments', icon: CreditCard },
  { label: 'Invoices', to: '/dashboard/invoices', icon: Receipt },
  { label: 'My Abstracts', to: '/dashboard/abstracts', icon: FileText },
  { label: 'My Reviews', to: '/dashboard/reviews', icon: ClipboardList, roles: ['reviewer', 'organizer', 'admin'] },
  { label: 'Certificates', to: '/dashboard/certificates', icon: Award },
  { label: 'Notifications', to: '/dashboard/notifications', icon: Bell },
  { label: 'Profile', to: '/dashboard/profile', icon: User },
  // Admin section
  { label: 'Abstract Admin', to: '/dashboard/admin', icon: Shield, roles: ['organizer', 'admin'], dividerBefore: true },
  { label: 'Payment Admin', to: '/dashboard/admin/payments', icon: CreditCard, roles: ['organizer', 'admin'] },
  { label: 'QR Check-in', to: '/dashboard/admin/checkin', icon: QrCode, roles: ['organizer', 'admin'] },
  { label: 'Analytics', to: '/dashboard/admin/analytics', icon: BarChart2, roles: ['organizer', 'admin'] },
  { label: 'User Management', to: '/dashboard/admin/users', icon: UsersRound, roles: ['admin'] },
  { label: 'Announcements', to: '/dashboard/admin/announcements', icon: Megaphone, roles: ['organizer', 'admin'] },
]

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout, hasRole } = useAuth()

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src="/focus-logo.webp" alt="Focus Space" className="h-8 w-auto object-contain" />
          <p className="text-xs text-gray-400 leading-none">Delegate Portal</p>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems
          .filter((item) => !item.roles || hasRole(item.roles))
          .map(({ label, to, icon: Icon, dividerBefore }) => (
            <div key={to}>
              {dividerBefore && <div className="my-2 border-t border-gray-100" />}
              <NavLink
                to={to}
                end={to === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-charcoal'
                  }`
                }
              >
                <Icon size={17} className="shrink-0" />
                {label}
              </NavLink>
            </div>
          ))}
      </nav>

      {/* User footer */}
      {user && (
        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <UserAvatar user={user} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-charcoal truncate">
                {user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user.email}
              </p>
              <p className="text-xs text-gray-400 capitalize truncate">{user.userRole}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={17} className="shrink-0" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-100 h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-30 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 z-40 lg:hidden"
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
