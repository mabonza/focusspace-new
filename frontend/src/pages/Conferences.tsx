import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import EventCard from '../components/EventCard'
import { SkeletonEventCard } from '../components/Skeleton'
import { useSEO } from '../hooks/useSEO'
import { getUpcomingEvents, getPastEvents } from '../services/strapi'
import type { Event } from '../types'

export default function Conferences() {
  useSEO({
    title: 'Conferences & Events',
    description: 'Browse upcoming and past academic conferences, workshops, summits, and webinars hosted on Focus Space.',
  })

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [filter, setFilter] = useState<'all' | 'conference' | 'workshop' | 'webinar' | 'summit'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getUpcomingEvents(), getPastEvents()]).then(([upcoming, past]) => {
      setUpcomingEvents(upcoming)
      setPastEvents(past)
      setLoading(false)
    })
  }, [])

  const allEvents = [...upcomingEvents, ...pastEvents]
  const filtered = filter === 'all' ? allEvents : allEvents.filter((e) => e.type === filter)

  return (
    <div>
      <Hero
        title="Conferences & Events"
        subtitle="All Events"
        description="Browse upcoming and past academic conferences, workshops, summits, and webinars hosted on the Focus Space platform."
        backgroundImage="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1800&auto=format&fit=crop"
        size="small"
      />
      <section className="section-padding bg-white">
        <div className="container-max">
          <SectionTitle subtitle="Browse Events" title="All Conferences & Events" />
          <div className="flex flex-wrap gap-2 mb-10">
            <span className="flex items-center gap-1.5 text-sm text-gray-500 mr-2"><Filter size={14} /> Filter:</span>
            {(['all', 'conference', 'summit', 'workshop', 'webinar'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 text-sm font-medium rounded-sm capitalize transition-colors ${
                  filter === type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonEventCard key={n} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400"><p className="text-lg">No events found for the selected filter.</p></div>
          ) : (
            <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
