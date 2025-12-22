import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  User,
  Briefcase,
  Heart,
  Calendar,
  Users,
  MessageSquare,
  Bell,
  LogOut,
  GraduationCap,
} from 'lucide-react'
import DarkModeToggle from './DarkModeToggle'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/user/dashboard' },
    { icon: User, label: 'Profile', path: '/user/profile' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: Heart, label: 'Donate', path: '/donate' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Users, label: 'Directory', path: '/directory' },
    { icon: MessageSquare, label: 'Messages', path: '/networking' },
  ]

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-64 glass dark:glass-dark border-r border-gray-200 dark:border-gray-800 z-40"
    >
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <GraduationCap className="w-8 h-8 text-sky-500" />
          <span className="text-xl font-bold text-gradient">AlumniFusion</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-900'
                  }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bell size={20} className="text-gray-700 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">Notifications</span>
            </div>
            <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">3</span>
          </div>
          <DarkModeToggle />
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 w-full mt-4"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </motion.aside>
  )
}

export default Sidebar

