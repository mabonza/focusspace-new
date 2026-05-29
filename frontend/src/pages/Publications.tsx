import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Button from '../components/Button'
import { useSEO } from '../hooks/useSEO'

const advisoryBoard = [
  'Dr. Muntuwenkosi Chili, Vaal University of Technology, South Africa',
  'Prof Jacob Nyambe, University of Namibia, Namibia',
  'Prof Mahlapahlapana Themane, University of Limpopo, South Africa',
  'Prof David Edwards, Birmingham City University, United Kingdom',
  'Dr Ephraim Zulu, Copperbelt University, Zambia',
  'Prof Monwabisi Ralarala, University of Western Cape, South Africa',
  'Prof Fidelis Emuze, Central University of Technology, South Africa',
  'Dr. Gizem Halis Kasap, Ondokuz Mayıs Üniversitesi, Turkey',
  'Prof Sagadevan Mundree, Queensland University of Technology, Australia.',
  'Ms. Shanali Govender, University of Cape Town, South Africa',
]

const editors = [
  'Dr Phiwayinkosi R. Gumede, Mangosuthu University of Technology',
  'Dr Themba Mngomeni Mthethwa, Mangosuthu University of Technology',
  'Mrs Ntombikhona Nene, Mangosuthu University of Technology',
  'Mr Cebo Nyondo, Mangosuthu University of Technology',
]

const previousPublications = [
  {
    year: '2024',
    title: '2024 Conference Proceedings',
    image: '/2024%20Conference%20Proceedings.png',
    description:
      'The proceedings of the 2024 Focus Conference have been published by Atlantis Press (a part of Springer Nature) in the Atlantis Highlights in Social Sciences, Education and Humanities (ISSN e:2667-128X). All published papers are available in Open Access.',
    link: 'https://www.atlantis-press.com/proceedings/tfc-24/publishing',
  },
  {
    year: '2023',
    title: '2023 Conference Proceedings',
    image: '/2023%20Conference%20Proceedings.jpg',
    description:
      'The proceedings of the 2023 Focus Conference have been published by Atlantis Press in the Advances in Social Science, Education and Humanities Research Series (ISSN e:2352-5398), which is accredited by DHET (indexed in DOAJ). All published papers are available in Open Access.',
    link: 'https://www.atlantis-press.com/proceedings/tfc-23',
  },
  {
    year: '2022',
    title: '2022 Conference Proceedings',
    image: '/2022%20Conference%20Proceedings.png',
    description:
      'The proceedings of the 2022 Focus Conference have been published by Atlantis Press (a part of Springer Nature) in the Advances in Social Science, Education and Humanities Research Series (ISSN e:2352-5398X), which is accredited by DHET (indexed in DOAJ). All published papers are available in Open Access.',
    link: 'https://www.atlantis-press.com/proceedings/tfc-22',
  },
]

const guidelinePoints = [
  'The Special Issue will publish a maximum of 20 articles.',
  'No author may publish more than one article, either individually or collaboratively.',
  'A maximum of three manuscripts from a single institution will be accepted.',
  'Authors from various countries are encouraged to submit.',
  'All submissions will undergo a double-blind peer review process with two independent reviewers.',
  'Review reports will be submitted to APORTAL for safekeeping.',
  'All submissions will be screened using TURNITIN for plagiarism detection.',
  'Manuscripts exceeding the acceptable similarity threshold will be rejected.',
  'The journal editors will handle formatting and layout according to APORTAL\'s publishing standards.',
  'The Chief Editor reserves the right to reject any article, even if accepted by the Guest Editors.',
]

export default function Publications() {
  useSEO({
    title: 'Publications',
    description: 'Access conference proceedings, policy briefs, and research summaries from Focus Space events.',
  })

  return (
    <div>
      <Hero
        title="Publications"
        subtitle="Research & Proceedings"
        description="Access conference proceedings, policy briefs, and research summaries from Focus Space events."
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1800&auto=format&fit=crop"
        size="small"
      />

      {/* Publication Opportunities */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h1 className="text-3xl font-bold text-center text-charcoal mb-3">Publication Opportunities</h1>
            <p className="text-center text-gray-500 mb-8 border-b border-red-400 pb-6">
              The Organizing Committee is pleased to announce the following publication opportunities:
            </p>

            {/* 1. Conference Proceedings */}
            <h2 className="text-2xl font-bold text-charcoal mb-3">1. Conference Proceedings</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Proceedings of the 2025 Focus Conference will be published in{' '}
              <a href="#" className="text-primary hover:underline">Atlantis Press</a>, which is part of Springer Nature.
              Atlantis Press is indexed in, among others, DOAJ, Web of Science and Scopus.
            </p>

            {/* 2. Special Issue */}
            <h2 className="text-2xl font-bold text-charcoal mb-3">2. Special Issue</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              A cohort of papers will be considered for a{' '}
              <a href="#" className="text-primary hover:underline">special issue</a>{' '}
              in the African Perspectives of Research in Teaching and Learning (APORTAL) journal. The APORTAL is a peer-reviewed journal accredited by the South African Department of Higher Education and Training (DHET).
            </p>

            {/* Publication Guidelines box */}
            <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 mb-8">
              <h3 className="font-bold text-charcoal mb-4">Publication Guidelines</h3>
              <ul className="space-y-2">
                {guidelinePoints.map((point, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button href="#" variant="primary" className="mb-0">
              Click here for the editorial and review policy
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-charcoal mb-6 uppercase tracking-wide">Advisory Board</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {advisoryBoard.map((member, i) => (
                <div key={i} className="bg-primary text-white text-sm p-4 rounded-sm leading-snug">
                  {member}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Editors */}
      <section className="pb-12 bg-white">
        <div className="container-max max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-charcoal mb-6 uppercase tracking-wide">Editors</h2>

            <h3 className="font-bold text-charcoal mb-1">Chief Editor and Chairperson of Editorial Committee:</h3>
            <p className="text-gray-600 text-sm mb-6">Dr Johannes Manyane Makua, Mangosuthu University of Technology</p>

            <h3 className="font-bold text-charcoal mb-3">Editors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {editors.map((editor, i) => (
                <div key={i} className="bg-primary text-white text-sm p-4 rounded-sm leading-snug">
                  {editor}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Previous Publications */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-charcoal mb-8">Previous Publications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {previousPublications.map((pub, i) => (
                <motion.div
                  key={pub.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-40 h-52 bg-gray-100 rounded-sm overflow-hidden mb-4 shadow-md">
                    <img
                      src={pub.image}
                      alt={pub.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                  <h3 className="font-bold text-primary text-lg mb-2">{pub.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{pub.description}</p>
                  <a
                    href={pub.link}
                    className="inline-block bg-primary text-white text-sm font-semibold px-5 py-2 rounded-sm hover:bg-primary-700 transition-colors"
                  >
                    Access Proceedings
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
