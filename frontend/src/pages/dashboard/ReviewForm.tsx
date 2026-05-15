import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Send } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getMyReviews, submitReview, updateReview } from '../../services/reviews'
import { reviewSchema, type ReviewInput } from '../../lib/schemas'
import Button from '../../components/Button'
import type { Review } from '../../types'

function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function ReviewForm() {
  const { id } = useParams<{ id: string }>()
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [review, setReview] = useState<Review | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({ resolver: zodResolver(reviewSchema) })

  useEffect(() => {
    if (!token || !user) return
    getMyReviews(token, user.id).then((reviews) => {
      const found = reviews.find((r) => r.id === Number(id))
      if (found) {
        setReview(found)
        reset({
          score: found.score ?? 5,
          comments: found.comments ?? '',
          recommendation: found.recommendation,
        })
      }
      setLoadingData(false)
    })
  }, [id, token, user, reset])

  const onSubmit = async (data: ReviewInput) => {
    if (!token) return
    setServerError('')
    try {
      if (review) {
        await updateReview(token, review.id, data)
      } else if (user) {
        await submitReview(token, { ...data, reviewer: user.id, abstract: Number(id) })
      }
      navigate('/dashboard/reviews')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to save review.')
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-sm text-sm focus:outline-none focus:border-primary transition-colors ${hasError ? 'border-red-400' : 'border-gray-200'}`

  if (loadingData) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
  }

  const abstract = review?.abstract as any

  return (
    <div className="max-w-2xl">
      <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-6">
        <div className="pb-4 border-b border-gray-100">
          <h2 className="text-lg font-serif font-bold text-charcoal">Abstract Review</h2>
          {abstract?.title && (
            <p className="text-sm text-gray-600 mt-1 font-medium">{abstract.title}</p>
          )}
          {abstract?.abstractText && (
            <p className="text-xs text-gray-400 mt-2 line-clamp-3">{abstract.abstractText}</p>
          )}
        </div>

        {serverError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-sm p-3 text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {serverError}
          </div>
        )}

        <Field label="Score (1–10)" required error={errors.score?.message} hint="1 = poor, 10 = excellent">
          <input
            {...register('score', { valueAsNumber: true })}
            type="number"
            min={1}
            max={10}
            className={inputClass(!!errors.score)}
          />
        </Field>

        <Field label="Recommendation" required error={errors.recommendation?.message}>
          <select {...register('recommendation')} className={inputClass(!!errors.recommendation)}>
            <option value="">Select recommendation…</option>
            <option value="accept">Accept</option>
            <option value="revise">Minor/Major Revision</option>
            <option value="reject">Reject</option>
          </select>
        </Field>

        <Field label="Comments" required error={errors.comments?.message} hint="Minimum 20 characters">
          <textarea
            {...register('comments')}
            rows={8}
            className={`${inputClass(!!errors.comments)} resize-none`}
            placeholder="Provide detailed feedback for the authors…"
          />
        </Field>

        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="primary"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            <Send size={15} /> {isSubmitting ? 'Saving…' : 'Submit Review'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/reviews')}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
