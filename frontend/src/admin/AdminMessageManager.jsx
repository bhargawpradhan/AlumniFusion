import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MessageCircle, Send, User, Calendar, CheckCircle, Reply, MessageSquare, Crown } from 'lucide-react'
import api from '../utils/api'
import { socket } from '../utils/socket'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'
import toast from 'react-hot-toast'

const AdminMessageManager = () => {
    const [activeTab, setActiveTab] = useState('contact') // 'contact' or 'groups'
    const [messages, setMessages] = useState([])
    const [groupMessages, setGroupMessages] = useState({
        general: [],
        jobs: [],
        tech: [],
        alumni: []
    })
    const [isLoading, setIsLoading] = useState(true)
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyText, setReplyText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState('general')
    const [showIconBurst, setShowIconBurst] = useState(false)

    const groups = [
        { id: 'general', name: 'General Discussion', icon: '💬', color: 'from-sky-500 to-blue-500' },
        { id: 'jobs', name: 'Job Opportunities', icon: '💼', color: 'from-blue-400 to-sky-300' },
        { id: 'tech', name: 'Tech Talk', icon: '💻', color: 'from-sky-600 to-blue-600' },
        { id: 'alumni', name: 'Alumni Events', icon: '🎓', color: 'from-cyan-500 to-sky-500' },
    ]

    useEffect(() => {
        fetchMessages()
        fetchGroupMessages()

        // Setup socket for real-time group messages
        socket.connect()
        socket.on('receiveGroupMessage', (msg) => {
            setGroupMessages(prev => ({
                ...prev,
                [msg.groupId]: [...(prev[msg.groupId] || []), {
                    id: msg._id,
                    userId: msg.userId,
                    user: `${msg.user.firstName} ${msg.user.lastName}`,
                    text: msg.text,
                    time: msg.time,
                    isAdminReply: msg.isAdminReply,
                    createdAt: msg.createdAt
                }]
            }))
        })

        return () => {
            socket.off('receiveGroupMessage')
        }
    }, [])

    const fetchMessages = async () => {
        try {
            const { data } = await api.get('/contact/all')
            setMessages(data)
        } catch (error) {
            toast.error('Failed to load contact messages')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchGroupMessages = async () => {
        try {
            const res = await api.get('/group-messages/admin/all-groups')
            const formatted = {}

            Object.keys(res.data).forEach(groupId => {
                formatted[groupId] = res.data[groupId].map(msg => ({
                    id: msg._id,
                    userId: msg.user._id,
                    user: `${msg.user.firstName} ${msg.user.lastName}`,
                    email: msg.user.email,
                    text: msg.text,
                    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isAdminReply: msg.isAdminReply,
                    createdAt: msg.createdAt
                }))
            })

            setGroupMessages(formatted)
        } catch (error) {
            console.error('Failed to load group messages:', error)
            toast.error('Failed to load group messages')
        }
    }

    const handleReply = async (e) => {
        e.preventDefault()
        if (!replyText.trim()) return

        setIsSubmitting(true)
        try {
            await api.put(`/contact/${replyingTo._id}/reply`, { adminReply: replyText })
            toast.success('Reply sent successfully')
            setMessages(prev => prev.map(m =>
                m._id === replyingTo._id ? { ...m, adminReply: replyText, status: 'replied' } : m
            ))
            setReplyingTo(null)
            setReplyText('')
        } catch (error) {
            toast.error('Failed to send reply')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGroupReply = async (e) => {
        e.preventDefault()
        if (!replyText.trim()) return

        setIsSubmitting(true)
        try {
            const userStr = localStorage.getItem('user')
            const currentUser = JSON.parse(userStr)

            const messageData = {
                groupId: selectedGroup,
                userId: currentUser._id || currentUser.id,
                text: replyText,
                user: {
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    role: 'admin'
                }
            }

            socket.emit('sendGroupMessage', messageData)
            toast.success('Admin reply sent to group!')
            setReplyText('')
            setReplyingTo(null)
        } catch (error) {
            console.error('Failed to send group reply:', error)
            toast.error('Failed to send reply')
        } finally {
            setIsSubmitting(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    }

    const totalGroupMessages = Object.values(groupMessages).reduce((sum, msgs) => sum + msgs.length, 0)
    const currentGroupMessages = groupMessages[selectedGroup] || []

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Message System
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg font-medium flex items-center">
                        <MessageCircle size={18} className="mr-2 text-sky-500" />
                        Manage contact inquiries and group discussions
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('contact')}
                    className={`px-6 py-3 font-bold transition-all ${activeTab === 'contact'
                        ? 'border-b-2 border-sky-500 text-sky-600 dark:text-sky-400'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <Mail size={18} className="inline mr-2" />
                    Contact Messages ({messages.length})
                </button>
                <button
                    onClick={() => setActiveTab('groups')}
                    className={`px-6 py-3 font-bold transition-all ${activeTab === 'groups'
                        ? 'border-b-2 border-sky-500 text-sky-600 dark:text-sky-400'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <MessageSquare size={18} className="inline mr-2" />
                    Group Chats ({totalGroupMessages})
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
                </div>
            ) : (
                <>
                    {/* Contact Messages Tab */}
                    {activeTab === 'contact' && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid gap-6"
                        >
                            {messages.length === 0 ? (
                                <GlassCard className="text-center py-20">
                                    <Mail size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-500 text-xl font-medium">No messages found</p>
                                </GlassCard>
                            ) : (
                                messages.map((msg) => (
                                    <motion.div key={msg._id} variants={itemVariants}>
                                        <GlassCard className="group relative overflow-hidden">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold">
                                                                {msg.name[0].toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-lg dark:text-white">{msg.name}</h3>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">{msg.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="flex items-center text-xs text-gray-400 font-mono mb-1">
                                                                <Calendar size={12} className="mr-1" />
                                                                {new Date(msg.createdAt).toLocaleDateString()}
                                                            </div>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${msg.status === 'replied' ? 'bg-green-500/20 text-green-600' : 'bg-amber-500/20 text-amber-600'}`}>
                                                                {msg.status}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                                        <h4 className="font-bold text-sky-600 dark:text-sky-400 mb-2 truncate">
                                                            {msg.subject || 'No Subject'}
                                                        </h4>
                                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                            {msg.message}
                                                        </p>
                                                    </div>

                                                    {msg.adminReply && (
                                                        <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50 ml-8">
                                                            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-black uppercase text-[10px] tracking-widest mb-2">
                                                                <Reply size={12} />
                                                                <span>Admin Reply</span>
                                                            </div>
                                                            <p className="text-emerald-700 dark:text-emerald-300 italic">
                                                                "{msg.adminReply}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col justify-end">
                                                    {msg.status === 'pending' && (
                                                        <AnimatedButton
                                                            onClick={() => setReplyingTo(msg)}
                                                            className="w-full md:w-auto"
                                                        >
                                                            <Reply size={16} className="mr-2" /> Reply
                                                        </AnimatedButton>
                                                    )}
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {/* Group Chat Messages Tab */}
                    {activeTab === 'groups' && (
                        <div className="grid lg:grid-cols-4 gap-6">
                            {/* Group Selector */}
                            <div className="lg:col-span-1">
                                <GlassCard className="p-4">
                                    <h3 className="font-bold mb-4 dark:text-white flex items-center">
                                        <MessageSquare className="mr-2" size={18} />
                                        Groups
                                    </h3>
                                    <div className="space-y-2">
                                        {groups.map((group) => {
                                            const count = groupMessages[group.id]?.length || 0
                                            return (
                                                <button
                                                    key={group.id}
                                                    onClick={() => {
                                                        if (selectedGroup !== group.id) {
                                                            setShowIconBurst(true)
                                                            setTimeout(() => setShowIconBurst(false), 1500)
                                                        }
                                                        setSelectedGroup(group.id)
                                                    }}
                                                    className={`w-full text-left p-3 rounded-lg transition-all ${selectedGroup === group.id
                                                        ? `bg-gradient-to-r ${group.color} text-white shadow-lg`
                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xl">{group.icon}</span>
                                                            <span className="font-medium text-sm">{group.name}</span>
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded-full ${selectedGroup === group.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                                            {count}
                                                        </span>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Messages Display */}
                            <div className="lg:col-span-3">
                                <GlassCard className="h-[600px] flex flex-col">
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="text-xl font-bold dark:text-white flex items-center justify-between">
                                            <span>
                                                <span className="text-2xl mr-2">{groups.find(g => g.id === selectedGroup)?.icon}</span>
                                                {groups.find(g => g.id === selectedGroup)?.name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {currentGroupMessages.length} messages
                                            </span>
                                        </h2>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
                                        {/* Logo Burst Animation */}
                                        <AnimatePresence>
                                            {showIconBurst && (
                                                <>
                                                    {Array.from({ length: 12 }, (_, i) => {
                                                        const angle = (i / 12) * Math.PI * 2
                                                        const distance = 250
                                                        return (
                                                            <motion.div
                                                                key={`burst-${i}`}
                                                                className="absolute pointer-events-none z-50"
                                                                style={{
                                                                    left: '50%',
                                                                    top: '50%',
                                                                    fontSize: '3rem'
                                                                }}
                                                                initial={{ x: '-50%', y: '-50%', scale: 0.5, opacity: 1 }}
                                                                animate={{
                                                                    x: `calc(-50% + ${Math.cos(angle) * distance}px)`,
                                                                    y: `calc(-50% + ${Math.sin(angle) * distance}px)`,
                                                                    scale: [0.5, 1.5, 0],
                                                                    opacity: [1, 0.8, 0],
                                                                    rotate: [0, 360 + i * 30]
                                                                }}
                                                                exit={{ opacity: 0, scale: 0 }}
                                                                transition={{
                                                                    duration: 1.2,
                                                                    ease: [0.34, 1.56, 0.64, 1]
                                                                }}
                                                            >
                                                                {groups.find(g => g.id === selectedGroup)?.icon}
                                                            </motion.div>
                                                        )
                                                    })}
                                                </>
                                            )}
                                        </AnimatePresence>

                                        {currentGroupMessages.length === 0 ? (
                                            <div className="text-center py-12 text-gray-400">
                                                <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                                                <p>No messages in this group yet</p>
                                            </div>
                                        ) : (
                                            currentGroupMessages.map((msg) => (
                                                <motion.div
                                                    key={msg.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`flex items-start space-x-3 ${msg.isAdminReply ? 'bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border-l-4 border-yellow-500' : ''}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0 ${msg.isAdminReply ? 'bg-gradient-to-r from-yellow-500 to-orange-600 ring-2 ring-yellow-300' : 'bg-gradient-to-r from-purple-400 to-pink-500'}`}>
                                                        {msg.user.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            {msg.isAdminReply && <Crown size={14} className="text-yellow-500" />}
                                                            <span className={`font-bold ${msg.isAdminReply ? 'text-orange-600 dark:text-yellow-300' : 'text-gray-900 dark:text-white'}`}>
                                                                {msg.user}
                                                            </span>
                                                            {msg.isAdminReply && (
                                                                <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                                                                    ADMIN
                                                                </span>
                                                            )}
                                                            <span className="text-xs text-gray-500">{msg.time}</span>
                                                        </div>
                                                        <p className="text-gray-700 dark:text-gray-300 break-words">{msg.text}</p>
                                                        {!msg.isAdminReply && msg.email && (
                                                            <p className="text-xs text-gray-400 mt-1">{msg.email}</p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>

                                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Crown size={16} className="text-yellow-500" />
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Reply as Admin</span>
                                        </div>
                                        <form onSubmit={handleGroupReply} className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Type admin reply..."
                                                className="flex-1 px-4 py-3 rounded-lg border-2 border-yellow-300 focus:border-yellow-500 focus:outline-none bg-white dark:bg-gray-700 dark:text-white"
                                            />
                                            <AnimatedButton type="submit" disabled={!replyText.trim() || isSubmitting}>
                                                <Send size={18} className="mr-2" />
                                                {isSubmitting ? 'Sending...' : 'Send'}
                                            </AnimatedButton>
                                        </form>
                                    </div>
                                </GlassCard>
                            </div>
                        </div>
                    )}
                </>
            )}

            <AnimatePresence>
                {replyingTo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-lg"
                        >
                            <GlassCard className="p-8">
                                <h2 className="text-2xl font-bold mb-6 dark:text-white flex items-center">
                                    <Send size={24} className="mr-3 text-sky-500" />
                                    Reply to {replyingTo.name}
                                </h2>
                                <form onSubmit={handleReply} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                                            Admin Message
                                        </label>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            rows="5"
                                            className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 outline-none resize-none dark:text-white"
                                            placeholder="Type your reply here..."
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <AnimatedButton
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setReplyingTo(null)}
                                        >
                                            Cancel
                                        </AnimatedButton>
                                        <AnimatedButton
                                            type="submit"
                                            className="flex-1"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send Reply'}
                                        </AnimatedButton>
                                    </div>
                                </form>
                            </GlassCard>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminMessageManager
