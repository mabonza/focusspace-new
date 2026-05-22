import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Megaphone, Send, Users, User, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { broadcastNotification } from '../../services/notifications'
import Button from '../../components/Button'

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  type: z.enum(['system', 'registration', 'abstract', 'payment', 'review']),
  targetUserId: z.string().optional(),
})
type FormInput = z.infer<typeof schema>

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-primary transition-colors ${hasError ? 'border-red-400' : 'border-gray-200'}`

function Field({ label, hint, error, children }: {
  label: string; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function AdminAnnouncements() {
  const { token } = useAuth()
  const [mode, setMode] = useState<'all' | 'single'>('all')
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [users, setUsers] = useState<{ id: number; email: string; firstName?: string }[]>([])
  const [usersLoaded, setUsersLoaded] = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'system' },
  })

  const loadUsers = async () => {
    if (usersLoaded || !token) return
    try {
      const res = await fetch(`${BASE_URL}/api/user-management/users?pageSize=500`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const json = await res.json()
        setUsers(json.data ?? [])
        setUsersLoaded(true)
      }
    } catch { /* ignore */ }
  }

  const onSubmit = async (data: FormInput) => {
    if (!token) return
    setError('')
    setSuccess(null)
    try {
      const result = await broadcastNotification(token, {
        title: data.title,
        message: data.message,
        type: data.type,
        targetUserId: mode === 'single' && data.targetUserId ? Number(data.targetUserId) : undefined,
      })
      setSuccess(`Notification sent to ${result.sent} user${result.sent !== 1 ? 's' : ''}.`)
      reset({ type: 'system' })
      setTimeout(() => setSuccess(null), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send notification.')
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-5">
        <div className="pb-4 border-b border-gray-100">
          <h2 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
            <Megaphone size={18} /> Send Announcement
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Send an in-app notification that appears immediately in the recipient's notification bell and Notifications page.
          </p>
        </div>

        {/* Target toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium border transition-colors ${
              mode === 'all' ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary/40'
            }`}
          >
            <Users size={14} /> All Users
          </button>
          <button
            type="button"
            onClick={() => { setMode('single'); loadUsers() }}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium border transition-colors ${
              mode === 'single' ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary/40'
            }`}
          >
            <User size={14} /> Specific User
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-sm p-3 text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-sm p-3 text-sm">
            <CheckCircle size={16} className="shrink-0" /> {success}
          </div>
        )}

        <Field label="Notification Title" error={errors.title?.message}>
          <input {...register('title')} className={inputClass(!!errors.title)} placeholder="e.g. Important Update" />
        </Field>

        <Field label="Message" error={errors.message?.message}>
          <textarea
            {...register('message')}
            rows={4}
            className={inputClass(!!errors.message)}
            placeholder="Write your announcement message here…"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Notification Type" error={errors.type?.message}>
            <select {...register('type')} className={inputClass(!!errors.type)}>
              <option value="system">System</option>
              <option value="registration">Registration</option>
              <option value="abstract">Abstract</option>
              <option value="payment">Payment</option>
              <option value="review">Review</option>
            </select>
          </Field>

          {mode === 'single' && (
            <Field label="Target User" hint="Select the user to notify" error={errors.targetUserId?.message}>
              <select {...register('targetUserId')} className={inputClass(!!errors.targetUserId)}>
                <option value="">Select user…</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName ? `${u.firstName} — ` : ''}{u.email}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        <div className="pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="primary"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            <Send size={15} /> {isSubmitting ? 'Sending…' : mode === 'all' ? 'Send to All Users' : 'Send to User'}
          </Button>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-100 rounded-sm p-4 text-xs text-blue-700 space-y-1">
        <p className="font-semibold">How notifications work</p>
        <p>• Notifications appear instantly in each user's bell icon and Notifications page.</p>
        <p>• "All Users" sends to every confirmed, active account in the system.</p>
        <p>• "Specific User" targets one individual — useful for personal follow-ups.</p>
        <p>• Automated notifications are also sent when abstract status changes or payments are verified.</p>
      </div>
    </div>
  )
}
