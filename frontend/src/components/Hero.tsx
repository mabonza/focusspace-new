import { motion } from 'framer-motion'
import Button from './Button'

interface HeroProps {
  title: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  primaryAction?: { label: string; to?: string; href?: string }
  secondaryAction?: { label: string; to?: string; href?: string }
  badge?: string
  overlay?: boolean
  size?: 'full' | 'medium' | 'small'
}

export default function Hero({
  title,
  subtitle,
  description,
  backgroundImage,
  primaryAction,
  secondaryAction,
  badge,
  overlay = true,
  size = 'full',
}: HeroProps) {
  const heights = { full: 'min-h-[85vh]', medium: 'min-h-[60vh]', small: 'min-h-[40vh]' }

  return (
    <section
      className={`relative flex items-center ${heights[size]} bg-charcoal overflow-hidden`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/40" />
      )}

      {/* Decorative accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-gold to-primary" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          {badge && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-5"
            >
              <span className="px-4 py-1.5 bg-gold/20 border border-gold/40 text-gold text-xs font-semibold uppercase tracking-widest rounded-sm">
                {badge}
              </span>
            </motion.div>
          )}

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gold text-sm font-semibold uppercase tracking-widest mb-4"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6"
          >
            {title}
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-300 text-lg leading-relaxed mb-10 max-w-2xl"
            >
              {description}
            </motion.p>
          )}

          {(primaryAction || secondaryAction) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              {primaryAction && (
                <Button variant="primary" size="lg" to={primaryAction.to} href={primaryAction.href}>
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button variant="outline" size="lg" to={secondaryAction.to} href={secondaryAction.href}
                  className="border-white text-white hover:bg-white hover:text-charcoal"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/10 to-transparent" />
    </section>
  )
}
