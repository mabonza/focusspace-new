import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { resetPassword } from '../services/auth'
import { resetPasswordSchema, type ResetPasswordInput } from '../lib/schemas'
import Button from '../components/Button'
import { useSEO } from '../hooks/useSEO'

export default function ResetPassword() {
  useSEO({ title: 'Reset Password' })
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [done, setDone] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { code: searchParams.get('code') ?? '' },
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError('')
    try {
      await resetPassword(data.code, data.password, data.confirmPassword)
      setDone(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Reset failed. The link may have expired.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <img src="/focus-logo.webp" alt="Focus Space" className="h-14 w-auto object-contain" />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Set New Password</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your new password below</p>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8">
          {done ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-serif font-bold text-charcoal text-xl mb-2">Password Updated</h3>
              <p className="text-gray-500 text-sm">Redirecting you to sign in…</p>
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
                {!searchParams.get('code') && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                      Reset Code
                    </label>
                    <input
                      {...register('code')}
                      className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-primary ${errors.code ? 'border-red-400' : 'border-gray-200'}`}
                      placeholder="Paste code from email"
                    />
                    {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-primary pr-10 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                      placeholder="Min. 8 characters"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...register('confirmPassword')}
                    className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-primary ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="Repeat new password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>
                <Button type="submit" variant="primary" className="w-full justify-center" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating…' : 'Update Password'}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
