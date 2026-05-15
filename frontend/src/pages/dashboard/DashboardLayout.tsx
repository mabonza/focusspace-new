import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../../components/dashboard/Sidebar'
import Topbar from '../../components/dashboard/Topbar'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/conferences': 'My Conferences',
  '/dashboard/registrations': 'My Registrations',
  '/dashboard/abstracts': 'My Abstracts',
  '/dashboard/abstracts/new': 'Submit Abstract',
  '/dashboard/reviews': 'My Reviews',
  '/dashboard/invoices': 'My Invoices',
  '/dashboard/payments': 'My Payments',
  '/dashboard/payments/upload': 'Upload Payment Proof',
  '/dashboard/certificates': 'My Certificates',
  '/dashboard/profile': 'Profile Settings',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/admin': 'Abstract Admin',
  '/dashboard/admin/payments': 'Payment Management',
  '/dashboard/admin/checkin': 'QR Check-in',
  '/dashboard/admin/analytics': 'Analytics Dashboard',
  '/dashboard/admin/users': 'User Management',
  '/dashboard/admin/announcements': 'Send Announcement',
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const title =
    Object.entries(pageTitles).find(([path]) =>
      path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(path)
    )?.[1] ?? 'Dashboard'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
