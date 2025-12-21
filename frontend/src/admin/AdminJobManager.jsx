import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, CheckCircle, X, Edit, Trash2, Plus, Briefcase, Archive, Loader2, RefreshCw } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AdminJobManager = () => {
    const [activeTab, setActiveTab] = useState('pending') // 'pending', 'all', 'new'
    const [pendingJobs, setPendingJobs] = useState([])
    const [allJobs, setAllJobs] = useState([])
    const [applications, setApplications] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // New Job State
    const [newJob, setNewJob] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        salary: '',
        type: 'Full-time',
        requirements: '',
        qualifications: ''
    })
    const [isPosting, setIsPosting] = useState(false)

    useEffect(() => {
        fetchJobs()
    }, [activeTab])

    const fetchJobs = async () => {
        setIsLoading(true)
        try {
            if (activeTab === 'pending') {
                const { data } = await api.get('/jobs/pending')
                setPendingJobs(data)
            } else if (activeTab === 'all') {
                const { data } = await api.get('/jobs')
                setAllJobs(data)
            } else if (activeTab === 'applications') {
                const { data } = await api.get('/jobs/applications/all')
                setApplications(data)
            }
        } catch (error) {
            console.error('Fetch error:', error)
            toast.error('Failed to load jobs')
        } finally {
            setIsLoading(false)
        }
    }

    const handleApprove = async (id) => {
        try {
            await api.put(`/jobs/${id}/status`, { status: 'approved' })
            toast.success('Job approved')
            setPendingJobs(prev => prev.filter(j => j._id !== id))
        } catch (error) {
            toast.error('Approval failed')
        }
    }

    const handleReject = async (id) => {
        if (window.confirm('Reject this job post?')) {
            try {
                await api.put(`/jobs/${id}/status`, { status: 'rejected' })
                toast.success('Job rejected')
                setPendingJobs(prev => prev.filter(j => j._id !== id))
            } catch (error) {
                toast.error('Rejection failed')
            }
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Delete this job permanently?')) {
            try {
                await api.delete(`/jobs/${id}`)
                toast.success('Job deleted')
                setAllJobs(prev => prev.filter(j => j._id !== id))
            } catch (error) {
                toast.error('Delete failed')
            }
        }
    }

    const handleStatusUpdate = async (id, status) => {
        const confirmMsg = status === 'accepted' ? 'Approve this application?' : 'Reject this application?'
        if (window.confirm(confirmMsg)) {
            try {
                await api.put(`/jobs/applications/${id}/status`, { status })
                toast.success(`Application ${status} successfully`)
                setApplications(prev => prev.map(app =>
                    app._id === id ? { ...app, status } : app
                ))
            } catch (error) {
                toast.error('Status update failed')
            }
        }
    }

    const handlePostJob = async (e) => {
        e.preventDefault()
        setIsPosting(true)
        try {
            // Admin posting a job -> Should be auto-approved? Or pending?
            // User asked to "add jobs for user". Probably auto-approved is better UX for admin.
            const payload = { ...newJob, status: 'approved' }
            await api.post('/jobs', payload)
            toast.success('Job posted successfully!')
            setNewJob({
                title: '',
                company: '',
                location: '',
                description: '',
                salary: '',
                type: 'Full-time',
                requirements: '',
                qualifications: ''
            })
            setActiveTab('all')
        } catch (error) {
            toast.error('Failed to post job')
        } finally {
            setIsPosting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gradient">Job Manager</h1>
                <div className="flex space-x-2 bg-white/10 p-1 rounded-lg backdrop-blur-sm">
                    {[
                        { id: 'pending', label: 'Pending Approvals', icon: Archive },
                        { id: 'all', label: 'All Jobs', icon: Briefcase },
                        { id: 'applications', label: 'Applications', icon: FileText },
                        { id: 'new', label: 'Post New Job', icon: Plus },
                    ].map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-all ${activeTab === tab.id
                                    ? 'bg-sky-500 text-white shadow-lg'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                <Icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'pending' && (
                    <motion.div
                        key="pending"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid gap-4"
                    >
                        {isLoading ? (
                            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-sky-500" /></div>
                        ) : pendingJobs.length === 0 ? (
                            <div className="text-center p-12 text-gray-500 bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                No pending job approvals
                            </div>
                        ) : (
                            pendingJobs.map(job => (
                                <GlassCard key={job._id} className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{job.title}</h3>
                                        <p className="text-sky-600">{job.company} • {job.location}</p>
                                        <div className="text-sm text-gray-500 mt-2">Posted by: {job.postedBy?.firstName || 'Unknown'}</div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleApprove(job._id)} className="p-2 bg-green-100/50 text-green-600 rounded-lg hover:bg-green-100"><CheckCircle size={20} /></button>
                                        <button onClick={() => handleReject(job._id)} className="p-2 bg-red-100/50 text-red-600 rounded-lg hover:bg-red-100"><X size={20} /></button>
                                    </div>
                                </GlassCard>
                            ))
                        )}
                    </motion.div>
                )}

                {activeTab === 'all' && (
                    <motion.div
                        key="all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid gap-4"
                    >
                        {isLoading ? (
                            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-sky-500" /></div>
                        ) : allJobs.length === 0 ? (
                            <div className="text-center p-12 text-gray-500">No active jobs found</div>
                        ) : (
                            allJobs.map(job => (
                                <GlassCard key={job._id} className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{job.title}</h3>
                                        <p className="text-gray-600">{job.company}</p>
                                    </div>
                                    <button onClick={() => handleDelete(job._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </GlassCard>
                            ))
                        )}
                    </motion.div>
                )}

                {activeTab === 'applications' && (
                    <motion.div
                        key="applications"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid gap-6"
                    >
                        {isLoading ? (
                            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-sky-500" /></div>
                        ) : applications.length === 0 ? (
                            <div className="text-center p-12 text-gray-500 bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                No job applications yet
                            </div>
                        ) : (
                            applications.map(app => (
                                <GlassCard key={app._id} className="relative overflow-hidden group">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-xl">
                                                    {app.user?.firstName?.[0]}{app.user?.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold dark:text-white">
                                                        {app.user?.firstName} {app.user?.lastName}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{app.user?.email} • {app.user?.phone || 'No Phone'}</p>
                                                </div>
                                            </div>

                                            <div className="bg-sky-500/5 dark:bg-sky-500/10 p-4 rounded-xl border border-sky-500/10">
                                                <div className="text-xs font-black uppercase text-sky-600 dark:text-sky-400 mb-1 tracking-wider">Applied for</div>
                                                <div className="text-lg font-bold dark:text-white">{app.job?.title}</div>
                                                <div className="text-sm text-sky-600/80 dark:text-sky-400/80 font-medium">{app.job?.company}</div>
                                            </div>

                                            {app.coverLetter && (
                                                <div className="space-y-1">
                                                    <div className="text-xs font-black uppercase text-gray-500 dark:text-gray-400 tracking-wider">Cover Letter</div>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm italic line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                                                        "{app.coverLetter}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                                            <div className="text-right">
                                                <div className="text-xs text-gray-400 font-mono mb-1">
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'pending' ? 'bg-amber-500/20 text-amber-600' :
                                                    app.status === 'accepted' ? 'bg-green-500/20 text-green-600' :
                                                        'bg-red-500/20 text-red-600'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                {app.resume && (
                                                    <AnimatedButton
                                                        variant="outline"
                                                        className="py-2 px-4 text-xs"
                                                        onClick={() => window.open(`http://localhost:5000${app.resume}`, '_blank')}
                                                    >
                                                        <FileText size={14} className="mr-2" /> View CV
                                                    </AnimatedButton>
                                                )}
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'accepted')}
                                                        className="p-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                        className="p-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                        title="Reject"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.div
                                        className="absolute bottom-0 left-0 h-1 bg-sky-500"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                </GlassCard>
                            ))
                        )}
                    </motion.div>
                )}

                {activeTab === 'new' && (
                    <motion.div
                        key="new"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <GlassCard className="max-w-3xl mx-auto">
                            <form onSubmit={handlePostJob} className="space-y-4">
                                <h2 className="text-xl font-bold mb-4 dark:text-white">Create New Job Post</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        placeholder="Job Title"
                                        className="input-field p-3 rounded-lg bg-white/5 border border-gray-200 dark:border-gray-700 w-full dark:text-white"
                                        value={newJob.title}
                                        onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                                        required
                                    />
                                    <input
                                        placeholder="Company Name"
                                        className="input-field p-3 rounded-lg bg-white/5 border border-gray-200 dark:border-gray-700 w-full dark:text-white"
                                        value={newJob.company}
                                        onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        placeholder="Location (e.g. Remote, NY)"
                                        className="input-field p-3 rounded-lg bg-white/5 border border-gray-200 dark:border-gray-700 w-full dark:text-white"
                                        value={newJob.location}
                                        onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                                        required
                                    />
                                    <input
                                        placeholder="Salary Range"
                                        className="input-field p-3 rounded-lg bg-white/5 border border-gray-200 dark:border-gray-700 w-full dark:text-white"
                                        value={newJob.salary}
                                        onChange={e => setNewJob({ ...newJob, salary: e.target.value })}
                                    />
                                </div>
                                <textarea
                                    placeholder="Job Description"
                                    rows={4}
                                    className="input-field p-3 rounded-lg bg-white/5 border border-gray-200 dark:border-gray-700 w-full dark:text-white"
                                    value={newJob.description}
                                    onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                                    required
                                />
                                <div className="pt-4">
                                    <AnimatedButton type="submit" className="w-full justify-center">
                                        {isPosting ? <Loader2 className="animate-spin" /> : 'Post Job'}
                                    </AnimatedButton>
                                </div>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminJobManager
