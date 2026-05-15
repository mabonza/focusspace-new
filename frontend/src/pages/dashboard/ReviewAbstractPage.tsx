import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Download, FileText, CheckCircle, XCircle,
  RotateCcw, Send, AlertCircle, Loader2, Paperclip,
} from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '../../contexts/AuthContext'
import { getAbstractById, updateAbstractStatus } from '../../services/abstracts'
import { getMyReviews, submitReview, updateReview } from '../../services/reviews'
import Button from '../../components/Button'
import StatusBadge from '../../components/dashboard/StatusBadge'
import type { Abstract, Review } from '../../types'

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

const REVIEWER_ROLES = ['reviewer', 'organizer', 'admin']
const ADMIN_ROLES = ['organizer', 'admin']

export default function ReviewAbstractPage() {
  const { abstractId } = useParams<{ abstractId: string }>()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [abstract, setAbstract] = useState<Abstract | null>(null)
  const [existingReview, setExistingReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusSaving, setStatusSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Review form state
  const [score, setScore] = useState(5)
  const [recommendation, setRecommendation] = useState<'accept' | 'reject' | 'revise'>('accept')
  const [comments, setComments] = useState('')
  const [adminComments, setAdminComments] = useState('')

  const isAdmin = user ? ADMIN_ROLES.includes(user.userRole) : false
  const isReviewer = user ? REVIEWER_ROLES.includes(user.userRole) : false

  useEffect(() => {
    if (!token || !user || !abstractId) return

    Promise.all([
      getAbstractById(token, Number(abstractId)),
      getMyReviews(token, user.id),
    ]).then(([ab, reviews]) => {
      setAbstract(ab)
      const mine = reviews.find((r) => (r.abstract as any)?.id === Number(abstractId) || (r as any).abstractId === Number(abstractId))
      if (mine) {
        setExistingReview(mine)
        setScore(mine.score ?? 5)
        setRecommendation(mine.recommendation as any ?? 'accept')
        setComments(mine.comments ?? '')
      }
      if (ab) setAdminComments((ab as any).adminComments ?? '')
      setLoading(false)
    })
  }, [abstractId, token, user])

  const handleStatusChange = async (newStatus: string) => {
    if (!token || !abstract) return
    setStatusSaving(true)
    setError('')
    try {
      await updateAbstractStatus(token, abstract.id, newStatus, adminComments || undefined)
      setAbstract((prev) => prev ? { ...prev, status: newStatus as any } : prev)
      setSuccess(`Status updated to "${newStatus}"`)
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to update status')
    } finally {
      setStatusSaving(false)
    }
  }

  const handleSaveAdminComments = async () => {
    if (!token || !abstract) return
    setSaving(true)
    setError('')
    try {
      await updateAbstractStatus(token, abstract.id, abstract.status, adminComments)
      setSuccess('Comments saved')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to save comments')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!token || !user || !abstract) return
    if (comments.length < 20) { setError('Comments must be at least 20 characters'); return }
    setSaving(true)
    setError('')
    try {
      if (existingReview) {
        await updateReview(token, existingReview.id, { score, recommendation, comments })
      } else {
        const created = await submitReview(token, {
          abstract: abstract.id,
          reviewer: user.id,
          score,
          recommendation,
          comments,
        })
        setExistingReview(created)
      }
      // Auto-set status to under-review if still submitted
      if (abstract.status === 'submitted') {
        await updateAbstractStatus(token, abstract.id, 'under-review')
        setAbstract((prev) => prev ? { ...prev, status: 'under-review' } : prev)
      }
      setSuccess('Review saved successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save review')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    )
  }

  if (!abstract) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-500">
        <AlertCircle size={32} className="text-primary" />
        <p className="font-semibold">Abstract not found</p>
        <button onClick={() => navigate(-1)} className="text-primary text-sm hover:underline">Go back</button>
      </div>
    )
  }

  const doc = (abstract as any).documentUpload
  const submitter = (abstract as any).user
  const conference = (abstract as any).conference

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Abstract details */}
      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
        <div className="bg-primary/5 border-b border-primary/10 px-6 py-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FileText size={15} className="text-primary shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Abstract</span>
            </div>
            <h2 className="text-lg font-serif font-bold text-charcoal leading-snug">{abstract.title}</h2>
          </div>
          <StatusBadge status={abstract.status} />
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
            {submitter && (
              <div>
                <p className="text-xs text-gray-400 font-medium">Author</p>
                <p className="text-charcoal font-semibold">
                  {submitter.firstName ? `${submitter.firstName} ${submitter.lastName ?? ''}`.trim() : submitter.email}
                </p>
              </div>
            )}
            {(abstract as any).institution && (
              <div>
                <p className="text-xs text-gray-400 font-medium">Institution</p>
                <p className="text-charcoal">{(abstract as any).institution}</p>
              </div>
            )}
            {conference && (
              <div>
                <p className="text-xs text-gray-400 font-medium">Conference</p>
                <p className="text-charcoal">{conference.title}</p>
              </div>
            )}
            {abstract.presentationType && (
              <div>
                <p className="text-xs text-gray-400 font-medium">Presentation</p>
                <p className="text-charcoal capitalize">{abstract.presentationType.replace('-', ' ')}</p>
              </div>
            )}
            {(abstract as any).subtheme && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400 font-medium">Sub-theme</p>
                <p className="text-charcoal">{(abstract as any).subtheme}</p>
              </div>
            )}
            {(abstract as any).coAuthors && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400 font-medium">Co-authors</p>
                <p className="text-charcoal">{(abstract as any).coAuthors}</p>
              </div>
            )}
            {abstract.keywords && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400 font-medium">Keywords</p>
                <p className="text-charcoal">{abstract.keywords}</p>
              </div>
            )}
            {(abstract as any).createdAt && (
              <div>
                <p className="text-xs text-gray-400 font-medium">Submitted</p>
                <p className="text-charcoal">{format(new Date((abstract as any).createdAt), 'dd MMM yyyy')}</p>
              </div>
            )}
          </div>

          {/* Abstract text */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Abstract Text</p>
            <div className="bg-gray-50 border border-gray-100 rounded-sm p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {abstract.abstractText}
            </div>
          </div>

          {/* Document download */}
          {doc && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Uploaded Document</p>
              <a
                href={`${BASE_URL}${doc.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors"
              >
                <Download size={14} />
                Download {doc.name ?? 'Document'}
                {doc.size && (
                  <span className="text-white/70 text-xs">({Math.round(doc.size / 1024)} KB)</span>
                )}
              </a>
            </div>
          )}
          {!doc && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Paperclip size={12} />
              No document uploaded
            </div>
          )}
        </div>
      </div>

      {/* Feedback / error */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-sm p-3 text-sm">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 rounded-sm p-3 text-sm">
          <CheckCircle size={15} className="shrink-0 mt-0.5" />
          {success}
        </div>
      )}

      {/* Admin/Organizer: quick status actions */}
      {isAdmin && (
        <div className="bg-white border border-gray-100 rounded-sm p-5 space-y-4">
          <h3 className="font-semibold text-charcoal text-sm uppercase tracking-wide">Decision</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('accepted')}
              disabled={statusSaving || abstract.status === 'accepted'}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <CheckCircle size={14} />
              Accept
            </button>
            <button
              onClick={() => handleStatusChange('rejected')}
              disabled={statusSaving || abstract.status === 'rejected'}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <XCircle size={14} />
              Reject
            </button>
            <button
              onClick={() => handleStatusChange('revision-requested')}
              disabled={statusSaving || abstract.status === 'revision-requested'}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-sm hover:bg-amber-700 disabled:opacity-50 transition-colors"
            >
              <RotateCcw size={14} />
              Request Revision
            </button>
            <button
              onClick={() => handleStatusChange('under-review')}
              disabled={statusSaving || abstract.status === 'under-review'}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              Under Review
            </button>
            {statusSaving && <Loader2 size={18} className="animate-spin text-primary mt-2" />}
          </div>

          {/* Admin comments */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Note to Author (optional)
            </label>
            <textarea
              value={adminComments}
              onChange={(e) => setAdminComments(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Visible to the author after status change…"
            />
            <button
              onClick={handleSaveAdminComments}
              disabled={saving}
              className="mt-2 px-4 py-2 text-sm bg-charcoal text-white rounded-sm hover:bg-charcoal/90 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 size={13} className="animate-spin" />}
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* Reviewer: review form */}
      {isReviewer && (
        <div className="bg-white border border-gray-100 rounded-sm p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-charcoal text-sm uppercase tracking-wide">
              {existingReview ? 'Update Review' : 'Submit Review'}
            </h3>
            {existingReview && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                ✓ Review submitted
              </span>
            )}
          </div>

          {/* Score */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Score <span className="text-red-400">*</span>
              <span className="normal-case font-normal ml-1 text-gray-300">(1 = poor, 10 = excellent)</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={10}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="w-8 text-center font-bold text-primary text-lg">{score}</span>
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Recommendation <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {([
                { value: 'accept', label: 'Accept', color: 'green' },
                { value: 'revise', label: 'Revision Required', color: 'amber' },
                { value: 'reject', label: 'Reject', color: 'red' },
              ] as const).map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRecommendation(value as any)}
                  className={`px-4 py-2 text-sm font-semibold rounded-sm border transition-colors ${
                    recommendation === value
                      ? color === 'green'
                        ? 'bg-green-600 border-green-600 text-white'
                        : color === 'amber'
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'bg-red-600 border-red-600 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Review Comments <span className="text-red-400">*</span>
              <span className="normal-case font-normal ml-1 text-gray-300">(min. 20 characters)</span>
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Provide detailed feedback on originality, methodology, relevance, and writing quality…"
            />
            <p className="text-xs text-gray-400 mt-1">{comments.length} characters</p>
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <Button
              variant="primary"
              disabled={saving}
              onClick={handleSubmitReview}
            >
              {saving
                ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                : <><Send size={14} /> {existingReview ? 'Update Review' : 'Submit Review'}</>
              }
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
