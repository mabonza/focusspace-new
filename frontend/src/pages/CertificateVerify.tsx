import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Award, ArrowLeft } from 'lucide-react'
import { verifyCertificate } from '../services/certificates'
import type { CertificateVerification } from '../types'

export default function CertificateVerify() {
  const { code } = useParams<{ code: string }>()
  const [result, setResult] = useState<CertificateVerification | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!code) return
    verifyCertificate(code).then((data) => {
      if (!data) setNotFound(true)
      else setResult(data)
      setLoading(false)
    })
  }, [code])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-charcoal mb-6">
            <ArrowLeft size={14} /> Back to Focus Space
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-white font-serif font-bold">F</span>
            </div>
            <span className="font-serif font-bold text-charcoal text-lg">Certificate Verification</span>
          </div>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-100 rounded-sm p-8 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Verifying certificate…</p>
          </div>
        ) : notFound ? (
          <div className="bg-white border border-red-200 rounded-sm p-8 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={28} className="text-red-500" />
            </div>
            <h2 className="text-lg font-serif font-bold text-charcoal mb-2">Invalid Certificate</h2>
            <p className="text-gray-500 text-sm">
              This verification code does not match any issued certificate. It may be invalid or the certificate may have been revoked.
            </p>
            <p className="text-xs text-gray-400 mt-4 font-mono break-all">Code: {code}</p>
          </div>
        ) : result ? (
          <div className="bg-white border border-green-200 rounded-sm overflow-hidden">
            {/* Header */}
            <div className="bg-green-50 border-b border-green-100 p-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={22} className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-800">Certificate Verified</p>
                <p className="text-xs text-green-600">This certificate is authentic</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                  <Award size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Certificate Type</p>
                  <p className="font-semibold text-charcoal capitalize">{result.certificateType}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">Certificate ID</span>
                  <span className="font-mono font-semibold text-charcoal text-xs">{result.certificateId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">Holder</span>
                  <span className="font-semibold text-charcoal">
                    {result.holder.firstName} {result.holder.lastName}
                  </span>
                </div>
                {result.holder.email && (
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-400">Email</span>
                    <span className="text-charcoal">{result.holder.email}</span>
                  </div>
                )}
                {result.conference?.title && (
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-400">Conference</span>
                    <span className="text-charcoal text-right max-w-[200px]">{result.conference.title}</span>
                  </div>
                )}
                {result.conference?.location && (
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-400">Location</span>
                    <span className="text-charcoal">{result.conference.location}</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Issue Date</span>
                  <span className="text-charcoal">{result.issuedDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 text-xs text-gray-400 text-center">
              Verified by Focus Space Certificate Authority
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
