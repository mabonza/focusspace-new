import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Eye, Download } from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { getAllPayments, verifyPayment, rejectPayment } from '../../services/payments'
import StatusBadge from '../../components/dashboard/StatusBadge'
import SearchFilter from '../../components/SearchFilter'
import Pagination from '../../components/Pagination'
import { toast } from '../../components/Toast'
import type { Payment, PaymentStatus } from '../../types'

const PAGE_SIZE = 15

const STATUS_FILTERS: (PaymentStatus | 'all')[] = ['all', 'pending', 'under-review', 'approved', 'rejected']

export default function AdminPayments() {
  const { token } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<PaymentStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [rejectId, setRejectId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [processing, setProcessing] = useState<number | null>(null)

  const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

  useEffect(() => {
    if (!token) return
    getAllPayments(token).then((data) => { setPayments(data); setLoading(false) })
  }, [token])

  const handleVerify = async (id: number) => {
    if (!token) return
    setProcessing(id)
    try {
      await verifyPayment(token, id)
      setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: 'approved' } : p))
      toast.success('Payment approved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to approve')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async () => {
    if (!token || rejectId === null) return
    setProcessing(rejectId)
    try {
      await rejectPayment(token, rejectId, rejectReason || 'Payment proof could not be verified.')
      setPayments((prev) => prev.map((p) => p.id === rejectId ? { ...p, status: 'rejected', notes: rejectReason } : p))
      toast.success('Payment rejected')
      setRejectId(null)
      setRejectReason('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject')
    } finally {
      setProcessing(null)
    }
  }

  const filtered = payments.filter((p) => {
    const matchStatus = filter === 'all' || p.status === filter
    const q = search.toLowerCase()
    const inv = (p.invoice as any)
    const user = (p.user as any)
    const matchSearch = !q || (
      inv?.invoiceNumber?.toLowerCase().includes(q) ||
      user?.email?.toLowerCase().includes(q) ||
      user?.firstName?.toLowerCase().includes(q) ||
      p.paymentReference?.toLowerCase().includes(q)
    )
    return matchStatus && matchSearch
  })

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((n) => <div key={n} className="h-16 bg-white border border-gray-100 rounded-sm animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchFilter value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search by invoice, user, reference…" className="flex-1" />
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setPage(1) }}
              className={`text-xs px-3 py-1.5 rounded-sm font-semibold capitalize transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-primary/30'}`}
            >
              {s === 'all' ? `All (${payments.length})` : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Invoice', 'Delegate', 'Amount', 'Method', 'Reference', 'Date', 'Status', 'Proof', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400 text-sm">No payments found.</td></tr>
              ) : (
                paginated.map((p, i) => {
                  const inv = p.invoice as any
                  const user = p.user as any
                  const proof = p.paymentProof as any
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-mono text-xs">{inv?.invoiceNumber ?? '—'}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-charcoal text-xs">{user?.firstName ? `${user.firstName} ${user.lastName ?? ''}` : user?.email}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold">{p.currency} {p.amount?.toFixed(2) ?? '—'}</td>
                      <td className="px-4 py-3 capitalize text-gray-500">{p.paymentMethod?.replace('_', ' ')}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.paymentReference || '—'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.createdAt ? format(new Date(p.createdAt), 'dd MMM yyyy') : '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3">
                        {proof?.url ? (
                          <a href={`${API_URL}${proof.url}`} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                            <Download size={12} /> View
                          </a>
                        ) : <span className="text-gray-400 text-xs">None</span>}
                      </td>
                      <td className="px-4 py-3">
                        {(p.status === 'pending' || p.status === 'under-review') && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleVerify(p.id)}
                              disabled={processing === p.id}
                              className="p-1.5 text-green-500 hover:bg-green-50 rounded-sm disabled:opacity-50 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle size={15} />
                            </button>
                            <button
                              onClick={() => setRejectId(p.id)}
                              disabled={processing === p.id}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-sm disabled:opacity-50 transition-colors"
                              title="Reject"
                            >
                              <XCircle size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4">
          <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
        </div>
      </div>

      {/* Reject modal */}
      {rejectId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/60" onClick={() => setRejectId(null)} />
          <div className="relative bg-white rounded-sm p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-serif font-bold text-charcoal mb-4">Reject Payment</h3>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Reason</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-primary resize-none"
              placeholder="Explain why the proof was rejected…"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReject}
                disabled={!!processing}
                className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {processing ? 'Rejecting…' : 'Reject Payment'}
              </button>
              <button onClick={() => setRejectId(null)} className="px-4 py-2 border border-gray-200 text-sm rounded-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
