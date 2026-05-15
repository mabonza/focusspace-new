import { useEffect, useState } from 'react'
import { Award, Download, QrCode } from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { useAuth } from '../../contexts/AuthContext'
import { getMyCertificates } from '../../services/certificates'
import EmptyState from '../../components/dashboard/EmptyState'
import type { Certificate } from '../../types'

const TYPE_STYLES: Record<string, string> = {
  attendee: 'bg-blue-50 text-blue-700',
  speaker: 'bg-purple-50 text-purple-700',
  presenter: 'bg-orange-50 text-orange-700',
  reviewer: 'bg-green-50 text-green-700',
  organizer: 'bg-red-50 text-red-700',
}

export default function MyCertificates() {
  const { user, token } = useAuth()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [qrImages, setQrImages] = useState<Record<number, string>>({})

  useEffect(() => {
    if (!token || !user) return
    getMyCertificates(token, user.id).then((data) => {
      setCertificates(data)
      setLoading(false)
      // Pre-generate QR codes
      data.forEach(async (cert) => {
        if (cert.verificationCode) {
          const url = `${window.location.origin}/verify/${cert.verificationCode}`
          try {
            const dataUrl = await QRCode.toDataURL(url, { width: 120, margin: 1 })
            setQrImages((prev) => ({ ...prev, [cert.id]: dataUrl }))
          } catch { /* ignore */ }
        }
      })
    })
  }, [token, user])

  const handlePrint = (cert: Certificate) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    const conf = cert.conference as any
    const qr = qrImages[cert.id] ?? ''
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate — ${cert.certificateId}</title>
        <style>
          body { margin: 0; font-family: Georgia, serif; }
          .cert { width: 842px; height: 595px; border: 8px solid #7c2d49; margin: auto; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; box-sizing: border-box; }
          .cert-inner { border: 2px solid #d4af37; width: 100%; height: 100%; position: absolute; top: 12px; left: 12px; pointer-events: none; }
          h1 { color: #7c2d49; font-size: 42px; margin: 0 0 8px 0; }
          .subtitle { font-size: 14px; text-transform: uppercase; letter-spacing: 4px; color: #6b7280; margin-bottom: 32px; }
          .name { font-size: 36px; color: #1a1a2e; font-style: italic; margin: 16px 0; border-bottom: 2px solid #d4af37; padding-bottom: 12px; }
          .type { font-size: 18px; color: #374151; margin-bottom: 8px; }
          .conf { font-size: 14px; color: #6b7280; }
          .meta { margin-top: 32px; display: flex; gap: 60px; font-size: 11px; color: #9ca3af; align-items: flex-end; }
          .qr { width: 80px; height: 80px; }
          .id { font-family: monospace; font-size: 10px; }
        </style>
      </head>
      <body>
        <div class="cert">
          <div class="cert-inner"></div>
          <h1>Focus Space</h1>
          <div class="subtitle">Certificate of ${cert.certificateType}</div>
          <p style="font-size:13px;color:#6b7280;margin:0 0 4px 0">This is to certify that</p>
          <div class="name">${user?.firstName ?? ''} ${user?.lastName ?? ''}</div>
          <div class="type">has participated as a <strong>${cert.certificateType}</strong></div>
          <div class="conf">at ${conf?.title ?? 'Focus Space Conference'}${conf?.year ? ` (${conf.year})` : ''}</div>
          <div class="meta">
            <div>
              <div>Issued: ${cert.issuedDate ? format(new Date(cert.issuedDate), 'dd MMMM yyyy') : ''}</div>
              <div class="id">${cert.certificateId}</div>
            </div>
            ${qr ? `<img class="qr" src="${qr}" alt="QR" />` : ''}
            <div>Verification: ${cert.verificationCode ?? ''}</div>
          </div>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((n) => <div key={n} className="h-28 bg-white border border-gray-100 rounded-sm animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <p className="text-sm text-gray-500">{certificates.length} certificate{certificates.length !== 1 ? 's' : ''}</p>

      {certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Certificates are issued after conference participation is confirmed."
        />
      ) : (
        <div className="space-y-4">
          {certificates.map((cert, i) => {
            const conf = cert.conference as any
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border border-gray-100 rounded-sm p-5"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex gap-4">
                    {/* QR preview */}
                    <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-center shrink-0 overflow-hidden">
                      {qrImages[cert.id] ? (
                        <img src={qrImages[cert.id]} alt="QR" className="w-full h-full" />
                      ) : (
                        <QrCode size={24} className="text-gray-300" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_STYLES[cert.certificateType] ?? 'bg-gray-100 text-gray-600'}`}>
                          {cert.certificateType}
                        </span>
                      </div>
                      <p className="font-semibold text-charcoal">{conf?.title ?? 'Conference'}</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">{cert.certificateId}</p>
                      {cert.issuedDate && (
                        <p className="text-xs text-gray-400">Issued: {format(new Date(cert.issuedDate), 'dd MMM yyyy')}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePrint(cert)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 text-charcoal rounded-sm hover:bg-gray-50 hover:border-primary/30 transition-colors shrink-0"
                  >
                    <Download size={13} /> Download / Print
                  </button>
                </div>
                {cert.verificationCode && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    Verify at: <span className="text-primary font-mono">{window.location.origin}/verify/{cert.verificationCode}</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
