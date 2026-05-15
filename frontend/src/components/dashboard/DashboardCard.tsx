import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  trend?: { value: string; positive?: boolean }
  index?: number
}

export default function DashboardCard({
  title, value, subtitle, icon: Icon, iconColor = 'text-primary', trend, index = 0,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white border border-gray-100 rounded-sm p-6 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 bg-primary-50 rounded-sm flex items-center justify-center`}>
          <Icon size={20} className={iconColor} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-gray-500 text-xs uppercase tracking-widest font-medium mb-1">{title}</p>
      <p className="text-3xl font-serif font-bold text-charcoal">{value}</p>
      {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
    </motion.div>
  )
}
