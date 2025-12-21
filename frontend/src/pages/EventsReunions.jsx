import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Clock, Users, QrCode, X, CheckCircle, Loader2, Plus } from 'lucide-react'
import api from '../utils/api'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import AnimatedButton from '../components/AnimatedButton'
import toast from 'react-hot-toast'
import { cardContinuousAnimation, cardHoverAnimation } from '../animations/cardAnimations'

const EventsReunions = () => {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Host Event State
  const [showHostModal, setShowHostModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    banner: '',
    approvalStatus: 'pending' // Users are pending by default
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events')
      setEvents(data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
      toast.error('Failed to load events')
    } finally {
      setIsLoading(false)
    }
  }

  const handleHostEvent = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = {
        ...newEvent,
        date: new Date(newEvent.date).toISOString()
      }
      await api.post('/events', payload)
      toast.success('Event submitted for approval! Admins will review it shortly.')
      setShowHostModal(false)
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        banner: '',
        approvalStatus: 'pending'
      })
    } catch (error) {
      toast.error('Failed to submit event')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date())
  const pastEvents = events.filter(e => new Date(e.date) < new Date())

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
                background: `radial-gradient(circle at 30% 30%, rgba(${i % 3 === 0 ? '59, 130, 246' : i % 3 === 1 ? '147, 51, 234' : '236, 72, 153'}, 0.3), rgba(${i % 3 === 0 ? '59, 130, 246' : i % 3 === 1 ? '147, 51, 234' : '236, 72, 153'}, 0.05))`,
                backdropFilter: 'blur(2px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: `0 8px 32px 0 rgba(${i % 3 === 0 ? '59, 130, 246' : i % 3 === 1 ? '147, 51, 234' : '236, 72, 153'}, 0.2)`,
              }}
              animate={{
                y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 200 : 1000)],
                x: [0, Math.sin(i) * 50, Math.sin(i + 1) * -50, Math.sin(i + 2) * 50, 0],
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
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <SectionHeader
            title="Events & Reunions"
            subtitle="Stay connected through our alumni events"
            center={false}
          />
          <motion.button
            onClick={() => setShowHostModal(true)}
            className="mt-4 md:mt-0 px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg flex items-center space-x-2 font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            <span>Host an Event</span>
          </motion.button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
          </div>
        ) : (
          <>
            {/* Upcoming Events */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gradient">Upcoming Events</h2>
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No upcoming events scheduled. Be the first to host one!</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 50, scale: 0.9, rotateY: -15 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100, damping: 15 }}
                      whileHover={{ scale: 1.08, y: -15, rotateY: 5, transition: { duration: 0.3 } }}
                    >
                      <GlassCard
                        className="h-full relative overflow-hidden group"
                        {...cardContinuousAnimation}
                      >
                        <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 pointer-events-none" />
                        {event.banner && (
                          <img src={event.banner} alt={event.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                        )}
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white relative z-10">{event.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Calendar size={16} className="mr-2" />
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Clock size={16} className="mr-2" />
                            {event.time}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <MapPin size={16} className="mr-2" />
                            {event.location}
                          </p>
                        </div>
                        <div className="flex space-x-2 mt-auto">
                          <AnimatedButton className="flex-1" onClick={() => setSelectedEvent(event)}>View Details</AnimatedButton>
                          <AnimatedButton variant="outline" className="flex-1" onClick={() => { setSelectedEvent(event); setShowQR(true); }}>RSVP</AnimatedButton>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Events Gallery */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gradient">Past Events Gallery</h2>
              {pastEvents.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No past events found.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pastEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <GlassCard
                        className="cursor-pointer relative overflow-hidden group"
                        onClick={() => setSelectedEvent(event)}
                        {...cardContinuousAnimation}
                      >
                        {event.banner && (
                          <img src={event.banner} alt={event.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                        )}
                        <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Event Detail Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              onClick={() => { setSelectedEvent(null); setShowQR(false); }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass dark:glass-dark rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedEvent.title}</h2>
                  <button onClick={() => { setSelectedEvent(null); setShowQR(false); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X size={24} /></button>
                </div>
                {selectedEvent.banner && (
                  <img src={selectedEvent.banner} alt={selectedEvent.title} className="w-full h-64 object-cover rounded-lg mb-6" />
                )}
                <div className="space-y-4 mb-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedEvent.description}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400"><Calendar size={20} className="mr-2" /> {new Date(selectedEvent.date).toLocaleDateString()}</div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400"><Clock size={20} className="mr-2" /> {selectedEvent.time}</div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400"><MapPin size={20} className="mr-2" /> {selectedEvent.location}</div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400"><Users size={20} className="mr-2" /> {selectedEvent.attendees.length || 0} attendees</div>
                  </div>
                </div>
                {showQR ? (
                  <div className="text-center">
                    <div className="glass dark:glass-dark rounded-lg p-6 mb-4 inline-block"><QrCode size={200} className="text-gray-900 dark:text-white" /></div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Scan this QR code at the event for check-in</p>
                    <AnimatedButton onClick={() => setShowQR(false)}>Close</AnimatedButton>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <AnimatedButton className="flex-1" onClick={() => setShowQR(true)}><CheckCircle className="inline mr-2" size={20} /> RSVP & Get QR Code</AnimatedButton>
                    <AnimatedButton variant="outline" className="flex-1" onClick={() => { setSelectedEvent(null); setShowQR(false); }}>Close</AnimatedButton>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Host Event Modal */}
        <AnimatePresence>
          {showHostModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              onClick={() => setShowHostModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass dark:glass-dark rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-white/20 shadow-2xl"
              >
                <button
                  onClick={() => setShowHostModal(false)}
                  className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                >
                  <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Host an Event</h2>

                <form onSubmit={handleHostEvent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Event Title *</label>
                    <input type="text" required value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description *</label>
                    <textarea rows="4" required value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Date *</label>
                      <input type="date" required value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Time</label>
                      <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Location *</label>
                    <input type="text" required value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Banner Image URL</label>
                    <input type="text" value={newEvent.banner || ''} onChange={(e) => setNewEvent({ ...newEvent, banner: e.target.value })} className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" placeholder="https://..." />
                  </div>
                  <div className="pt-4">
                    <AnimatedButton type="submit" className="w-full">
                      {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Submit for Approval'}
                    </AnimatedButton>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EventsReunions
