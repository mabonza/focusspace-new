import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, AlertCircle, Building2, CreditCard, Info } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getConferences } from '../../services/strapi'
import { createRegistration, checkRegistration, CONFERENCE_FEE, PRECONFERENCE_FEE } from '../../services/registrations'
import type { Conference } from '../../types'

// EFT banking details — update these with real bank account info
const EFT_DETAILS = {
  bankName: 'Standard Bank',
  accountName: 'Focus Space Events (Pty) Ltd',
  accountNumber: '123 456 789',
  branchCode: '051 001',
  accountType: 'Current Account',
}

const TITLES = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Rev', 'Other']

function FeeBox({
  preconference,
  conferenceFee,
  preconferenceFee,
}: {
  preconference: boolean
  conferenceFee: number
  preconferenceFee: number
}) {
  const total = conferenceFee + (preconference ? preconferenceFee : 0)
  return (
    <div className="border border-primary/30 bg-primary/5 rounded-sm p-4 text-sm space-y-1">
      <div className="flex justify-between">
        <span className="text-primary font-semibold">Conference Fee:</span>
        <span className="font-semibold text-primary">R{conferenceFee.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-primary font-semibold">Preconference Fee:</span>
        <span className="font-semibold text-primary">
          R{(preconference ? preconferenceFee : 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-primary font-semibold">Discount:</span>
        <span className="font-semibold text-primary">None</span>
      </div>
      <div className="pt-1 border-t border-primary/20 flex justify-between">
        <span className="text-primary font-bold">Total Payable:</span>
        <span className="font-bold text-primary">R{total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  )
}

export default function ConferenceRegistrationPage() {
  const { conferenceId } = useParams<{ conferenceId: string }>()
  const navigate = useNavigate()
  const { user, token } = useAuth()

  const [conference, setConference] = useState<Conference | null>(null)
  const [loading, setLoading] = useState(true)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<{ invoiceNumber: string; total: number } | null>(null)
  const [error, setError] = useState('')

  // Form fields
  const [titlePrefix, setTitlePrefix] = useState('')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [institution, setInstitution] = useState((user as any)?.institution ?? '')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [stateProvince, setStateProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState((user as any)?.country ?? '')
  const [vatNumber, setVatNumber] = useState('')
  const [preconference, setPreconference] = useState(false)
  const [abstractSub, setAbstractSub] = useState(false)
  const [acceptPolicy, setAcceptPolicy] = useState(false)

  useEffect(() => {
    if (!token || !conferenceId) return
    Promise.all([
      getConferences(),
      checkRegistration(token, Number(conferenceId)),
    ]).then(([confs, existing]) => {
      const conf = confs.find((c) => c.id === Number(conferenceId))
      setConference(conf ?? null)
      if (existing) setAlreadyRegistered(true)
      setLoading(false)
    })
  }, [token, conferenceId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !conferenceId || !acceptPolicy) return
    setSubmitting(true)
    setError('')
    try {
      const reg = await createRegistration(token, {
        conference: Number(conferenceId),
        titlePrefix,
        phone,
        institution,
        billingAddress1: address1,
        billingAddress2: address2,
        city,
        stateProvince,
        postalCode,
        country,
        vatNumber,
        preconferenceAttendance: preconference,
        abstractSubmission: abstractSub,
      })
      const total = CONFERENCE_FEE + (preconference ? PRECONFERENCE_FEE : 0)
      setSuccess({ invoiceNumber: reg.invoiceNumber ?? '', total })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors'
  const labelClass = 'block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1'

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="space-y-4">
          {[1, 2, 3].map((n) => <div key={n} className="h-12 bg-gray-100 rounded-sm animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (!conference) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <p className="text-gray-500">Conference not found.</p>
        <Link to="/dashboard/conferences" className="text-primary text-sm mt-2 inline-block">Back to Conferences</Link>
      </div>
    )
  }

  if (alreadyRegistered) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 text-center">
        <div className="bg-green-50 border border-green-200 rounded-sm p-8">
          <CheckCircle size={40} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-charcoal mb-2">Already Registered</h2>
          <p className="text-gray-500 text-sm mb-6">You are already registered for {conference.title}.</p>
          <Link to="/dashboard/registrations" className="text-sm font-semibold text-primary border border-primary px-4 py-2 rounded-sm hover:bg-primary/5">
            View My Registrations
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white border border-gray-100 rounded-sm p-8 text-center">
          <CheckCircle size={44} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-charcoal mb-1">Registration Successful!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your invoice number is <strong className="text-charcoal">{success.invoiceNumber}</strong>. Please use this as your payment reference.
          </p>

          {/* EFT Details */}
          <div className="bg-primary/5 border border-primary/20 rounded-sm p-5 text-left mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-primary" />
              <h3 className="font-bold text-charcoal text-sm">EFT Payment Details</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Bank</span>
                <span className="font-semibold text-charcoal">{EFT_DETAILS.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Name</span>
                <span className="font-semibold text-charcoal">{EFT_DETAILS.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Number</span>
                <span className="font-semibold text-charcoal">{EFT_DETAILS.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Branch Code</span>
                <span className="font-semibold text-charcoal">{EFT_DETAILS.branchCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Type</span>
                <span className="font-semibold text-charcoal">{EFT_DETAILS.accountType}</span>
              </div>
              <div className="pt-2 border-t border-primary/20 flex justify-between">
                <span className="text-gray-500 font-semibold">Reference</span>
                <span className="font-bold text-primary">{success.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Amount</span>
                <span className="font-bold text-charcoal">R{success.total.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-sm p-3 text-left mb-6">
            <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Please upload your proof of payment in your dashboard under <strong>Payments</strong> once the EFT has been processed. Your registration will be confirmed once payment is verified.
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard/payments')}
              className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-primary/90 transition-colors"
            >
              Upload Proof of Payment
            </button>
            <button
              onClick={() => navigate('/dashboard/registrations')}
              className="border border-gray-200 text-gray-600 text-sm px-5 py-2.5 rounded-sm hover:border-gray-300 transition-colors"
            >
              View Registrations
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white border border-gray-100 rounded-sm p-6 sm:p-8">
        <h1 className="text-xl font-bold text-charcoal mb-6">{conference.title} Registration</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-sm p-3 text-sm text-red-700">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Your Details */}
          <section>
            <h2 className="text-sm font-bold text-charcoal mb-4 pb-2 border-b border-gray-100">Your Details</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Title</label>
                <select value={titlePrefix} onChange={(e) => setTitlePrefix(e.target.value)} className={inputClass}>
                  <option value="">Select title…</option>
                  {TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input value={user?.firstName ?? ''} readOnly className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input value={user?.lastName ?? ''} readOnly className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input value={user?.email ?? ''} readOnly className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} />
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+27 xx xxx xxxx"
                  className={inputClass}
                />
              </div>

              <Link
                to="/dashboard/profile"
                className="inline-block text-xs font-semibold uppercase tracking-widest border border-primary text-primary px-4 py-2 rounded-sm hover:bg-primary/5 transition-colors"
              >
                Edit My Details
              </Link>
            </div>
          </section>

          {/* Institution & Billing */}
          <section>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <Building2 size={14} className="text-gray-400" />
              <h2 className="text-sm font-bold text-charcoal">Institution &amp; Billing</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Institution</label>
                <input
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Enter your Institution"
                  className={inputClass}
                />
              </div>

              <div className="space-y-3">
                <label className={labelClass}>Billing Address</label>
                <input value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="Address Line 1" className={inputClass} />
                <input value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Address Line 2, optional" className={inputClass} />
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={inputClass} />
                <input value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} placeholder="State or Province" className={inputClass} />
                <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal Code" className={inputClass} />
                <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>VAT Number</label>
                <input
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  placeholder="Enter VAT Number"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Fee Summary */}
          <FeeBox preconference={preconference} conferenceFee={CONFERENCE_FEE} preconferenceFee={PRECONFERENCE_FEE} />

          {/* Preconference Attendance */}
          <section>
            <h2 className="text-sm font-bold text-charcoal mb-3">Preconference Attendance</h2>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={preconference} onChange={() => setPreconference(true)} className="accent-primary" />
                <span className="text-sm font-semibold uppercase tracking-widest">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!preconference} onChange={() => setPreconference(false)} className="accent-primary" />
                <span className="text-sm font-semibold uppercase tracking-widest">No</span>
              </label>
            </div>
          </section>

          {/* Abstract Submission */}
          <section>
            <h2 className="text-sm font-bold text-charcoal mb-3">Abstract Submission</h2>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={abstractSub} onChange={() => setAbstractSub(true)} className="accent-primary" />
                <span className="text-sm font-semibold uppercase tracking-widest">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={!abstractSub} onChange={() => setAbstractSub(false)} className="accent-primary" />
                <span className="text-sm font-semibold uppercase tracking-widest">No</span>
              </label>
            </div>
          </section>

          {/* Cancellation Policy */}
          <div className="border border-gray-200 rounded-sm p-4 text-xs text-gray-600">
            <p className="font-bold uppercase text-primary mb-2">Cancellation Policy</p>
            <p>
              All cancellation requests must be submitted in writing to the Conference Secretariat at{' '}
              <a href="mailto:focusconference@mut.ac.za" className="text-primary underline">focusconference@mut.ac.za</a>.
              A 25 percent admin fee will apply for cancellations received before 1 August 2026.
              Cancellations received after 1 August 2026 will incur a 50 percent fee.
              No refunds will be issued after 5 August 2026 or for non attendance.
            </p>
          </div>

          {/* Accept policy */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptPolicy}
              onChange={(e) => setAcceptPolicy(e.target.checked)}
              className="mt-0.5 accent-primary"
            />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600">I Accept the Cancellation Policy</span>
          </label>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={submitting || !acceptPolicy}
              className="w-full bg-charcoal text-white text-sm font-bold uppercase tracking-widest py-3 rounded-sm hover:bg-charcoal/90 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Registering…' : 'Register for the Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
