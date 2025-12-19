import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { useTheme } from '../utils/ThemeContext'
import ErrorBoundary from '../components/ErrorBoundary'

const UserLayout = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-sky-900 dark:to-cyan-900">
        <div className="flex">
          <ErrorBoundary>
            <Sidebar />
          </ErrorBoundary>
          <main className="flex-1 ml-64 p-8">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default UserLayout

