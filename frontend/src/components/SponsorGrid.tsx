import { motion } from 'framer-motion'
import type { Sponsor } from '../types'
import { getStrapiMediaUrl } from '../services/strapi'

const tierOrder = ['platinum', 'gold', 'silver', 'bronze', 'partner']
const tierLabels: Record<string, string> = {
  platinum: 'Platinum Sponsors',
  gold: 'Gold Sponsors',
  silver: 'Silver Sponsors',
  bronze: 'Bronze Sponsors',
  partner: 'Partners',
}
const tierSizes: Record<string, string> = {
  platinum: 'h-20',
  gold: 'h-16',
  silver: 'h-12',
  bronze: 'h-10',
  partner: 'h-10',
}

interface SponsorGridProps {
  sponsors: Sponsor[]
}

export default function SponsorGrid({ sponsors }: SponsorGridProps) {
  const grouped = tierOrder.reduce<Record<string, Sponsor[]>>((acc, tier) => {
    const items = sponsors.filter((s) => s.tier === tier)
    if (items.length > 0) acc[tier] = items
    return acc
  }, {})

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([tier, items]) => (
        <div key={tier}>
          <h4 className="text-center text-sm font-semibold uppercase tracking-widest text-gray-400 mb-6">
            {tierLabels[tier]}
          </h4>
          <div className="flex flex-wrap justify-center gap-6 items-center">
            {items.map((sponsor, i) => (
              <motion.a
                key={sponsor.id}
                href={sponsor.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center justify-center px-8 py-5 bg-white border border-gray-100 rounded-sm hover:border-gold hover:shadow-md transition-all duration-300 min-w-[140px]"
              >
                {sponsor.logo ? (
                  <img
                    src={getStrapiMediaUrl(sponsor.logo)}
                    alt={sponsor.name}
                    loading="lazy"
                    className={`${tierSizes[sponsor.tier]} object-contain grayscale hover:grayscale-0 transition-all`}
                  />
                ) : (
                  <span className="text-gray-700 font-semibold text-sm text-center">{sponsor.name}</span>
                )}
              </motion.a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
