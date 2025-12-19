import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Megaphone, Plus, Trash2, AlertCircle, Info, Bell, Calendar, GraduationCap } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AdminAnnouncementManager = () => {
    const [announcements, setAnnouncements] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        content: '',
        type: 'general',
        priority: 'normal'
    })

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const fetchAnnouncements = async () => {
        try {
            const { data } = await api.get('/announcements')
            setAnnouncements(data)
        } catch (error) {
            toast.error('Failed to fetch announcements')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const userStr = localStorage.getItem('user')
            const user = userStr ? JSON.parse(userStr) : null
            const author = user?.id || user?._id

            const payload = {
                ...newAnnouncement,
                author
            }

            await api.post('/announcements', payload)
            toast.success('Announcement posted successfully')
            setShowModal(false)
            setNewAnnouncement({ title: '', content: '', type: 'general', priority: 'normal' })
            fetchAnnouncements()
        } catch (error) {
            console.error('Failed to post announcement:', error)
            toast.error('Failed to post announcement')
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Delete this announcement?')) {
            try {
                await api.delete(`/announcements/${id}`)
                toast.success('Announcement deleted')
                fetchAnnouncements()
            } catch (error) {
                toast.error('Failed to delete')
            }
        }
    }

    const getIcon = (type) => {
        switch (type) {
            case 'urgent': return <AlertCircle className="text-red-500" />
            case 'event': return <Calendar className="text-purple-500" />
            case 'news': return <Megaphone className="text-blue-500" />
            default: return <Info className="text-gray-500" />
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-gradient">Announcement Manager</h1>
                    <p className="text-gray-600 dark:text-gray-400">Broadcast updates to all alumni</p>
                </div>
                <AnimatedButton onClick={() => setShowModal(true)}>
                    <Plus className="inline mr-2" size={20} />
                    Post Announcement
                </AnimatedButton>
            </div>

            <motion.div
                className="grid gap-6"
                variants={{
                    show: {
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
                initial="hidden"
                animate="show"
            >
                {announcements.map((item, index) => (
                    <motion.div
                        key={item._id}
                        variants={{
                            hidden: { opacity: 0, x: -20 },
                            show: { opacity: 1, x: 0 }
                        }}
                        whileHover={{ scale: 1.01, x: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <GlassCard className="flex justify-between items-start group border-l-4 border-l-sky-500 hover:shadow-xl transition-all duration-300">
                            <div className="flex space-x-6">
                                <div className="p-4 bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 rounded-2xl group-hover:rotate-6 transition-transform">
                                    <GraduationCap size={28} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-sky-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        {item.priority === 'high' && (
                                            <span className="animate-pulse bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-widest">
                                                Urgent
                                            </span>
                                        )}
                                        <span className={`text-[10px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${item.type === 'news' ? 'bg-blue-500' :
                                                item.type === 'event' ? 'bg-purple-500' :
                                                    item.type === 'urgent' ? 'bg-red-500' : 'bg-gray-500'
                                            }`}>
                                            {item.type}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{item.content}</p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <p className="text-xs font-mono text-gray-400">
                                            Posted on {new Date(item.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        {item.author && (
                                            <p className="text-xs font-bold text-sky-600 dark:text-sky-400">
                                                By {item.author.firstName} {item.author.lastName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                            >
                                <Trash2 size={22} />
                            </button>
                        </GlassCard>
                    </motion.div>
                ))}
                {!isLoading && announcements.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                        <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-500">No announcements posted yet</h3>
                    </div>
                )}
            </motion.div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="glass dark:glass-dark rounded-xl p-8 max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">New Announcement</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title</label>
                                <input
                                    type="text" required
                                    value={newAnnouncement.title}
                                    onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Content</label>
                                <textarea
                                    required rows="4"
                                    value={newAnnouncement.content}
                                    onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Type</label>
                                    <select
                                        value={newAnnouncement.type}
                                        onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                                    >
                                        <option value="general" className="text-black">General</option>
                                        <option value="news" className="text-black">News</option>
                                        <option value="event" className="text-black">Event</option>
                                        <option value="urgent" className="text-black">Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Priority</label>
                                    <select
                                        value={newAnnouncement.priority}
                                        onChange={e => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                                    >
                                        <option value="normal" className="text-black">Normal</option>
                                        <option value="high" className="text-black">High</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <AnimatedButton type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</AnimatedButton>
                                <AnimatedButton type="submit" className="flex-1">Post</AnimatedButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminAnnouncementManager
