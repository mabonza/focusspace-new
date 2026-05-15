import { useEffect, useState, useCallback } from 'react'
import { Settings, ChevronDown, Download, UserPlus, X, ChevronRight, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import {
  getAllAbstracts,
  updateAbstractStatus,
  getReviewers,
  assignReviewer,
  downloadAbstractsCsv,
  type ReviewerOption,
} from '../../services/abstracts'
import StatusBadge from '../../components/dashboard/StatusBadge'
import EmptyState from '../../components/dashboard/EmptyState'
import type { Abstract, AbstractStatus } from '../../types'

const STATUS_OPTIONS: AbstractStatus[] = [
  'draft', 'submitted', 'under-review', 'revision-requested', 'accepted', 'rejected',
]

// ── Assign Reviewer Modal ────────────────────────────────────────────────────

function AssignReviewerModal({
  abstract,
  reviewers,
  onClose,
  onAssigned,
}: {
  abstract: Abstract
  reviewers: ReviewerOption[]
  onClose: () => void
  onAssigned: (abstractId: number, reviewer: ReviewerOption) => void
}) {
  const { token } = useAuth()
  const [selectedId, setSelectedId] = useState<number | ''>(
    (abstract.assignedReviewer as any)?.id ?? ''
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!token || !selectedId) return
    setSaving(true)
    setError('')
    try {
      await assignReviewer(token, abstract.id, Number(selectedId))
      const reviewer = reviewers.find((r) => r.id === Number(selectedId))!
      onAssigned(abstract.id, reviewer)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign reviewer')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-sm shadow-xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-charcoal">Assign Reviewer</h3>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{abstract.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-charcoal transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Reviewer
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-primary"
            >
              <option value="">Select a reviewer…</option>
              {reviewers.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.firstName ? `${r.firstName} ${r.lastName ?? ''}`.trim() : r.email}
                  {' '}({r.userRole})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 pt-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-200 rounded-sm text-gray-600 hover:border-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selectedId}
            className="px-4 py-2 text-sm bg-primary text-white rounded-sm hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {saving && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Assign
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Abstract Row ─────────────────────────────────────────────────────────────

function AbstractRow({
  ab,
  index,
  updating,
  onStatusChange,
  onAssignClick,
}: {
  ab: Abstract
  index: number
  updating: number | null
  onStatusChange: (id: number, status: AbstractStatus) => void
  onAssignClick: (ab: Abstract) => void
}) {
  const navigate = useNavigate()
  const submitter = ab.user as any
  const conference = ab.conference as any
  const reviewer = ab.assignedReviewer as any
  const doc = (ab as any).documentUpload
  const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-white border border-gray-100 rounded-sm p-4 hover:border-primary/20 transition-colors"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-charcoal text-sm mb-1 leading-snug">{ab.title}</h4>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
            {submitter && (
              <span>
                Author: <strong className="text-charcoal">
                  {submitter.firstName ? `${submitter.firstName} ${submitter.lastName ?? ''}`.trim() : submitter.email}
                </strong>
              </span>
            )}
            {(ab as any).institution && (
              <span className="text-gray-400">{(ab as any).institution}</span>
            )}
            {conference && (
              <span>Conf: <strong className="text-charcoal">{conference.title}</strong></span>
            )}
            <span className="capitalize">Type: <strong className="text-charcoal">{ab.presentationType}</strong></span>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <StatusBadge status={ab.status} />
            {reviewer ? (
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                Reviewer: {reviewer.firstName ? `${reviewer.firstName} ${reviewer.lastName ?? ''}`.trim() : reviewer.email}
              </span>
            ) : (
              <span className="text-xs bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full">
                No reviewer
              </span>
            )}
            {ab.keywords && (
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                {ab.keywords.split(',').slice(0, 2).map((k) => k.trim()).join(', ')}
              </span>
            )}
          </div>

          {(ab as any).coAuthors && (
            <p className="text-xs text-gray-400 mt-1">Co-authors: {(ab as any).coAuthors}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Document download */}
          {doc && (
            <a
              href={`${BASE_URL}${doc.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-sm text-gray-600 hover:border-primary/40 hover:text-primary transition-colors"
              title="Download abstract document"
            >
              <Download size={12} />
              Doc
            </a>
          )}

          {/* Review button */}
          <button
            onClick={() => navigate(`/dashboard/reviews/abstract/${ab.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-charcoal text-white rounded-sm hover:bg-charcoal/90 transition-colors font-medium"
          >
            <Eye size={12} />
            Review
          </button>

          {/* Assign Reviewer button */}
          <button
            onClick={() => onAssignClick(ab)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-primary/30 text-primary rounded-sm hover:bg-primary/5 transition-colors font-medium"
          >
            <UserPlus size={12} />
            {reviewer ? 'Reassign' : 'Assign Reviewer'}
          </button>

          {/* Status change dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1 border border-gray-200 rounded-sm px-3 py-1.5 text-xs bg-white hover:border-primary/30 transition-colors">
              <select
                value={ab.status}
                disabled={updating === ab.id}
                onChange={(e) => onStatusChange(ab.id, e.target.value as AbstractStatus)}
                className="appearance-none bg-transparent text-charcoal font-semibold focus:outline-none cursor-pointer pr-4 capitalize"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
              <ChevronDown size={11} className="text-gray-400 pointer-events-none absolute right-2" />
            </div>
            {updating === ab.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-sm">
                <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Subtheme Section ─────────────────────────────────────────────────────────

function SubthemeSection({
  subtheme,
  abstracts,
  updating,
  onStatusChange,
  onAssignClick,
  startIndex,
}: {
  subtheme: string
  abstracts: Abstract[]
  updating: number | null
  onStatusChange: (id: number, status: AbstractStatus) => void
  onAssignClick: (ab: Abstract) => void
  startIndex: number
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="space-y-2">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center gap-2 text-left group"
      >
        <div className="h-px flex-1 bg-primary/20" />
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/15 rounded-sm shrink-0">
          <ChevronRight
            size={13}
            className={`text-primary transition-transform ${collapsed ? '' : 'rotate-90'}`}
          />
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">
            {subtheme}
          </span>
          <span className="text-xs text-primary/60 font-normal">({abstracts.length})</span>
        </div>
        <div className="h-px flex-1 bg-primary/20" />
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {abstracts.map((ab, i) => (
              <AbstractRow
                key={ab.id}
                ab={ab}
                index={startIndex + i}
                updating={updating}
                onStatusChange={onStatusChange}
                onAssignClick={onAssignClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── AdminPanel ───────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const { token } = useAuth()
  const [abstracts, setAbstracts] = useState<Abstract[]>([])
  const [reviewers, setReviewers] = useState<ReviewerOption[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<AbstractStatus | 'all'>('all')
  const [updating, setUpdating] = useState<number | null>(null)
  const [assignTarget, setAssignTarget] = useState<Abstract | null>(null)
  const [exporting, setExporting] = useState(false)

  const load = useCallback(async () => {
    if (!token) return
    const [data, revs] = await Promise.all([getAllAbstracts(token), getReviewers(token)])
    setAbstracts(data)
    setReviewers(revs)
    setLoading(false)
  }, [token])

  useEffect(() => { load() }, [load])

  const handleStatusChange = async (id: number, status: AbstractStatus) => {
    if (!token) return
    setUpdating(id)
    try {
      await updateAbstractStatus(token, id, status)
      setAbstracts((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
    } finally {
      setUpdating(null)
    }
  }

  const handleAssigned = (abstractId: number, reviewer: ReviewerOption) => {
    setAbstracts((prev) =>
      prev.map((a) =>
        a.id === abstractId
          ? { ...a, assignedReviewer: reviewer as any, status: a.status === 'submitted' ? 'under-review' : a.status }
          : a
      )
    )
  }

  const handleExport = async () => {
    if (!token) return
    setExporting(true)
    try { await downloadAbstractsCsv(token) }
    catch { /* silently fail */ }
    finally { setExporting(false) }
  }

  const filtered = filter === 'all' ? abstracts : abstracts.filter((a) => a.status === filter)

  // Group by subtheme
  const grouped = filtered.reduce<Record<string, Abstract[]>>((acc, ab) => {
    const key = (ab as any).subtheme?.trim() || '(No Subtheme)'
    if (!acc[key]) acc[key] = []
    acc[key].push(ab)
    return acc
  }, {})
  const subthemeKeys = Object.keys(grouped).sort((a, b) =>
    a === '(No Subtheme)' ? 1 : b === '(No Subtheme)' ? -1 : a.localeCompare(b)
  )

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((n) => <div key={n} className="h-20 bg-white border border-gray-100 rounded-sm animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Filter:</span>
          {(['all', ...STATUS_OPTIONS] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-sm font-semibold capitalize transition-colors ${
                filter === s
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-primary/30'
              }`}
            >
              {s === 'all' ? `All (${abstracts.length})` : s}
            </button>
          ))}
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 text-xs border border-gray-200 rounded-sm text-charcoal hover:border-primary/30 hover:text-primary transition-colors font-semibold disabled:opacity-60"
        >
          <Download size={13} />
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Settings}
          title="No abstracts"
          description="No abstracts match the selected filter."
        />
      ) : (
        <div className="space-y-6">
          {subthemeKeys.map((subtheme, si) => {
            const prevCount = subthemeKeys.slice(0, si).reduce((n, k) => n + grouped[k].length, 0)
            return (
              <SubthemeSection
                key={subtheme}
                subtheme={subtheme}
                abstracts={grouped[subtheme]}
                updating={updating}
                onStatusChange={handleStatusChange}
                onAssignClick={setAssignTarget}
                startIndex={prevCount}
              />
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {assignTarget && (
          <AssignReviewerModal
            abstract={assignTarget}
            reviewers={reviewers}
            onClose={() => setAssignTarget(null)}
            onAssigned={handleAssigned}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
