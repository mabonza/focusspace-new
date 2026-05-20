const configs: Record<string, { bg: string; text: string; dot: string }> = {
  // Conference registration
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  paid: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  failed: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  refunded: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  registered: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  attended: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  'no-show': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400' },
  // Abstract
  draft: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  submitted: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'under-review': { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  'revision-requested': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400' },
  accepted: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  rejected: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400' },
  // Review
  accept: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  reject: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400' },
  revise: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400' },
  // Conference
  upcoming: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  active: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  completed: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  archived: { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-300' },
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  if (!status) return null
  const cfg = configs[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
  const label = status.replace(/-/g, ' ')
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${cfg.bg} ${cfg.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {label}
    </span>
  )
}
