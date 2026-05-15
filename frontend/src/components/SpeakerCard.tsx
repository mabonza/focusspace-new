import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import type { Speaker } from '../types'
import { getImageUrl } from '../services/strapi'

const roleColors: Record<string, string> = {
  keynote: 'bg-primary text-white',
  host: 'bg-charcoal text-white',
  speaker: 'bg-gold text-white',
  panelist: 'bg-blue-600 text-white',
  reviewer: 'bg-gray-500 text-white',
}

interface SpeakerCardProps {
  speaker: Speaker
  index?: number
}

export default function SpeakerCard({ speaker, index = 0 }: SpeakerCardProps) {
  const photoUrl = getImageUrl(speaker.photo)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="card rounded-sm overflow-hidden group text-center p-6"
    >
      {/* Photo */}
      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-100 mb-4 ring-4 ring-primary-50 group-hover:ring-primary transition-all duration-300">
        {speaker.photo ? (
          <img
            src={photoUrl}
            alt={speaker.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-50">
            <User size={36} className="text-primary-200" />
          </div>
        )}
      </div>

      {/* Role badge */}
      <span className={`inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-sm mb-3 ${roleColors[speaker.role] || 'bg-gray-500 text-white'}`}>
        {speaker.role}
      </span>

      <h3 className="font-serif font-bold text-charcoal text-lg leading-snug mb-1">
        {speaker.name}
      </h3>
      <p className="text-gold text-sm font-medium mb-1">{speaker.title}</p>
      <p className="text-gray-500 text-xs mb-4">{speaker.organisation}</p>

      {speaker.bio && (
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{speaker.bio}</p>
      )}
    </motion.div>
  )
}
