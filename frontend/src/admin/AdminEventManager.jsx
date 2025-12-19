import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Upload, X, CheckCircle, XCircle, Clock } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AdminEventManager = () => {
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all') // 'all', 'pending'

  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    banner: '',
    approvalStatus: 'approved' // Admin created events are approved by default
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      // For admin, we want to see ALL events, including pending ones.
      // We'll filter client-side for tabs or use specific endpoints if preferred.
      // Let's use the new /all endpoint we just created.
      const { data } = await api.get('/events/all')
      setEvents(data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
      toast.error('Failed to load events')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      _id: '',
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      banner: '',
      approvalStatus: 'approved'
    })
    setIsEditing(false)
  }

  const handleOpenAdd = () => {
    resetForm()
    setShowModal(true)
  }

  const handleEdit = (event) => {
    setFormData({
      ...event,
      date: new Date(event.date).toISOString().split('T')[0]
    })
    setIsEditing(true)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`)
        toast.success('Event deleted successfully')
        fetchEvents()
      } catch (error) {
        toast.error('Failed to delete event')
      }
    }
  }

  const handleApproval = async (id, status) => {
    try {
      await api.put(`/events/${id}/status`, { status })
      toast.success(`Event ${status === 'approved' ? 'approved' : 'rejected'}`)
      fetchEvents()
    } catch (error) {
      toast.error(`Failed to ${status} event`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await api.put(`/events/${formData._id}`, formData)
        toast.success('Event updated successfully')
      } else {
        // Create a copy of formData and remove _id for creation
        const { _id, ...newDetail } = formData
        await api.post('/events', newDetail) // approved by default via state
        toast.success('Event created successfully')
      }
      setShowModal(false)
      resetForm()
      fetchEvents()
    } catch (error) {
      console.error(error)
      toast.error(isEditing ? 'Failed to update event' : 'Failed to create event')
    }
  }

  const filteredEvents = activeTab === 'all'
    ? events
    : events.filter(e => e.approvalStatus === 'pending')

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gradient">Event Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and approve alumni events</p>
        </div>
        <AnimatedButton onClick={handleOpenAdd}>
          <Plus className="inline mr-2" size={20} />
          Create Event
        </AnimatedButton>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2 px-4 font-medium transition-colors relative ${activeTab === 'all' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
        >
          All Events
          {activeTab === 'all' && (
            <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-2 px-4 font-medium transition-colors relative ${activeTab === 'pending' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
        >
          Pending Approval
          {events.filter(e => e.approvalStatus === 'pending').length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {events.filter(e => e.approvalStatus === 'pending').length}
            </span>
          )}
          {activeTab === 'pending' && (
            <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard className="h-full flex flex-col relative overflow-hidden">
              {/* Status Badge */}
              <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm
                ${event.approvalStatus === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' :
                  event.approvalStatus === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                    'bg-yellow-100 text-yellow-700 border border-yellow-200 delay-100 animate-pulse'
                }
              `}>
                {event.approvalStatus}
              </div>

              {event.banner && (
                <img
                  src={event.banner}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{event.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{event.description}</p>

              <div className="space-y-2 mb-4 flex-1">
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

              {/* Action Buttons */}
              <div className="space-y-2 mt-auto">
                {event.approvalStatus === 'pending' && (
                  <div className="flex space-x-2 pb-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                    <button
                      onClick={() => handleApproval(event._id, 'approved')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
                    >
                      <CheckCircle size={16} className="mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => handleApproval(event._id, 'rejected')}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
                    >
                      <XCircle size={16} className="mr-1" /> Reject
                    </button>
                  </div>
                )}

                <div className="flex space-x-2">
                  <AnimatedButton variant="outline" className="flex-1" onClick={() => handleEdit(event)}>
                    <Edit className="inline mr-2" size={16} />
                    Edit
                  </AnimatedButton>
                  <AnimatedButton variant="outline" className="flex-1" onClick={() => handleDelete(event._id)}>
                    <Trash2 className="inline mr-2" size={16} />
                    Delete
                  </AnimatedButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Event Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass dark:glass-dark rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-white/20 shadow-2xl"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description *</label>
                <textarea
                  rows="4"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Location *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Banner Image URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={formData.banner || ''}
                    onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <AnimatedButton type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </AnimatedButton>
                <AnimatedButton type="submit" className="flex-1">
                  {isEditing ? 'Update Event' : 'Create Event'}
                </AnimatedButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminEventManager
