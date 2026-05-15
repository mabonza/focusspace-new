import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Receipt, Download } from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { getMyInvoices } from '../../services/invoices'
import StatusBadge from '../../components/dashboard/StatusBadge'
import EmptyState from '../../components/dashboard/EmptyState'
import type { Invoice } from '../../types'

export default function MyInvoices() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !user) return
    getMyInvoices(token, user.id).then((data) => { setInvoices(data); setLoading(false) })
  }, [token, user])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => <div key={n} className="h-20 bg-white border border-gray-100 rounded-sm animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>

      {invoices.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No invoices yet"
          description="Invoices will appear here after conference registration."
          action={{ label: 'Browse Conferences', to: '/dashboard/conferences' }}
        />
      ) : (
        <div className="space-y-3">
          {invoices.map((inv, i) => {
            const reg = inv.registration as any
            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-sm p-5 hover:border-primary/20 transition-colors cursor-pointer"
                onClick={() => navigate(`/dashboard/invoices/${inv.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-gray-400">{inv.invoiceNumber}</span>
                      <StatusBadge status={inv.paymentStatus} />
                    </div>
                    <h3 className="font-semibold text-charcoal leading-snug">
                      {reg?.conference?.title ?? 'Conference Registration'}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                      {inv.amount != null && (
                        <span className="font-semibold text-charcoal">
                          {inv.currency} {inv.amount.toFixed(2)}
                        </span>
                      )}
                      {inv.issuedDate && (
                        <span>Issued: {format(new Date(inv.issuedDate), 'dd MMM yyyy')}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/invoices/${inv.id}`) }}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary-50 rounded-sm transition-colors shrink-0"
                    title="View / Download"
                  >
                    <Download size={15} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
