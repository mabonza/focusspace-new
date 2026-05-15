import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import SpeakerCard from '../components/SpeakerCard'
import { SkeletonSpeakerCard } from '../components/Skeleton'
import { useSEO } from '../hooks/useSEO'
import { getSpeakers } from '../services/strapi'
import type { Speaker } from '../types'

const roles = ['all', 'keynote', 'host', 'speaker', 'panelist', 'reviewer'] as const
type RoleFilter = typeof roles[number]

export default function Speakers() {
  useSEO({
    title: 'Speakers & Faculty',
    description: 'Meet the researchers, policymakers, and practitioners who share their expertise at Focus Space conferences.',
  })

  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [filter, setFilter] = useState<RoleFilter>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSpeakers().then((data) => {
      setSpeakers(data)
      setLoading(false)
    })
  }, [])

  const filtered = filter === 'all' ? speakers : speakers.filter((s) => s.role === filter)

  return (
    <div>
      <Hero
        title="Speakers & Hosts"
        subtitle="Our Faculty"
        description="Meet the researchers, policymakers, and practitioners who share their expertise at Focus Space conferences."
        backgroundImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&auto=format&fit=crop"
        size="small"
      />
      <section className="section-padding bg-white">
        <div className="container-max">
          <SectionTitle subtitle="Faculty" title="Conference Speakers" />
          <div className="flex flex-wrap gap-2 mb-10">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setFilter(role)}
                className={`px-4 py-1.5 text-sm font-medium rounded-sm capitalize transition-colors ${
                  filter === role ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonSpeakerCard key={n} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((speaker, i) => <SpeakerCard key={speaker.id} speaker={speaker} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
