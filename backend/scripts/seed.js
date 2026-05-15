'use strict'
/**
 * Standalone seed script — run manually to populate a Strapi instance.
 *
 * Usage (from backend directory):
 *   node scripts/seed.js
 *
 * The bootstrap in src/index.js already seeds automatically on first start.
 * Use this script to re-seed a wiped database without restarting Strapi.
 *
 * Requires the Strapi server to NOT be running (it starts its own instance).
 */

const { createStrapi } = require('@strapi/strapi')
const path = require('path')

async function seed() {
  const app = await createStrapi({ appDir: path.join(__dirname, '..') }).load()

  const now = new Date()
  const db = app.db

  // ── 1. Conference ──────────────────────────────────────────────────────────
  const existing = await db.query('api::conference.conference').count()
  if (existing > 0) {
    console.log(`Database already has ${existing} conference(s) — skipping seed.`)
    await app.destroy()
    return
  }

  console.log('Seeding database…')

  const conference = await db.query('api::conference.conference').create({
    data: {
      title: 'International Conference on Health Systems Research 2025',
      slug: 'ichs-2025',
      year: 2025,
      theme: 'Strengthening Health Systems for Universal Coverage',
      description:
        'A premier gathering of health systems researchers, policymakers, and practitioners from across the globe to share evidence, innovations, and best practices in health systems strengthening.',
      startDate: '2025-09-15',
      endDate: '2025-09-18',
      venue: 'Sandton Convention Centre',
      location: 'Johannesburg, South Africa',
      status: 'upcoming',
      featured: true,
      registrationOpen: true,
      abstractSubmissionOpen: true,
      registrationUrl: 'https://focusspace.org/register/ichs-2025',
      publishedAt: now,
    },
  })
  console.log('  ✓ Conference: ICHS 2025')

  // ── 2. Events ──────────────────────────────────────────────────────────────
  const events = [
    {
      title: 'International Conference on Health Systems Research 2025',
      slug: 'ichs-2025-main',
      type: 'conference',
      status: 'upcoming',
      shortDescription:
        'Three days of evidence-based dialogue on universal health coverage, health financing, and service delivery innovations.',
      startDate: '2025-09-15T08:00:00',
      endDate: '2025-09-18T17:00:00',
      location: 'Johannesburg, South Africa',
      venue: 'Sandton Convention Centre',
      registrationUrl: 'https://focusspace.org/register/ichs-2025',
      conference: conference.id,
    },
    {
      title: 'Pre-Conference Workshop: Health Economics Masterclass',
      slug: 'hec-workshop-2025',
      type: 'workshop',
      status: 'upcoming',
      shortDescription: 'An intensive one-day masterclass covering cost-effectiveness analysis and budget impact modelling.',
      startDate: '2025-09-14T09:00:00',
      endDate: '2025-09-14T17:00:00',
      location: 'Johannesburg, South Africa',
      venue: 'Sandton Convention Centre – Workshop Hall B',
      registrationUrl: 'https://focusspace.org/register/hec-workshop-2025',
      conference: conference.id,
    },
    {
      title: 'Webinar: Emerging Infectious Diseases in Resource-Limited Settings',
      slug: 'webinar-eid-2025',
      type: 'webinar',
      status: 'upcoming',
      shortDescription: 'A virtual panel discussion on surveillance, response readiness, and community engagement.',
      startDate: '2025-07-22T14:00:00',
      endDate: '2025-07-22T16:00:00',
      location: 'Online (Zoom)',
      venue: 'Virtual',
      registrationUrl: 'https://focusspace.org/register/webinar-eid-2025',
      conference: conference.id,
    },
  ]

  for (const event of events) {
    await db.query('api::event.event').create({ data: { ...event, publishedAt: now } })
  }
  console.log(`  ✓ Events: ${events.length}`)

  // ── 3. Speakers ────────────────────────────────────────────────────────────
  const speakers = [
    { name: 'Prof. Ama Owusu', title: 'Director of Health Policy', organisation: 'University of Ghana', role: 'keynote', bio: 'Leading researcher in health systems financing with 25 years of experience across sub-Saharan Africa.', conference: conference.id },
    { name: 'Dr. Sipho Nkosi', title: 'Chief Medical Officer', organisation: 'South African Department of Health', role: 'keynote', bio: 'Dr Nkosi has led national health reform initiatives and contributed to the development of the NHI framework.', conference: conference.id },
    { name: 'Dr. Fatima Al-Rashid', title: 'Senior Health Economist', organisation: 'World Health Organization', role: 'speaker', bio: 'Expert in universal health coverage financing and health benefit package design.', conference: conference.id },
    { name: 'Prof. James Kariuki', title: 'Professor of Epidemiology', organisation: 'University of Nairobi', role: 'panelist', bio: 'Specialises in infectious disease epidemiology and community health interventions.', conference: conference.id },
    { name: 'Dr. Nomsa Dlamini', title: 'Executive Director', organisation: 'African Health Foundation', role: 'host', bio: 'Champion of community health worker programmes across Southern Africa.', conference: conference.id },
    { name: 'Dr. Marcus Webb', title: 'Research Director', organisation: 'London School of Hygiene & Tropical Medicine', role: 'speaker', bio: 'Focuses on health system resilience and pandemic preparedness.', conference: conference.id },
  ]

  const createdSpeakers = []
  for (const speaker of speakers) {
    const s = await db.query('api::speaker.speaker').create({ data: { ...speaker, publishedAt: now } })
    createdSpeakers.push(s)
  }
  console.log(`  ✓ Speakers: ${speakers.length}`)

  // ── 4. Programme Sessions ──────────────────────────────────────────────────
  const sessions = [
    { title: 'Opening Ceremony & Keynote Address', sessionType: 'Plenary', startTime: '2025-09-15T08:30:00', endTime: '2025-09-15T10:00:00', venueRoom: 'Main Auditorium', conference: conference.id, speakers: [createdSpeakers[0].id, createdSpeakers[4].id] },
    { title: 'Health Financing for Universal Coverage', sessionType: 'Panel', startTime: '2025-09-15T10:30:00', endTime: '2025-09-15T12:00:00', venueRoom: 'Hall A', description: 'Panelists discuss innovative financing mechanisms.', conference: conference.id, speakers: [createdSpeakers[2].id, createdSpeakers[1].id] },
    { title: 'Community Health Workforce Development', sessionType: 'Workshop', startTime: '2025-09-15T14:00:00', endTime: '2025-09-15T15:30:00', venueRoom: 'Workshop Room 1', description: 'Interactive workshop on CHW training and retention strategies.', conference: conference.id, speakers: [createdSpeakers[4].id] },
    { title: 'Oral Presentations: Health Governance', sessionType: 'Oral Presentations', startTime: '2025-09-16T09:00:00', endTime: '2025-09-16T10:30:00', venueRoom: 'Hall B', conference: conference.id },
    { title: 'Closing Plenary: Pathways to UHC', sessionType: 'Plenary', startTime: '2025-09-18T15:00:00', endTime: '2025-09-18T17:00:00', venueRoom: 'Main Auditorium', conference: conference.id, speakers: [createdSpeakers[0].id, createdSpeakers[1].id, createdSpeakers[5].id] },
  ]

  for (const session of sessions) {
    await db.query('api::programme-session.programme-session').create({ data: { ...session, publishedAt: now } })
  }
  console.log(`  ✓ Programme sessions: ${sessions.length}`)

  // ── 5. Sponsors ────────────────────────────────────────────────────────────
  const sponsors = [
    { name: 'Global Health Initiative', tier: 'platinum', website: 'https://example.com', conference: conference.id },
    { name: 'African Development Bank', tier: 'platinum', website: 'https://example.com', conference: conference.id },
    { name: 'WHO AFRO', tier: 'gold', website: 'https://example.com', conference: conference.id },
    { name: 'Bill & Melinda Gates Foundation', tier: 'gold', website: 'https://example.com', conference: conference.id },
    { name: 'USAID Health', tier: 'silver', website: 'https://example.com', conference: conference.id },
    { name: 'Sanofi', tier: 'silver', website: 'https://example.com', conference: conference.id },
    { name: 'UNFPA', tier: 'bronze', website: 'https://example.com', conference: conference.id },
    { name: 'African Union Commission', tier: 'partner', website: 'https://example.com', conference: conference.id },
  ]

  for (const sponsor of sponsors) {
    await db.query('api::sponsor.sponsor').create({ data: { ...sponsor, publishedAt: now } })
  }
  console.log(`  ✓ Sponsors: ${sponsors.length}`)

  // ── 6. Publications ────────────────────────────────────────────────────────
  const publications = [
    { title: 'ICHS 2024 Conference Proceedings', slug: 'ichs-2024-proceedings', description: 'Full proceedings from the 2024 conference, including abstracts and selected full papers.', publicationDate: '2024-11-01', conference: conference.id },
    { title: 'Policy Brief: Health Workforce Crisis in Africa', slug: 'policy-brief-workforce-2024', description: 'Evidence-based recommendations for addressing the health worker shortage across sub-Saharan Africa.', publicationDate: '2024-08-15', conference: conference.id },
    { title: 'Research Summary: NHI Readiness Assessment', slug: 'nhi-readiness-2024', description: 'A comparative analysis of National Health Insurance readiness across five African countries.', publicationDate: '2024-06-30', conference: conference.id },
  ]

  for (const pub of publications) {
    await db.query('api::publication.publication').create({ data: { ...pub, publishedAt: now } })
  }
  console.log(`  ✓ Publications: ${publications.length}`)

  console.log('\nSeed complete.')
  await app.destroy()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
