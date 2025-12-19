import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  FileText,
  LogOut,
  GraduationCap,
  Shield,
  Megaphone,
} from 'lucide-react'
import DarkModeToggle from './DarkModeToggle'

const AdminSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Calendar, label: 'Event Manager', path: '/admin/events' },
    { icon: Briefcase, label: 'Job Manager', path: '/admin/jobs' },
    { icon: FileText, label: 'Content Manager', path: '/admin/content' },
  ]

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="fixed left-0 top-0 h-full w-64 glass dark:glass-dark border-r border-gray-200 dark:border-gray-800 z-40 overflow-hidden shadow-2xl"
    >
      <div className="p-6 h-full flex flex-col relative">
        {/* Background glow effect */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center space-x-3 mb-10 relative z-10">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Shield className="w-8 h-8 text-gradient" />
          </motion.div>
          <span className="text-xl font-bold text-gradient tracking-tight">Admin Panel</span>
        </div>

        <nav className="space-y-2 flex-1 relative z-10">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <motion.div
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg shadow-sky-500/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-sky-900/50 hover:translate-x-1'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-sky-600 to-cyan-600 rounded-xl -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon size={20} className={`${isActive ? 'text-white' : 'text-sky-500 group-hover:text-sky-600'}`} />
                  <span className="font-medium">{item.label}</span>
                  {!isActive && (
                    <motion.div
                      className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -5 }}
                      whileHover={{ x: 0 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-gray-200 dark:border-gray-800 relative z-10">
          <DarkModeToggle />
          <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 w-full mt-4 transition-all"
          >
            <LogOut size={20} className="text-red-500" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.aside>
  )
}

export default AdminSidebar

