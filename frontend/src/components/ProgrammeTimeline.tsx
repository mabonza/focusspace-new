import { motion } from 'framer-motion'
import { Clock, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import type { ProgrammeSession } from '../types'

const sessionTypeColors: Record<string, string> = {
  Plenary: 'border-l-primary bg-primary-50',
  Panel: 'border-l-gold bg-yellow-50',
  Workshop: 'border-l-blue-500 bg-blue-50',
  'Oral Presentations': 'border-l-green-600 bg-green-50',
  default: 'border-l-gray-400 bg-gray-50',
}

interface ProgrammeTimelineProps {
  sessions: ProgrammeSession[]
}

export default function ProgrammeTimeline({ sessions }: ProgrammeTimelineProps) {
  const grouped = sessions.reduce<Record<string, ProgrammeSession[]>>((acc, session) => {
    const day = format(new Date(session.startTime), 'EEEE, dd MMMM yyyy')
    if (!acc[day]) acc[day] = []
    acc[day].push(session)
    return acc
  }, {})

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([day, daySessions]) => (
        <div key={day}>
          <h3 className="font-serif font-bold text-charcoal text-xl mb-5 pb-3 border-b border-gray-200">
            {day}
          </h3>
          <div className="space-y-4">
            {daySessions.map((session, i) => {
              const colorClass = (session.sessionType && sessionTypeColors[session.sessionType]) || sessionTypeColors.default
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className={`border-l-4 pl-5 py-4 pr-4 rounded-r-sm ${colorClass}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-charcoal text-base">{session.title}</h4>
                    <span className="text-xs font-semibold text-primary bg-primary-50 border border-primary-100 px-3 py-1 rounded-sm shrink-0 self-start">
                      {session.sessionType}
                    </span>
                  </div>
                  {session.description && (
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{session.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-gold" />
                      {format(new Date(session.startTime), 'HH:mm')}{session.endTime ? ` – ${format(new Date(session.endTime), 'HH:mm')}` : ''}
                    </span>
                    {session.venueRoom && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-gold" />
                        {session.venueRoom}
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
