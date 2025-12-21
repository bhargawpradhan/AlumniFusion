import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Megaphone, Calendar, Bell, Info, GraduationCap, Loader2, AlertCircle } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import api from '../utils/api'
import { cardContinuousAnimation, cardHoverAnimation } from '../animations/cardAnimations'

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('/announcements')
                setAnnouncements(data)
            } catch (error) {
                console.error('Failed to load announcements')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const getIcon = (type) => {
        switch (type) {
            case 'urgent': return <AlertCircle className="text-red-500" size={32} />
            case 'event': return <Calendar className="text-purple-500" size={32} />
            case 'news': return <Megaphone className="text-blue-500" size={32} />
            default: return <Info className="text-gray-500" size={32} />
        }
    }

    const getTypeColor = (type) => {
        switch (type) {
            case 'urgent': return 'bg-red-500'
            case 'event': return 'bg-purple-500'
            case 'news': return 'bg-blue-500'
            default: return 'bg-gray-500'
        }
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="container mx-auto px-4 py-12 relative min-h-screen overflow-hidden">
            {/* Floating background bubbles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(25)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: `${20 + Math.random() * 80}px`,
                            height: `${20 + Math.random() * 80}px`,
                            left: `${Math.random() * 100}%`,
                            bottom: '-100px',
                            background: `radial-gradient(circle at 30% 30%, rgba(${i % 3 === 0 ? '59, 130, 246' : i % 3 === 1 ? '147, 51, 234' : '236, 72, 153'
                                }, 0.3), rgba(${i % 3 === 0 ? '59, 130, 246' : i % 3 === 1 ? '147, 51, 234' : '236, 72, 153'
                                }, 0.05))`,
                            backdropFilter: 'blur(2px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: `0 8px 32px 0 rgba(${i % 3 === 0 ? '59, 130, 246' : i % 3 === 1 ? '147, 51, 234' : '236, 72, 153'
                                }, 0.2)`,
                        }}
                        animate={{
                            y: [0, -1200],
                            x: [0, Math.sin(i) * 50, 0],
                            scale: [1, 1.1, 1],
                            opacity: [0, 0.6, 0.8, 0.6, 0],
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: 'easeInOut',
                        }}
                    />
                ))}

                {/* Sparkle particles */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={`sparkle-${i}`}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: `radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(59, 130, 246, 0.4))`,
                            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                <SectionHeader
                    title="Announcements"
                    subtitle="Latest news, updates, and important notices from the community."
                />

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="max-w-4xl mx-auto space-y-8"
                    >
                        {announcements.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10">
                                <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">No announcements yet</h3>
                                <p className="text-gray-500">Check back later for updates!</p>
                            </div>
                        ) : (
                            announcements.map((announcement) => (
                                <motion.div
                                    key={announcement._id}
                                    variants={item}
                                    whileHover={{ y: -5 }}
                                    className="group"
                                >
                                    <GlassCard
                                        className="overflow-hidden border-t-4 border-t-sky-500 transition-all duration-300 hover:shadow-2xl"
                                        {...cardContinuousAnimation}
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 rounded-2xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                                        <GraduationCap size={28} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[10px] uppercase font-black text-sky-600 dark:text-sky-400 tracking-[0.2em]">Official Memo</span>
                                                            {announcement.priority === 'high' && (
                                                                <span className="animate-pulse bg-red-500 text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider">
                                                                    Urgent
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                                            {announcement.title}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 font-mono">
                                                        {new Date(announcement.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-widest text-white ${getTypeColor(announcement.type)}`}>
                                                        {announcement.type}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap ml-16">
                                                {announcement.content}
                                            </div>

                                            {announcement.author && (
                                                <div className="mt-4 ml-16 flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-[10px] font-bold text-sky-600 dark:text-sky-400">
                                                        {announcement.author.firstName?.[0]}{announcement.author.lastName?.[0]}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        Posted by {announcement.author.firstName} {announcement.author.lastName}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Announcements
