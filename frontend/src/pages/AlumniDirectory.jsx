import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, MapPin, Briefcase, GraduationCap, Linkedin, Mail, ExternalLink, Sparkles, Star, Award, Loader2, Users } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import AnimatedButton from '../components/AnimatedButton'
import { cardContinuousAnimation, cardHoverAnimation } from '../animations/cardAnimations'

const GlassCard = ({ children, className = '', onClick, ...props }) => (
  <motion.div
    onClick={onClick}
    className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
)

const SectionHeader = ({ title, subtitle }) => (
  <motion.div
    className="text-center mb-12"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.h2
      className="text-4xl font-bold mb-4 bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent"
      animate={{
        backgroundPosition: ['0%', '100%', '0%'],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{ backgroundSize: '200% 200%' }}
    >
      {title}
    </motion.h2>
    <motion.p
      className="text-gray-600 dark:text-gray-400 text-lg"
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      {subtitle}
    </motion.p>
  </motion.div>
)

const AlumniDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    batch: '',
    branch: '',
    country: '',
    company: '',
    skills: '',
  })
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  // Real data integration
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Add Alumni State
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    company: '',
    branch: '',
    batch: '',
    location: '',
    skills: ''
  })

  // Handle Add Alumni
  const handleAddAlumni = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Split skills string into array
      const skillsArray = newUser.skills.split(',').map(s => s.trim()).filter(Boolean)

      const payload = {
        ...newUser,
        department: newUser.branch, // Map branch to department for backend
        skills: skillsArray
      }

      await api.post('/users', payload)
      toast.success('Alumni added successfully!')
      setShowAddModal(false)
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        company: '',
        branch: '',
        batch: '',
        location: '',
        skills: ''
      })
      fetchUsers() // Refresh list
    } catch (error) {
      console.error('Failed to add alumni:', error)
      toast.error(error.response?.data?.message || 'Failed to add alumni')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users')
      // Normalize data for the UI
      const formattedUsers = data.map(user => ({
        ...user,
        name: user.name || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Unknown Alumni'),
        branch: user.branch || user.department || 'Unknown Branch', // Handle both cases
        id: user._id
      }))
      setUsers(formattedUsers)
    } catch (error) {
      console.error('Failed to fetch alumni:', error)
      toast.error('Failed to load alumni directory')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAlumni = users.filter((alumni) => {
    // Basic search
    const matchesSearch =
      (alumni.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (alumni.position?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (alumni.company?.toLowerCase() || '').includes(searchTerm.toLowerCase())

    // Advanced filters
    const matchesBatch = !filters.batch || alumni.batch === filters.batch
    const matchesBranch = !filters.branch || alumni.branch === filters.branch
    const matchesCountry = !filters.country || (alumni.location?.toLowerCase() || '').includes(filters.country.toLowerCase())
    const matchesCompany = !filters.company || (alumni.company?.toLowerCase() || '').includes(filters.company.toLowerCase())

    // Skills check - assuming alumni.skills is an array of strings
    const matchesSkills = !filters.skills || (alumni.skills && alumni.skills.some(skill =>
      skill.toLowerCase().includes(filters.skills.toLowerCase())
    ))

    return matchesSearch && matchesBatch && matchesBranch && matchesCountry && matchesCompany && matchesSkills
  })

  // Get unique values for filters from actual data
  const uniqueBatches = [...new Set(users.map(a => a.batch).filter(Boolean))].sort()
  const uniqueBranches = [...new Set(users.map(a => a.branch).filter(Boolean))].sort()

  return (
    <div className="container mx-auto px-4 py-12 relative overflow-hidden">
      {/* Floating background bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => {
          const size = 20 + Math.random() * 80; // Bubble size between 20-100px
          const duration = 8 + Math.random() * 12; // Float duration 8-20s
          const delay = Math.random() * 5; // Random start delay
          const leftPosition = Math.random() * 100; // Random horizontal position

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${leftPosition}%`,
                bottom: '-100px',
                background: `radial-gradient(circle at 30% 30%, rgba(${i % 3 === 0 ? '56, 189, 248' : i % 3 === 1 ? '14, 165, 233' : '3, 105, 161'
                  }, 0.3), rgba(${i % 3 === 0 ? '56, 189, 248' : i % 3 === 1 ? '14, 165, 233' : '3, 105, 161'
                  }, 0.05))`,
                backdropFilter: 'blur(2px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: `0 8px 32px 0 rgba(${i % 3 === 0 ? '56, 189, 248' : i % 3 === 1 ? '14, 165, 233' : '3, 105, 161'
                  }, 0.2)`,
              }}
              animate={{
                y: [0, -(window.innerHeight + 200)],
                x: [
                  0,
                  Math.sin(i) * 50,
                  Math.sin(i + 1) * -50,
                  Math.sin(i + 2) * 50,
                  0
                ],
                scale: [1, 1.1, 0.9, 1.05, 1],
                opacity: [0, 0.6, 0.8, 0.6, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: 'easeInOut',
              }}
            >
              {/* Inner bubble highlight */}
              <motion.div
                className="absolute rounded-full bg-white/40"
                style={{
                  width: `${size * 0.3}px`,
                  height: `${size * 0.3}px`,
                  top: `${size * 0.15}px`,
                  left: `${size * 0.15}px`,
                  filter: 'blur(8px)',
                }}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          );
        })}

        {/* Additional smaller sparkle particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(59, 130, 246, 0.4))`,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <SectionHeader
        title="Alumni Directory"
        subtitle="Connect with alumni from Lovely Professional University"
      />

      {/* Search and Filter Bar */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <motion.div
            className="flex-1 relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-500" size={20} />
            </motion.div>
            <input
              type="text"
              placeholder="Search by name, position, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </motion.div>
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center space-x-2 hover:bg-sky-500/20"
            whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{
                rotate: showFilters ? 180 : 0,
              }}
            >
              <Filter size={20} />
            </motion.div>
            <span>Filters</span>
          </motion.button>

          <motion.button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users size={20} />
            <span>Add Alumni</span>
          </motion.button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, rotateX: -90 }}
              animate={{ opacity: 1, height: 'auto', rotateX: 0 }}
              exit={{ opacity: 0, height: 0, rotateX: -90 }}
              transition={{ duration: 0.4 }}
              className="mt-4 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 origin-top"
            >
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { label: 'Batch', key: 'batch', type: 'select', options: uniqueBatches },
                  { label: 'Branch', key: 'branch', type: 'select', options: uniqueBranches },
                  { label: 'Country', key: 'country', type: 'input', placeholder: 'e.g., India, USA' },
                  { label: 'Company', key: 'company', type: 'input', placeholder: 'Company name' },
                  { label: 'Skills', key: 'skills', type: 'input', placeholder: 'e.g., React, Python' },
                ].map((filter, index) => (
                  <motion.div
                    key={filter.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <label className="block text-sm font-medium mb-2">{filter.label}</label>
                    {filter.type === 'select' ? (
                      <select
                        value={filters[filter.key]}
                        onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20"
                      >
                        <option value="">All {filter.label}s</option>
                        {filter.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder={filter.placeholder}
                        value={filters[filter.key]}
                        onChange={(e) => setFilters({ ...filters, [filter.key]: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
              <motion.button
                onClick={() => setFilters({ batch: '', branch: '', country: '', company: '', skills: '' })}
                className="mt-4 text-sm text-sky-400 hover:underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear all filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results Count */}
      <motion.p
        className="text-gray-600 dark:text-gray-400 mb-6 font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={filteredAlumni.length}
      >
        Found {filteredAlumni.length} alumni
      </motion.p>

      {/* Alumni Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-16 h-16 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alumni, index) => (
            <motion.div
              key={alumni.id}
              initial={{ opacity: 0, y: 50, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
              transition={{
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100,
                damping: 15
              }}
              whileHover={{
                scale: 1.08,
                y: -15,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <GlassCard
                className="cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedProfile(alumni)}
                {...cardContinuousAnimation}
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 pointer-events-none"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Sparkle effect on hover */}
                <motion.div
                  className="absolute top-2 right-2"
                  whileHover={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                >
                  <Star className="w-5 h-5 text-sky-400" />
                </motion.div>

                <div className="flex items-start space-x-4 relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg relative"
                    whileHover={{
                      rotate: 360,
                      scale: 1.2
                    }}
                    transition={{ duration: 0.6 }}
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(56, 189, 248, 0.5)',
                        '0 0 40px rgba(14, 165, 233, 0.5)',
                        '0 0 20px rgba(56, 189, 248, 0.5)',
                      ],
                    }}
                  >
                    {/* Rotating ring around avatar */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/30"
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />

                    {/* Name initial with animated gradient */}
                    <motion.span
                      className="text-white text-xl font-bold relative z-10"
                      animate={{
                        scale: [1, 1.1, 1],
                        textShadow: [
                          '0 0 10px rgba(255,255,255,0.5)',
                          '0 0 20px rgba(255,255,255,0.8)',
                          '0 0 10px rgba(255,255,255,0.5)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      {alumni.name && alumni.name.length > 0 ? alumni.name[0] : '?'}
                    </motion.span>

                    {/* Animated particles around avatar */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                        }}
                        animate={{
                          x: [0, Math.cos(i * 120 * Math.PI / 180) * 30],
                          y: [0, Math.sin(i * 120 * Math.PI / 180) * 30],
                          opacity: [1, 0],
                          scale: [1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3
                      className="font-bold text-lg text-gray-900 dark:text-white"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {alumni.name}
                    </motion.h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{alumni.position}</p>
                    <motion.p
                      className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1"
                      whileHover={{ x: 5 }}
                    >
                      <Briefcase size={14} className="mr-1" />
                      {alumni.company}
                    </motion.p>
                    <motion.p
                      className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1"
                      whileHover={{ x: 5 }}
                    >
                      <GraduationCap size={14} className="mr-1" />
                      {alumni.branch} • {alumni.batch}
                    </motion.p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {alumni.skills && alumni.skills.slice(0, 3).map((skill, i) => (
                        <motion.span
                          key={i}
                          className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProfile(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateX: -20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateX: 20 }}
              transition={{ type: 'spring', duration: 0.6 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 shadow-xl relative"
                    animate={{
                      rotate: [0, 360],
                      boxShadow: [
                        '0 0 30px rgba(59, 130, 246, 0.6)',
                        '0 0 60px rgba(147, 51, 234, 0.6)',
                        '0 0 30px rgba(59, 130, 246, 0.6)',
                      ],
                    }}
                    transition={{
                      rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                      boxShadow: { duration: 3, repeat: Infinity },
                    }}
                  >
                    {/* Multiple rotating rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-white/20"
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-white/10"
                      animate={{
                        rotate: [360, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />

                    {/* Animated name initial */}
                    <motion.span
                      className="text-white text-3xl font-bold relative z-10"
                      animate={{
                        scale: [1, 1.15, 1],
                        textShadow: [
                          '0 0 20px rgba(255,255,255,0.8)',
                          '0 0 40px rgba(255,255,255,1)',
                          '0 0 20px rgba(255,255,255,0.8)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      {selectedProfile.name[0]}
                    </motion.span>

                    {/* Orbiting particles */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                        }}
                        animate={{
                          x: [0, Math.cos(i * 60 * Math.PI / 180) * 50],
                          y: [0, Math.sin(i * 60 * Math.PI / 180) * 50],
                          opacity: [1, 0.3, 1],
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                      />
                    ))}
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProfile.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{selectedProfile.position}</p>
                    <p className="text-gray-600 dark:text-gray-400">{selectedProfile.company}</p>
                  </motion.div>
                </div>
                <motion.button
                  onClick={() => setSelectedProfile(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Education',
                    icon: GraduationCap,
                    content: `${selectedProfile.branch}, Batch ${selectedProfile.batch}`
                  },
                  {
                    title: 'Location',
                    icon: MapPin,
                    content: selectedProfile.location
                  },
                ].map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{section.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center">
                      <section.icon size={16} className="mr-2" />
                      {section.content}
                    </p>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.skills.map((skill, i) => (
                      <motion.span
                        key={i}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        whileHover={{ scale: 1.1, y: -3 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Contact</h3>
                  <div className="flex space-x-4">
                    <motion.a
                      href={selectedProfile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
                      whileHover={{ scale: 1.1, x: 5 }}
                    >
                      <Linkedin size={20} />
                      <span>LinkedIn</span>
                      <ExternalLink size={14} />
                    </motion.a>
                    <motion.a
                      href={`mailto:${selectedProfile.email}`}
                      className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
                      whileHover={{ scale: 1.1, x: 5 }}
                    >
                      <Mail size={20} />
                      <span>Email</span>
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Alumni Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-8 max-w-lg w-full border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Alumni</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleAddAlumni} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">First Name</label>
                    <input
                      type="text"
                      required
                      value={newUser.firstName}
                      onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Last Name</label>
                    <input
                      type="text"
                      required
                      value={newUser.lastName}
                      onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Position</label>
                    <input
                      type="text"
                      value={newUser.position}
                      onChange={e => setNewUser({ ...newUser, position: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Company</label>
                    <input
                      type="text"
                      value={newUser.company}
                      onChange={e => setNewUser({ ...newUser, company: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Branch</label>
                    <select
                      value={newUser.branch}
                      onChange={e => setNewUser({ ...newUser, branch: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all dark:text-white"
                    >
                      <option value="" className="text-black">Select Branch</option>
                      <option value="Computer Science" className="text-black">Computer Science</option>
                      <option value="Information Technology" className="text-black">Information Technology</option>
                      <option value="Electronics" className="text-black">Electronics</option>
                      <option value="Mechanical" className="text-black">Mechanical</option>
                      <option value="Civil" className="text-black">Civil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Batch</label>
                    <input
                      type="text"
                      placeholder="e.g. 2023"
                      value={newUser.batch}
                      onChange={e => setNewUser({ ...newUser, batch: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Location</label>
                  <input
                    type="text"
                    value={newUser.location}
                    onChange={e => setNewUser({ ...newUser, location: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, Python"
                    value={newUser.skills}
                    onChange={e => setNewUser({ ...newUser, skills: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="pt-4">
                  <AnimatedButton
                    type="submit"
                    className="w-full"
                    width="full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Add Alumni'}
                  </AnimatedButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  )
}

export default AlumniDirectory