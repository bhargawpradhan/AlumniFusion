// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { MessageSquare, Users, Send, Search, UserPlus } from 'lucide-react'
// import GlassCard from '../components/GlassCard'
// import SectionHeader from '../components/SectionHeader'

// const NetworkingHub = () => {
//   const [activeGroup, setActiveGroup] = useState('general')
//   const [message, setMessage] = useState('')

//   const groups = [
//     { id: 'general', name: 'General Discussion', unread: 3 },
//     { id: 'jobs', name: 'Job Opportunities', unread: 1 },
//     { id: 'tech', name: 'Tech Talk', unread: 0 },
//     { id: 'alumni', name: 'Alumni Events', unread: 2 },
//   ]

//   const messages = [
//     { id: 1, user: 'John Doe', text: 'Hello everyone! Excited to be part of this network.', time: '10:30 AM', avatar: 'JD' },
//     { id: 2, user: 'Jane Smith', text: 'Welcome John! Great to have you here.', time: '10:32 AM', avatar: 'JS' },
//     { id: 3, user: 'Mike Johnson', text: 'Anyone interested in a tech meetup next month?', time: '11:15 AM', avatar: 'MJ' },
//   ]

//   const suggestions = [
//     { name: 'Sarah Williams', position: 'Product Manager', company: 'Microsoft', mutual: 5 },
//     { name: 'David Brown', position: 'Software Engineer', company: 'Amazon', mutual: 3 },
//     { name: 'Emily Davis', position: 'Data Scientist', company: 'Google', mutual: 8 },
//   ]

//   const handleSend = () => {
//     if (message.trim()) {
//       // Handle send message
//       setMessage('')
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <SectionHeader
//         title="Networking Hub"
//         subtitle="Connect, discuss, and grow with fellow alumni"
//       />

//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Discussion Groups */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//         >
//           <GlassCard>
//             <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
//               <MessageSquare className="mr-2" size={24} />
//               Discussion Groups
//             </h3>
//             <div className="space-y-2">
//               {groups.map((group) => (
//                 <button
//                   key={group.id}
//                   onClick={() => setActiveGroup(group.id)}
//                   className={`w-full text-left p-3 rounded-lg transition-all ${
//                     activeGroup === group.id
//                       ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white'
//                       : 'hover:bg-primary-50 dark:hover:bg-primary-900/20'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium">{group.name}</span>
//                     {group.unread > 0 && (
//                       <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//                         {group.unread}
//                       </span>
//                     )}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </GlassCard>
//         </motion.div>

//         {/* Chat Area */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="lg:col-span-2"
//         >
//           <GlassCard className="h-[600px] flex flex-col">
//             <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                 {groups.find(g => g.id === activeGroup)?.name}
//               </h3>
//             </div>

//             <div className="flex-1 overflow-y-auto space-y-4 mb-4">
//               {messages.map((msg) => (
//                 <motion.div
//                   key={msg.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="flex items-start space-x-3"
//                 >
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold">
//                     {msg.avatar}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-2 mb-1">
//                       <span className="font-semibold text-gray-900 dark:text-white">{msg.user}</span>
//                       <span className="text-xs text-gray-500 dark:text-gray-400">{msg.time}</span>
//                     </div>
//                     <p className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
//                       {msg.text}
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//                 placeholder="Type a message..."
//                 className="flex-1 px-4 py-2 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
//               />
//               <button
//                 onClick={handleSend}
//                 className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
//               >
//                 <Send size={20} />
//               </button>
//             </div>
//           </GlassCard>
//         </motion.div>
//       </div>

//       {/* People You May Know */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.4 }}
//         className="mt-8"
//       >
//         <GlassCard>
//           <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
//             <Users className="mr-2" size={24} />
//             People You May Know
//           </h3>
//           <div className="grid md:grid-cols-3 gap-4">
//             {suggestions.map((person, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.5 + index * 0.1 }}
//                 className="p-4 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700"
//               >
//                 <div className="flex items-center space-x-3 mb-3">
//                   <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold">
//                     {person.name.split(' ').map(n => n[0]).join('')}
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900 dark:text-white">{person.name}</h4>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">{person.position}</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-500">{person.company}</p>
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
//                   {person.mutual} mutual connections
//                 </p>
//                 <button className="w-full px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2">
//                   <UserPlus size={16} />
//                   <span>Connect</span>
//                 </button>
//               </motion.div>
//             ))}
//           </div>
//         </GlassCard>
//       </motion.div>
//     </div>
//   )
// }

// export default NetworkingHub

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Users, Send, Search, UserPlus, Check, Sparkles } from 'lucide-react'

const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 ${className}`}>
    {children}
  </div>
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
  const [connectedPeople, setConnectedPeople] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const [chatMessages, setChatMessages] = useState({
    general: [
      { id: 1, user: 'John Doe', text: 'Hello everyone! Excited to be part of this network.', time: '10:30 AM', avatar: 'JD', isMine: false },
      { id: 2, user: 'Jane Smith', text: 'Welcome John! Great to have you here.', time: '10:32 AM', avatar: 'JS', isMine: false },
    ],
    jobs: [
      { id: 1, user: 'Sarah Wilson', text: 'Google is hiring for Senior SWE positions!', time: '09:15 AM', avatar: 'SW', isMine: false },
      { id: 2, user: 'Alex Kumar', text: 'Just got an offer from Amazon!', time: '09:45 AM', avatar: 'AK', isMine: false },
    ],
    tech: [
      { id: 1, user: 'David Tech', text: 'Has anyone tried React 19 features?', time: '08:00 AM', avatar: 'DT', isMine: false },
      { id: 2, user: 'Emma Code', text: 'Just deployed with Docker and Kubernetes!', time: '08:30 AM', avatar: 'EC', isMine: false },
    ],
    alumni: [
      { id: 1, user: 'Events Team', text: 'Alumni Reunion 2025 - Save the date: March 15th!', time: '07:00 AM', avatar: 'ET', isMine: false },
      { id: 2, user: 'Priya Alumni', text: 'Looking forward to the reunion!', time: '07:30 AM', avatar: 'PA', isMine: false },
    ],
  })

  const groups = [
    { id: 'general', name: 'General Discussion', unread: 3, icon: '💬', color: 'from-sky-500 to-blue-500' },
    { id: 'jobs', name: 'Job Opportunities', unread: 1, icon: '💼', color: 'from-blue-400 to-sky-300' },
    { id: 'tech', name: 'Tech Talk', unread: 0, icon: '💻', color: 'from-sky-600 to-blue-600' },
    { id: 'alumni', name: 'Alumni Events', unread: 2, icon: '🎓', color: 'from-cyan-500 to-sky-500' },
  ]

  const suggestions = [
    { name: 'Sarah Williams', position: 'Product Manager', company: 'Microsoft', mutual: 5, avatar: 'SW' },
    { name: 'David Brown', position: 'Software Engineer', company: 'Amazon', mutual: 3, avatar: 'DB' },
    { name: 'Emily Davis', position: 'Data Scientist', company: 'Google', mutual: 8, avatar: 'ED' },
    { name: 'Alex Kumar', position: 'UX Designer', company: 'Apple', mutual: 4, avatar: 'AK' },
    { name: 'Lisa Chen', position: 'DevOps Engineer', company: 'Netflix', mutual: 6, avatar: 'LC' },
    { name: 'Ryan Patel', position: 'ML Engineer', company: 'Tesla', mutual: 2, avatar: 'RP' },
  ]

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: chatMessages[activeGroup].length + 1,
        user: 'You',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'YU',
        isMine: true
      }
      setChatMessages({
        ...chatMessages,
        [activeGroup]: [...chatMessages[activeGroup], newMessage]
      })
      setMessage('')
    }
  }

  const handleConnect = (person) => {
    if (!connectedPeople.includes(person.name)) {
      setConnectedPeople([...connectedPeople, person.name])
    }
  }

  const filteredSuggestions = suggestions.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Animated bubbles
  const bubbles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 60 + 25,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 5
  }))

  return (
    <div className="container mx-auto px-4 py-12 relative overflow-hidden">
      {/* Animated Bubbles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              background: `radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.3), rgba(14, 165, 233, 0.2), rgba(3, 105, 161, 0.1))`,
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
            <motion.div
              className="absolute top-2 left-2 w-1/3 h-1/3 bg-white/50 rounded-full blur-sm"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating message icons */}
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={`msg-${i}`}
          className="fixed"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -200, 0],
            x: [0, Math.random() * 60 - 30, 0],
            rotate: [0, 360],
            scale: [0.5, 1.5, 0.5],
            opacity: [0, 0.7, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 8,
            repeat: Infinity,
            delay: Math.random() * 4
          }}
        >
          <MessageSquare
            size={Math.random() * 25 + 15}
            className="text-sky-400"
            style={{ filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.6))' }}
          />
        </motion.div>
      ))}

      {/* Sparkles */}
      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="fixed w-2 h-2 bg-white rounded-full"
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
            delay: Math.random() * 2
          }}
        />
      ))}

      <SectionHeader
        title="Networking Hub"
        subtitle="Connect, discuss, and grow with fellow alumni"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Discussion Groups */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <GlassCard className="relative overflow-hidden">
            {/* Bubbles inside groups card */}
            {Array.from({ length: 6 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: Math.random() * 30 + 15,
                  height: Math.random() * 30 + 15,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.05))',
                }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}

            <motion.h3
              className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <MessageSquare className="mr-2" size={24} />
              </motion.div>
              Discussion Groups
            </motion.h3>

            <div className="space-y-2 relative z-10">
              {groups.map((group, index) => (
                <motion.button
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all relative overflow-hidden ${activeGroup === group.id
                    ? `bg-gradient-to-r ${group.color} text-white shadow-lg`
                    : 'hover:bg-white/20'
                    }`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Mini bubbles in active group */}
                  {activeGroup === group.id && Array.from({ length: 3 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-white/30 rounded-full"
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
                        delay: i * 0.4
                      }}
                    />
                  ))}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{group.icon}</span>
                      <span className="font-medium">{group.name}</span>
                    </div>
                    {group.unread > 0 && (
                      <motion.span
                        className="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        {group.unread}
                      </motion.span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="lg:col-span-2"
        >
          <GlassCard className="h-[600px] flex flex-col relative overflow-hidden">
            {/* Bubbles inside chat */}
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
                  duration: 5 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}

            <div className="border-b border-white/20 pb-4 mb-4 relative z-10">
              <motion.h3
                className="text-xl font-bold text-gray-900 dark:text-white flex items-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span
                  className="text-3xl mr-2"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {groups.find(g => g.id === activeGroup)?.icon}
                </motion.span>
                {groups.find(g => g.id === activeGroup)?.name}
              </motion.h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGroup}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring' }}
                  className="space-y-4"
                >
                  {chatMessages[activeGroup].map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: msg.isMine ? 100 : -100, scale: 0.5 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                      className={`flex items-start space-x-3 ${msg.isMine ? 'flex-row-reverse space-x-reverse' : ''}`}
                    >
                      <motion.div
                        className={`w-10 h-10 rounded-full bg-gradient-to-r ${msg.isMine ? 'from-sky-500 to-blue-600' : 'from-blue-400 to-sky-300'} flex items-center justify-center text-white font-bold shadow-lg relative`}
                        whileHover={{ scale: 1.3, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Bubble around avatar */}
                        {Array.from({ length: 2 }, (_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-white/60 rounded-full"
                            animate={{
                              scale: [0, 2, 0],
                              opacity: [0, 1, 0],
                              x: [0, Math.cos(i * Math.PI) * 20],
                              y: [0, Math.sin(i * Math.PI) * 20]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.5
                            }}
                          />
                        ))}
                        {msg.avatar}
                      </motion.div>
                      <div className="flex-1">
                        <div className={`flex items-center space-x-2 mb-1 ${msg.isMine ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <span className="font-semibold text-gray-900 dark:text-white">{msg.user}</span>
                          <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                        <motion.p
                          className={`text-gray-700 dark:text-gray-300 ${msg.isMine ? 'bg-gradient-to-r from-sky-500/20 to-blue-600/20' : 'bg-white/20'} backdrop-blur-sm rounded-lg p-3 shadow-md relative overflow-hidden`}
                          whileHover={{ scale: 1.03, y: -3 }}
                        >
                          {/* Mini bubble in message */}
                          <motion.div
                            className="absolute w-2 h-2 bg-white/40 rounded-full"
                            style={{ right: '10%', top: '20%' }}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity
                            }}
                          />
                          {msg.text}
                        </motion.p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              className="flex space-x-2 relative z-10"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                onClick={handleSend}
                className="px-6 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg relative overflow-hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Send size={20} />
              </motion.button>
            </motion.div>
          </GlassCard>
        </motion.div>
      </div>

      {/* People You May Know */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <GlassCard className="relative overflow-hidden">
          {/* Bubbles inside people card */}
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: Math.random() * 35 + 15,
                height: Math.random() * 35 + 15,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
              }}
              animate={{
                y: [0, -45, 0],
                x: [0, Math.random() * 25 - 12.5, 0],
                scale: [1, 1.35, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 5 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 relative z-10">
            <motion.h3
              className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-4 md:mb-0"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Users className="mr-2" size={24} />
              </motion.div>
              People You May Know
            </motion.h3>

            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search people..."
                className="pl-10 pr-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {filteredSuggestions.map((person, index) => {
              const isConnected = connectedPeople.includes(person.name)
              return (
                <motion.div
                  key={person.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, type: 'spring' }}
                  whileHover={{ scale: 1.08, y: -10 }}
                  className="p-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 relative overflow-hidden"
                >
                  {/* Bubbles inside person card */}
                  {Array.from({ length: 3 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: 15,
                        height: 15,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
                      }}
                      animate={{
                        y: [0, -20, 0],
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 3 + i,
                        repeat: Infinity
                      }}
                    />
                  ))}

                  {isConnected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 bg-sky-500 rounded-full p-1 z-10"
                    >
                      <Check size={16} className="text-white" />
                    </motion.div>
                  )}

                  <div className="flex items-center space-x-3 mb-3 relative z-10">
                    <motion.div
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 flex items-center justify-center text-white font-bold relative"
                      whileHover={{ rotate: 360, scale: 1.3 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Rotating bubbles around avatar */}
                      {Array.from({ length: 2 }, (_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white/60 rounded-full"
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5
                          }}
                          style={{
                            left: '50%',
                            top: i === 0 ? '-5px' : 'auto',
                            bottom: i === 1 ? '-5px' : 'auto',
                            transformOrigin: `center ${i === 0 ? '30px' : '-10px'}`,
                          }}
                        />
                      ))}
                      {person.avatar}
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{person.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{person.position}</p>
                      <p className="text-xs text-gray-500">{person.company}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex items-center relative z-10">
                    <Sparkles size={12} className="mr-1 text-yellow-500" />
                    {person.mutual} mutual connections
                  </p>

                  <motion.button
                    onClick={() => handleConnect(person)}
                    className={`w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 relative overflow-hidden z-10 ${isConnected
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isConnected}
                  >
                    {isConnected ? (
                      <>
                        <Check size={16} />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        <span>Connect</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}

export default NetworkingHub