
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, MapPin, DollarSign, Clock, Search, Plus, X, Upload, CheckCircle, Sparkles, Star, Zap, TrendingUp, Loader2 } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import GlassCard from '../components/GlassCard'

const JobPortal = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [showAddJob, setShowAddJob] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applicationData, setApplicationData] = useState({ coverLetter: '', resume: null })
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showJobSuccess, setShowJobSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newJobData, setNewJobData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    salary: '',
    type: 'Full-time',
    requirements: '',
    skills: ''
  })

  // Extended job list
  const [allJobs, setAllJobs] = useState([])

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs')
      // Transform data if necessary, ensuring formatted dates or appropriate defaults
      const formattedJobs = data.map(job => ({
        ...job,
        id: job._id, // Ensure ID compatibility
        posted: new Date(job.createdAt).toLocaleDateString() // simpler date
      }))
      setAllJobs(formattedJobs)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredJobs = allJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setApplicationData({ ...applicationData, resume: file })
    }
  }

  const handleSubmitApplication = async () => {
    // if (!applicationData.resume) {
    //   toast.error('Please upload your resume (simulation)')
    //   // For now, we won't block because file upload isn't fully implemented on backend
    // }

    setIsSubmitting(true)
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        const formData = new FormData()
        formData.append('userId', user.id)
        formData.append('coverLetter', applicationData.coverLetter)
        if (applicationData.resume) {
          formData.append('resume', applicationData.resume)
        }

        await api.post(`/jobs/${selectedJob.id}/apply`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        setShowApplyModal(false)
        setShowSuccess(true)
        setSelectedJob(null)
        setApplicationData({ coverLetter: '', resume: null })
        toast.success('Application submitted successfully!')

        setTimeout(() => {
          setShowSuccess(false)
        }, 4000)
      } else {
        toast.error('You must be logged in to apply')
      }
    } catch (error) {
      console.error('Application error:', error)
      toast.error('Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePostJob = async () => {
    // Validate required fields
    if (!newJobData.title.trim()) {
      toast.error('Please enter a job title')
      return
    }
    if (!newJobData.company.trim()) {
      toast.error('Please enter a company name')
      return
    }

    setIsSubmitting(true)

    // Create new job object
    const jobPayload = {
      title: newJobData.title,
      company: newJobData.company,
      location: newJobData.location,
      salary: newJobData.salary || 'Competitive',
      type: newJobData.type,
      description: newJobData.description,
      requirements: newJobData.requirements.split(',').map(r => r.trim()).filter(r => r),
      skills: newJobData.skills.split(',').map(s => s.trim()).filter(s => s),
      // postedBy: user.id // Should be handled by backend from token ideally, or pass it here
    }

    try {
      // We get userId from localstorage to send as postedBy (if backend doesn't extract from token)
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        jobPayload.postedBy = user.id
      }

      await api.post('/jobs', jobPayload)
      // Optimistically update list or wait for re-fetch?
      // Since it's pending, we shouldn't add it to the list immediately if the list only filters approved.
      // So, just show success message.
      toast.success('Job submitted for approval! An admin will review it shortly.')
      setShowAddJob(false)
      setShowJobSuccess(true)
      setNewJobData({
        title: '',
        company: '',
        location: '',
        description: '',
        salary: '',
        type: 'Full-time',
        requirements: '',
        skills: ''
      })
      setTimeout(() => { setShowJobSuccess(false) }, 4000)

    } catch (error) {
      console.error('Post job error:', error)
      toast.error('Failed to post job')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Floating particles background
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 15
  }))

  // Animated bubbles
  const bubbles = Array.from({ length: 35 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 50 + 25,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 5
  }))

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-sky-400/20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Animated Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              background: `radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.3), rgba(125, 211, 252, 0.2), rgba(14, 165, 233, 0.1))`,
              boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.3)',
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 80 - 40, 0],
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: bubble.delay
            }}
          >
            {/* Inner shine effect */}
            <motion.div
              className="absolute top-2 left-2 w-1/3 h-1/3 bg-white/50 rounded-full blur-sm"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating briefcase icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={`briefcase-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -200, 0],
              x: [0, Math.random() * 60 - 30, 0],
              rotate: [0, 360],
              scale: [0.5, 1.2, 0.5],
              opacity: [0, 0.7, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 4
            }}
          >
            <Briefcase
              size={Math.random() * 25 + 15}
              className="text-sky-400"
              style={{ filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.6))' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 25 }, (_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.9)'
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto max-w-7xl px-4 py-12 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-sky-600 dark:text-sky-400">
                Job Portal
              </h1>
              <motion.p
                className="text-sky-200 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Find opportunities or post jobs for fellow alumni
              </motion.p>
            </motion.div>
          </div>
          <motion.button
            onClick={() => setShowAddJob(true)}
            className="px-8 py-4 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600 text-white rounded-2xl font-bold shadow-2xl flex items-center gap-3 relative overflow-hidden group"
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-sky-500 via-blue-500 to-sky-400"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Plus size={24} className="relative z-10" />
            </motion.div>
            <span className="relative z-10">Post Job</span>
          </motion.button>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-16 h-16 animate-spin text-sky-500" />
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="relative group">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600 rounded-3xl opacity-50 blur group-hover:opacity-75 transition-opacity"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: '200% 100%' }}
                />
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
                  <motion.div
                    className="absolute left-5 top-1/2 transform -translate-y-1/2 text-sky-300"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Search size={24} />
                  </motion.div>
                  <motion.input
                    type="text"
                    placeholder="Search jobs by title, company, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-8 py-5 rounded-3xl bg-transparent text-white placeholder-sky-300 outline-none text-lg"
                    whileFocus={{
                      scale: 1.02,
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              className="grid grid-cols-3 gap-6 mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {[
                { label: 'Total Jobs', value: filteredJobs.length, icon: Briefcase, color: 'from-sky-400 to-blue-500', gradient: 'sky' },
                { label: 'Companies', value: new Set(filteredJobs.map(j => j.company)).size, icon: Star, color: 'from-blue-400 to-sky-300', gradient: 'blue' },
                { label: 'Remote', value: filteredJobs.filter(j => j.location.includes('Remote')).length, icon: Zap, color: 'from-sky-500 to-cyan-500', gradient: 'cyan' }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="relative group"
                  initial={{ opacity: 0, y: 20, rotateY: -30 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.08, y: -10, rotateY: 5 }}
                >
                  <motion.div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl opacity-75 blur group-hover:opacity-100 transition-opacity`}
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className={`relative bg-gradient-to-br ${stat.color} p-6 rounded-2xl text-white shadow-2xl overflow-hidden`}>
                    {/* Floating mini bubbles inside stat cards */}
                    {Array.from({ length: 4 }, (_, j) => (
                      <motion.div
                        key={j}
                        className="absolute rounded-full bg-white/20"
                        style={{
                          width: Math.random() * 25 + 10,
                          height: Math.random() * 25 + 10,
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [0, -40, 0],
                          x: [0, Math.random() * 20 - 10, 0],
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 3 + j,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: j * 0.5
                        }}
                      />
                    ))}
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="relative z-10"
                    >
                      <stat.icon className="mb-2" size={28} />
                    </motion.div>
                    <motion.div
                      className="text-4xl font-black mb-1 relative z-10"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm font-semibold opacity-90 relative z-10">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Jobs Grid */}
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 50, rotateX: -20 }}
                  animate={{
                    opacity: [0, 1, 0.8, 1],
                    y: 0,
                    rotateX: 0,
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    opacity: { duration: 0.8, times: [0, 0.2, 0.5, 1] },
                    y: { duration: 0.8, type: "spring", stiffness: 100 },
                    rotateX: { duration: 0.8 },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                  }}
                  className="group"
                >
                  <GlassCard
                    className="cursor-pointer h-full"
                    onClick={() => setSelectedJob(job)}
                  >
                    {/* Floating bubbles inside job cards */}
                    {Array.from({ length: 6 }, (_, j) => (
                      <motion.div
                        key={j}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          width: Math.random() * 35 + 15,
                          height: Math.random() * 35 + 15,
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.05))',
                        }}
                        animate={{
                          y: [0, -50, 0],
                          x: [0, Math.random() * 30 - 15, 0],
                          scale: [1, 1.4, 1],
                          opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                          duration: 4 + j * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: j * 0.3
                        }}
                      />
                    ))}

                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <motion.div
                        className="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg relative"
                        whileHover={{ rotate: [0, 360], scale: 1.2 }}
                        transition={{ duration: 0.8 }}
                      >
                        {job.company[0]}
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-white/20"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0, 0.5]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        {/* Mini bubbles around icon */}
                        {Array.from({ length: 3 }, (_, k) => (
                          <motion.div
                            key={k}
                            className="absolute w-2 h-2 bg-white/60 rounded-full"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: k * 0.4
                            }}
                          />
                        ))}
                      </motion.div>
                      <motion.span
                        className="px-3 py-1.5 bg-sky-500/90 text-white rounded-full text-xs font-bold shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.08 + 0.2, type: "spring" }}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                      >
                        {job.type}
                      </motion.span>
                    </div>

                    <motion.h3
                      className="text-xl font-bold mb-2 text-white relative z-10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 + 0.1 }}
                    >
                      {job.title}
                    </motion.h3>

                    <motion.p
                      className="text-sky-200 mb-4 font-medium relative z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.08 + 0.15 }}
                    >
                      {job.company}
                    </motion.p>

                    <div className="space-y-2.5 relative z-10">
                      <motion.p
                        className="text-sm text-sky-100 flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 + 0.2 }}
                        whileHover={{ x: 5 }}
                      >
                        <MapPin size={16} className="mr-2 text-sky-400" />
                        {job.location}
                      </motion.p>
                      <motion.p
                        className="text-sm text-sky-100 flex items-center font-bold"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 + 0.25 }}
                        whileHover={{ x: 5 }}
                      >
                        <DollarSign size={16} className="mr-2 text-sky-400" />
                        {job.salary}
                      </motion.p>
                      <motion.p
                        className="text-sm text-sky-300 flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 + 0.3 }}
                        whileHover={{ x: 5 }}
                      >
                        <Clock size={16} className="mr-2" />
                        {job.posted}
                      </motion.p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 relative z-10">
                      {job.skills.slice(0, 3).map((skill, i) => (
                        <motion.span
                          key={i}
                          className="px-3 py-1.5 bg-gradient-to-r from-sky-500/80 to-blue-500/80 text-white rounded-full text-xs font-bold shadow-lg relative overflow-hidden"
                          initial={{ scale: 0, opacity: 0, rotate: -180 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          transition={{
                            delay: index * 0.08 + 0.4 + (i * 0.08),
                            type: "spring",
                            stiffness: 200
                          }}
                          whileHover={{ scale: 1.2, y: -3, rotate: 5 }}
                        >
                          {/* Bubble inside skill badge */}
                          <motion.div
                            className="absolute w-3 h-3 bg-white/30 rounded-full"
                            style={{
                              left: '20%',
                              top: '20%',
                            }}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity
                            }}
                          />
                          <span className="relative z-10">{skill}</span>
                        </motion.span>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

          </>
        )}

        {/* Job Detail Modal */}
        <AnimatePresence>
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedJob(null)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 relative"
              >
                {/* Animated bubbles in modal */}
                {Array.from({ length: 10 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: Math.random() * 50 + 25,
                      height: Math.random() * 50 + 25,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
                    }}
                    animate={{
                      y: [0, -60, 0],
                      x: [0, Math.random() * 40 - 20, 0],
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 5 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                  />
                ))}

                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-blue-500/10 to-sky-500/10 rounded-3xl pointer-events-none"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.h2
                        className="text-5xl font-black mb-3"
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                        style={{
                          backgroundImage: 'linear-gradient(90deg, #38bdf8, #60a5fa, #0ea5e9, #38bdf8)',
                          backgroundSize: '200% 100%',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {selectedJob.title}
                      </motion.h2>
                      <p className="text-2xl text-sky-200 font-semibold">{selectedJob.company}</p>
                    </motion.div>
                    <motion.button
                      onClick={() => setSelectedJob(null)}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={28} className="text-white" />
                    </motion.button>
                  </div>

                  <motion.div
                    className="space-y-6 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex flex-wrap gap-4">
                      {[
                        { icon: MapPin, text: selectedJob.location, color: 'from-sky-500 to-blue-500' },
                        { icon: DollarSign, text: selectedJob.salary, color: 'from-blue-500 to-sky-400' },
                        { icon: Clock, text: selectedJob.posted, color: 'from-sky-400 to-cyan-500' }
                      ].map((item, i) => (
                        <motion.p
                          key={i}
                          className={`text-white flex items-center bg-gradient-to-r ${item.color} px-5 py-3 rounded-2xl font-semibold shadow-lg`}
                          initial={{ opacity: 0, x: -20, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ delay: 0.4 + (i * 0.1) }}
                          whileHover={{ scale: 1.1, y: -5 }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          >
                            <item.icon size={20} className="mr-2" />
                          </motion.div>
                          {item.text}
                        </motion.p>
                      ))}
                      <motion.span
                        className="px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-2xl font-bold shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.7, type: "spring" }}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                      >
                        {selectedJob.type}
                      </motion.span>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-br from-sky-500/20 to-blue-500/20 backdrop-blur-xl p-6 rounded-3xl border border-white/10"
                    >
                      <h3 className="font-black text-xl mb-4 text-white flex items-center">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Sparkles className="mr-3 text-sky-400" size={24} />
                        </motion.div>
                        Description
                      </h3>
                      <p className="text-sky-100 leading-relaxed text-lg">{selectedJob.description}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-gradient-to-br from-blue-500/20 to-sky-500/20 backdrop-blur-xl p-6 rounded-3xl border border-white/10"
                    >
                      <h3 className="font-black text-xl mb-4 text-white">Requirements</h3>
                      <ul className="space-y-3">
                        {selectedJob.requirements.map((req, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start text-sky-100 text-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + (i * 0.1) }}
                            whileHover={{ x: 5 }}
                          >
                            <motion.div
                              animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <CheckCircle className="mr-3 mt-0.5 text-sky-400 flex-shrink-0" size={22} />
                            </motion.div>
                            {req}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h3 className="font-black text-xl mb-4 text-white flex items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Star className="mr-3 text-sky-400" size={24} />
                        </motion.div>
                        Skills Required
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedJob.skills.map((skill, i) => (
                          <motion.span
                            key={i}
                            className="px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl text-sm font-bold shadow-2xl"
                            initial={{ scale: 0, opacity: 0, rotate: -180 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{
                              delay: 0.9 + (i * 0.08),
                              type: "spring",
                              stiffness: 200
                            }}
                            whileHover={{
                              scale: 1.2,
                              y: -8,
                              rotate: 5,
                              boxShadow: "0 20px 40px rgba(14, 165, 233, 0.5)"
                            }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.button
                    onClick={() => {
                      setShowApplyModal(true)
                    }}
                    className="w-full py-5 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600 text-white rounded-3xl font-black text-xl shadow-2xl relative overflow-hidden group"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-sky-500 via-blue-500 to-sky-400"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.8 }}
                    />
                    <span className="relative z-10">Apply Now 🚀</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Apply Modal */}
        <AnimatePresence>
          {showApplyModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={() => setShowApplyModal(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateX: -90 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotateX: 90 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 relative overflow-hidden"
              >
                {/* Bubbles in apply modal */}
                {Array.from({ length: 8 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: Math.random() * 40 + 20,
                      height: Math.random() * 40 + 20,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
                    }}
                    animate={{
                      y: [0, -50, 0],
                      x: [0, Math.random() * 30 - 15, 0],
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 4 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                  />
                ))}

                <motion.h3
                  className="text-4xl font-black mb-6 relative z-10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    y: { duration: 0.5 },
                    backgroundPosition: { duration: 5, repeat: Infinity }
                  }}
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #60a5fa, #a78bfa, #ec4899, #60a5fa)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Apply for Job
                </motion.h3>
                <div className="space-y-6 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-sky-200">Cover Letter</label>
                    <motion.textarea
                      rows="6"
                      value={applicationData.coverLetter}
                      onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-sky-400 focus:outline-none text-white placeholder-sky-300 transition-all backdrop-blur-xl"
                      placeholder="Tell us why you're perfect for this role..."
                      whileFocus={{
                        scale: 1.02,
                        boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)",
                        borderColor: "#38bdf8"
                      }}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-sky-200">Resume</label>
                    <motion.label
                      className="flex items-center justify-center w-full px-5 py-5 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer hover:border-sky-400 transition-all bg-white/5 backdrop-blur-xl"
                      whileHover={{ scale: 1.03, borderColor: "#38bdf8" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <motion.div
                        animate={{
                          y: [0, -8, 0],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-sky-300"
                      >
                        <Upload size={24} className="mr-3" />
                      </motion.div>
                      <span className="text-sky-100 font-semibold">
                        {applicationData.resume ? applicationData.resume.name : 'Upload Resume (PDF, DOC)'}
                      </span>
                      <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                    </motion.label>
                  </motion.div>
                  <motion.div
                    className="flex space-x-4 pt-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.button
                      onClick={() => {
                        setShowApplyModal(false)
                        setSelectedJob(null)
                      }}
                      className="flex-1 px-6 py-4 rounded-2xl border-2 border-white/30 bg-white/5 hover:bg-white/10 font-bold transition-all text-white backdrop-blur-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleSubmitApplication}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600 text-white font-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-2xl relative overflow-hidden group"
                      whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                    >
                      {!isSubmitting && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-sky-500 via-blue-500 to-sky-400"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                      )}
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-7 h-7 border-4 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <span className="relative z-10">Submit 🚀</span>
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -150, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -150, scale: 0.5 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[60]"
            >
              <motion.div
                className="bg-white/10 backdrop-blur-2xl rounded-3xl px-10 py-6 shadow-2xl border-4 border-sky-400"
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(56, 189, 248, 0.4)",
                    "0 0 60px rgba(56, 189, 248, 0.7)",
                    "0 0 30px rgba(56, 189, 248, 0.4)",
                  ],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center space-x-5">
                  <motion.div
                    initial={{ scale: 0, rotate: -360 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl"
                  >
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={4}
                      stroke="white"
                      className="w-9 h-9"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </motion.svg>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="text-2xl font-black text-sky-400 flex items-center">
                      Application Submitted!
                      <motion.span
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="ml-2"
                      >
                        🎉
                      </motion.span>
                    </h4>
                    <p className="text-sky-200 font-semibold">We'll get back to you soon.</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Job Posted Success Notification */}
        <AnimatePresence>
          {showJobSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -150, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -150, scale: 0.5 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[60]"
            >
              <motion.div
                className="bg-white/10 backdrop-blur-2xl rounded-3xl px-10 py-6 shadow-2xl border-4 border-sky-400"
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(56, 189, 248, 0.4)",
                    "0 0 60px rgba(56, 189, 248, 0.7)",
                    "0 0 30px rgba(56, 189, 248, 0.4)",
                  ],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center space-x-5">
                  <motion.div
                    initial={{ scale: 0, rotate: -360 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl"
                  >
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={4}
                      stroke="white"
                      className="w-9 h-9"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </motion.svg>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="text-2xl font-black text-sky-400 flex items-center">
                      Job Posted Successfully!
                      <motion.span
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="ml-2"
                      >
                        🚀
                      </motion.span>
                    </h4>
                    <p className="text-sky-200 font-semibold">Your job is now live on the portal.</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Job Modal */}
        <AnimatePresence>
          {showAddJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddJob(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 150 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: 150 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 relative overflow-hidden"
              >
                {/* Bubbles in add job modal */}
                {Array.from({ length: 12 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: Math.random() * 45 + 20,
                      height: Math.random() * 45 + 20,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
                    }}
                    animate={{
                      y: [0, -55, 0],
                      x: [0, Math.random() * 35 - 17.5, 0],
                      scale: [1, 1.35, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 5 + i * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                  />
                ))}

                <motion.h3
                  className="text-4xl font-black mb-8 relative z-10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    y: { duration: 0.5 },
                    backgroundPosition: { duration: 5, repeat: Infinity }
                  }}
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #60a5fa, #a78bfa, #ec4899, #60a5fa)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Post a Job
                </motion.h3>
                <div className="space-y-6">
                  <motion.div
                    className="grid md:grid-cols-2 gap-5"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div>
                      <label className="block text-sm font-bold mb-3 text-sky-200">Job Title *</label>
                      <motion.input
                        type="text"
                        value={newJobData.title}
                        onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-sky-400 focus:outline-none transition-all text-white placeholder-sky-300 backdrop-blur-xl"
                        placeholder="e.g. Senior Developer"
                        whileFocus={{ scale: 1.02, boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-3 text-sky-200">Company *</label>
                      <motion.input
                        type="text"
                        value={newJobData.company}
                        onChange={(e) => setNewJobData({ ...newJobData, company: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-sky-400 focus:outline-none transition-all text-white placeholder-sky-300 backdrop-blur-xl"
                        placeholder="e.g. TechCorp"
                        whileFocus={{ scale: 1.02, boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-sky-200">Description *</label>
                    <motion.textarea
                      rows="4"
                      value={newJobData.description}
                      onChange={(e) => setNewJobData({ ...newJobData, description: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-sky-400 focus:outline-none transition-all text-white placeholder-sky-300 backdrop-blur-xl"
                      placeholder="Describe the role and responsibilities..."
                      whileFocus={{ scale: 1.02, boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
                    />
                  </motion.div>
                  <motion.div
                    className="grid md:grid-cols-2 gap-5"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div>
                      <label className="block text-sm font-bold mb-3 text-sky-200">Location *</label>
                      <motion.input
                        type="text"
                        value={newJobData.location}
                        onChange={(e) => setNewJobData({ ...newJobData, location: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-sky-400 focus:outline-none transition-all text-white placeholder-sky-300 backdrop-blur-xl"
                        placeholder="e.g. New York, NY or Remote"
                        whileFocus={{ scale: 1.02, boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-3 text-sky-200">Salary</label>
                      <motion.input
                        type="text"
                        value={newJobData.salary}
                        onChange={(e) => setNewJobData({ ...newJobData, salary: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-sky-400 focus:outline-none transition-all text-white placeholder-sky-300 backdrop-blur-xl"
                        placeholder="e.g. $80,000 - $120,000"
                        whileFocus={{ scale: 1.02, boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    className="grid md:grid-cols-2 gap-5"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <div>
                      <label className="block text-sm font-bold mb-3 text-sky-200">Job Type</label>
                      <motion.select
                        value={newJobData.type}
                        onChange={(e) => setNewJobData({ ...newJobData, type: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-sky-400 focus:outline-none transition-all text-white backdrop-blur-xl"
                        whileFocus={{ scale: 1.02, boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
                      >
                        <option value="Full-time" className="bg-gray-800">Full-time</option>
                        <option value="Part-time" className="bg-gray-800">Part-time</option>
                        <option value="Contract" className="bg-gray-800">Contract</option>
                        <option value="Internship" className="bg-gray-800">Internship</option>
                      </motion.select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-3 text-sky-200">Skills (comma-separated)</label>
                      <motion.input
                        type="text"
                        value={newJobData.skills}
                        onChange={(e) => setNewJobData({ ...newJobData, skills: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-sky-400 focus:outline-none transition-all text-white placeholder-sky-300 backdrop-blur-xl"
                        placeholder="e.g. React, Node.js, AWS"
                        whileFocus={{ scale: 1.02, boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-bold mb-3 text-sky-200">Requirements (comma-separated)</label>
                    <motion.textarea
                      rows="3"
                      value={newJobData.requirements}
                      onChange={(e) => setNewJobData({ ...newJobData, requirements: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-sky-400 focus:outline-none transition-all text-white placeholder-sky-300 backdrop-blur-xl"
                      placeholder="e.g. 5+ years experience, Bachelor's degree"
                      whileFocus={{ scale: 1.02, boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
                    />
                  </motion.div>
                  <motion.div
                    className="flex space-x-4 pt-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <motion.button
                      onClick={() => setShowAddJob(false)}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-4 rounded-2xl border-2 border-white/30 bg-white/5 hover:bg-white/10 font-bold transition-all text-white backdrop-blur-xl disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handlePostJob}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600 text-white font-black shadow-2xl relative overflow-hidden group disabled:opacity-50 flex items-center justify-center"
                      whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                    >
                      {!isSubmitting && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-sky-500 via-blue-500 to-sky-400"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                      )}
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-7 h-7 border-4 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <span className="relative z-10">Post Job 🚀</span>
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div >
  )
}

export default JobPortal