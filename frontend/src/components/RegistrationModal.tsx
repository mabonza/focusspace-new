import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, AlertCircle, CheckCircle, Ticket } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { createRegistration } from '../services/registrations'
import { registrationSchema, type RegistrationInput } from '../lib/schemas'
import Button from './Button'
import type { Conference } from '../types'

interface Props {
  conference: Conference
  onClose: () => void
}

export default function RegistrationModal({ conference, onClose }: Props) {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({ resolver: zodResolver(registrationSchema) })

  const onSubmit = async (data: RegistrationInput) => {
    if (!token || !user) return
    setServerError('')
    try {
      await createRegistration(token, {
        conference: conference.id,
      })
      setSuccess(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed.')
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-primary transition-colors ${hasError ? 'border-red-400' : 'border-gray-200'}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-sm shadow-2xl w-full max-w-lg"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
                <Ticket size={18} className="text-primary" /> Register for Conference
              </h2>
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{conference.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-charcoal hover:bg-gray-100 rounded-sm transition-colors ml-4"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {success ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-green-500" />
                </div>
                <h3 className="font-semibold text-charcoal text-lg mb-2">Registration Submitted!</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Your registration is pending payment confirmation. Check your dashboard for updates.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="primary" onClick={() => navigate('/dashboard/registrations')}>
                    View My Registrations
                  </Button>
                  <Button variant="outline" onClick={onClose}>Close</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {!user && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-4 text-sm text-yellow-800">
                    Please{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/login', { state: { from: `/conferences/${conference.slug}` } })}
                      className="font-semibold underline"
                    >
                      sign in
                    </button>{' '}
                    to register for this conference.
                  </div>
                )}

                {serverError && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-sm p-3 text-sm">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    {serverError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    Registration Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    {...register('registrationType')}
                    className={inputClass(!!errors.registrationType)}
                    disabled={!user}
                  >
                    <option value="">Select type…</option>
                    <option value="in-person">In-Person</option>
                    <option value="virtual">Virtual</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  {errors.registrationType && (
                    <p className="text-red-500 text-xs mt-1">{errors.registrationType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    Ticket Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    {...register('ticketCategory')}
                    className={inputClass(!!errors.ticketCategory)}
                    disabled={!user}
                  >
                    <option value="">Select category…</option>
                    <option value="standard">Standard</option>
                    <option value="student">Student</option>
                    <option value="early-bird">Early Bird</option>
                    <option value="vip">VIP</option>
                  </select>
                  {errors.ticketCategory && (
                    <p className="text-red-500 text-xs mt-1">{errors.ticketCategory.message}</p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-sm p-4 text-xs text-gray-500">
                  An invoice will be generated automatically. Payment instructions will be sent to your registered email.
                </div>

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || !user}
                  >
                    {isSubmitting ? 'Registering…' : 'Confirm Registration'}
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
