import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, FileText, Users, CreditCard, Award, QrCode, Bot, Smartphone, Lock,
} from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

const modules = [
  {
    icon: FileText,
    title: 'Abstract Submission',
    description: 'Submit and manage your research abstracts for review.',
    status: 'coming-soon',
  },
  {
    icon: Users,
    title: 'Reviewer Dashboard',
    description: 'Review and score submitted abstracts.',
    status: 'coming-soon',
  },
  {
    icon: CreditCard,
    title: 'Registration & Payments',
    description: 'Register for conferences and process payments securely.',
    status: 'coming-soon',
  },
  {
    icon: FileText,
    title: 'Invoice Generation',
    description: 'Generate and download registration invoices.',
    status: 'coming-soon',
  },
  {
    icon: Award,
    title: 'Certificates',
    description: 'Download your attendance and participation certificates.',
    status: 'coming-soon',
  },
  {
    icon: QrCode,
    title: 'QR Check-in',
    description: 'Contactless event check-in via QR code.',
    status: 'coming-soon',
  },
  {
    icon: Bot,
    title: 'AI Abstract Review',
    description: 'AI-assisted scoring and review recommendations.',
    status: 'coming-soon',
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Full conference experience on Android and iOS.',
    status: 'coming-soon',
  },
]

export default function Dashboard() {
  useSEO({
    title: 'Delegate Dashboard',
    description: 'Manage your conference registrations, abstract submissions, and certificates.',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-charcoal text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center">
            <LayoutDashboard size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold">Delegate Dashboard</h1>
            <p className="text-gray-400 text-sm">Manage your conference registrations and submissions</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Auth notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-sm p-5 mb-10 flex items-start gap-4"
        >
          <Lock size={20} className="text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 text-sm">Authentication Required</p>
            <p className="text-yellow-700 text-sm mt-1">
              Full dashboard functionality requires authentication. Sign in to access your account, or{' '}
              <Link to="/login" className="underline font-semibold">sign in here</Link>.
              Full auth integration is planned for Phase 2.
            </p>
          </div>
        </motion.div>

        <h2 className="text-xl font-serif font-bold text-charcoal mb-6">Available Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map(({ icon: Icon, title, description, status }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border border-gray-100 rounded-sm p-5 relative overflow-hidden group"
            >
              <div className="absolute top-3 right-3">
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm font-medium">
                  Coming Soon
                </span>
              </div>
              <div className="w-10 h-10 bg-primary-50 rounded-sm flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <Icon size={18} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-charcoal text-sm mb-2">{title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="text-sm text-primary hover:underline">← Return to Homepage</Link>
        </div>
      </div>
    </div>
  )
}
