import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, GraduationCap, MapPin, ExternalLink, Sparkles, ChevronDown, ChevronUp, Loader2, X } from 'lucide-react'
import api from '../utils/api'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import toast from 'react-hot-toast'
import { cardContinuousAnimation, cardHoverAnimation } from '../animations/cardAnimations'

const SuccessStories = () => {
  const [expandedStories, setExpandedStories] = useState({})
  const [stories, setStories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Add Story State
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newStory, setNewStory] = useState({
    name: '',
    position: '',
    company: '',
    branch: '',
    batch: '',
    location: '',
    story: '',
    achievements: '',
    link: ''
  })

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const { data } = await api.get('/stories')
      setStories(data)
    } catch (error) {
      console.error('Error fetching stories:', error)
      toast.error('Failed to load success stories')
    } finally {
      setIsLoading(false)
    }
  }

  // Assuming this is the intended 'handleAddStory' or submission logic
  // The original instruction snippet replaced fetchStories, but this is likely a separate function.
  // For the purpose of applying the change faithfully, I'm adding it as a new function.
  // If this was meant to replace fetchStories, the application's story fetching would break.
  const handleAddStory = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const achievementsList = newStory.achievements.split(',').map(s => s.trim()).filter(Boolean)
      const payload = { ...newStory, achievements: achievementsList }

      await api.post('/stories', payload)
      toast.success('Story submitted for approval! An admin will review it shortly.')
      setShowAddModal(false)
      setNewStory({
        name: '',
        position: '',
        company: '',
        branch: '',
        batch: '',
        location: '',
        story: '',
        achievements: '',
        link: ''
      })
    } catch (error) {
      console.error('Error submitting story:', error)
      toast.error('Failed to submit story.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleStory = (id) => {
    setExpandedStories(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  return (
    <div className="container mx-auto px-4 py-12 relative overflow-hidden">
      {/* Floating background bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => {
          const size = 20 + Math.random() * 80;
          const duration = 8 + Math.random() * 12;
          const delay = Math.random() * 5;
          const leftPosition = Math.random() * 100;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${leftPosition}%`,
                bottom: '-100px',
                background: `radial-gradient(circle at 30% 30%, rgba(${i % 3 === 0 ? '59, 130, 246' : i % 3 === 1 ? '147, 51, 234' : '236, 72, 153'
                  }, 0.3), rgba(${i % 3 === 0 ? '59, 130, 246' : i % 3 === 1 ? '147, 51, 234' : '236, 72, 153'
                  }, 0.05))`,
                backdropFilter: 'blur(2px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: `0 8px 32px 0 rgba(${i % 3 === 0 ? '59, 130, 246' : i % 3 === 1 ? '147, 51, 234' : '236, 72, 153'
                  }, 0.2)`,
              }}
              animate={{
                y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 200 : 1000)],
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

        {/* Sparkle particles */}
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

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <SectionHeader
            title="Success Stories"
            subtitle="Inspiring journeys of our accomplished alumni"
            center={false}
          />
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg flex items-center space-x-2 font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles size={20} />
            <span>Share Your Story</span>
          </motion.button>
        </div>

        <div className="space-y-12">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
            </div>
          ) : (
            stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15
                }}
              >
                <GlassCard
                  className="overflow-hidden relative group"
                  {...cardContinuousAnimation}
                >
                  {/* Animated gradient background */}

                  <motion.div
                    className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  />
                  <div className="flex items-start space-x-6 relative z-10">
                    <motion.div
                      className="w-24 h-24 rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg relative"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(59, 130, 246, 0.5)',
                          '0 0 40px rgba(147, 51, 234, 0.5)',
                          '0 0 20px rgba(59, 130, 246, 0.5)',
                        ],
                      }}
                    >
                      {/* Rotating ring */}
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
                      {story.photo ? (
                        <img src={story.photo} alt={story.name} className="w-full h-full object-cover relative z-10" />
                      ) : (
                        <motion.span
                          className="text-white text-3xl font-bold relative z-10"
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        >
                          {story.name && story.name.length > 0 ? story.name[0] : '?'}
                        </motion.span>
                      )}
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + 0.1 }}
                        >
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{story.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400">{story.position}</p>
                          <p className="text-gray-600 dark:text-gray-400">{story.company}</p>
                        </motion.div>
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3
                          }}
                        >
                          <Trophy className="text-yellow-400" size={32} />
                        </motion.div>
                      </div>

                      <motion.div
                        className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.2 }}
                      >
                        <motion.span
                          className="flex items-center px-3 py-1 bg-sky-100 dark:bg-sky-900/30 rounded-full"
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          <GraduationCap size={16} className="mr-1 text-sky-600 dark:text-sky-400" />
                          {story.branch} • {story.batch}
                        </motion.span>
                        <motion.span
                          className="flex items-center px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 rounded-full"
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          <MapPin size={16} className="mr-1 text-cyan-600 dark:text-cyan-400" />
                          {story.location}
                        </motion.span>
                      </motion.div>

                      <motion.div
                        className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.3 }}
                      >
                        <p>
                          {expandedStories[story.id] ? story.story : truncateText(story.story)}
                        </p>
                        {story.story.length > 200 && (
                          <motion.button
                            onClick={() => toggleStory(story.id)}
                            className="mt-2 text-sky-600 dark:text-sky-400 hover:underline font-semibold inline-flex items-center"
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {expandedStories[story.id] ? (
                              <>
                                Show Less <ChevronUp size={16} className="ml-1" />
                              </>
                            ) : (
                              <>
                                Read More <ChevronDown size={16} className="ml-1" />
                              </>
                            )}
                          </motion.button>
                        )}
                      </motion.div>

                      {story.achievements && (
                        <motion.div
                          className="mb-4"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + 0.4 }}
                        >
                          <h4 className="font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
                            <Sparkles size={18} className="mr-2 text-sky-500" />
                            Key Achievements:
                          </h4>
                          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                            {story.achievements.map((achievement, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 + 0.5 + i * 0.1 }}
                                whileHover={{ x: 5, color: '#0ea5e9' }}
                              >
                                {achievement}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {story.link && (
                        <motion.a
                          href={story.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sky-600 dark:text-sky-400 hover:underline font-semibold"
                          whileHover={{ scale: 1.05, x: 5 }}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + 0.6 }}
                        >
                          View LinkedIn Profile <ExternalLink size={16} className="ml-1" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add Story Modal */}
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
              className="bg-white/10 backdrop-blur-xl rounded-xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Your Success Story</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleAddStory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
                    <input
                      type="text"
                      required
                      value={newStory.name}
                      onChange={e => setNewStory({ ...newStory, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 outline-none dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Current Position</label>
                    <input
                      type="text"
                      required
                      value={newStory.position}
                      onChange={e => setNewStory({ ...newStory, position: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 outline-none dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Company</label>
                    <input
                      type="text"
                      required
                      value={newStory.company}
                      onChange={e => setNewStory({ ...newStory, company: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 outline-none dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Location</label>
                    <input
                      type="text"
                      value={newStory.location}
                      onChange={e => setNewStory({ ...newStory, location: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 outline-none dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Branch</label>
                    <select
                      value={newStory.branch}
                      onChange={e => setNewStory({ ...newStory, branch: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 outline-none dark:text-white"
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
                      value={newStory.batch}
                      onChange={e => setNewStory({ ...newStory, batch: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 outline-none dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Your Story</label>
                  <textarea
                    required
                    rows="4"
                    value={newStory.story}
                    onChange={e => setNewStory({ ...newStory, story: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 outline-none dark:text-white"
                    placeholder="Share your journey..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Key Achievements (comma separated)</label>
                  <input
                    type="text"
                    value={newStory.achievements}
                    onChange={e => setNewStory({ ...newStory, achievements: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">LinkedIn/Profile Link</label>
                  <input
                    type="url"
                    value={newStory.link}
                    onChange={e => setNewStory({ ...newStory, link: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-sky-500 outline-none dark:text-white"
                  />
                </div>

                <div className="pt-4">
                  <motion.button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Submit Story'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SuccessStories

