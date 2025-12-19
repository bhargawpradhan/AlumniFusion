import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { User, Briefcase, Heart, Calendar, Users, MessageSquare, Bell, TrendingUp, Award, MapPin, X, Loader2 } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const Dashboard = () => {
  const quickActions = [
    { icon: User, label: 'Profile', path: '/user/profile', color: 'from-blue-500 to-cyan-500' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs', color: 'from-green-500 to-emerald-500' },
    { icon: Heart, label: 'Donate', path: '/donate', color: 'from-pink-500 to-rose-500' },
    { icon: Calendar, label: 'Events', path: '/events', color: 'from-orange-500 to-amber-500' },
    { icon: Users, label: 'Directory', path: '/directory', color: 'from-purple-500 to-indigo-500' },
    { icon: MessageSquare, label: 'Messages', path: '/networking', color: 'from-teal-500 to-cyan-500' },
  ]

  const stats = [
    { label: 'Connections', value: '247', icon: Users, change: '+12%' },
    { label: 'Jobs Applied', value: '8', icon: Briefcase, change: '+2' },
    { label: 'Donations', value: '₹25,000', icon: Heart, change: '+₹5,000' },
    { label: 'Events Attended', value: '15', icon: Calendar, change: '+3' },
  ]

  const [activities, setActivities] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch approved stories for activity feed
      const storiesRes = await api.get('/stories')
      const recentStories = storiesRes.data.map(story => ({
        id: story._id,
        type: 'story',
        text: `Success Story: ${story.name} - ${story.position} at ${story.company}`,
        time: new Date(story.createdAt).toLocaleDateString()
      }))

      // Fetch upcoming events
      const eventsRes = await api.get('/events')
      const events = eventsRes.data.filter(e => new Date(e.date) >= new Date())
      setUpcomingEvents(events.slice(0, 3)) // Take top 3 upcoming events

      // Add events to activity feed as well
      const recentEvents = events.slice(0, 3).map(event => ({
        id: event._id,
        type: 'event',
        text: `Upcoming Event: ${event.title}`,
        time: new Date(event.createdAt).toLocaleDateString()
      }))

      setActivities([...recentStories, ...recentEvents].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5))

    } catch (error) {
      console.error('Failed to fetch dashboard data', error)
      toast.error('Failed to load dashboard updates')
    } finally {
      setIsLoading(false)
    }
  }

  const removeActivity = (id) => {
    setActivities(activities.filter(n => n.id !== id))
    toast.success('Notification dismissed')
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-gradient">
          Welcome back, Alumni! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your network today
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <TrendingUp size={12} className="mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.icon === Users ? 'from-blue-500 to-cyan-500' : stat.icon === Briefcase ? 'from-green-500 to-emerald-500' : stat.icon === Heart ? 'from-pink-500 to-rose-500' : 'from-orange-500 to-amber-500'} flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={index} to={action.path}>
                <GlassCard className="text-center cursor-pointer hover:shadow-xl transition-shadow">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</p>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Recent Activity & Notifications */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Bell className="mr-2" size={24} />
                Recent Activity
              </h3>
              <span className="text-xs px-2 py-1 bg-sky-100 text-sky-600 rounded-full font-medium">
                {activities.length} New
              </span>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-sky-500" />
                </div>
              ) : (
                <AnimatePresence mode='popLayout'>
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="relative flex items-start space-x-3 p-4 rounded-lg bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all border border-transparent hover:border-sky-200 dark:hover:border-sky-800 shadow-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
                        <div className="flex-1 pr-6">
                          <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">{activity.text}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{activity.time}</p>
                        </div>
                        <button
                          onClick={() => removeActivity(activity.id)}
                          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-gray-500"
                    >
                      No new notifications
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
              <Award className="mr-2" size={24} />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <div key={event._id} className="p-4 rounded-lg bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-100 dark:border-sky-800/50">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                      <MapPin size={14} className="mr-1" />
                      {event.location}
                    </p>
                    <Link to="/events">
                      <AnimatedButton className="mt-4 w-full text-sm shadow-md">
                        View Details
                      </AnimatedButton>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No upcoming events
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard

