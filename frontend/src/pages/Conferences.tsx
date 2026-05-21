import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight, Filter } from 'lucide-react'
import { format } from 'date-fns'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import CountdownTimer from '../components/CountdownTimer'
import { SkeletonEventCard } from '../components/Skeleton'
import { useSEO } from '../hooks/useSEO'
import { getConferences, getImageUrl } from '../services/strapi'
import type { Conference } from '../types'

type StatusFilter = 'all' | 'upcoming' | 'active' | 'completed'

export default function Conferences() {
  useSEO({
    title: 'Conferences & Events',
    description: 'Browse upcoming and past academic conferences hosted on the Focus Space platform.',
  })

  const [conferences, setConferences] = useState<Conference[]>([])
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getConferences().then((data) => { setConferences(data); setLoading(false) })
  }, [])

  const filtered = filter === 'all'
    ? conferences
    : conferences.filter((c) => c.conferenceStatus === filter)

  return (
    <div>
      <Hero
        title="Conferences & Events"
        subtitle="All Conferences"
        description="Browse upcoming and past academic conferences hosted on the Focus Space platform."
        backgroundImage="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1800&auto=format&fit=crop"
        size="small"
      />
      <section className="section-padding bg-white">
        <div className="container-max">
          <SectionTitle subtitle="Browse Conferences" title="All Conferences & Events" />

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            <span className="flex items-center gap-1.5 text-sm text-gray-500 mr-2">
              <Filter size={14} /> Filter:
            </span>
            {(['all', 'upcoming', 'active', 'completed'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 text-sm font-medium rounded-sm capitalize transition-colors ${
                  filter === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonEventCard key={n} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">No conferences found.</p>
            </div>
          ) : (
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((conf, i) => {
                const isUpcoming = conf.conferenceStatus === 'upcoming' || conf.conferenceStatus === 'active'
                const isPast = conf.conferenceStatus === 'completed' || conf.conferenceStatus === 'archived'
                return (
                  <motion.div
                    key={conf.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="card rounded-sm overflow-hidden flex flex-col group"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden h-48 bg-gray-100">
                      <img
                        src={getImageUrl(conf.bannerImage ?? conf.heroImage, `https://picsum.photos/seed/${conf.id + 20}/800/400`)}
                        alt={conf.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-sm bg-primary text-white">
                        Conference
                      </span>
                      {isPast && (
                        <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold uppercase tracking-widest bg-charcoal/70 px-4 py-2 rounded-sm">
                            Past Conference
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-serif font-bold text-charcoal text-lg leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {conf.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        {conf.startDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={14} className="text-gold shrink-0" />
                            <span>{format(new Date(conf.startDate), 'dd MMM yyyy')}</span>
                            {conf.endDate && conf.endDate !== conf.startDate && (
                              <span>– {format(new Date(conf.endDate), 'dd MMM yyyy')}</span>
                            )}
                          </div>
                        )}
                        {(conf.venue || conf.location) && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={14} className="text-gold shrink-0" />
                            <span className="truncate">{[conf.venue, conf.location].filter(Boolean).join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {conf.theme && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-2 flex-1 italic">
                          {conf.theme}
                        </p>
                      )}

                      {isUpcoming && conf.startDate && (
                        <div className="mb-5">
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-medium">Conference starts in</p>
                          <CountdownTimer targetDate={conf.startDate} compact />
                        </div>
                      )}

                      <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                        {isUpcoming && conf.registrationOpen && (
                          <Link
                            to={`/conferences/${conf.slug}`}
                            className="flex-1 text-center px-4 py-2 text-xs font-semibold bg-primary text-white rounded-sm hover:bg-primary-600 transition-colors"
                          >
                            Register Now
                          </Link>
                        )}
                        <Link
                          to={`/conferences/${conf.slug}`}
                          className={`flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-600 transition-colors ${isUpcoming && conf.registrationOpen ? '' : 'flex-1 btn-outline'}`}
                        >
                          View Details <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
