import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Save, User, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { profileSchema, changePasswordSchema, type ProfileInput, type ChangePasswordInput } from '../../lib/schemas'
import Button from '../../components/Button'
import UserAvatar from '../../components/dashboard/UserAvatar'

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Angola','Argentina','Australia','Austria','Bangladesh',
  'Belgium','Bolivia','Brazil','Cambodia','Cameroon','Canada','Chile','China','Colombia',
  'Congo','Costa Rica','Côte d\'Ivoire','Croatia','Cuba','Czech Republic','Denmark',
  'Dominican Republic','DR Congo','Ecuador','Egypt','El Salvador','Ethiopia','Finland',
  'France','Germany','Ghana','Greece','Guatemala','Honduras','Hungary','India','Indonesia',
  'Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya',
  'Malaysia','Mexico','Morocco','Mozambique','Myanmar','Nepal','Netherlands','New Zealand',
  'Nicaragua','Nigeria','North Korea','Norway','Pakistan','Panama','Paraguay','Peru',
  'Philippines','Poland','Portugal','Romania','Russia','Rwanda','Saudi Arabia','Senegal',
  'Serbia','Sierra Leone','Somalia','South Africa','South Korea','Spain','Sri Lanka','Sudan',
  'Sweden','Switzerland','Syria','Tanzania','Thailand','Tunisia','Turkey','Uganda','Ukraine',
  'United Kingdom','United States','Uruguay','Venezuela','Vietnam','Zambia','Zimbabwe',
]

function Field({ label, error, hint, children }: {
  label: string; error?: string; hint?: string; children: React.ReactNode
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

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

export default function Profile() {
  const { user, token } = useAuth()
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-primary transition-colors ${hasError ? 'border-red-400' : 'border-gray-200'}`

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema) })

  const {
    register: regPw,
    handleSubmit: handlePw,
    reset: resetPw,
    formState: { errors: pwErrors, isSubmitting: pwSubmitting },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) })

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phone: user.phone ?? '',
        institution: user.institution ?? '',
        country: user.country ?? '',
      })
    }
  }, [user, reset])

  const onSubmit = async (data: ProfileInput) => {
    if (!token || !user) return
    setServerError('')
    setSuccess(false)
    try {
      const res = await fetch(`${BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update profile.')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to update profile.')
    }
  }

  const onChangePassword = async (data: ChangePasswordInput) => {
    if (!token) return
    setPwError('')
    setPwSuccess(false)
    try {
      const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          password: data.password,
          passwordConfirmation: data.confirmPassword,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message || 'Failed to change password.')
      setPwSuccess(true)
      resetPw()
      setTimeout(() => setPwSuccess(false), 3000)
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Failed to change password.')
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Avatar + name header */}
      <div className="bg-white border border-gray-100 rounded-sm p-6 flex items-center gap-5">
        <UserAvatar user={user} size="lg" />
        <div>
          <p className="font-semibold text-charcoal">
            {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user?.username}
          </p>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <span className="text-xs font-semibold capitalize bg-primary-50 text-primary px-2 py-0.5 rounded-full mt-1 inline-block">
            {user?.userRole ?? 'attendee'}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-5">
        <div className="pb-4 border-b border-gray-100">
          <h2 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
            <User size={18} /> Profile Settings
          </h2>
        </div>

        {serverError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-sm p-3 text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {serverError}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-sm p-3 text-sm">
            Profile updated successfully.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="First Name" error={errors.firstName?.message}>
            <input {...register('firstName')} className={inputClass(!!errors.firstName)} />
          </Field>
          <Field label="Last Name" error={errors.lastName?.message}>
            <input {...register('lastName')} className={inputClass(!!errors.lastName)} />
          </Field>
        </div>

        <Field label="Institution / Organization" error={errors.institution?.message}>
          <input {...register('institution')} className={inputClass(!!errors.institution)} placeholder="University, hospital, NGO…" />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Phone" error={errors.phone?.message}>
            <input {...register('phone')} className={inputClass(!!errors.phone)} placeholder="+1 234 567 8900" />
          </Field>
          <Field label="Country" error={errors.country?.message}>
            <select {...register('country')} className={inputClass(!!errors.country)}>
              <option value="">Select country…</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="primary"
            disabled={isSubmitting || !isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            <Save size={15} /> {isSubmitting ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-5">
        <div className="pb-4 border-b border-gray-100">
          <h2 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
            <Lock size={18} /> Change Password
          </h2>
        </div>

        {pwError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-sm p-3 text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {pwError}
          </div>
        )}
        {pwSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-sm p-3 text-sm">
            Password changed successfully.
          </div>
        )}

        <Field label="Current Password" error={pwErrors.currentPassword?.message}>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              {...regPw('currentPassword')}
              className={`${inputClass(!!pwErrors.currentPassword)} pr-10`}
              placeholder="Enter current password"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="New Password" error={pwErrors.password?.message}>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                {...regPw('password')}
                className={`${inputClass(!!pwErrors.password)} pr-10`}
                placeholder="Min. 8 characters"
              />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>
          <Field label="Confirm New Password" error={pwErrors.confirmPassword?.message}>
            <input
              type="password"
              {...regPw('confirmPassword')}
              className={inputClass(!!pwErrors.confirmPassword)}
              placeholder="Repeat new password"
            />
          </Field>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="primary"
            disabled={pwSubmitting}
            onClick={handlePw(onChangePassword)}
          >
            <Lock size={15} /> {pwSubmitting ? 'Updating…' : 'Update Password'}
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-sm p-4">
        <p className="text-xs text-gray-500">
          To change your email address please contact support at focusconference@mut.ac.za
        </p>
      </div>
    </div>
  )
}
