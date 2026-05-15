import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Ticket } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getMyRegistrations } from '../../services/registrations'
import StatusBadge from '../../components/dashboard/StatusBadge'
import EmptyState from '../../components/dashboard/EmptyState'
import type { ConferenceRegistration } from '../../types'

export default function MyRegistrations() {
  const { user, token } = useAuth()
  const [registrations, setRegistrations] = useState<ConferenceRegistration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !user) return
    getMyRegistrations(token).then((data) => { setRegistrations(data); setLoading(false) })
  }, [token, user])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => <div key={n} className="h-20 bg-white border border-gray-100 rounded-sm animate-pulse" />)}
      </div>
    )
  }

  if (registrations.length === 0) {
    return (
      <EmptyState
        icon={Ticket}
        title="No registrations yet"
        description="Register for a conference to see it here."
        action={{ label: 'Browse Conferences', to: '/dashboard/conferences' }}
      />
    )
  }

  return (
    <div className="space-y-4">
      {registrations.map((reg) => (
        <div key={reg.id} className="bg-white border border-gray-100 rounded-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-charcoal mb-1">
                {(reg.conference as any)?.title ?? 'Conference'}
              </h3>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                <span className="capitalize">Type: <strong className="text-charcoal">{reg.registrationType}</strong></span>
                <span className="capitalize">Ticket: <strong className="text-charcoal">{reg.ticketCategory}</strong></span>
                {reg.createdAt && (
                  <span>Registered: <strong className="text-charcoal">{format(new Date(reg.createdAt), 'dd MMM yyyy')}</strong></span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={reg.paymentStatus} />
                <StatusBadge status={reg.attendanceStatus} />
              </div>
            </div>
            <div className="shrink-0 text-right">
              {reg.invoiceNumber && (
                <p className="text-xs text-gray-400 font-mono mb-2">{reg.invoiceNumber}</p>
              )}
              {reg.qrCode && (
                <div className="w-16 h-16 bg-gray-100 rounded-sm flex items-center justify-center text-xs text-gray-400">
                  QR
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
