import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import ProgrammeTimeline from '../components/ProgrammeTimeline'
import { SkeletonSection } from '../components/Skeleton'
import { useSEO } from '../hooks/useSEO'
import { getProgrammeSessions } from '../services/strapi'
import type { ProgrammeSession } from '../types'

export default function Programme() {
  useSEO({
    title: 'Programme Schedule',
    description: 'Browse the full schedule of plenary sessions, panels, workshops, and oral presentations.',
  })

  const [sessions, setSessions] = useState<ProgrammeSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProgrammeSessions().then((data) => { setSessions(data); setLoading(false) })
  }, [])

  return (
    <div>
      <Hero
        title="Programme Schedule"
        subtitle="Conference Programme"
        description="Browse the full schedule of plenary sessions, panels, workshops, and oral presentations."
        backgroundImage="https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1800&auto=format&fit=crop"
        size="small"
      />
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <SectionTitle subtitle="Schedule" title="Full Programme" description="All times are local to the conference venue." />
          {loading ? <SkeletonSection count={3} cardHeight="h-24" /> : <ProgrammeTimeline sessions={sessions} />}
        </div>
      </section>
    </div>
  )
}
