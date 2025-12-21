import { Link } from 'react-router-dom'
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="relative mt-20 glass dark:glass-dark border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-4 group cursor-pointer">
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg blur-md opacity-30 group-hover:opacity-100 transition duration-500"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <GraduationCap className="w-8 h-8 text-sky-500 relative drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
              </div>
              <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600 tracking-tight drop-shadow-sm">
                AlumniFusion
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Connecting Lovely Professional University alumni worldwide. Building a strong network for success.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              {['Directory', 'Networking', 'Jobs', 'Events', 'Donate'].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Resources</h3>
            <ul className="space-y-2">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Success Stories', path: '/success-stories' },
                { label: 'Feedback', path: '/feedback' },
                { label: 'Contact', path: '/contact' }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                <Mail size={16} />
                <span>info@lpu.co.in</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                <Phone size={16} />
                <span>+91 182 451 7000</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                <MapPin size={16} />
                <span>LOVELY PROFESSIONAL UNIVERSITY ,Jalandhar - Delhi G.T. Road ,Phagwara ,Punjab (India)-144411</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              {[
                { Icon: Facebook, url: 'https://facebook.com/LPUUniversity' },
                { Icon: Twitter, url: 'https://twitter.com/lpuuniversity' },
                { Icon: Linkedin, url: 'https://linkedin.com/school/lovely-professional-university' },
                { Icon: Instagram, url: 'https://instagram.com/lpuuniversity' }
              ].map(({ Icon, url }, i) => (
                <motion.a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 shadow-lg"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} AlumniFusion - LOVELY PROFESSIONAL UNIVERSITY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

