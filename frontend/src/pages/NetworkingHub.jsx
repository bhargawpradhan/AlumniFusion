import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Users, Send, Search, UserPlus, Check, Sparkles, Wifi, X, User } from 'lucide-react'
import { cardContinuousAnimation } from '../animations/cardAnimations'
import api from '../utils/api'
import { socket } from '../utils/socket'
import toast from 'react-hot-toast'

const GlassCard = ({ children, className = '', ...props }) => (
  <motion.div
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
  >
    <motion.h2
      className="text-4xl font-bold mb-4 bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent"
      animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      style={{ backgroundSize: '200% 200%' }}
    >
      {title}
    </motion.h2>
    <p className="text-gray-600 dark:text-gray-400 text-lg">{subtitle}</p>
  </motion.div>
)

const NetworkingHub = () => {
  const [activeGroup, setActiveGroup] = useState('general')
  const [message, setMessage] = useState('')
  const [activeAlumni, setActiveAlumni] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [directChatPerson, setDirectChatPerson] = useState(null)
  const [directMessage, setDirectMessage] = useState('')
  const [directMessages, setDirectMessages] = useState({})
  const [showIconBurst, setShowIconBurst] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [requests, setRequests] = useState([])
  const [myConnections, setMyConnections] = useState([])
  const [unreadCounts, setUnreadCounts] = useState({})

  // Chat messages for groups - NOW REAL!
  const [chatMessages, setChatMessages] = useState({
    general: [],
    jobs: [],
    tech: [],
    alumni: []
  })

  const groups = [
    { id: 'general', name: 'General Discussion', icon: '💬', color: 'from-sky-500 to-blue-500' },
    { id: 'jobs', name: 'Job Opportunities', icon: '💼', color: 'from-blue-400 to-sky-300' },
    { id: 'tech', name: 'Tech Talk', icon: '💻', color: 'from-sky-600 to-blue-600' },
    { id: 'alumni', name: 'Alumni Events', icon: '🎓', color: 'from-cyan-500 to-sky-500' },
  ]

  // Initial Data Fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)
          console.log('[GroupChat] Current user:', user)
          setCurrentUser(user)

          // Connect Socket
          socket.connect()
          const userId = user._id || user.id
          console.log('[GroupChat] Emitting join with userId:', userId)
          socket.emit('join', userId)
        }

        // Fetch Suggestions
        const suggestionsRes = await api.get('/connections/suggestions')
        setSuggestions(suggestionsRes.data)

        // Fetch Pending Requests
        try {
          const requestsRes = await api.get('/connections/requests')
          setRequests(requestsRes.data)
        } catch (err) {
          console.error('Failed to fetch requests', err)
        }

        // Fetch My Connections
        try {
          const connectionsRes = await api.get('/connections/my-connections')
          setMyConnections(connectionsRes.data)
        } catch (err) {
          console.error('Failed to fetch my connections', err)
        }

        // Fetch Unread Message Counts
        try {
          const unreadRes = await api.get('/messages/unread/counts')
          setUnreadCounts(unreadRes.data)
        } catch (err) {
          console.error('Failed to fetch unread counts', err)
        }

        // Fetch Group Messages for all groups
        try {
          const groupsToFetch = ['general', 'jobs', 'tech', 'alumni']
          console.log('[GroupChat] Fetching messages for groups:', groupsToFetch)
          const groupMessagesPromises = groupsToFetch.map(groupId =>
            api.get(`/group-messages/${groupId}`)
          )
          const results = await Promise.all(groupMessagesPromises)

          const newChatMessages = {}
          groupsToFetch.forEach((groupId, index) => {
            const messages = results[index].data
            console.log(`[GroupChat] ${groupId} has ${messages.length} messages`)
            newChatMessages[groupId] = messages.map(msg => ({
              id: msg._id,
              userId: msg.user._id,
              user: `${msg.user.firstName} ${msg.user.lastName}`,
              text: msg.text,
              time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              avatar: `${msg.user.firstName[0]}${msg.user.lastName[0]}`,
              isMine: msg.user._id === (currentUser?._id || currentUser?.id),
              isAdminReply: msg.isAdminReply
            }))
          })
          setChatMessages(newChatMessages)
          console.log('[GroupChat] Chat messages loaded:', newChatMessages)
        } catch (err) {
          console.error('[GroupChat] Failed to fetch group messages:', err)
        }

        // Fetch all users to filter active ones
        const usersRes = await api.get('/users')
        const allUsers = usersRes.data

        socket.on('onlineUsers', (userIds) => {
          // Filter allUsers who are in userIds array and NOT current user
          const currentUserId = JSON.parse(userStr)?.id || JSON.parse(userStr)?._id
          const active = allUsers.filter(u => userIds.includes(u._id) && u._id !== currentUserId)
          setActiveAlumni(active)
        })

        socket.on('receiveGroupMessage', (msg) => {
          console.log('[GroupChat] Received group message:', msg)
          // Add incoming group message to the appropriate group
          setChatMessages(prev => ({
            ...prev,
            [msg.groupId]: [...(prev[msg.groupId] || []), {
              id: msg._id,
              userId: msg.userId,
              user: `${msg.user.firstName} ${msg.user.lastName}`,
              text: msg.text,
              time: msg.time,
              avatar: `${msg.user.firstName[0]}${msg.user.lastName[0]}`,
              isMine: msg.userId === (currentUser?._id || currentUser?.id),
              isAdminReply: msg.isAdminReply
            }]
          }))
        })

        socket.on('receiveMessage', (msg) => {
          const senderId = msg.from
          setDirectMessages(prev => {
            // If chat is open with this person, append message
            if (directChatPerson && directChatPerson._id === senderId) {
              return {
                ...prev,
                [senderId]: [...(prev[senderId] || []), { ...msg, isMine: false }]
              }
            }

            // Otherwise show toast notification and increment unread
            const senderName = msg.user ? `${msg.user.firstName} ${msg.user.lastName}` : 'Someone'
            toast(`New message from ${senderName}`, {
              icon: '💬',
              duration: 4000
            })

            // Increment unread count
            setUnreadCounts(prev => ({
              ...prev,
              [senderId]: (prev[senderId] || 0) + 1
            }))

            // Store message anyway
            return {
              ...prev,
              [senderId]: [...(prev[senderId] || []), { ...msg, isMine: false }]
            }
          })
        })

      } catch (error) {
        console.error('Error initializing networking hub', error)
      }
    }

    fetchInitialData()

    return () => {
      socket.off('onlineUsers')
      socket.off('receiveMessage')
      socket.off('receiveGroupMessage')
      socket.disconnect()
    }
  }, [directChatPerson]) // check dependency

  const handleSend = () => {
    if (message.trim() && currentUser) {
      const userId = currentUser._id || currentUser.id
      const messageData = {
        groupId: activeGroup,
        userId: userId,
        text: message,
        user: {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          role: currentUser.role || 'user'
        }
      }

      console.log('[GroupChat] Sending message:', messageData)
      // Emit via socket for real-time broadcast
      socket.emit('sendGroupMessage', messageData)

      setMessage('')
    }
  }

  const handleConnect = async (person) => {
    try {
      await api.post(`/connections/request/${person._id}`)
      toast.success(`Connection request sent to ${person.firstName}`)
      // Remove from suggestions locally
      setSuggestions(suggestions.filter(s => s._id !== person._id))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to connect')
    }
  }

  const handleStartChat = async (person) => {
    setDirectChatPerson(person)

    // Mark messages as read
    try {
      await api.post(`/messages/${person._id}/mark-read`)
      // Clear unread count for this person
      setUnreadCounts(prev => {
        const newCounts = { ...prev }
        delete newCounts[person._id]
        return newCounts
      })
    } catch (err) {
      console.error('Failed to mark as read', err)
    }

    // Fetch previous messages
    try {
      const res = await api.get(`/messages/${person._id}`)
      const history = res.data.map(msg => ({
        id: msg._id,
        text: msg.text,
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMine: msg.from === (currentUser.id || currentUser._id)
      }))

      setDirectMessages(prev => ({
        ...prev,
        [person._id]: history
      }))
    } catch (error) {
      console.error('Failed to fetch chat history', error)
      if (!directMessages[person._id]) {
        setDirectMessages(prev => ({
          ...prev,
          [person._id]: []
        }))
      }
    }
  }

  const handleSendDirectMessage = () => {
    if (directMessage.trim() && directChatPerson && currentUser) {
      const newMessage = {
        id: Date.now(),
        text: directMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMine: true
      }

      // Update local UI
      setDirectMessages(prev => ({
        ...prev,
        [directChatPerson._id]: [...(prev[directChatPerson._id] || []), newMessage]
      }))

      // Emit socket event
      socket.emit('sendMessage', {
        to: directChatPerson._id,
        from: currentUser.id || currentUser._id,
        text: directMessage,
        user: {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          _id: currentUser._id
        }
      })

      setDirectMessage('')
    }
  }

  const closeChat = () => {
    setDirectChatPerson(null)
  }

  const handleAccept = async (requestId) => {
    try {
      await api.post(`/connections/accept/${requestId}`)
      toast.success('Connection accepted')
      setRequests(requests.filter(r => r._id !== requestId))
      // Refresh suggestions to potentially remove the user if they were there (optional)
    } catch (error) {
      toast.error('Failed to accept connection')
    }
  }

  const handleReject = async (requestId) => {
    try {
      await api.post(`/connections/reject/${requestId}`)
      toast.success('Connection rejected')
      setRequests(requests.filter(r => r._id !== requestId))
    } catch (error) {
      toast.error('Failed to reject connection')
    }
  }

  const filteredSuggestions = suggestions.filter(person =>
    `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.options?.position || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.options?.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Floating background bubbles
  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 60 + 25,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  }))

  return (
    <div className="container mx-auto px-4 py-12 relative overflow-hidden min-h-screen">
      {/* Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              background: `radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.15), rgba(14, 165, 233, 0.1), rgba(3, 105, 161, 0.05))`,
              boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 60 - 30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: bubble.delay
            }}
          />
        ))}
      </div>

      <SectionHeader
        title="Networking Hub"
        subtitle="Connect, discuss, and grow with fellow alumni"
      />

      {/* Connection Requests Section */}
      <AnimatePresence>
        {requests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <GlassCard className="border-l-4 border-l-blue-500">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <UserPlus className="mr-2 text-blue-500" size={24} />
                Connection Requests
                <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">{requests.length}</span>
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {requests.map((req) => (
                  <motion.div
                    key={req._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        {req.from.firstName[0]}{req.from.lastName[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{req.from.firstName} {req.from.lastName}</h4>
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">{req.from.position || 'Member'}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAccept(req._id)}
                        className="p-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20 transition-colors"
                        title="Accept"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="p-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors"
                        title="Reject"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Discussion Groups */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="lg:col-span-1"
        >
          <GlassCard className="relative overflow-hidden h-full">
            <motion.h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
              <MessageSquare className="mr-2" size={24} />
              Discussion Groups
            </motion.h3>

            <div className="space-y-2 relative z-10">
              {groups.map((group, index) => (
                <motion.button
                  key={group.id}
                  onClick={() => {
                    if (activeGroup !== group.id) {
                      setShowIconBurst(true)
                      setTimeout(() => setShowIconBurst(false), 1500)
                    }
                    setActiveGroup(group.id)
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all relative overflow-hidden ${activeGroup === group.id
                    ? `bg-gradient-to-r ${group.color} text-white shadow-lg`
                    : 'hover:bg-white/20'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{group.icon}</span>
                    <span className="font-medium">{group.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="lg:col-span-2"
        >
          <GlassCard className="h-[600px] flex flex-col relative overflow-hidden">

            {/* Header */}
            <div className="border-b border-white/20 pb-4 mb-4 relative z-10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                {groups.find(g => g.id === activeGroup)?.icon}
                <span className="ml-2">{groups.find(g => g.id === activeGroup)?.name}</span>
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 relative z-10 pr-2">
              {/* Logo Burst Animation */}
              <AnimatePresence>
                {showIconBurst && (
                  <>
                    {Array.from({ length: 12 }, (_, i) => {
                      const angle = (i / 12) * Math.PI * 2
                      const distance = 300
                      return (
                        <motion.div
                          key={`burst-${i}`}
                          className="absolute text-6xl pointer-events-none"
                          style={{
                            left: '50%',
                            top: '50%',
                            zIndex: 100,
                            transformOrigin: 'center'
                          }}
                          initial={{ x: '-50%', y: '-50%', scale: 0.5, opacity: 1 }}
                          animate={{
                            x: `calc(-50% + ${Math.cos(angle) * distance}px)`,
                            y: `calc(-50% + ${Math.sin(angle) * distance}px)`,
                            scale: [0.5, 2, 0],
                            opacity: [1, 0.8, 0],
                            rotate: [0, 360 + i * 30]
                          }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{
                            duration: 1.2,
                            ease: [0.34, 1.56, 0.64, 1]
                          }}
                        >
                          {groups.find(g => g.id === activeGroup)?.icon}
                        </motion.div>
                      )
                    })}
                  </>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGroup}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {(chatMessages[activeGroup] || []).map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: msg.isMine ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-start space-x-3 ${msg.isMine ? 'flex-row-reverse space-x-reverse' : ''} ${msg.isAdminReply ? 'relative' : ''}`}
                    >
                      {msg.isAdminReply && (
                        <div className="absolute -left-2 -top-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
                          <span className="text-xs">👑</span>
                        </div>
                      )}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${msg.isAdminReply
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600 ring-2 ring-yellow-300'
                        : msg.isMine
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600'
                          : 'bg-gradient-to-r from-purple-400 to-pink-500'
                        }`}>
                        {msg.isMine ? (currentUser?.firstName?.[0] || 'Y') : (msg.avatar?.[0] || 'U')}
                      </div>
                      <div className={`max-w-[70%] p-3 rounded-lg border-2 ${msg.isAdminReply
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-400 text-gray-900 dark:text-yellow-100'
                        : msg.isMine
                          ? 'bg-blue-500/20 text-gray-800 dark:text-gray-100 border-transparent'
                          : 'bg-white/40 dark:bg-gray-800/40 text-gray-800 dark:text-gray-100 border-transparent'
                        }`}>
                        <div className={`text-xs mb-1 flex items-center ${msg.isMine ? 'justify-end text-blue-300' : 'text-gray-500'}`}>
                          {msg.isAdminReply && <span className="mr-1">⭐</span>}
                          {!msg.isMine && <span className={`font-bold mr-2 ${msg.isAdminReply ? 'text-orange-600 dark:text-yellow-300' : ''}`}>{msg.user}</span>}
                          {msg.isAdminReply && <span className="text-orange-600 dark:text-yellow-300 text-[10px] mr-2">ADMIN</span>}
                          <span className={msg.isAdminReply ? 'text-orange-500 dark:text-yellow-400' : ''}>{msg.time}</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  {(chatMessages[activeGroup] || []).length === 0 && (
                    <div className="text-center text-gray-500 mt-20">
                      <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
                      <p>No messages yet. Be the first to say hello!</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="flex space-x-2 relative z-10">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Message ${groups.find(g => g.id === activeGroup)?.name}...`}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Send size={20} />
              </button>
            </div>

          </GlassCard>
        </motion.div>
      </div>

      {/* My Connections Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8"
      >
        <GlassCard className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Users className="mr-2 text-blue-500" size={24} />
              My Connections
              <span className="ml-3 bg-blue-500/20 text-blue-600 text-sm px-3 py-1 rounded-full border border-blue-500/30">
                {myConnections.length} Connected
              </span>
            </h3>
          </div>

          {myConnections.length === 0 ? (
            <p className="text-gray-500 text-center py-8">You haven't connected with anyone yet. Start networking!</p>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {myConnections.map((person) => (
                <motion.div
                  key={person._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {person.firstName[0]}{person.lastName[0]}
                      </div>
                      {person.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                      {unreadCounts[person._id] > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{unreadCounts[person._id]}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{person.firstName} {person.lastName}</h4>
                      <p className="text-xs text-gray-500">{person.position || 'Alumni'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartChat(person)}
                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <MessageSquare size={16} />
                    <span>Message</span>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Active Alumni Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8"
      >
        <GlassCard className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Wifi className="mr-2 text-green-500 animate-pulse" size={24} />
              Active Alumni
              <span className="ml-3 bg-green-500/20 text-green-600 text-sm px-3 py-1 rounded-full border border-green-500/30">
                {activeAlumni.length} Online
              </span>
            </h3>
          </div>

          {activeAlumni.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No other alumni are currently online.</p>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeAlumni.map((person) => {
                const isConnected = currentUser?.connections?.includes(person._id)
                return (
                  <motion.div
                    key={person._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all group"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                          {person.firstName[0]}{person.lastName[0]}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{person.firstName} {person.lastName}</h4>
                        <p className="text-xs text-gray-500">{person.options?.position || 'Alumni'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartChat(person)}
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center space-x-2 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                      <MessageSquare size={16} />
                      <span>Chat</span>
                    </button>
                  </motion.div>
                )
              })}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* People You May Know */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <GlassCard>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-4 md:mb-0">
              <Users className="mr-2 text-blue-500" size={24} />
              People You May Know
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search alumni..."
                className="pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuggestions.map((person, index) => {
              // Check if already connected (though suggestions should technically filter this out, good to be safe)
              const isConnected = currentUser?.connections?.includes(person._id)

              return (
                <motion.div
                  key={person._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all flex flex-col"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                      {person.firstName[0]}{person.lastName[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{person.firstName} {person.lastName}</h4>
                      <p className="text-sm text-gray-500">{person.options?.position}</p>
                      <p className="text-xs text-gray-400">{person.options?.company}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Sparkles size={12} className="mr-1 text-yellow-500" />
                      Active Alumni
                    </span>
                    <button
                      onClick={() => handleConnect(person)}
                      disabled={isConnected}
                      className={`px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1 transition-all ${isConnected
                        ? 'bg-green-500/20 text-green-500 cursor-default'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                      {isConnected ? (
                        <>
                          <Check size={14} />
                          <span>Connected</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={14} />
                          <span>Connect</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )
            })}
            {filteredSuggestions.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No suggestions found matching your search.
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Direct Chat Modal */}
      <AnimatePresence>
        {directChatPerson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeChat}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[80vh]"
            >
              {/* Chat Header */}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 flex justify-between items-center text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    {directChatPerson.firstName[0]}{directChatPerson.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold">{directChatPerson.firstName} {directChatPerson.lastName}</h3>
                    <p className="text-xs text-blue-100 opacity-80">{directChatPerson.options?.position || 'Alumni'}</p>
                  </div>
                </div>
                <button onClick={closeChat} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                {(directMessages[directChatPerson._id] || []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <MessageSquare size={48} className="mb-2 opacity-30" />
                    <p>Start a conversation with {directChatPerson.firstName}</p>
                  </div>
                ) : (
                  (directMessages[directChatPerson._id] || []).map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-3 rounded-2xl ${msg.isMine
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                        } shadow-sm`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${msg.isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center space-x-2">
                <input
                  type="text"
                  value={directMessage}
                  onChange={(e) => setDirectMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendDirectMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendDirectMessage}
                  disabled={!directMessage.trim()}
                  className={`p-2 rounded-full ${directMessage.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400'} transition-all`}
                >
                  <Send size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NetworkingHub