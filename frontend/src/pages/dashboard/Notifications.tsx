import { useEffect, useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { getMyNotifications, markAsRead, markAllAsRead } from '../../services/notifications'
import EmptyState from '../../components/dashboard/EmptyState'
import Button from '../../components/Button'
import type { Notification } from '../../types'

const TYPE_STYLES: Record<string, string> = {
  registration: 'bg-blue-50 text-blue-700',
  abstract: 'bg-purple-50 text-purple-700',
  review: 'bg-orange-50 text-orange-700',
  payment: 'bg-green-50 text-green-700',
  system: 'bg-gray-100 text-gray-600',
}

export default function Notifications() {
  const { user, token } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !user) return
    getMyNotifications(token, user.id).then((data) => { setNotifications(data); setLoading(false) })
  }, [token, user])

  const handleMarkRead = async (n: Notification) => {
    if (!token || n.readStatus) return
    await markAsRead(token, n.id)
    setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, readStatus: true } : x))
  }

  const handleMarkAll = async () => {
    if (!token || !user) return
    await markAllAsRead(token, user.id)
    setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })))
  }

  const unreadCount = notifications.filter((n) => !n.readStatus).length

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => <div key={n} className="h-16 bg-white border border-gray-100 rounded-sm animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          {unreadCount > 0 && <span className="ml-2 font-semibold text-primary">({unreadCount} unread)</span>}
        </p>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAll}>
            <CheckCheck size={14} /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! Notifications about your activity will appear here."
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleMarkRead(n)}
                className={`bg-white border rounded-sm p-4 cursor-pointer transition-colors hover:border-primary/20 ${
                  n.readStatus ? 'border-gray-100' : 'border-primary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {!n.readStatus && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                  )}
                  {n.readStatus && <div className="w-2 h-2 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_STYLES[n.type] ?? TYPE_STYLES.system}`}>
                        {n.type}
                      </span>
                      {n.createdAt && (
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-medium ${n.readStatus ? 'text-gray-500' : 'text-charcoal'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
