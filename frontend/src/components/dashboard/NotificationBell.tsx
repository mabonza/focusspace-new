import { useState, useEffect, useRef } from 'react'
import { Bell, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { useAuth } from '../../contexts/AuthContext'
import { getMyNotifications, markAllAsRead } from '../../services/notifications'
import type { Notification } from '../../types'

export default function NotificationBell() {
  const { user, token } = useAuth()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!token || !user) return
    const load = () => getMyNotifications(token, user.id).then(setNotifications)
    load()
    const interval = setInterval(load, 60_000)
    return () => clearInterval(interval)
  }, [token, user])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const unread = notifications.filter((n) => !n.readStatus).length

  const handleMarkAll = async () => {
    if (!token || !user) return
    await markAllAsRead(token, user.id)
    setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })))
  }

  const typeIcon: Record<string, string> = {
    registration: '🎫', abstract: '📄', review: '⭐', payment: '💳', system: '🔔',
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-sm transition-colors"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-sm shadow-lg z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-charcoal text-sm">Notifications</h3>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button onClick={handleMarkAll} className="text-xs text-primary hover:underline">
                    Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">No notifications</div>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!n.readStatus ? 'bg-primary-50/30' : ''}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base shrink-0 mt-0.5">{typeIcon[n.type] ?? '🔔'}</span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm leading-snug ${!n.readStatus ? 'font-semibold text-charcoal' : 'text-gray-700'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                        {n.createdAt && (
                          <p className="text-xs text-gray-400 mt-1">
                            {format(new Date(n.createdAt), 'dd MMM, HH:mm')}
                          </p>
                        )}
                      </div>
                      {!n.readStatus && <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
