import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, CheckCircle, X, Edit, Trash2, Bell, Check, AlertCircle, BarChart2, Star } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AdminContentManager = () => {
  const [stories, setStories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [announcements, setAnnouncements] = useState([])
  const [feedback, setFeedback] = useState([])
  const [feedbackStats, setFeedbackStats] = useState({ averageRating: 0, ratingCounts: [] })

  const [surveyTitle, setSurveyTitle] = useState('Platform Feedback Survey')
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' })

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true)
      await Promise.all([
        fetchPendingStories(),
        fetchAnnouncements(),
        fetchFeedbackData()
      ])
      setIsLoading(false)
    }
    initData()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get('/announcements')
      setAnnouncements(data)
    } catch (error) {
      console.error('Failed to fetch announcements:', error)
    }
  }

  const fetchFeedbackData = async () => {
    try {
      const [listRes, statsRes] = await Promise.all([
        api.get('/feedback'),
        api.get('/feedback/stats')
      ])
      setFeedback(listRes.data)
      setFeedbackStats(statsRes.data)
    } catch (error) {
      console.error('Failed to fetch feedback data:', error)
    }
  }

  const fetchPendingStories = async () => {
    try {
      const { data } = await api.get('/stories/pending')
      setStories(data)
    } catch (error) {
      console.error('Failed to fetch stories:', error)
      toast.error('Failed to load pending stories')
    }
  }

  // Story Actions
  const handleApproveStory = async (id) => {
    if (window.confirm('Are you sure you want to approve this success story?')) {
      try {
        await api.put(`/stories/${id}/status`, { status: 'approved' })
        setStories(stories.filter(s => s._id !== id))
        toast.success('Story approved successfully')
      } catch (error) {
        console.error('Approve error:', error)
        toast.error('Failed to approve story')
      }
    }
  }

  const handleRejectStory = async (id) => {
    if (window.confirm('Are you sure you want to reject this story?')) {
      try {
        await api.put(`/stories/${id}/status`, { status: 'rejected' })
        setStories(stories.filter(s => s._id !== id))
        toast.success('Story rejected')
      } catch (error) {
        console.error('Reject error:', error)
        toast.error('Failed to reject story')
      }
    }
  }

  // Announcement Actions
  const handleAddAnnouncement = async (e) => {
    e.preventDefault()
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast.error('Please fill in all fields')
      return
    }
    const announcement = {
      title: newAnnouncement.title,
      content: newAnnouncement.content,
    }
    try {
      await api.post('/announcements', announcement)
      fetchAnnouncements()
      setNewAnnouncement({ title: '', content: '' })
      setShowAnnouncementModal(false)
      toast.success('Announcement added successfully')
    } catch (error) {
      toast.error('Failed to add announcement')
    }
  }

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await api.delete(`/announcements/${id}`)
        fetchAnnouncements()
        toast.success('Announcement deleted successfully')
      } catch (error) {
        toast.error('Failed to delete announcement')
      }
    }
  }

  // Survey Actions
  const handleEditSurvey = () => {
    const newTitle = window.prompt('Enter new survey title:', surveyTitle)
    if (newTitle) {
      setSurveyTitle(newTitle)
      toast.success('Survey title updated')
    }
  }

  const handleViewResults = () => {
    setShowResultsModal(true)
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-gradient">Content Manager</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage success stories, announcements, and surveys</p>
      </motion.div>

      {/* Success Stories */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Success Stories</h2>
        <div className="space-y-4">
          <AnimatePresence>
            {stories.map((story, index) => (
              <motion.div
                key={story._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{story.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{story.story}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleApproveStory(story._id)}
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg text-green-600 dark:text-green-400"
                        title="Approve"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleRejectStory(story._id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-600 dark:text-red-400"
                        title="Reject"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
          {!isLoading && stories.length === 0 && (
            <p className="text-gray-500 italic">No pending stories.</p>
          )}
        </div>
      </div>

      {/* Announcements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h2>
          <AnimatedButton onClick={() => setShowAnnouncementModal(true)}>
            <Bell className="inline mr-2" size={20} />
            Add Announcement
          </AnimatedButton>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence>
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{announcement.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{announcement.content}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement._id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-600 dark:text-red-400 h-fit transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
          {!isLoading && announcements.length === 0 && (
            <p className="text-gray-500 italic">No announcements found.</p>
          )}
        </div>
      </div>

      {/* Surveys */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Surveys & Feedback</h2>
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{surveyTitle}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Active • {feedback.length} responses</p>
            </div>
            <div className="flex space-x-3">
              <AnimatedButton variant="outline" onClick={handleEditSurvey}>
                <Edit className="inline mr-2" size={16} />
                Edit
              </AnimatedButton>
              <AnimatedButton onClick={handleViewResults}>
                <BarChart2 className="inline mr-2" size={16} />
                View Results
              </AnimatedButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Add Announcement Modal */}
      <AnimatePresence>
        {showAnnouncementModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAnnouncementModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass dark:glass-dark rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">New Announcement</h2>
              <form onSubmit={handleAddAnnouncement} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Title</label>
                  <input
                    type="text"
                    required
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl glass dark:glass-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                    placeholder="Enter announcement title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Content</label>
                  <textarea
                    rows="4"
                    required
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl glass dark:glass-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                    placeholder="Enter announcement details..."
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <AnimatedButton type="button" variant="outline" className="flex-1" onClick={() => setShowAnnouncementModal(false)}>
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton type="submit" className="flex-1">
                    Post Announcement
                  </AnimatedButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Survey Results Modal */}
      <AnimatePresence>
        {showResultsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowResultsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass dark:glass-dark rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-white/20"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Survey Insights</h2>
                  <p className="text-sm text-gray-500">{surveyTitle}</p>
                </div>
                <button
                  onClick={() => setShowResultsModal(false)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 rounded-xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-sky-50 dark:bg-sky-900/20 p-5 rounded-2xl text-center border border-sky-100 dark:border-sky-800">
                    <p className="text-xs uppercase tracking-wider font-bold text-sky-600 mb-2">Avg Rating</p>
                    <div className="flex items-center justify-center gap-2">
                      <Star size={20} className="fill-yellow-400 text-yellow-400" />
                      <p className="text-3xl font-black text-gray-900 dark:text-white">
                        {feedbackStats.averageRating ? feedbackStats.averageRating.toFixed(1) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-2xl text-center border border-purple-100 dark:border-purple-800">
                    <p className="text-xs uppercase tracking-wider font-bold text-purple-600 mb-2">Responses</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{feedback.length}</p>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 px-1">Rating Distribution</h3>
                  <div className="space-y-4">
                    {[5, 4, 3, 2, 1].map(stars => {
                      const count = feedbackStats.ratingCounts?.find(c => c._id === stars)?.count || 0
                      const percentage = feedback.length ? (count / feedback.length) * 100 : 0
                      return (
                        <div key={stars} className="group">
                          <div className="flex justify-between text-xs mb-2 text-gray-700 dark:text-gray-300">
                            <span className="flex items-center font-bold">
                              {stars} <Star size={10} className="ml-1 fill-yellow-400 text-yellow-400" />
                            </span>
                            <span className="font-mono">{count} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className={`h-full rounded-full ${stars >= 4 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' :
                                  stars >= 3 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
                                    'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                                }`}
                            ></motion.div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recent Individual Feedback */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 px-1">Recent Comments</h3>
                  <div className="space-y-4">
                    {feedback.slice(0, 5).map((f) => (
                      <div key={f._id} className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-700 transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-xs font-bold text-sky-600 dark:text-sky-400">
                              {f.userId ? `${f.userId.firstName[0]}${f.userId.lastName[0]}` : 'AN'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                                {f.userId ? `${f.userId.firstName} ${f.userId.lastName}` : 'Anonymous'}
                              </p>
                              <span className="text-[10px] text-gray-400 font-mono">
                                {new Date(f.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center bg-yellow-400/10 px-2 py-1 rounded-lg text-yellow-500 border border-yellow-400/20">
                            <Star size={12} className="fill-current mr-1" />
                            <span className="text-xs font-black">{f.rating || '-'}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium italic">
                          "{f.feedback || 'No comment provided.'}"
                        </p>
                        {f.emoji && (
                          <div className="mt-3 inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Mood:</span>
                            <span className="text-xs capitalize font-bold text-gray-700 dark:text-gray-200">{f.emoji}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {feedback.length === 0 && (
                      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <BarChart2 className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500 italic">No feedback comments yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <AnimatedButton className="w-full text-lg font-bold h-14 rounded-2xl" onClick={() => setShowResultsModal(false)}>
                  Done Reviewing
                </AnimatedButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminContentManager
