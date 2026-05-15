import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Upload, CheckCircle, Clock, XCircle, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { getMyPayments } from '../../services/payments'
import { getMyInvoices } from '../../services/invoices'
import StatusBadge from '../../components/dashboard/StatusBadge'
import EmptyState from '../../components/dashboard/EmptyState'
import Button from '../../components/Button'
import type { Payment, Invoice } from '../../types'

const STATUS_ICON = {
  pending: Clock,
  'under-review': Eye,
  approved: CheckCircle,
  rejected: XCircle,
}

export default function MyPayments() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [payments, setPayments] = useState<Payment[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !user) return
    Promise.all([
      getMyPayments(token, user.id),
      getMyInvoices(token, user.id),
    ]).then(([pmts, invs]) => {
      setPayments(pmts)
      setInvoices(invs)
      setLoading(false)
    })
  }, [token, user])

  // Invoices that don't have a payment yet
  const unpaidInvoices = invoices.filter(
    (inv) => inv.paymentStatus !== 'paid' &&
      !payments.some((p) => (p.invoice as any)?.id === inv.id || p.invoice === inv.id as any)
  )

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => <div key={n} className="h-24 bg-white border border-gray-100 rounded-sm animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Unpaid invoices — call to action */}
      {unpaidInvoices.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-sm p-5">
          <p className="text-sm font-semibold text-orange-800 mb-3">
            You have {unpaidInvoices.length} unpaid invoice{unpaidInvoices.length !== 1 ? 's' : ''} — upload proof of payment below.
          </p>
          <div className="space-y-2">
            {unpaidInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between gap-4 bg-white border border-orange-100 rounded-sm p-3">
                <div>
                  <span className="font-mono text-xs text-gray-400">{inv.invoiceNumber}</span>
                  <p className="text-sm font-semibold text-charcoal">
                    {inv.currency} {inv.amount?.toFixed(2) ?? '—'}
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/dashboard/payments/upload/${inv.id}`)}
                >
                  <Upload size={13} /> Upload Proof
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment history */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">{payments.length} payment submission{payments.length !== 1 ? 's' : ''}</p>
        </div>

        {payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payment submissions yet"
            description="Upload proof of payment for any outstanding invoices."
          />
        ) : (
          <div className="space-y-3">
            {payments.map((pmt, i) => {
              const Icon = STATUS_ICON[pmt.status] ?? Clock
              const invoice = pmt.invoice as any
              const reg = pmt.registration as any
              return (
                <motion.div
                  key={pmt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-gray-100 rounded-sm p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <StatusBadge status={pmt.status} />
                        <span className="font-mono text-xs text-gray-400">{invoice?.invoiceNumber ?? '—'}</span>
                      </div>
                      <p className="font-semibold text-charcoal">
                        {reg?.conference?.title ?? 'Conference'}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-1">
                        <span className="font-semibold text-charcoal">{pmt.currency} {pmt.amount?.toFixed(2) ?? '—'}</span>
                        <span className="capitalize">{pmt.paymentMethod?.replace('_', ' ')}</span>
                        {pmt.paymentReference && <span>Ref: {pmt.paymentReference}</span>}
                        {pmt.createdAt && <span>{format(new Date(pmt.createdAt), 'dd MMM yyyy')}</span>}
                      </div>
                      {pmt.notes && pmt.status === 'rejected' && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-sm text-xs text-red-600">
                          <span className="font-semibold">Rejection reason: </span>{pmt.notes}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      <Icon size={20} className={
                        pmt.status === 'approved' ? 'text-green-500' :
                        pmt.status === 'rejected' ? 'text-red-500' :
                        pmt.status === 'under-review' ? 'text-blue-500' : 'text-gray-400'
                      } />
                    </div>
                  </div>
                  {pmt.status === 'rejected' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/dashboard/payments/upload/${invoice?.id}`)}
                      >
                        <Upload size={13} /> Re-upload Proof
                      </Button>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
