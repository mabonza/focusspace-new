import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">F</span>
              </div>
              <span className="font-serif font-bold text-white text-xl">Focus Space</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              A premier academic conference management platform connecting researchers, policymakers, and practitioners across Africa and the globe.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 bg-charcoal-light rounded-sm flex items-center justify-center text-gray-400 hover:text-gold hover:bg-primary transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Conferences', to: '/conferences' },
                { label: 'Past Events', to: '/past-events' },
                { label: 'Speakers', to: '/speakers' },
                { label: 'Programme', to: '/programme' },
                { label: 'Sponsors', to: '/sponsors' },
                { label: 'Publications', to: '/publications' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For delegates */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">For Delegates</h4>
            <ul className="space-y-2 text-sm">
              {[
                'Register for Conference',
                'Submit an Abstract',
                'Download Certificate',
                'View Invoice',
                'Reviewer Dashboard',
                'Mobile App',
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-gold transition-colors text-gray-400 cursor-not-allowed">
                    {item} <span className="text-xs text-gray-600"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <span className="text-gray-400">Focus Space Secretariat, 123 Conference Road, Johannesburg, South Africa</span>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="text-gold mt-0.5 shrink-0" />
                <a href="mailto:info@focusspace.org" className="hover:text-gold transition-colors">
                  info@focusspace.org
                </a>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="text-gold mt-0.5 shrink-0" />
                <a href="tel:+27000000000" className="hover:text-gold transition-colors">
                  +27 (0) 00 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-charcoal-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Focus Space. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
