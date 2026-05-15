import { Search, X } from 'lucide-react'

interface SearchFilterProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

export default function SearchFilter({ value, onChange, placeholder = 'Search…', className = '' }: SearchFilterProps) {
  return (
    <div className={`relative ${className}`}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 pr-8 py-2 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
