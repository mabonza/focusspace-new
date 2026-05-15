import { useRef, useState } from 'react'
import { CheckCircle, XCircle, QrCode, Camera } from 'lucide-react'
import jsQR from 'jsqr'
import { useAuth } from '../../contexts/AuthContext'
import { checkinByQR } from '../../services/attendance'
import { toast } from '../../components/Toast'

interface CheckinResult {
  success: boolean
  alreadyCheckedIn?: boolean
  userName?: string
  conferenceName?: string
  message?: string
}

export default function QRCheckin() {
  const { token } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<CheckinResult | null>(null)
  const [manualCode, setManualCode] = useState('')
  const [processing, setProcessing] = useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setScanning(true)
        startScanning()
      }
    } catch {
      toast.error('Camera access denied. Use manual entry below.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((t) => t.stop())
      videoRef.current.srcObject = null
    }
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current)
    setScanning(false)
  }

  const startScanning = () => {
    scanIntervalRef.current = setInterval(() => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code?.data) {
        stopCamera()
        processCheckin(code.data)
      }
    }, 200)
  }

  const processCheckin = async (qrCode: string) => {
    if (!token || processing) return
    setProcessing(true)
    try {
      const resp = await checkinByQR(token, qrCode)
      const userName = resp.user
        ? `${resp.user.firstName ?? ''} ${resp.user.lastName ?? ''}`.trim() || resp.user.email
        : 'Delegate'
      setResult({
        success: true,
        alreadyCheckedIn: resp.alreadyCheckedIn,
        userName,
        conferenceName: resp.conference?.title,
      })
      if (resp.alreadyCheckedIn) {
        toast.error(`${userName} is already checked in.`)
      } else {
        toast.success(`${userName} checked in successfully!`)
      }
    } catch (err) {
      setResult({ success: false, message: err instanceof Error ? err.message : 'Check-in failed' })
      toast.error('Check-in failed — QR code not recognised.')
    } finally {
      setProcessing(false)
    }
  }

  const handleManual = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) processCheckin(manualCode.trim())
  }

  const reset = () => { setResult(null); setManualCode('') }

  return (
    <div className="max-w-lg space-y-6">
      <div className="bg-white border border-gray-100 rounded-sm p-6">
        <h2 className="text-lg font-serif font-bold text-charcoal mb-4 flex items-center gap-2">
          <QrCode size={20} className="text-primary" /> QR Check-in Scanner
        </h2>

        {/* Camera scanner */}
        <div className="relative bg-charcoal rounded-sm overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
          <canvas ref={canvasRef} className="hidden" />
          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Camera size={40} className="text-white/40" />
              <p className="text-white/60 text-sm">Camera not active</p>
            </div>
          )}
          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-gold rounded-sm" />
            </div>
          )}
        </div>

        <div className="flex gap-3 mb-6">
          {!scanning ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-sm hover:bg-primary-600 transition-colors"
            >
              <Camera size={15} /> Start Camera
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="px-4 py-2 border border-gray-200 text-sm rounded-sm hover:bg-gray-50 transition-colors"
            >
              Stop Camera
            </button>
          )}
        </div>

        {/* Manual entry */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Manual Entry</p>
          <form onSubmit={handleManual} className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter QR code value…"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              disabled={!manualCode.trim() || processing}
              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-sm hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {processing ? '…' : 'Check In'}
            </button>
          </form>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className={`bg-white border rounded-sm p-5 ${result.success && !result.alreadyCheckedIn ? 'border-green-200' : result.success ? 'border-orange-200' : 'border-red-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            {result.success && !result.alreadyCheckedIn ? (
              <CheckCircle size={24} className="text-green-500" />
            ) : result.success ? (
              <CheckCircle size={24} className="text-orange-400" />
            ) : (
              <XCircle size={24} className="text-red-500" />
            )}
            <div>
              <p className="font-semibold text-charcoal">
                {result.success
                  ? result.alreadyCheckedIn ? 'Already Checked In' : 'Check-in Successful!'
                  : 'Check-in Failed'}
              </p>
              {result.userName && <p className="text-sm text-gray-500">{result.userName}</p>}
              {result.conferenceName && <p className="text-xs text-gray-400">{result.conferenceName}</p>}
              {result.message && <p className="text-xs text-red-500 mt-1">{result.message}</p>}
            </div>
          </div>
          <button onClick={reset} className="text-xs text-primary hover:underline">Scan another →</button>
        </div>
      )}
    </div>
  )
}
