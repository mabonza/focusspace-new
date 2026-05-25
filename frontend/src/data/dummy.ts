import type { Event, Speaker, ProgrammeSession, Sponsor, Publication, Conference } from '../types'

export const dummyConferences: Conference[] = [
  {
    id: 1,
    title: 'International Conference on Health Systems Research',
    slug: 'ichs-2025',
    year: 2025,
    theme: 'Strengthening Health Systems for Universal Coverage',
    description:
      'A premier gathering of health systems researchers, policymakers, and practitioners from across the globe to share evidence, innovations, and best practices in health systems strengthening.',
    startDate: '2025-09-15',
    endDate: '2025-09-18',
    venue: 'Sandton Convention Centre',
    location: 'Johannesburg, South Africa',
    conferenceStatus: 'upcoming',
    featured: true,
    registrationOpen: true,
    abstractSubmissionOpen: true,
  },
  {
    id: 2,
    title: 'African Public Health Summit',
    slug: 'aphs-2024',
    year: 2024,
    theme: 'Community-Centred Approaches to Disease Prevention',
    description:
      'An annual summit bringing together public health professionals across Africa to advance community health strategies and regional cooperation.',
    startDate: '2024-06-10',
    endDate: '2024-06-12',
    venue: 'Kenyatta International Convention Centre',
    location: 'Nairobi, Kenya',
    conferenceStatus: 'completed',
    featured: false,
    registrationOpen: false,
    abstractSubmissionOpen: false,
  },
]

export const dummyEvents: Event[] = [
  {
    id: 1,
    title: 'International Conference on Health Systems Research 2025',
    slug: 'ichs-2025',
    type: 'conference',
    eventStatus: 'upcoming',
    shortDescription:
      'Three days of evidence-based dialogue on universal health coverage, health financing, and service delivery innovations.',
    description:
      'Join over 800 delegates from 40+ countries at the premier health systems research conference in Africa. Sessions cover financing, workforce, governance, and community health.',
    startDate: '2025-09-15T08:00:00',
    endDate: '2025-09-18T17:00:00',
    location: 'Johannesburg, South Africa',
    venue: 'Sandton Convention Centre',
    registrationUrl: '#register',
  },
  {
    id: 2,
    title: 'Pre-Conference Workshop: Health Economics Masterclass',
    slug: 'hec-workshop-2025',
    type: 'workshop',
    eventStatus: 'upcoming',
    shortDescription:
      'An intensive one-day masterclass covering cost-effectiveness analysis and budget impact modelling.',
    description:
      'Facilitated by leading health economists, this workshop offers hands-on training in the methods most valued by policymakers and funders.',
    startDate: '2025-09-14T09:00:00',
    endDate: '2025-09-14T17:00:00',
    location: 'Johannesburg, South Africa',
    venue: 'Sandton Convention Centre – Workshop Hall B',
    registrationUrl: '#register',
  },
  {
    id: 3,
    title: 'Webinar: Emerging Infectious Diseases in Resource-Limited Settings',
    slug: 'webinar-eid-2025',
    type: 'webinar',
    eventStatus: 'upcoming',
    shortDescription: 'A virtual panel discussion on surveillance, response readiness, and community engagement.',
    description:
      'Free to attend. Register to receive the Zoom link. Featuring panelists from WHO, MSF, and leading African universities.',
    startDate: '2025-07-22T14:00:00',
    endDate: '2025-07-22T16:00:00',
    location: 'Virtual',
    venue: 'Zoom',
    registrationUrl: '#register',
  },
]

export const dummyPastEvents: Event[] = [
  {
    id: 10,
    title: 'Teaching with Technology Summit 2026',
    slug: 'twt-summit-2026',
    type: 'summit',
    eventStatus: 'past',
    shortDescription: 'Designing Learning that Works: Technology, e-Pedagogy, and the Pursuit of Student Success.',
    description:
      'A premier summit bringing together educators, technologists, and academic leaders to explore how technology and e-pedagogy can transform teaching and drive student success.',
    startDate: '2026-03-26',
    endDate: '2026-03-27',
    location: 'Durban, South Africa',
    venue: 'Durban International Convention Centre (ICC)',
    image: { id: 0, url: '/teaching-with-tech-summit.jpg' },
  },
  {
    id: 11,
    title: '2025 Focus Conference',
    slug: 'focus-conference-2025',
    type: 'conference',
    eventStatus: 'past',
    shortDescription: 'Shaping Global Perspectives in Higher Education: Transforming Learning Through Innovation, Digital Equity, and Global Partnerships.',
    description:
      'The 2025 Focus Conference brought together higher education leaders and innovators to explore transformative approaches to learning through innovation, digital equity, and global partnerships.',
    startDate: '2025-08-13',
    endDate: '2025-08-15',
    location: 'Umhlanga, South Africa',
    venue: 'Coastland Hotel Umhlanga',
    image: { id: 0, url: '/focus-conf2025.jpeg' },
  },
  {
    id: 12,
    title: 'Teaching with Technology Summit 2025',
    slug: 'twt-summit-2025',
    type: 'summit',
    eventStatus: 'past',
    shortDescription: 'The Teaching and Learning Development Centre at Mangosuthu University of Technology invites submissions for the Teaching with Technology Summit 2025.',
    description:
      'Taking place at the Hilton Hotel in Durban, South Africa, the Teaching with Technology Summit 2025 brought together educators and researchers to advance the integration of technology in teaching and learning.',
    startDate: '2025-03-27',
    endDate: '2025-03-28',
    location: 'Durban, South Africa',
    venue: 'Hilton Hotel',
    image: { id: 0, url: '/Event27-03-2025-scaled.webp' },
  },
]

export const dummySpeakers: Speaker[] = [
  {
    id: 1,
    name: 'Prof. Adaora Okonkwo',
    title: 'Professor of Global Health Policy',
    organisation: 'University of Lagos',
    bio: 'Prof. Okonkwo is a leading voice in African health systems reform, with over 25 years of research experience and advisory roles at the WHO and African Union.',
    role: 'keynote',
  },
  {
    id: 2,
    name: 'Dr. Samuel Kariuki',
    title: 'Director of Health Financing',
    organisation: 'African Development Bank',
    bio: 'Dr. Kariuki leads health financing strategy for 12 African nations, focusing on domestic resource mobilisation and results-based financing models.',
    role: 'keynote',
  },
  {
    id: 3,
    name: 'Dr. Fatima Al-Hassan',
    title: 'Senior Researcher, Infectious Diseases',
    organisation: 'KEMRI-Wellcome Trust',
    bio: 'Dr. Al-Hassan specialises in epidemic preparedness and community-based surveillance systems in East Africa.',
    role: 'speaker',
  },
  {
    id: 4,
    name: 'Ms. Nomvula Dlamini',
    title: 'CEO & Co-Founder',
    organisation: 'HealthBridge Africa',
    bio: 'A social entrepreneur building last-mile healthcare delivery systems using mobile technology and community health workers.',
    role: 'panelist',
  },
  {
    id: 5,
    name: 'Prof. Jean-Pierre Mbeki',
    title: 'Chair, Department of Epidemiology',
    organisation: 'University of Cape Town',
    bio: 'Epidemiologist and biostatistician with expertise in disease burden modelling and health technology assessment.',
    role: 'host',
  },
  {
    id: 6,
    name: 'Dr. Nneka Uzoma',
    title: 'Health Systems Strengthening Advisor',
    organisation: 'USAID West Africa',
    bio: 'Dr. Uzoma advises on integrated primary healthcare systems, supply chain management, and human resources for health.',
    role: 'speaker',
  },
]

export const dummyProgramme: ProgrammeSession[] = [
  {
    id: 1,
    title: 'Opening Ceremony & Keynote Address',
    description: 'Welcome address by the conference chair, followed by the opening keynote on the state of African health systems.',
    startTime: '2025-09-15T08:30:00',
    endTime: '2025-09-15T10:00:00',
    venueRoom: 'Main Auditorium',
    sessionType: 'Plenary',
  },
  {
    id: 2,
    title: 'Health Financing: From Theory to Practice',
    description: 'Panel discussion exploring sustainable domestic financing mechanisms for universal health coverage.',
    startTime: '2025-09-15T10:30:00',
    endTime: '2025-09-15T12:00:00',
    venueRoom: 'Plenary Hall A',
    sessionType: 'Panel',
  },
  {
    id: 3,
    title: 'Workshop: Community Health Worker Programme Design',
    description: 'Hands-on session on designing effective CHW programmes, with case studies from Kenya, Rwanda, and Ethiopia.',
    startTime: '2025-09-15T13:30:00',
    endTime: '2025-09-15T15:30:00',
    venueRoom: 'Workshop Room 3',
    sessionType: 'Workshop',
  },
  {
    id: 4,
    title: 'Digital Tools in Health Systems Monitoring',
    description: 'Presentations on DHIS2 implementation, real-time data dashboards, and AI-assisted anomaly detection.',
    startTime: '2025-09-16T09:00:00',
    endTime: '2025-09-16T10:30:00',
    venueRoom: 'Plenary Hall B',
    sessionType: 'Oral Presentations',
  },
  {
    id: 5,
    title: 'Closing Ceremony & Awards',
    description: 'Best abstract awards, reflections from the organising committee, and announcement of the next conference.',
    startTime: '2025-09-18T15:00:00',
    endTime: '2025-09-18T17:00:00',
    venueRoom: 'Main Auditorium',
    sessionType: 'Plenary',
  },
]

export const dummySponsors: Sponsor[] = [
  { id: 1, name: 'African Development Bank', tier: 'platinum', website: '#' },
  { id: 2, name: 'WHO Africa Regional Office', tier: 'platinum', website: '#' },
  { id: 3, name: 'Gates Foundation', tier: 'gold', website: '#' },
  { id: 4, name: 'Wellcome Trust', tier: 'gold', website: '#' },
  { id: 5, name: 'USAID', tier: 'silver', website: '#' },
  { id: 6, name: 'Novartis Foundation', tier: 'silver', website: '#' },
  { id: 7, name: 'Johnson & Johnson', tier: 'bronze', website: '#' },
  { id: 8, name: 'African Union', tier: 'partner', website: '#' },
]

export const dummyPublications: Publication[] = [
  {
    id: 1,
    title: 'Proceedings: ICHS 2024',
    slug: 'proceedings-ichs-2024',
    description: 'Full conference proceedings including all accepted abstracts, keynote transcripts, and policy briefs from ICHS 2024.',
    publicationDate: '2024-11-01',
  },
  {
    id: 2,
    title: 'Policy Brief: Community Health Worker Integration in Africa',
    slug: 'policy-brief-chw-2024',
    description:
      'Evidence synthesis and policy recommendations on integrating community health workers into formal health systems across Sub-Saharan Africa.',
    publicationDate: '2024-08-15',
  },
  {
    id: 3,
    title: 'Research Summary: Digital Health Outcomes 2023',
    slug: 'research-summary-digital-health-2023',
    description: 'A summary of 15 research projects presented at DHIF 2024, covering telemedicine uptake, mHealth interventions, and AI diagnostics.',
    publicationDate: '2024-05-20',
  },
]
