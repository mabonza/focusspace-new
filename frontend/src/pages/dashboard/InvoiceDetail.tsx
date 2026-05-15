import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '../../contexts/AuthContext'
import { getInvoiceById } from '../../services/invoices'
import StatusBadge from '../../components/dashboard/StatusBadge'
import Button from '../../components/Button'
import type { Invoice } from '../../types'

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    getInvoiceById(token, Number(id)).then((data) => { setInvoice(data); setLoading(false) })
  }, [id, token])

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Invoice not found.</p>
        <button onClick={() => navigate('/dashboard/invoices')} className="text-primary text-sm hover:underline mt-2">
          Back to invoices
        </button>
      </div>
    )
  }

  const reg = invoice.registration as any
  const conf = reg?.conference as any

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/dashboard/invoices')}
          className="p-2 text-gray-400 hover:text-charcoal rounded-sm hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-lg font-serif font-bold text-charcoal">Invoice</h2>
      </div>

      <div className="bg-white border border-gray-100 rounded-sm p-8 print:shadow-none" id="invoice-print">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
          <div>
            <p className="text-xl font-serif font-bold text-charcoal">Focus Space</p>
            <p className="text-xs text-gray-400 mt-1">Conference Management Platform</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Invoice</p>
            <p className="font-mono text-sm text-charcoal font-bold mt-1">{invoice.invoiceNumber}</p>
            <StatusBadge status={invoice.paymentStatus} />
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Bill To</p>
            <p className="text-sm text-charcoal">{reg?.conference?.title ? conf?.title : 'Delegate'}</p>
          </div>
          <div className="text-right">
            {invoice.issuedDate && (
              <div>
                <p className="text-xs text-gray-400">Issue Date</p>
                <p className="text-sm text-charcoal">{format(new Date(invoice.issuedDate), 'dd MMMM yyyy')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Line items */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-left pb-2">Description</th>
              <th className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-right pb-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50">
              <td className="py-3 text-sm text-charcoal">
                {conf?.title ?? 'Conference'} — {reg?.ticketCategory ?? 'Standard'} ticket
                {reg?.registrationType && <span className="text-gray-400 ml-1 capitalize">({reg.registrationType})</span>}
              </td>
              <td className="py-3 text-sm text-charcoal text-right font-semibold">
                {invoice.currency} {invoice.amount?.toFixed(2) ?? '0.00'}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="pt-4 text-sm font-bold text-charcoal">Total</td>
              <td className="pt-4 text-sm font-bold text-charcoal text-right">
                {invoice.currency} {invoice.amount?.toFixed(2) ?? '0.00'}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="border-t border-gray-100 pt-4 text-xs text-gray-400 text-center">
          Thank you for registering with Focus Space.
        </div>
      </div>

      <div className="mt-4 flex gap-3 print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer size={15} /> Print / Download
        </Button>
      </div>
    </div>
  )
}
