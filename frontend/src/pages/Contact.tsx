import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import Hero from '../components/Hero'
import SectionTitle from '../components/SectionTitle'
import Button from '../components/Button'
import { useSEO } from '../hooks/useSEO'

export default function Contact() {
  useSEO({
    title: 'Contact Us',
    description: 'Reach out for conference inquiries, sponsorship opportunities, abstract submissions, or general questions.',
  })
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div>
      <Hero
        title="Contact Us"
        subtitle="Get In Touch"
        description="Reach out for conference inquiries, sponsorship opportunities, abstract submissions, or general questions."
        backgroundImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1800&auto=format&fit=crop"
        size="small"
      />

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact info */}
            <div>
              <SectionTitle subtitle="Reach Us" title="Contact Information" />
              <div className="space-y-6">
                {[
                  { Icon: MapPin, label: 'Address', value: 'Focus Space Secretariat\n123 Conference Road\nJohannesburg, South Africa' },
                  { Icon: Mail, label: 'Email', value: 'info@focusspace.org' },
                  { Icon: Phone, label: 'Phone', value: '+27 (0) 00 000 0000' },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-sm flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                      <p className="text-charcoal text-sm whitespace-pre-line">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <SectionTitle subtitle="Send a Message" title="Write to Us" />
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center gap-4 py-16 text-center"
                >
                  <CheckCircle size={48} className="text-green-500" />
                  <h3 className="font-serif font-bold text-charcoal text-2xl">Message Sent</h3>
                  <p className="text-gray-500">Thank you for reaching out. We'll respond within 2 business days.</p>
                  <Button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }} variant="outline">
                    Send Another
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { name: 'name', label: 'Full Name', type: 'text', colSpan: false },
                    { name: 'email', label: 'Email Address', type: 'email', colSpan: false },
                    { name: 'subject', label: 'Subject', type: 'text', colSpan: true },
                  ].map(({ name, label, type, colSpan }) => (
                    <div key={name} className={colSpan ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={form[name as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-charcoal focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                      Message
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-charcoal focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" variant="primary" disabled={loading}>
                      <Send size={15} />
                      {loading ? 'Sending…' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
