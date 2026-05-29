import { motion } from 'framer-motion'
import { Linkedin, Mail, Phone } from 'lucide-react'
import Hero from '../components/Hero'
import { useSEO } from '../hooks/useSEO'

const boardMembers = [
  {
    name: 'Dr JM Makua',
    role: 'Conference Chair',
    image: '/Dr-Makua.webp',
    linkedin: '#',
  },
  {
    name: 'Dr PR Gumede',
    role: 'Content Director',
    image: '/Dr%20PR%20Gumede.webp',
    linkedin: '#',
  },
  {
    name: 'Ms NL Nene',
    role: 'Logistics and Operations Specialist',
    image: '/Ms%20NL%20Nene.webp',
    linkedin: '#',
  },
  {
    name: 'Mr C Nyondo',
    role: 'Strategic Technology and Logistics Specialist',
    image: '/Mr%20C%20Nyondo.webp',
    linkedin: '#',
  },
]

const contactDetails = [
  {
    label: 'For conference enquiries, contact',
    person: 'Ms. NL Nene',
    email: 'tldc@mut.ac.za',
  },
  {
    label: 'Abstract submission:',
    person: 'Dr. PR Gumede',
    email: 'siphiweg@mut.ac.za',
  },
  {
    label: 'Registration problems:',
    person: 'Mr. C Nyondo',
    email: 'nyondoc@mut.ac.za',
  },
]

export default function BoardOfDirectors() {
  useSEO({
    title: 'Conference Board of Directors',
    description: 'Meet the Conference Board of Directors responsible for organising and managing Focus Space events.',
  })

  return (
    <div>
      <Hero
        title="Conference Board of Directors"
        subtitle="Our Team"
        description="Meet the team responsible for organising and managing Focus Space conference events."
        backgroundImage="/slide-4-copy-scaled.webp"
        size="small"
      />

      {/* Board members */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-center text-charcoal mb-10">Conference Board of Directors</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {boardMembers.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-gray-100 rounded-sm shadow-sm p-5 flex flex-col items-center text-center w-56"
                >
                  <div className="w-36 h-36 rounded-sm overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                  <h3 className="font-bold text-charcoal text-base mb-1">{member.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-snug">{member.role}</p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-sm hover:bg-primary-700 transition-colors"
                  >
                    <Linkedin size={13} />
                    LinkedIn
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact details */}
      <section className="pb-16 bg-white">
        <div className="container-max max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-lg font-bold text-charcoal mb-4">Contact Details</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {contactDetails.map((item) => (
                <p key={item.email}>
                  {item.label}{' '}
                  <span className="font-semibold text-charcoal">{item.person}</span>:{' '}
                  <a href={`mailto:${item.email}`} className="text-primary hover:underline">
                    {item.email}
                  </a>
                </p>
              ))}
              <p className="flex items-center gap-1.5 mt-1">
                <Phone size={13} className="text-gray-400" />
                Tel: +27 (031) 907 7575
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
