import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, BookOpen, Globe, Award, Play, ArrowRight, CheckCircle, Calendar, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import EventCard from '../components/EventCard'
import NewsletterForm from '../components/NewsletterForm'
import Button from '../components/Button'
import CountdownTimer from '../components/CountdownTimer'
import { SkeletonEventCard, SkeletonHeroSection } from '../components/Skeleton'
import { useSEO } from '../hooks/useSEO'
import { getUpcomingConferences, getPastEvents, getFeaturedConference, getStrapiMediaUrl, getImageUrl } from '../services/strapi'
import type { Conference } from '../types'

const stats = [
  { icon: Users, label: 'Delegates', value: '3,000+' },
  { icon: Globe, label: 'Countries', value: '45+' },
  { icon: BookOpen, label: 'Abstracts', value: '800+' },
  { icon: Award, label: 'Conferences', value: '12+' },
]

const expectations = [
  { title: 'World-Class Keynotes', description: 'Hear from leading researchers, policymakers, and practitioners shaping global health and public policy.' },
  { title: 'Cutting-Edge Research', description: 'Access peer-reviewed abstracts, oral presentations, and poster sessions from across the continent.' },
  { title: 'Networking Opportunities', description: 'Connect with delegates from 40+ countries during structured networking sessions and social events.' },
  { title: 'Workshops & Training', description: 'Participate in intensive pre-conference workshops covering methods, tools, and practical skills.' },
  { title: 'Policy Dialogues', description: 'Engage in high-level policy dialogues translating evidence into action for health systems reform.' },
  { title: 'Publications & Proceedings', description: 'Access full conference proceedings, policy briefs, and research summaries post-event.' },
]

export default function Home() {
  useSEO({
    description: 'Join thousands of researchers, policymakers, and health professionals at the continent\'s leading academic conference platform.',
  })

  const [featured, setFeatured] = useState<Conference | null>(null)
  const [heroLoading, setHeroLoading] = useState(true)
  const [upcomingConferences, setUpcomingConferences] = useState<Conference[]>([])
  const [pastEvents, setPastEvents] = useState<import('../types').Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFeaturedConference().then((conf) => {
      setFeatured(conf)
      setHeroLoading(false)
    })
    Promise.all([getUpcomingConferences(), getPastEvents()]).then(([upcoming, past]) => {
      setUpcomingConferences(upcoming)
      setPastEvents(past.slice(0, 3))
      setLoading(false)
    })
  }, [])

  const heroImage =
    getStrapiMediaUrl(featured?.heroImage) ??
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1800&auto=format&fit=crop'

  return (
    <div>
      {/* Hero — driven by featured conference */}
      {heroLoading ? (
        <SkeletonHeroSection />
      ) : (
        <Hero
          badge={featured ? `${featured.conferenceStatus === 'upcoming' ? 'Upcoming' : 'Featured'} — ${featured.year ?? ''}` : 'Upcoming — September 2025'}
          subtitle="Focus Space Conference Platform"
          title={featured?.theme ?? 'Advancing Research. Shaping Policy. Connecting Africa.'}
          description={
            featured
              ? `${featured.title} · ${featured.venue}, ${featured.location}`
              : 'Join thousands of researchers, policymakers, and health professionals at the continent\'s leading academic conference platform.'
          }
          backgroundImage={heroImage}
          primaryAction={{ label: 'View Upcoming Conferences', to: '/conferences' }}
          secondaryAction={{ label: featured ? 'Learn More' : 'Contact Us', to: featured ? `/conferences/${featured.slug}` : '/contact' }}
        />
      )}

      {/* Stats bar */}
      <div className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <Icon size={24} className="text-gold mx-auto mb-2" />
                <p className="text-3xl font-bold text-white font-serif">{value}</p>
                <p className="text-primary-200 text-sm mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Countdown — only shown when featured conference is upcoming */}
      {featured?.startDate && featured.conferenceStatus === 'upcoming' && (
        <div className="bg-charcoal py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold mb-1">Save the Date</p>
                <h3 className="text-white font-serif text-xl font-bold">{featured.title}</h3>
                <p className="text-white/60 text-sm mt-0.5">
                  {featured.venue}{featured.location ? `, ${featured.location}` : ''}
                </p>
              </div>
              <CountdownTimer targetDate={featured.startDate} variant="light" label="Conference starts in" />
            </div>
          </div>
        </div>
      )}

      {/* Welcome */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionTitle
                subtitle="Welcome to Focus Space"
                title="The Home of African Academic Conferences"
                description="Focus Space brings together the brightest minds in research, policy, and practice to advance knowledge and strengthen systems across Africa and beyond."
              />
              <p className="text-gray-600 leading-relaxed mb-6">
                Since our founding, Focus Space has hosted flagship conferences across health systems, public health, digital innovation, and policy reform — convening delegates from over 45 countries. Our platform provides end-to-end conference management: from abstract submission to certificate generation.
              </p>
              <Button to="/conferences" variant="primary">
                Explore Our Conferences <ArrowRight size={16} />
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="aspect-[4/3] rounded-sm overflow-hidden">
                <img
                  src="/Option-1-for-backend-cover-copy-scaled.webp"
                  alt="Conference delegates"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary p-6 rounded-sm text-white">
                <p className="text-4xl font-bold font-serif">12+</p>
                <p className="text-primary-200 text-sm">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <SectionTitle subtitle="What We Offer" title="What You Can Expect" description="A world-class conference experience designed for academic rigour, practical relevance, and meaningful connections." centered />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expectations.map(({ title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white p-6 rounded-sm border border-gray-100 hover:border-gold hover:shadow-md transition-all duration-300"
              >
                <div className="w-8 h-8 bg-primary-50 rounded-sm flex items-center justify-center mb-4">
                  <CheckCircle size={18} className="text-primary" />
                </div>
                <h3 className="font-serif font-bold text-charcoal text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Conferences */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <SectionTitle subtitle="What's Coming" title="Upcoming Events" />
            <Link to="/conferences" className="text-sm font-semibold text-primary hover:text-primary-600 flex items-center gap-1.5 shrink-0 mb-4">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => <SkeletonEventCard key={n} />)}
            </div>
          ) : upcomingConferences.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No upcoming conferences at this time.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingConferences.map((conf, i) => (
                <motion.div
                  key={conf.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="card rounded-sm overflow-hidden flex flex-col group"
                >
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
                  </div>
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
                      <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-3 flex-1 italic">{conf.theme}</p>
                    )}
                    {conf.startDate && (
                      <div className="mb-5">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-medium">Conference starts in</p>
                        <CountdownTimer targetDate={conf.startDate} compact />
                      </div>
                    )}
                    <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                      <Link
                        to={`/conferences/${conf.slug}`}
                        className="flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-600 transition-colors flex-1 btn-outline"
                      >
                        View Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <SectionTitle subtitle="Our History" title="Past Events" />
            <Link to="/past-events" className="text-sm font-semibold text-primary hover:text-primary-600 flex items-center gap-1.5 shrink-0 mb-4">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => <SkeletonEventCard key={n} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastEvents.map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* Featured Video */}
      <section className="section-padding bg-charcoal">
        <div className="container-max">
          <SectionTitle subtitle="Highlights" title="Conference Highlights" description="Relive the most impactful moments from our recent conferences." centered light />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto rounded-sm overflow-hidden bg-black aspect-video"
          >
            <video
              src="/focus-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-black/30 flex items-center justify-center shadow-xl">
                <Play size={28} className="text-white" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-1">ICHS 2024 Highlights</p>
              <p className="text-xl font-serif font-bold">Three Days. Hundreds of Ideas.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <NewsletterForm />
    </div>
  )
}
