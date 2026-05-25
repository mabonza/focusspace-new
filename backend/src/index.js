'use strict'

const PUBLIC_CONTENT_TYPES = [
  'api::conference.conference',
  'api::event.event',
  'api::speaker.speaker',
  'api::programme-session.programme-session',
  'api::sponsor.sponsor',
  'api::publication.publication',
]

const AUTHENTICATED_READ = [
  'api::conference.conference',
  'api::event.event',
  'api::speaker.speaker',
  'api::conference-registration.conference-registration',
  'api::abstract.abstract',
  'api::review.review',
  'api::invoice.invoice',
  'api::notification.notification',
  'api::payment.payment',
  'api::certificate.certificate',
  'api::attendance.attendance',
]

const AUTHENTICATED_WRITE = [
  'api::conference-registration.conference-registration',
  'api::abstract.abstract',
  'api::review.review',
  'api::notification.notification',
  'api::payment.payment',
  'api::attendance.attendance',
]

// Custom action permissions for authenticated users
const AUTHENTICATED_CUSTOM = [
  'api::payment.payment.verify',
  'api::payment.payment.reject',
  'api::certificate.certificate.verifybycode',
  'api::certificate.certificate.issue',
  'api::certificate.certificate.find',
  'api::certificate.certificate.findone',
  'api::attendance.attendance.checkin',
  'api::analytics.analytics.overview',
  'api::analytics.analytics.registrationsbydate',
  'api::analytics.analytics.paymentsbyconference',
  'api::analytics.analytics.countrydistribution',
  'api::abstract.abstract.myabstracts',
  'api::notification.notification.broadcast',
  'api::conference-registration.conference-registration.checkforconference',
  'api::abstract.abstract.assignreviewer',
  'api::abstract.abstract.getreviewers',
  'api::abstract.abstract.exportcsv',
  'api::user-management.user-management.listusers',
  'api::user-management.user-management.updaterole',
  'plugin::upload.content-api.upload',
  'plugin::upload.content-api.find',
  'plugin::upload.content-api.findOne',
  'plugin::upload.content-api.destroy',
]

// Public custom actions (certificate verification is public)
const PUBLIC_CUSTOM = [
  'api::certificate.certificate.verifybycode',
]

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    await setupPublicPermissions(strapi)
    await setupAuthenticatedPermissions(strapi)
    await seedIfEmpty(strapi)
  },
}

async function setupPublicPermissions(strapi) {
  try {
    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } })

    if (!publicRole) return

    for (const uid of PUBLIC_CONTENT_TYPES) {
      for (const action of ['find', 'findOne']) {
        await ensurePermission(strapi, `${uid}.${action}`, publicRole.id)
      }
    }
    for (const action of PUBLIC_CUSTOM) {
      await ensurePermission(strapi, action, publicRole.id)
    }

    strapi.log.info('[FocusSpace] ✓ Public API permissions configured')
  } catch (err) {
    strapi.log.warn('[FocusSpace] Could not configure public permissions:', err.message)
  }
}

async function setupAuthenticatedPermissions(strapi) {
  try {
    const authRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } })

    if (!authRole) return

    for (const uid of AUTHENTICATED_READ) {
      for (const action of ['find', 'findOne']) {
        await ensurePermission(strapi, `${uid}.${action}`, authRole.id)
      }
    }

    for (const uid of AUTHENTICATED_WRITE) {
      for (const action of ['create', 'update', 'delete']) {
        await ensurePermission(strapi, `${uid}.${action}`, authRole.id)
      }
    }

    for (const action of AUTHENTICATED_CUSTOM) {
      await ensurePermission(strapi, action, authRole.id)
    }

    strapi.log.info('[FocusSpace] ✓ Authenticated API permissions configured')
  } catch (err) {
    strapi.log.warn('[FocusSpace] Could not configure authenticated permissions:', err.message)
  }
}

async function ensurePermission(strapi, action, roleId) {
  const exists = await strapi.db
    .query('plugin::users-permissions.permission')
    .findOne({ where: { action, role: roleId } })

  if (!exists) {
    await strapi.db
      .query('plugin::users-permissions.permission')
      .create({ data: { action, role: roleId, enabled: true } })
    strapi.log.info(`[FocusSpace] Permission enabled: ${action}`)
  }
}

// ── Seed data ─────────────────────────────────────────────────────────────────

async function seedIfEmpty(strapi) {
  try {
    const count = await strapi.db.query('api::conference.conference').count()
    if (count > 0) return

    strapi.log.info('[FocusSpace] Seeding initial data…')
    const now = new Date()

    const ichs2025 = await strapi.db.query('api::conference.conference').create({
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
        eventStatus: 'upcoming',
        featured: true,
        registrationOpen: true,
        abstractSubmissionOpen: true,
        publishedAt: now,
      },
    })

    const aphs2024 = await strapi.db.query('api::conference.conference').create({
      data: {
        title: 'African Public Health Summit 2024',
        slug: 'aphs-2024',
        year: 2024,
        theme: 'Community-Centred Approaches to Disease Prevention',
        description:
          'An annual summit bringing together public health professionals across Africa to advance community health strategies and regional cooperation.',
        startDate: '2024-06-10',
        endDate: '2024-06-12',
        venue: 'Kenyatta International Convention Centre',
        location: 'Nairobi, Kenya',
        status: 'completed',
        featured: false,
        registrationOpen: false,
        abstractSubmissionOpen: false,
        publishedAt: now,
      },
    })

    const dhif2024 = await strapi.db.query('api::conference.conference').create({
      data: {
        title: 'Digital Health Innovation Forum 2024',
        slug: 'dhif-2024',
        year: 2024,
        theme: 'Technology-Driven Transformation of African Healthcare',
        description:
          'Bringing together technologists, clinicians, and policymakers to showcase digital health solutions built for low-resource environments.',
        startDate: '2024-03-05',
        endDate: '2024-03-07',
        venue: 'Cape Town International Convention Centre',
        location: 'Cape Town, South Africa',
        status: 'completed',
        featured: false,
        registrationOpen: false,
        abstractSubmissionOpen: false,
        publishedAt: now,
      },
    })

    const eventsData = [
      { title: 'International Conference on Health Systems Research 2025', slug: 'ichs-2025-main', type: 'conference', eventStatus: 'upcoming', shortDescription: 'Three days of evidence-based dialogue on universal health coverage, health financing, and service delivery innovations.', description: 'Join over 800 delegates from 40+ countries at the premier health systems research conference in Africa.', startDate: '2025-09-15T08:00:00', endDate: '2025-09-18T17:00:00', location: 'Johannesburg, South Africa', venue: 'Sandton Convention Centre', registrationUrl: '#register', conference: ichs2025.id },
      { title: 'Pre-Conference Workshop: Health Economics Masterclass', slug: 'hec-workshop-2025', type: 'workshop', eventStatus: 'upcoming', shortDescription: 'An intensive one-day masterclass covering cost-effectiveness analysis and budget impact modelling.', startDate: '2025-09-14T09:00:00', endDate: '2025-09-14T17:00:00', location: 'Johannesburg, South Africa', venue: 'Sandton Convention Centre – Workshop Hall B', registrationUrl: '#register', conference: ichs2025.id },
      { title: 'Webinar: Emerging Infectious Diseases in Resource-Limited Settings', slug: 'webinar-eid-2025', type: 'webinar', eventStatus: 'upcoming', shortDescription: 'A virtual panel discussion on surveillance, response readiness, and community engagement.', startDate: '2025-07-22T14:00:00', endDate: '2025-07-22T16:00:00', location: 'Virtual', venue: 'Zoom', registrationUrl: '#register', conference: ichs2025.id },
      { title: 'African Public Health Summit 2024', slug: 'aphs-2024-main', type: 'summit', eventStatus: 'past', shortDescription: 'A landmark summit on community-centred disease prevention across Sub-Saharan Africa.', startDate: '2024-06-10', endDate: '2024-06-12', location: 'Nairobi, Kenya', venue: 'Kenyatta International Convention Centre', conference: aphs2024.id },
      { title: 'Digital Health Innovation Forum 2024', slug: 'dhif-2024-main', type: 'conference', eventStatus: 'past', shortDescription: 'Exploring digital tools, AI, and telemedicine in transforming African healthcare.', startDate: '2024-03-05', endDate: '2024-03-07', location: 'Cape Town, South Africa', venue: 'Cape Town International Convention Centre', conference: dhif2024.id },
      { title: 'Global Maternal & Child Health Conference 2023', slug: 'gmch-2023', type: 'conference', eventStatus: 'past', shortDescription: 'Evidence-driven strategies to reduce maternal and neonatal mortality across Africa.', startDate: '2023-10-18', endDate: '2023-10-20', location: 'Accra, Ghana', venue: 'Accra International Conference Centre' },
    ]
    for (const e of eventsData) {
      await strapi.db.query('api::event.event').create({ data: { ...e, publishedAt: now } })
    }

    const speakerData = [
      { name: 'Prof. Adaora Okonkwo', title: 'Professor of Global Health Policy', organisation: 'University of Lagos', bio: 'Prof. Okonkwo is a leading voice in African health systems reform with over 25 years of research experience and advisory roles at the WHO and African Union.', role: 'keynote' },
      { name: 'Dr. Samuel Kariuki', title: 'Director of Health Financing', organisation: 'African Development Bank', bio: 'Dr. Kariuki leads health financing strategy for 12 African nations, focusing on domestic resource mobilisation and results-based financing models.', role: 'keynote' },
      { name: 'Dr. Fatima Al-Hassan', title: 'Senior Researcher, Infectious Diseases', organisation: 'KEMRI-Wellcome Trust', bio: 'Dr. Al-Hassan specialises in epidemic preparedness and community-based surveillance systems in East Africa.', role: 'speaker' },
      { name: 'Ms. Nomvula Dlamini', title: 'CEO & Co-Founder', organisation: 'HealthBridge Africa', bio: 'A social entrepreneur building last-mile healthcare delivery systems using mobile technology and community health workers.', role: 'panelist' },
      { name: 'Prof. Jean-Pierre Mbeki', title: 'Chair, Department of Epidemiology', organisation: 'University of Cape Town', bio: 'Epidemiologist and biostatistician with expertise in disease burden modelling and health technology assessment.', role: 'host' },
      { name: 'Dr. Nneka Uzoma', title: 'Health Systems Strengthening Advisor', organisation: 'USAID West Africa', bio: 'Dr. Uzoma advises on integrated primary healthcare systems, supply chain management, and human resources for health.', role: 'speaker' },
    ]
    for (const s of speakerData) {
      await strapi.db.query('api::speaker.speaker').create({ data: { ...s, conference: ichs2025.id, publishedAt: now } })
    }

    const sessionData = [
      { title: 'Opening Ceremony & Keynote Address', description: 'Welcome address followed by the opening keynote on the state of African health systems.', startTime: '2025-09-15T08:30:00', endTime: '2025-09-15T10:00:00', venueRoom: 'Main Auditorium', sessionType: 'Plenary' },
      { title: 'Health Financing: From Theory to Practice', description: 'Panel discussion exploring sustainable domestic financing mechanisms for universal health coverage.', startTime: '2025-09-15T10:30:00', endTime: '2025-09-15T12:00:00', venueRoom: 'Plenary Hall A', sessionType: 'Panel' },
      { title: 'Workshop: Community Health Worker Programme Design', description: 'Hands-on session with case studies from Kenya, Rwanda, and Ethiopia.', startTime: '2025-09-15T13:30:00', endTime: '2025-09-15T15:30:00', venueRoom: 'Workshop Room 3', sessionType: 'Workshop' },
      { title: 'Digital Tools in Health Systems Monitoring', description: 'Presentations on DHIS2 implementation, real-time dashboards, and AI-assisted anomaly detection.', startTime: '2025-09-16T09:00:00', endTime: '2025-09-16T10:30:00', venueRoom: 'Plenary Hall B', sessionType: 'Oral Presentations' },
      { title: 'Closing Ceremony & Awards', description: 'Best abstract awards, reflections from the organising committee, and announcement of the next conference.', startTime: '2025-09-18T15:00:00', endTime: '2025-09-18T17:00:00', venueRoom: 'Main Auditorium', sessionType: 'Plenary' },
    ]
    for (const sess of sessionData) {
      await strapi.db.query('api::programme-session.programme-session').create({ data: { ...sess, conference: ichs2025.id } })
    }

    const sponsorData = [
      { name: 'African Development Bank', tier: 'platinum' },
      { name: 'WHO Africa Regional Office', tier: 'platinum' },
      { name: 'Gates Foundation', tier: 'gold' },
      { name: 'Wellcome Trust', tier: 'gold' },
      { name: 'USAID', tier: 'silver' },
      { name: 'Novartis Foundation', tier: 'silver' },
      { name: 'Johnson & Johnson', tier: 'bronze' },
      { name: 'African Union', tier: 'partner' },
    ]
    for (const sp of sponsorData) {
      await strapi.db.query('api::sponsor.sponsor').create({ data: { ...sp, conference: ichs2025.id } })
    }

    const pubData = [
      { title: 'Proceedings: ICHS 2024', slug: 'proceedings-ichs-2024', description: 'Full conference proceedings including all accepted abstracts, keynote transcripts, and policy briefs from ICHS 2024.', publicationDate: '2024-11-01' },
      { title: 'Policy Brief: Community Health Worker Integration in Africa', slug: 'policy-brief-chw-2024', description: 'Evidence synthesis and policy recommendations on integrating community health workers into formal health systems across Sub-Saharan Africa.', publicationDate: '2024-08-15' },
      { title: 'Research Summary: Digital Health Outcomes 2023', slug: 'research-summary-digital-health-2023', description: 'A summary of 15 research projects covering telemedicine uptake, mHealth interventions, and AI diagnostics.', publicationDate: '2024-05-20' },
    ]
    for (const pub of pubData) {
      await strapi.db.query('api::publication.publication').create({ data: { ...pub, conference: ichs2025.id } })
    }

    strapi.log.info('[FocusSpace] ✓ Seed data created successfully')
  } catch (err) {
    strapi.log.warn('[FocusSpace] Could not seed data:', err.message)
    strapi.log.debug(err)
  }
}
