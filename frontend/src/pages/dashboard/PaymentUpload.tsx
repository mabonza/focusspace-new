import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, Upload, ArrowLeft, FileCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getInvoiceById } from '../../services/invoices'
import { submitPaymentProof } from '../../services/payments'
import { toast } from '../../components/Toast'
import Button from '../../components/Button'
import type { Invoice } from '../../types'

const schema = z.object({
  paymentMethod: z.enum(['eft', 'bank_transfer', 'card', 'mobile_money'], {
    message: 'Select a payment method',
  }),
  paymentReference: z.string().optional(),
})
type FormInput = z.infer<typeof schema>

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function PaymentUpload() {
  const { invoiceId } = useParams<{ invoiceId: string }>()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [serverError, setServerError] = useState('')

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-primary transition-colors ${hasError ? 'border-red-400' : 'border-gray-200'}`

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!token) return
    getInvoiceById(token, Number(invoiceId)).then((inv) => { setInvoice(inv); setLoading(false) })
  }, [invoiceId, token])

  const onSubmit = async (data: FormInput) => {
    if (!token || !user || !invoice) return
    setServerError('')
    try {
      await submitPaymentProof(token, {
        invoiceId: invoice.id,
        registrationId: (invoice.registration as any)?.id,
        userId: user.id,
        amount: invoice.amount ?? 0,
        currency: invoice.currency,
        paymentMethod: data.paymentMethod,
        paymentReference: data.paymentReference,
        proofFile: proofFile ?? undefined,
      })
      toast.success('Payment proof submitted for review.')
      navigate('/dashboard/payments')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Submission failed.')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Invoice not found.</p>
        <button onClick={() => navigate('/dashboard/payments')} className="text-primary text-sm hover:underline mt-2">Back</button>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard/payments')} className="p-2 text-gray-400 hover:text-charcoal rounded-sm hover:bg-gray-100 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-lg font-serif font-bold text-charcoal">Upload Payment Proof</h2>
      </div>

      {/* Invoice summary */}
      <div className="bg-gray-50 border border-gray-100 rounded-sm p-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Invoice</span>
          <span className="font-mono font-semibold text-charcoal">{invoice.invoiceNumber}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-500">Amount Due</span>
          <span className="font-bold text-charcoal">{invoice.currency} {invoice.amount?.toFixed(2) ?? '0.00'}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-5">
        {serverError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-sm p-3 text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {serverError}
          </div>
        )}

        <Field label="Payment Method" required error={errors.paymentMethod?.message}>
          <select {...register('paymentMethod')} className={inputClass(!!errors.paymentMethod)}>
            <option value="">Select method…</option>
            <option value="eft">EFT / Bank Transfer</option>
            <option value="bank_transfer">Direct Bank Deposit</option>
            <option value="card">Card Payment</option>
            <option value="mobile_money">Mobile Money</option>
          </select>
        </Field>

        <Field label="Payment Reference / Transaction ID">
          <input
            {...register('paymentReference')}
            className={inputClass(false)}
            placeholder="e.g. TXN12345678"
          />
        </Field>

        <Field label="Proof of Payment" required>
          <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-sm p-6 cursor-pointer transition-colors ${proofFile ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-primary/40'}`}>
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
            />
            {proofFile ? (
              <div className="flex items-center gap-2 text-primary">
                <FileCheck size={18} />
                <span className="text-sm font-medium">{proofFile.name}</span>
              </div>
            ) : (
              <>
                <Upload size={24} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, or PDF — max 5MB</p>
              </>
            )}
          </label>
        </Field>

        <div className="bg-blue-50 border border-blue-100 rounded-sm p-4 text-xs text-blue-700">
          <strong>Bank Details:</strong> First National Bank · Account: 62234567890 · Branch: 250655 · Reference: {invoice.invoiceNumber}
        </div>

        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <Button type="button" variant="primary" disabled={isSubmitting || !proofFile} onClick={handleSubmit(onSubmit)}>
            <Upload size={15} /> {isSubmitting ? 'Submitting…' : 'Submit Proof'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/payments')}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}
