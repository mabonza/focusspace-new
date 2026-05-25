import { Link } from 'react-router-dom'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import CountdownTimer from './CountdownTimer'
import Button from './Button'
import type { Event } from '../types'
import { getImageUrl } from '../services/strapi'

const typeColors: Record<string, string> = {
  conference: 'bg-primary text-white',
  summit: 'bg-charcoal text-white',
  workshop: 'bg-gold text-white',
  webinar: 'bg-blue-600 text-white',
  'pre-conference': 'bg-gray-700 text-white',
}

interface EventCardProps {
  event: Event
  index?: number
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const isPast = event.eventStatus === 'past'
  const imageUrl = getImageUrl(event.image, `https://picsum.photos/seed/${event.id + 10}/800/400`)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="card rounded-sm overflow-hidden flex flex-col group"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48 bg-gray-100">
        <img
          src={imageUrl}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Type badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-sm ${typeColors[event.type] || 'bg-gray-700 text-white'}`}>
          {event.type}
        </span>
        {isPast && (
          <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
            <span className="text-white text-xs font-semibold uppercase tracking-widest bg-charcoal/70 px-4 py-2 rounded-sm">
              Past Event
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-charcoal text-lg leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} className="text-gold shrink-0" />
            <span>{format(new Date(event.startDate), 'dd MMM yyyy')}</span>
            {event.endDate && event.endDate !== event.startDate && (
              <span>– {format(new Date(event.endDate), 'dd MMM yyyy')}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={14} className="text-gold shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-3 flex-1">
          {event.shortDescription}
        </p>

        {/* Countdown for upcoming */}
        {!isPast && (
          <div className="mb-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-medium">Event starts in</p>
            <CountdownTimer targetDate={event.startDate} compact />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
          {!isPast && event.registrationUrl && (
            <Button
              variant="primary"
              size="sm"
              href={event.registrationUrl}
              className="flex-1 justify-center"
            >
              Register Now
            </Button>
          )}
          <Link
            to={`/conferences/${event.conference?.slug ?? event.slug}`}
            className={`flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-600 transition-colors ${!isPast && event.registrationUrl ? '' : 'flex-1 btn-outline'}`}
          >
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
