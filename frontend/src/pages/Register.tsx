import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { registerSchema, type RegisterInput } from '../lib/schemas'
import Button from '../components/Button'
import { useSEO } from '../hooks/useSEO'

const COUNTRIES = [
  'South Africa', 'Kenya', 'Nigeria', 'Ghana', 'Ethiopia', 'Tanzania', 'Uganda',
  'Rwanda', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Mozambique', 'Malawi',
  'Cameroon', 'Senegal', 'Côte d\'Ivoire', 'Other African Country',
  'United Kingdom', 'United States', 'Canada', 'Australia', 'Germany',
  'France', 'Netherlands', 'Sweden', 'Other',
]

function Field({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function Register() {
  useSEO({ title: 'Create Account', description: 'Register for a Focus Space delegate account.' })

  const { register: authRegister } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-primary transition-colors ${hasError ? 'border-red-400' : 'border-gray-200'}`

  const onSubmit = async (data: RegisterInput) => {
    setServerError('')
    try {
      await authRegister({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        institution: data.institution,
        country: data.country,
      })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <img src="/focus-logo.webp" alt="Focus Space" className="h-14 w-auto object-contain" />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Create Your Account</h1>
          <p className="text-gray-500 text-sm mt-2">Register to attend conferences, submit abstracts, and access the delegate portal</p>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8">
          {serverError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-sm p-3 mb-5 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="First Name" error={errors.firstName?.message}>
                <input {...register('firstName')} className={inputClass(!!errors.firstName)} placeholder="Ada" />
              </Field>
              <Field label="Last Name" error={errors.lastName?.message}>
                <input {...register('lastName')} className={inputClass(!!errors.lastName)} placeholder="Okonkwo" />
              </Field>
            </div>

            <Field label="Email Address" error={errors.email?.message}>
              <input type="email" {...register('email')} className={inputClass(!!errors.email)} placeholder="you@example.com" />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Password" error={errors.password?.message}>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={inputClass(!!errors.password) + ' pr-10'}
                    placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm Password" error={errors.confirmPassword?.message}>
                <input type="password" {...register('confirmPassword')} className={inputClass(!!errors.confirmPassword)} placeholder="Repeat password" />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Institution / Organisation" error={errors.institution?.message}>
                <input {...register('institution')} className={inputClass(!!errors.institution)} placeholder="University of Lagos" />
              </Field>
              <Field label="Country" error={errors.country?.message}>
                <select {...register('country')} className={inputClass(!!errors.country)}>
                  <option value="">Select country…</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Phone (optional)" error={errors.phone?.message}>
              <input {...register('phone')} className={inputClass(!!errors.phone)} placeholder="+27 00 000 0000" />
            </Field>

            <Button type="submit" variant="primary" className="w-full justify-center" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
