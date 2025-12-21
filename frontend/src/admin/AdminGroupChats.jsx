import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Crown, Users, Briefcase, Code, GraduationCap } from 'lucide-react'
import api from '../utils/api'
import { socket } from '../utils/socket'
import toast from 'react-hot-toast'

const AdminGroupChats = () => {
    const [groupMessages, setGroupMessages] = useState({
        general: [],
        jobs: [],
        tech: [],
        alumni: []
    })
    const [activeGroup, setActiveGroup] = useState('general')
    const [replyText, setReplyText] = useState('')
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const groups = [
        { id: 'general', name: 'General Discussion', icon: <MessageSquare size={20} />, color: 'from-sky-500 to-blue-500' },
        { id: 'jobs', name: 'Job Opportunities', icon: <Briefcase size={20} />, color: 'from-blue-400 to-sky-300' },
        { id: 'tech', name: 'Tech Talk', icon: <Code size={20} />, color: 'from-sky-600 to-blue-600' },
        { id: 'alumni', name: 'Alumni Events', icon: <GraduationCap size={20} />, color: 'from-cyan-500 to-sky-500' },
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userStr = localStorage.getItem('user')
                if (userStr) {
                    const user = JSON.parse(userStr)
                    console.log('[AdminGroupChat] Current user:', user)
                    setCurrentUser(user)

                    // Check if admin
                    if (user.role !== 'admin') {
                        toast.error('Admin access required')
                        return
                    }
                } else {
                    toast.error('Please login first')
                    return
                }

                // Fetch all group messages
                console.log('[AdminGroupChat] Fetching all group messages...')
                const res = await api.get('/group-messages/admin/all-groups')
                console.log('[AdminGroupChat] Received data:', res.data)
                const formatted = {}

                Object.keys(res.data).forEach(groupId => {
                    formatted[groupId] = res.data[groupId].map(msg => ({
                        id: msg._id,
                        userId: msg.user._id,
                        user: `${msg.user.firstName} ${msg.user.lastName}`,
                        email: msg.user.email,
                        text: msg.text,
                        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        avatar: `${msg.user.firstName[0]}${msg.user.lastName[0]}`,
                        isAdminReply: msg.isAdminReply,
                        createdAt: msg.createdAt
                    }))
                })

                setGroupMessages(formatted)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching group messages:', error)
                toast.error('Failed to load group messages')
                setLoading(false)
            }
        }

        fetchData()

        // Listen for new group messages
        socket.connect()

        // Emit join with current user (wait for user to be set)
        setTimeout(() => {
            const userStr = localStorage.getItem('user')
            if (userStr) {
                const user = JSON.parse(userStr)
                const userId = user._id || user.id
                console.log('[AdminGroupChat] Emitting join with userId:', userId)
                socket.emit('join', userId)
            }
        }, 500)

        socket.on('receiveGroupMessage', (msg) => {
            console.log('[AdminGroupChat] Received group message:', msg)
            setGroupMessages(prev => ({
                ...prev,
                [msg.groupId]: [...(prev[msg.groupId] || []), {
                    id: msg._id,
                    userId: msg.userId,
                    user: `${msg.user.firstName} ${msg.user.lastName}`,
                    text: msg.text,
                    time: msg.time,
                    avatar: `${msg.user.firstName[0]}${msg.user.lastName[0]}`,
                    isAdminReply: msg.isAdminReply,
                    createdAt: msg.createdAt
                }]
            }))
        })

        return () => {
            socket.off('receiveGroupMessage')
        }
    }, [])

    const handleAdminReply = async () => {
        if (!replyText.trim() || !currentUser) return

        try {
            const userId = currentUser._id || currentUser.id
            const messageData = {
                groupId: activeGroup,
                userId: userId,
                text: replyText,
                user: {
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    role: 'admin'
                }
            }

            console.log('[AdminGroupChat] Sending admin reply:', messageData)
            // Send via socket
            socket.emit('sendGroupMessage', messageData)
            setReplyText('')
            toast.success('Admin reply sent!')
        } catch (error) {
            console.error('[AdminGroupChat] Failed to send:', error)
            toast.error('Failed to send reply')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading group chats...</p>
                </div>
            </div>
        )
    }

    const totalMessages = Object.values(groupMessages).reduce((sum, msgs) => sum + msgs.length, 0)
    const activeMessages = groupMessages[activeGroup] || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                                <Crown className="mr-3 text-yellow-500" size={32} />
                                Admin Group Chat Monitor
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                View and respond to all discussion groups • {totalMessages} total messages
                            </p>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-bold">
                            ADMIN MODE
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Group Selector */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <Users className="mr-2" size={18} />
                                Discussion Groups
                            </h3>
                            <div className="space-y-2">
                                {groups.map((group) => {
                                    const count = groupMessages[group.id]?.length || 0
                                    return (
                                        <button
                                            key={group.id}
                                            onClick={() => setActiveGroup(group.id)}
                                            className={`w-full text-left p-3 rounded-lg transition-all ${activeGroup === group.id
                                                ? `bg-gradient-to-r ${group.color} text-white shadow-lg`
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    {group.icon}
                                                    <span className="font-medium text-sm">{group.name}</span>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${activeGroup === group.id
                                                    ? 'bg-white/20'
                                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {count}
                                                </span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Messages Panel */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col h-[calc(100vh-200px)]">
                            {/* Header */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                        {groups.find(g => g.id === activeGroup)?.icon}
                                        <span className="ml-2">{groups.find(g => g.id === activeGroup)?.name}</span>
                                    </h2>
                                    <span className="text-sm text-gray-500">
                                        {activeMessages.length} messages
                                    </span>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <AnimatePresence>
                                    {activeMessages.length === 0 ? (
                                        <div className="text-center py-12 text-gray-400">
                                            <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                                            <p>No messages in this group yet</p>
                                        </div>
                                    ) : (
                                        activeMessages.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex items-start space-x-3 ${msg.isAdminReply ? 'bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border-l-4 border-yellow-500' : ''}`}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0 ${msg.isAdminReply
                                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 ring-2 ring-yellow-300'
                                                    : 'bg-gradient-to-r from-purple-400 to-pink-500'
                                                    }`}>
                                                    {msg.avatar}
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
                                </AnimatePresence>
                            </div>

                            {/* Admin Reply Input */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Crown size={16} className="text-yellow-500" />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                        Reply as Admin
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAdminReply()}
                                        placeholder="Type your admin reply..."
                                        className="flex-1 px-4 py-3 rounded-lg border-2 border-yellow-300 focus:border-yellow-500 focus:outline-none bg-white dark:bg-gray-700"
                                    />
                                    <button
                                        onClick={handleAdminReply}
                                        disabled={!replyText.trim()}
                                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-bold disabled:opacity-50 hover:shadow-lg transition-all flex items-center space-x-2"
                                    >
                                        <Send size={18} />
                                        <span>Send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminGroupChats
