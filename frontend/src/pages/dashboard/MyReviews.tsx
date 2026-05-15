import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Download, Eye, CheckCircle, XCircle, RotateCcw, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { getAssignedAbstracts, updateAbstractStatus } from '../../services/abstracts'
import { getMyReviews } from '../../services/reviews'
import StatusBadge from '../../components/dashboard/StatusBadge'
import EmptyState from '../../components/dashboard/EmptyState'
import type { Abstract, Review } from '../../types'

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')
const ADMIN_ROLES = ['organizer', 'admin']

export default function MyReviews() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [abstracts, setAbstracts] = useState<Abstract[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [statusChanging, setStatusChanging] = useState<number | null>(null)

  const isAdmin = user ? ADMIN_ROLES.includes(user.userRole) : false

  useEffect(() => {
    if (!token || !user) return
    Promise.all([
      getAssignedAbstracts(token, user.id),
      getMyReviews(token, user.id),
    ]).then(([abs, revs]) => {
      setAbstracts(abs)
      setReviews(revs)
      setLoading(false)
    })
  }, [token, user])

  const getReviewForAbstract = (abstractId: number) =>
    reviews.find((r) => (r.abstract as any)?.id === abstractId)

  const handleQuickStatus = async (abstract: Abstract, status: string) => {
    if (!token) return
    setStatusChanging(abstract.id)
    try {
      await updateAbstractStatus(token, abstract.id, status)
      setAbstracts((prev) => prev.map((a) => a.id === abstract.id ? { ...a, status: status as any } : a))
    } finally {
      setStatusChanging(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => <div key={n} className="h-28 bg-white border border-gray-100 rounded-sm animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {abstracts.length} abstract{abstracts.length !== 1 ? 's' : ''} assigned for review
        </p>
      </div>

      {abstracts.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No abstracts assigned"
          description="Abstracts assigned to you for review will appear here."
        />
      ) : (
        <div className="space-y-3">
          {abstracts.map((ab, i) => {
            const review = getReviewForAbstract(ab.id)
            const doc = (ab as any).documentUpload
            const submitter = (ab as any).user
            const conference = (ab as any).conference
            const isChanging = statusChanging === ab.id

            return (
              <motion.div
                key={ab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-sm hover:border-primary/20 transition-colors"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-charcoal leading-snug mb-1">{ab.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                        {submitter && (
                          <span>
                            Author: <strong className="text-charcoal">
                              {submitter.firstName
                                ? `${submitter.firstName} ${submitter.lastName ?? ''}`.trim()
                                : submitter.email}
                            </strong>
                          </span>
                        )}
                        {(ab as any).institution && <span>{(ab as any).institution}</span>}
                        {conference && <span>Conf: <strong className="text-charcoal">{conference.title}</strong></span>}
                        <span className="capitalize">{ab.presentationType?.replace('-', ' ')}</span>
                        {(ab as any).createdAt && (
                          <span>{format(new Date((ab as any).createdAt), 'dd MMM yyyy')}</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 items-center">
                        <StatusBadge status={ab.status} />
                        {review ? (
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            ✓ Reviewed · {review.recommendation} · {review.score}/10
                          </span>
                        ) : (
                          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                            Pending review
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {doc && (
                        <a
                          href={`${BASE_URL}${doc.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-sm text-gray-600 hover:border-primary/40 hover:text-primary transition-colors"
                          title="Download document"
                        >
                          <Download size={12} />
                          Document
                        </a>
                      )}

                      <button
                        onClick={() => navigate(`/dashboard/reviews/abstract/${ab.id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors font-medium"
                      >
                        <Eye size={12} />
                        {review ? 'View / Edit' : 'Review'}
                      </button>

                      {/* Admin quick actions */}
                      {isAdmin && (
                        <>
                          {isChanging ? (
                            <Loader2 size={16} className="animate-spin text-primary" />
                          ) : (
                            <>
                              <button
                                onClick={() => handleQuickStatus(ab, 'accepted')}
                                disabled={ab.status === 'accepted'}
                                title="Accept"
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-sm transition-colors disabled:opacity-30"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleQuickStatus(ab, 'rejected')}
                                disabled={ab.status === 'rejected'}
                                title="Reject"
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors disabled:opacity-30"
                              >
                                <XCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleQuickStatus(ab, 'revision-requested')}
                                disabled={ab.status === 'revision-requested'}
                                title="Request revision"
                                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-sm transition-colors disabled:opacity-30"
                              >
                                <RotateCcw size={16} />
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Abstract text preview */}
                  {ab.abstractText && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{ab.abstractText}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
