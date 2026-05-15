import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, FileText, Edit2, Trash2, Paperclip, MessageSquare, CheckCircle2, Clock, Search, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { getMyAbstracts, withdrawAbstract } from '../../services/abstracts'
import StatusBadge from '../../components/dashboard/StatusBadge'
import EmptyState from '../../components/dashboard/EmptyState'
import Button from '../../components/Button'
import type { Abstract, AbstractStatus } from '../../types'

// ── Progress pipeline ────────────────────────────────────────────────────────

const PIPELINE: { key: AbstractStatus | 'submitted'; label: string }[] = [
  { key: 'submitted',        label: 'Submitted' },
  { key: 'under-review',     label: 'Under Review' },
  { key: 'revision-requested', label: 'Revision' },
  { key: 'accepted',         label: 'Accepted' },
]

const PIPELINE_ORDER: Record<string, number> = {
  draft: -1,
  submitted: 0,
  'under-review': 1,
  'revision-requested': 2,
  accepted: 3,
  rejected: 3,
}

function ProgressBar({ status }: { status: string }) {
  if (status === 'draft') return null

  const current = PIPELINE_ORDER[status] ?? 0
  const isRejected = status === 'rejected'

  return (
    <div className="mt-3 pt-3 border-t border-gray-50">
      <div className="flex items-center gap-0">
        {PIPELINE.map((step, i) => {
          const stepOrder = PIPELINE_ORDER[step.key]
          const done = current > stepOrder
          const active = current === stepOrder && !isRejected
          const isLast = i === PIPELINE.length - 1

          let dotColor = 'bg-gray-200'
          let labelColor = 'text-gray-400'
          if (done || (isLast && status === 'accepted')) {
            dotColor = 'bg-green-500'
            labelColor = 'text-green-600'
          } else if (active) {
            dotColor = 'bg-primary animate-pulse'
            labelColor = 'text-primary font-semibold'
          } else if (isRejected && i === 0) {
            dotColor = 'bg-red-400'
            labelColor = 'text-red-500'
          }

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
                <span className={`text-[10px] whitespace-nowrap ${labelColor}`}>{step.label}</span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-px mx-1 mb-4 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}

        {isRejected && (
          <>
            <div className="flex-1 h-px mx-1 mb-4 bg-red-200" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
              <span className="text-[10px] text-red-500 font-semibold">Rejected</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Abstract card ─────────────────────────────────────────────────────────────

function AbstractCard({
  ab,
  index,
  onWithdraw,
  withdrawing,
}: {
  ab: Abstract
  index: number
  onWithdraw: (id: number) => void
  withdrawing: boolean
}) {
  const navigate = useNavigate()
  const conference = ab.conference as any
  const doc = ab.documentUpload as any
  const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

  const canEdit = ab.status === 'draft' || ab.status === 'revision-requested'
  const canWithdraw = ab.status === 'draft' || ab.status === 'submitted'

  // Status icon
  const StatusIcon =
    ab.status === 'accepted' ? CheckCircle2
    : ab.status === 'rejected' ? XCircle
    : ab.status === 'under-review' ? Search
    : Clock

  const iconColor =
    ab.status === 'accepted' ? 'text-green-500'
    : ab.status === 'rejected' ? 'text-red-500'
    : ab.status === 'under-review' ? 'text-purple-500'
    : 'text-gray-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-gray-100 rounded-sm hover:border-primary/20 transition-colors"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`mt-0.5 shrink-0 ${iconColor}`}>
              <StatusIcon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-charcoal leading-snug mb-1">{ab.title}</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                {conference && (
                  <span>
                    <strong className="text-charcoal">{conference.title}</strong>
                    {conference.year ? ` (${conference.year})` : ''}
                  </span>
                )}
                <span className="capitalize">{ab.presentationType?.replace('-', ' ')}</span>
                {(ab as any).subtheme && <span className="text-primary/70">{(ab as any).subtheme}</span>}
                {ab.createdAt && <span>{format(new Date(ab.createdAt), 'dd MMM yyyy')}</span>}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <StatusBadge status={ab.status} />
                {ab.keywords && (
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                    {ab.keywords.split(',').slice(0, 3).map((k) => k.trim()).join(' · ')}
                  </span>
                )}
                {doc && (
                  <a
                    href={`${BASE_URL}${doc.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary bg-primary/5 px-2 py-0.5 rounded-full hover:bg-primary/10 transition-colors"
                  >
                    <Paperclip size={10} />
                    {doc.name ?? 'Document'}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {canEdit && (
              <button
                onClick={() => navigate(`/dashboard/abstracts/${ab.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-sm text-gray-600 hover:border-primary/40 hover:text-primary transition-colors"
              >
                <Edit2 size={12} /> Edit
              </button>
            )}
            {canWithdraw && (
              <button
                onClick={() => onWithdraw(ab.id)}
                disabled={withdrawing}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors disabled:opacity-50"
                title="Withdraw"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <ProgressBar status={ab.status} />

        {/* Reviewer / admin comments */}
        {ab.reviewerComments && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-orange-50 border border-orange-100 rounded-sm">
            <MessageSquare size={13} className="text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-orange-700 mb-0.5">Reviewer Feedback</p>
              <p className="text-xs text-orange-600 leading-relaxed">{ab.reviewerComments}</p>
            </div>
          </div>
        )}
        {ab.adminComments && (
          <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-sm">
            <MessageSquare size={13} className="text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-700 mb-0.5">Organiser Note</p>
              <p className="text-xs text-blue-600 leading-relaxed">{ab.adminComments}</p>
            </div>
          </div>
        )}

        {/* Revision prompt */}
        {ab.status === 'revision-requested' && (
          <div className="mt-2 flex items-center justify-between gap-3 p-3 bg-amber-50 border border-amber-200 rounded-sm">
            <p className="text-xs text-amber-700 font-medium">
              Revision required — please update and resubmit your abstract.
            </p>
            <button
              onClick={() => navigate(`/dashboard/abstracts/${ab.id}`)}
              className="shrink-0 text-xs bg-amber-600 text-white px-3 py-1.5 rounded-sm hover:bg-amber-700 transition-colors"
            >
              Edit & Resubmit
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MyAbstracts() {
  const { token } = useAuth()
  const [abstracts, setAbstracts] = useState<Abstract[]>([])
  const [loading, setLoading] = useState(true)
  const [withdrawing, setWithdrawing] = useState<number | null>(null)

  useEffect(() => {
    if (!token) return
    getMyAbstracts(token).then((data) => { setAbstracts(data); setLoading(false) })
  }, [token])

  const handleWithdraw = async (id: number) => {
    if (!token || !confirm('Withdraw this abstract? This cannot be undone.')) return
    setWithdrawing(id)
    try {
      await withdrawAbstract(token, id)
      setAbstracts((prev) => prev.filter((a) => a.id !== id))
    } finally {
      setWithdrawing(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => <div key={n} className="h-24 bg-white border border-gray-100 rounded-sm animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{abstracts.length} abstract{abstracts.length !== 1 ? 's' : ''}</p>
        <Link to="/dashboard/abstracts/new">
          <Button variant="primary" size="sm">
            <Plus size={15} /> Submit Abstract
          </Button>
        </Link>
      </div>

      {abstracts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No abstracts yet"
          description="Submit a research abstract for review."
          action={{ label: 'Submit Abstract', to: '/dashboard/abstracts/new' }}
        />
      ) : (
        <div className="space-y-3">
          {abstracts.map((ab, i) => (
            <AbstractCard
              key={ab.id}
              ab={ab}
              index={i}
              onWithdraw={handleWithdraw}
              withdrawing={withdrawing === ab.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
