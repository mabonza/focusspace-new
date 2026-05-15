import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import Button from '../components/Button'
import { SkeletonPublicationRow } from '../components/Skeleton'
import { useSEO } from '../hooks/useSEO'
import { getPublications, getStrapiMediaUrl, getImageUrl } from '../services/strapi'
import type { Publication } from '../types'

export default function Publications() {
  useSEO({
    title: 'Publications',
    description: 'Access conference proceedings, policy briefs, and research summaries from Focus Space events.',
  })

  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublications().then((data) => { setPublications(data); setLoading(false) })
  }, [])

  return (
    <div>
      <Hero
        title="Publications"
        subtitle="Research & Proceedings"
        description="Access conference proceedings, policy briefs, and research summaries from Focus Space events."
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1800&auto=format&fit=crop"
        size="small"
      />
      <section className="section-padding bg-white">
        <div className="container-max">
          <SectionTitle subtitle="Downloads" title="Conference Publications" description="Free to download. All publications are made available for academic use." />
          {loading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((n) => <SkeletonPublicationRow key={n} />)}
            </div>
          ) : (
            <div className="space-y-5">
              {publications.map((pub, i) => (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card rounded-sm p-6 flex flex-col sm:flex-row gap-5"
                >
                  <div className="w-16 h-20 bg-primary-50 rounded-sm flex items-center justify-center shrink-0 overflow-hidden">
                    {pub.coverImage ? (
                      <img src={getImageUrl(pub.coverImage)} alt={pub.title} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <FileText size={24} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-charcoal text-lg mb-2 hover:text-primary transition-colors">{pub.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">{pub.description}</p>
                    {pub.publicationDate && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar size={12} />
                        <span>{format(new Date(pub.publicationDate), 'MMMM yyyy')}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-start shrink-0">
                    <Button href={pub.file ? getStrapiMediaUrl(pub.file) ?? '#' : '#'} variant="outline" size="sm">
                      <Download size={14} />
                      Download
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
