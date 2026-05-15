import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import EventCard from '../components/EventCard'
import { SkeletonEventCard } from '../components/Skeleton'
import { useSEO } from '../hooks/useSEO'
import { getPastEvents } from '../services/strapi'
import type { Event } from '../types'

export default function PastEvents() {
  useSEO({
    title: 'Past Events',
    description: 'Explore our archive of past conferences, summits, workshops, and webinars. Access proceedings, publications, and highlights.',
  })

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPastEvents().then((data) => { setEvents(data); setLoading(false) })
  }, [])

  return (
    <div>
      <Hero
        title="Past Events"
        subtitle="Event Archive"
        description="Explore our archive of past conferences, summits, workshops, and webinars. Access proceedings, publications, and highlights."
        backgroundImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1800&auto=format&fit=crop"
        size="small"
      />
      <section className="section-padding bg-white">
        <div className="container-max">
          <SectionTitle subtitle="Archive" title="Past Conferences & Events" description="A record of every event hosted on the Focus Space platform." />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonEventCard key={n} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
