import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowLeft, AlertCircle, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import SpeakerCard from '../components/SpeakerCard'
import ProgrammeTimeline from '../components/ProgrammeTimeline'
import SponsorGrid from '../components/SponsorGrid'
import CountdownTimer from '../components/CountdownTimer'
import Button from '../components/Button'
import RegistrationModal from '../components/RegistrationModal'
import { SkeletonSection } from '../components/Skeleton'
import { useSEO } from '../hooks/useSEO'
import { getConferenceBySlug, getEventBySlug, getImageUrl } from '../services/strapi'
import { checkRegistration } from '../services/registrations'
import { useAuth } from '../contexts/AuthContext'
import type { Conference } from '../types'

function SubThemeAccordion({ themes }: { themes: { title: string; points?: string[] }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="space-y-2">
      {themes.map((theme, i) => (
        <div key={i} className="border border-gray-200 rounded-sm overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-semibold text-charcoal text-sm uppercase tracking-wide pr-4">
              {i + 1}. {theme.title}
            </span>
            {open === i ? <ChevronUp size={16} className="text-primary shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
          </button>
          {open === i && theme.points && theme.points.length > 0 && (
            <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
              <ul className="mt-3 space-y-1.5 list-disc list-inside">
                {theme.points.map((pt, j) => (
                  <li key={j} className="text-sm text-gray-600">{pt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function DateBox({ label, date }: { label: string; date: string }) {
  const d = new Date(date)
  const formatted = format(d, 'dd MMMM yyyy').toUpperCase()
  return (
    <div className="bg-primary rounded-sm p-4 text-center">
      <p className="text-primary-200 text-xs font-semibold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-white font-bold text-lg font-serif">{formatted}</p>
    </div>
  )
}

export default function ConferenceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [conference, setConference] = useState<Conference | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showRegModal, setShowRegModal] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  useSEO({
    title: conference?.title,
    description: conference?.description,
    image: conference ? getImageUrl(conference.bannerImage ?? conference.heroImage) : undefined,
    type: 'article',
  })

  useEffect(() => {
    if (!slug) return
    getConferenceBySlug(slug).then(async (conf) => {
      if (!conf) {
        // Maybe this is an event slug — try to redirect to the parent conference
        const event = await getEventBySlug(slug)
        if (event?.conference?.slug) {
          navigate(`/conferences/${event.conference.slug}`, { replace: true })
          return
        }
        setNotFound(true)
      }
      setConference(conf)
      setLoading(false)
    })
  }, [slug, navigate])

  useEffect(() => {
    if (!token || !user || !conference) return
    checkRegistration(token, conference.id).then((reg) => setAlreadyRegistered(reg !== null))
  }, [token, user, conference])

  if (loading) {
    return (
      <div>
        <div className="min-h-[60vh] bg-gray-200 animate-pulse" />
        <div className="bg-primary h-14" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <SkeletonSection count={4} cardHeight="h-32" />
        </div>
      </div>
    )
  }

  if (notFound || !conference) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <AlertCircle size={40} className="text-primary" />
        <p className="text-xl font-semibold">Conference not found</p>
        <Link to="/conferences" className="text-primary hover:underline">← Back to conferences</Link>
      </div>
    )
  }

  const isActive = conference.conferenceStatus === 'upcoming' || conference.conferenceStatus === 'active'
  const imageUrl = getImageUrl(
    conference.bannerImage ?? conference.heroImage,
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1800&auto=format&fit=crop'
  )
  const speakers = conference.speakers ?? []
  const sessions = conference.programmeSessions ?? []
  const sponsors = conference.sponsors ?? []
  const subThemes = conference.subThemes ?? []
  const importantDates = conference.importantDates ?? []
  const conferenceFee = conference.conferenceFee ?? 7250
  const preconferenceFee = conference.preconferenceFee ?? 2000

  return (
    <div>
      {/* Hero */}
      <div className="relative min-h-[55vh] flex items-end bg-charcoal overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-32 w-full">
          <Link to="/conferences" className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Conferences
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-sm ${isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}>
              {conference.conferenceStatus}
            </span>
            {conference.year && (
              <span className="text-xs font-semibold uppercase tracking-widest bg-primary px-3 py-1 text-white rounded-sm">
                {conference.year}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-3 max-w-4xl">
            {conference.title}
          </h1>
          {conference.theme && (
            <p className="text-gold text-lg italic mb-5 max-w-3xl">{conference.theme}</p>
          )}
          <div className="flex flex-wrap gap-6 text-gray-300 text-sm mb-6">
            {conference.startDate && (
              <span className="flex items-center gap-2">
                <Calendar size={15} className="text-gold" />
                Conference: {format(new Date(conference.startDate), 'dd MMM')}
                {conference.endDate && conference.endDate !== conference.startDate && (
                  ` – ${format(new Date(conference.endDate), 'dd MMM yyyy')}`
                )}
              </span>
            )}
            {conference.preconferenceStartDate && (
              <span className="flex items-center gap-2">
                <Calendar size={15} className="text-gold" />
                Pre-conference workshops: {format(new Date(conference.preconferenceStartDate), 'dd')}
                {conference.preconferenceEndDate && ` – ${format(new Date(conference.preconferenceEndDate), 'dd MMM yyyy')}`}
              </span>
            )}
            {conference.venue && (
              <span className="flex items-center gap-2">
                <MapPin size={15} className="text-gold" />
                {conference.venue}{conference.location && `, ${conference.location}`}
              </span>
            )}
          </div>
          {conference.hostedBy && (
            <p className="text-gray-400 text-sm">
              <span className="text-white/60 font-medium">Hosted by:</span> {conference.hostedBy}
            </p>
          )}
        </div>
      </div>

      {/* Action bar with countdown */}
      <div className="bg-primary py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            {isActive && conference.registrationOpen && (
              alreadyRegistered ? (
                <span className="px-5 py-2 text-sm font-semibold bg-green-600 text-white rounded-sm flex items-center gap-1.5">
                  ✓ Registered
                </span>
              ) : (
                <Button variant="gold" size="sm" onClick={() => setShowRegModal(true)}>
                  Register Now
                </Button>
              )
            )}
            {isActive && conference.abstractSubmissionOpen && (
              <Link
                to="/dashboard/abstracts/new"
                className="px-5 py-2 text-sm font-semibold border border-white/40 text-white rounded-sm hover:bg-white/10 transition-colors"
              >
                Submit Abstract
              </Link>
            )}
          </div>
          {isActive && conference.startDate && (
            <div className="flex items-center gap-3 text-white">
              <span className="text-xs text-white/60 uppercase tracking-widest hidden sm:block">Starts in</span>
              <CountdownTimer targetDate={conference.startDate} compact />
            </div>
          )}
        </div>
      </div>

      {/* Countdown block — mobile only when hero countdown is visible */}
      {isActive && conference.startDate && (
        <div className="bg-charcoal py-8 md:hidden">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <CountdownTimer targetDate={conference.startDate} variant="light" label="Conference starts in" />
          </div>
        </div>
      )}

      {/* Main body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Left / Main column ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-14">

            {/* Conference header */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-1">13<sup>th</sup> FOCUS Conference</h2>
              {conference.theme && (
                <p className="text-sm text-gray-500 italic">Theme: {conference.theme}</p>
              )}
            </section>

            {/* Conference details box */}
            <section>
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 text-sm space-y-2">
                {conference.startDate && (
                  <p>
                    <span className="font-semibold text-charcoal">Conference:</span>{' '}
                    {format(new Date(conference.startDate), 'dd – ')}
                    {conference.endDate ? format(new Date(conference.endDate), 'dd MMMM yyyy') : ''}
                  </p>
                )}
                {conference.preconferenceStartDate && (
                  <p>
                    <span className="font-semibold text-charcoal">Pre-conference workshops:</span>{' '}
                    {format(new Date(conference.preconferenceStartDate), 'dd – ')}
                    {conference.preconferenceEndDate ? format(new Date(conference.preconferenceEndDate), 'dd MMMM yyyy') : ''}
                  </p>
                )}
                {conference.hostedBy && (
                  <p>
                    <span className="font-semibold text-charcoal">Hosted by:</span>{' '}
                    {conference.hostedBy}
                  </p>
                )}
              </div>
            </section>

            {/* Background and Context */}
            {conference.backgroundContext && (
              <section>
                <h2 className="text-xl font-serif font-bold text-charcoal mb-5 uppercase tracking-wide">
                  Background and Context
                </h2>
                <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed text-sm space-y-4">
                  {conference.backgroundContext.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Sub-themes */}
            {subThemes.length > 0 && (
              <section>
                <h2 className="text-xl font-serif font-bold text-charcoal mb-5 uppercase tracking-wide">
                  Conference Sub-themes
                </h2>
                <p className="text-sm text-gray-500 mb-5">
                  The organising committee invites submissions aligned with the conference theme and the following sub-themes. Contributions may include research papers as well as reflections on institutional initiatives, projects, and practices.
                </p>
                <SubThemeAccordion themes={subThemes} />
                {isActive && conference.registrationOpen && (
                  <div className="mt-8 text-center">
                    {alreadyRegistered ? (
                      <span className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-sm">
                        ✓ You are registered
                      </span>
                    ) : (
                      <Button variant="primary" onClick={() => setShowRegModal(true)}>
                        Register Now
                      </Button>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* Submission of Abstracts */}
            {isActive && conference.abstractSubmissionOpen && (
              <section>
                <h2 className="text-xl font-serif font-bold text-charcoal mb-5 uppercase tracking-wide">
                  Submission of Abstracts
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-sm p-6 text-sm text-gray-700 space-y-3">
                  <p>
                    Abstracts of between 250 and 350 words should be submitted on or before the submission deadline.
                    Authors should ensure that abstracts clearly align with the conference theme and sub-themes, as this will be a primary submission criterion.
                  </p>
                  <ul className="space-y-1 list-none">
                    {[
                      'Title of the paper',
                      'Name(s) of author(s)',
                      'Institutional affiliation',
                      'Email address of the corresponding author',
                      'Abstract of 250 – 350 words',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="font-semibold text-amber-700 shrink-0">Include:</span>
                        <span>{item}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-2 mt-2">
                      <span className="font-semibold text-red-700 shrink-0">Note:</span>
                      <span>Abstracts submitted via email will not be accepted</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-5 text-center">
                  <Button variant="primary" to="/dashboard/abstracts/new">
                    Submit Abstract
                  </Button>
                </div>
              </section>
            )}

            {/* Registration and Fees */}
            <section>
              <h2 className="text-xl font-serif font-bold text-charcoal mb-5 uppercase tracking-wide">
                Registration and Fees
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 text-sm space-y-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600">Conference Registration Fee</span>
                  <span className="font-bold text-charcoal text-base">R{conferenceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600">Pre-Conference Workshop Fee</span>
                  <span className="font-bold text-charcoal text-base">R{preconferenceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Group Registration</span>
                  <span className="text-primary font-medium">5% discount</span>
                </div>
                <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                  A 5% discount is offered for groups of more than 5 members from the same institution.
                </p>
              </div>
            </section>

            {/* How to Submit Abstract */}
            {isActive && conference.abstractSubmissionOpen && (
              <section>
                <h2 className="text-xl font-serif font-bold text-charcoal mb-5 uppercase tracking-wide">
                  How to Submit Abstract
                </h2>
                <ol className="space-y-3">
                  {[
                    'Access the submission portal using the conference submission link',
                    'Select the Submit Abstract option',
                    'Create an account on the submission system if you do not already have one',
                    'Complete the submission form and upload your abstract',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-4 text-sm text-gray-600">
                      <span className="w-7 h-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Publication Opportunities */}
            <section>
              <h2 className="text-xl font-serif font-bold text-charcoal mb-5 uppercase tracking-wide">
                Publication Opportunities
              </h2>
              <div className="bg-primary/5 border border-primary/20 rounded-sm p-6 text-sm text-gray-700 space-y-2">
                <p>
                  Papers presented at the conference may be considered for publication in the Focus Conference Proceedings and in affiliated scholarly outlets, subject to peer review and editorial processes. Authors whose papers demonstrate strong scholarly contribution may be invited to submit extended manuscripts for consideration in a special issue or edited publication associated with the Focus Conference.
                </p>
                <p className="text-gray-400 text-xs">
                  Further details regarding publication opportunities will be communicated in due course.
                </p>
              </div>
            </section>

            {/* Pre-Conference Workshops */}
            {conference.preconferenceStartDate && (
              <section>
                <h2 className="text-xl font-serif font-bold text-charcoal mb-5 uppercase tracking-wide">
                  Pre-Conference Workshops
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 text-sm text-gray-700 space-y-3">
                  <p>
                    Several pre-conference workshops will be offered to provide participants with opportunities for professional development and scholarly engagement:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Writing for academic publication</li>
                    <li>Integrating entrepreneurship education into the curriculum</li>
                    <li>Leadership in higher education</li>
                    <li>Emerging technologies in teaching and learning</li>
                  </ul>
                  <p className="text-xs text-gray-400">
                    Further details regarding workshop facilitators and registration will be communicated in due course.
                  </p>
                </div>
              </section>
            )}

            {/* Important Dates */}
            {importantDates.length > 0 && (
              <section>
                <h2 className="text-xl font-serif font-bold text-charcoal mb-6 uppercase tracking-wide">
                  Important Dates
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {importantDates.map(({ label, date }) => (
                    <DateBox key={label} label={label} date={date} />
                  ))}
                </div>
              </section>
            )}

            {/* Speakers */}
            {speakers.length > 0 && (
              <section>
                <h2 className="text-xl font-serif font-bold text-charcoal mb-6 uppercase tracking-wide">
                  Speakers
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {speakers.map((speaker, i) => (
                    <SpeakerCard key={speaker.id} speaker={speaker} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Programme */}
            {sessions.length > 0 && (
              <section>
                <h2 className="text-xl font-serif font-bold text-charcoal mb-6 uppercase tracking-wide">
                  Programme
                </h2>
                <ProgrammeTimeline sessions={sessions} />
              </section>
            )}

            {/* Sponsors */}
            {sponsors.length > 0 && (
              <section>
                <h2 className="text-xl font-serif font-bold text-charcoal mb-6 uppercase tracking-wide">
                  Sponsors & Partners
                </h2>
                <SponsorGrid sponsors={sponsors} />
              </section>
            )}

            {/* Contact Details */}
            {(conference.contactEmail || conference.contactPhone || conference.contactAddress) && (
              <section>
                <h2 className="text-xl font-serif font-bold text-charcoal mb-5 uppercase tracking-wide">
                  Contact Details
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 text-sm space-y-3">
                  {conference.contactAddress && (
                    <div className="text-gray-600 whitespace-pre-line">{conference.contactAddress}</div>
                  )}
                  {conference.contactPhone && (
                    <a href={`tel:${conference.contactPhone}`} className="flex items-center gap-2 text-primary hover:underline">
                      <Phone size={14} /> {conference.contactPhone}
                    </a>
                  )}
                  {conference.contactEmail && (
                    <a href={`mailto:${conference.contactEmail}`} className="flex items-center gap-2 text-primary hover:underline">
                      <Mail size={14} /> {conference.contactEmail}
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* ── Right / Sidebar ──────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Countdown — desktop */}
            {isActive && conference.startDate && (
              <div className="bg-charcoal rounded-sm p-6 hidden md:block">
                <CountdownTimer targetDate={conference.startDate} variant="light" label="Conference starts in" />
              </div>
            )}

            {/* Quick info */}
            <div className="bg-gray-50 rounded-sm p-6 border border-gray-100">
              <h3 className="font-serif font-bold text-charcoal text-lg mb-4">Conference Details</h3>
              <dl className="space-y-3 text-sm">
                {conference.startDate && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-400 font-medium shrink-0">Conference</dt>
                    <dd className="text-charcoal text-right">
                      {format(new Date(conference.startDate), 'dd MMM')}
                      {conference.endDate && ` – ${format(new Date(conference.endDate), 'dd MMM yyyy')}`}
                    </dd>
                  </div>
                )}
                {conference.preconferenceStartDate && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-400 font-medium shrink-0">Pre-conference</dt>
                    <dd className="text-charcoal text-right">
                      {format(new Date(conference.preconferenceStartDate), 'dd MMM')}
                      {conference.preconferenceEndDate && ` – ${format(new Date(conference.preconferenceEndDate), 'dd MMM yyyy')}`}
                    </dd>
                  </div>
                )}
                {conference.venue && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-400 font-medium shrink-0">Venue</dt>
                    <dd className="text-charcoal text-right">{conference.venue}</dd>
                  </div>
                )}
                {conference.location && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-400 font-medium shrink-0">Location</dt>
                    <dd className="text-charcoal text-right">{conference.location}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-400 font-medium shrink-0">Fee</dt>
                  <dd className="text-charcoal text-right font-semibold">R{conferenceFee.toLocaleString()}</dd>
                </div>
              </dl>
            </div>

            {/* Registration CTA */}
            {isActive && conference.registrationOpen && (
              <div className="bg-primary rounded-sm p-6 text-center">
                <h3 className="font-serif font-bold text-white text-lg mb-1">Ready to Join?</h3>
                <p className="text-primary-200 text-xs mb-4">Secure your seat at the 13th FOCUS Conference</p>
                {alreadyRegistered ? (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-4 py-3 rounded-sm text-sm"
                  >
                    ✓ You are registered
                  </motion.div>
                ) : (
                  <Button variant="gold" className="w-full justify-center" onClick={() => setShowRegModal(true)}>
                    Register Now
                  </Button>
                )}
              </div>
            )}

            {/* Delegate Services */}
            <div className="bg-charcoal rounded-sm p-6">
              <h3 className="font-serif font-bold text-white text-lg mb-4">Delegate Services</h3>
              <div className="space-y-1">
                {[
                  { label: 'My Registrations', to: '/dashboard/registrations' },
                  { label: 'Submit Abstract', to: '/dashboard/abstracts/new' },
                  { label: 'My Abstracts', to: '/dashboard/abstracts' },
                  { label: 'My Invoices', to: '/dashboard/invoices' },
                  { label: 'Dashboard', to: '/dashboard' },
                ].map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0 group"
                  >
                    <div className="w-2 h-2 bg-gold rounded-full shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-white text-sm font-medium group-hover:text-gold transition-colors">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRegModal && conference && (
        <RegistrationModal
          conference={conference}
          onClose={() => setShowRegModal(false)}
        />
      )}
    </div>
  )
}
