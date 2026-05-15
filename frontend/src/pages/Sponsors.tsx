import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import SponsorGrid from '../components/SponsorGrid'
import Button from '../components/Button'
import { SkeletonSection } from '../components/Skeleton'
import { useSEO } from '../hooks/useSEO'
import { getSponsors } from '../services/strapi'
import type { Sponsor } from '../types'

export default function Sponsors() {
  useSEO({
    title: 'Sponsors & Partners',
    description: 'Focus Space conferences are made possible through the generous support of our sponsors and partners.',
  })

  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSponsors().then((data) => { setSponsors(data); setLoading(false) })
  }, [])

  return (
    <div>
      <Hero
        title="Sponsors & Partners"
        subtitle="Our Partners"
        description="Focus Space conferences are made possible through the generous support of our sponsors and partners."
        backgroundImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1800&auto=format&fit=crop"
        size="small"
      />
      <section className="section-padding bg-white">
        <div className="container-max">
          <SectionTitle subtitle="Sponsors" title="Our Sponsors & Partners" description="We are grateful to the organisations that make our conferences possible." centered />
          {loading ? <SkeletonSection count={3} cardHeight="h-20" /> : <SponsorGrid sponsors={sponsors} />}
        </div>
      </section>
      <section className="section-padding bg-gray-50">
        <div className="container-max max-w-3xl text-center">
          <SectionTitle subtitle="Partner With Us" title="Become a Sponsor" description="Showcase your organisation to thousands of academics, policymakers, and practitioners. Contact us for sponsorship packages." centered />
          <div className="flex flex-wrap gap-4 justify-center">
            <Button to="/contact" variant="primary">Contact Us</Button>
            <Button href="#" variant="outline">Download Sponsorship Pack</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
