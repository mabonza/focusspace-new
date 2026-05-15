import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { forgotPassword } from '../services/auth'
import { forgotPasswordSchema, type ForgotPasswordInput } from '../lib/schemas'
import Button from '../components/Button'
import { useSEO } from '../hooks/useSEO'

export default function ForgotPassword() {
  useSEO({ title: 'Forgot Password' })
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError('')
    try {
      await forgotPassword(data.email)
      setSent(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Could not send reset email.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <img src="/focus-logo.webp" alt="Focus Space" className="h-14 w-auto object-contain" />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Reset Your Password</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your email and we'll send a reset link</p>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8">
          {sent ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-serif font-bold text-charcoal text-xl mb-2">Email Sent</h3>
              <p className="text-gray-500 text-sm">Check your inbox for a password reset link.</p>
              <Link to="/login" className="inline-block mt-6 text-primary text-sm font-semibold hover:underline">
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <>
              {serverError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-sm p-3 mb-5 text-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  {serverError}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-primary transition-colors ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <Button type="submit" variant="primary" className="w-full justify-center" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send Reset Link'}
                </Button>
              </form>
              <div className="mt-5 text-center text-sm">
                <Link to="/login" className="text-primary hover:underline">← Back to Sign In</Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
