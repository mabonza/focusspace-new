import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, FileText, Ticket, Receipt, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import DashboardCard from '../../components/dashboard/DashboardCard'
import StatusBadge from '../../components/dashboard/StatusBadge'
import { getMyRegistrations } from '../../services/registrations'
import { getMyAbstracts } from '../../services/abstracts'
import { getMyInvoices } from '../../services/invoices'
import { getUpcomingEvents } from '../../services/strapi'
import type { ConferenceRegistration, Abstract, Invoice, Event } from '../../types'

export default function Overview() {
  const { user, token } = useAuth()
  const [registrations, setRegistrations] = useState<ConferenceRegistration[]>([])
  const [abstracts, setAbstracts] = useState<Abstract[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [upcoming, setUpcoming] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !user) return
    Promise.all([
      getMyRegistrations(token),
      getMyAbstracts(token),
      getMyInvoices(token, user.id),
      getUpcomingEvents(),
    ]).then(([regs, abs, invs, evts]) => {
      setRegistrations(regs)
      setAbstracts(abs)
      setInvoices(invs)
      setUpcoming(evts.slice(0, 3))
      setLoading(false)
    })
  }, [token, user])

  const pendingInvoices = invoices.filter((i) => i.paymentStatus === 'pending').length
  const firstName = user?.firstName || user?.email?.split('@')[0] || 'Delegate'

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-serif font-bold text-charcoal">
          Welcome back, {firstName} 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening on your account.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Registrations" value={loading ? '—' : registrations.length} icon={Ticket} index={0} />
        <DashboardCard title="Abstracts" value={loading ? '—' : abstracts.length} icon={FileText} index={1} />
        <DashboardCard
          title="Pending Invoices"
          value={loading ? '—' : pendingInvoices}
          icon={Receipt}
          index={2}
          iconColor={pendingInvoices > 0 ? 'text-orange-500' : 'text-primary'}
        />
        <DashboardCard title="Upcoming Events" value={loading ? '—' : upcoming.length} icon={Calendar} index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent registrations */}
        <div className="bg-white border border-gray-100 rounded-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal">Recent Registrations</h3>
            <Link to="/dashboard/registrations" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map((n) => <div key={n} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : registrations.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">No registrations yet.</p>
          ) : (
            <div className="space-y-3">
              {registrations.slice(0, 4).map((reg) => (
                <div key={reg.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-charcoal truncate max-w-[180px]">
                      {(reg.conference as any)?.title ?? 'Conference'}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{reg.registrationType}</p>
                  </div>
                  <StatusBadge status={reg.paymentStatus} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent abstracts */}
        <div className="bg-white border border-gray-100 rounded-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal">My Abstracts</h3>
            <Link to="/dashboard/abstracts" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1, 2].map((n) => <div key={n} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : abstracts.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-gray-400 text-sm mb-3">No abstracts submitted yet.</p>
              <Link to="/dashboard/abstracts/new" className="text-xs text-primary font-semibold hover:underline">
                Submit your first abstract →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {abstracts.slice(0, 4).map((ab) => (
                <div key={ab.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <p className="text-sm font-medium text-charcoal truncate max-w-[180px]">{ab.title}</p>
                  <StatusBadge status={ab.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-sm p-5">
          <h3 className="font-semibold text-charcoal mb-4">Upcoming Events</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {upcoming.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="border border-gray-100 rounded-sm p-4 hover:border-primary/30 transition-colors"
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary-50 px-2 py-0.5 rounded-sm">
                  {ev.type}
                </span>
                <p className="text-sm font-semibold text-charcoal mt-2 line-clamp-2">{ev.title}</p>
                <p className="text-xs text-gray-400 mt-1">{ev.location}</p>
                <Link to={`/conferences/${ev.slug}`} className="text-xs text-primary hover:underline mt-2 inline-block">
                  View details →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
