import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { getConferences } from '../../services/strapi'
import StatusBadge from '../../components/dashboard/StatusBadge'
import EmptyState from '../../components/dashboard/EmptyState'
import type { Conference } from '../../types'

export default function MyConferences() {
  const [conferences, setConferences] = useState<Conference[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getConferences().then((data) => { setConferences(data); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => <div key={n} className="h-24 bg-white border border-gray-100 rounded-sm animate-pulse" />)}
      </div>
    )
  }

  if (conferences.length === 0) {
    return <EmptyState title="No conferences found" description="Conferences will appear here once published." />
  }

  return (
    <div className="space-y-4">
      {conferences.map((conf) => (
        <div key={conf.id} className="bg-white border border-gray-100 rounded-sm p-5 flex flex-col sm:flex-row gap-4 hover:border-primary/20 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <StatusBadge status={conf.conferenceStatus} />
              {conf.registrationOpen && (
                <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                  Registration Open
                </span>
              )}
              {conf.abstractSubmissionOpen && (
                <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  Abstracts Open
                </span>
              )}
            </div>
            <h3 className="font-semibold text-charcoal text-base mb-1">{conf.title}</h3>
            {conf.theme && <p className="text-sm text-gold italic mb-2">{conf.theme}</p>}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              {conf.startDate && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={12} className="text-gold" />
                  {format(new Date(conf.startDate), 'dd MMM yyyy')}
                  {conf.endDate ? ` – ${format(new Date(conf.endDate), 'dd MMM yyyy')}` : ''}
                </span>
              )}
              {conf.venue && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-gold" />
                  {conf.venue}, {conf.location}
                </span>
              )}
            </div>
          </div>
          <div className="flex sm:flex-col gap-2 shrink-0 sm:items-end justify-start sm:justify-start">
            <Link
              to={`/conferences/${conf.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-600 border border-primary/30 px-3 py-1.5 rounded-sm hover:bg-primary-50 transition-colors"
            >
              <ExternalLink size={12} /> View Conference
            </Link>
            {conf.registrationOpen && (
              <Link
                to={`/dashboard/conferences/${conf.id}/register`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-sm hover:bg-primary-600 transition-colors"
              >
                Register Now
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
