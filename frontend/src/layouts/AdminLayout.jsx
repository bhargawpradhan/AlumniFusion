import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminSidebar from '../components/AdminSidebar'
import { useTheme } from '../utils/ThemeContext'
import ErrorBoundary from '../components/ErrorBoundary'

const AdminLayout = () => {
  const { theme } = useTheme()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-sky-900 dark:to-cyan-900 relative overflow-hidden">
        {/* Subtle background animation for Admin Panel */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20 transition-opacity duration-1000">
          {[...Array(15)].map((_, i) => {
            const size = 50 + Math.random() * 100;
            const duration = 15 + Math.random() * 20;
            const delay = Math.random() * 10;
            const leftPosition = Math.random() * 100;

            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${leftPosition}%`,
                  bottom: '-150px',
                  background: `radial-gradient(circle at 30% 30%, rgba(${i % 2 === 0 ? '14, 165, 233' : '6, 182, 212'
                    }, 0.2), rgba(${i % 2 === 0 ? '14, 165, 233' : '6, 182, 212'
                    }, 0.02))`,
                  backdropFilter: 'blur(1px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                animate={{
                  y: [0, -1500],
                  x: [0, Math.sin(i) * 30, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0, 0.4, 0.6, 0.4, 0],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                  ease: 'linear',
                }}
              />
            );
          })}
        </div>

        <div className="flex relative z-10">
          <ErrorBoundary>
            <AdminSidebar />
          </ErrorBoundary>
          <main className="flex-1 ml-64 p-8 min-h-screen">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default AdminLayout

