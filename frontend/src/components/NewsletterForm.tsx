import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import Button from './Button'

const BASE_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message ?? 'Subscription failed')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-charcoal py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-12 h-12 bg-primary rounded-sm flex items-center justify-center mx-auto mb-5">
            <Mail size={22} className="text-white" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white mb-3">Stay Informed</h2>
          <p className="text-gray-400 text-lg mb-8">
            Subscribe to receive conference announcements, call for abstracts, and event updates directly to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 text-green-400"
            >
              <CheckCircle size={22} />
              <p className="font-medium">You're subscribed! We'll be in touch soon.</p>
            </motion.div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 bg-charcoal-light border border-gray-600 text-white placeholder-gray-500 rounded-sm focus:outline-none focus:border-gold text-sm"
                />
                <Button type="submit" variant="gold" disabled={loading}>
                  {loading ? 'Subscribing…' : 'Subscribe'}
                </Button>
              </form>
              {error && (
                <div className="flex items-center justify-center gap-2 text-red-400 text-sm mt-3">
                  <AlertCircle size={15} /> {error}
                </div>
              )}
            </>
          )}

          <p className="text-gray-600 text-xs mt-5">
            No spam. Unsubscribe anytime. By subscribing you agree to our privacy policy.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
