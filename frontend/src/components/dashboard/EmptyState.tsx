import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import Button from '../Button'
import { Link } from 'react-router-dom'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: { label: string; to: string }
}

export default function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
        <Icon size={28} className="text-primary" />
      </div>
      <h3 className="text-charcoal font-semibold text-lg mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-xs">{description}</p>}
      {action && (
        <Link to={action.to} className="mt-6">
          <Button variant="primary" size="sm">{action.label}</Button>
        </Link>
      )}
    </div>
  )
}
