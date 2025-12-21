import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, GraduationCap, User, Shield, Sparkles } from 'lucide-react'
import Lottie from 'lottie-react'
import loginAnimation from '../animations/login.json'
import AnimatedButton from '../components/AnimatedButton'
import GlassCard from '../components/GlassCard'
import toast from 'react-hot-toast'
import api from '../utils/api'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loginType, setLoginType] = useState('user') // 'user' or 'admin'
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Real backend login
    setIsLoading(true)
    try {
      const { data } = await api.post('/auth/login', { ...formData, loginType })

      // Save token and user info
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user || {}))

      toast.success('Login successful!')

      // Redirect strictly based on the role and loginType context
      // If backend says they are admin and they logged in as admin, go to admin dashboard
      if (data.user?.role === 'admin' && loginType === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/user/dashboard')
      }
    } catch (error) {
      console.error('Login Error:', error)
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Floating background bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => {
          const size = 20 + Math.random() * 80;
          const duration = 8 + Math.random() * 12;
          const delay = Math.random() * 5;
          const leftPosition = Math.random() * 100;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${leftPosition}%`,
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
                y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 200 : 1000)],
                x: [
                  0,
                  Math.sin(i) * 50,
                  Math.sin(i + 1) * -50,
                  Math.sin(i + 2) * 50,
                  0
                ],
                scale: [1, 1.1, 0.9, 1.05, 1],
                opacity: [0, 0.6, 0.8, 0.6, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: 'easeInOut',
              }}
            >
              <motion.div
                className="absolute rounded-full bg-white/40"
                style={{
                  width: `${size * 0.3}px`,
                  height: `${size * 0.3}px`,
                  top: `${size * 0.15}px`,
                  left: `${size * 0.15}px`,
                  filter: 'blur(8px)',
                }}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          );
        })}

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
              x: [0, Math.random() * 10 - 5, 0],
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

      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            type: 'spring',
            stiffness: 100,
            damping: 15
          }}
          className="hidden md:block"
        >
          <motion.div
            className="relative"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <motion.img
              src="/alumni-fusion-login.png"
              alt="Alumni Fusion - Connect with Alumni"
              className="w-full rounded-2xl shadow-2xl"
              animate={{
                rotate: [0, 2, -2, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            type: 'spring',
            stiffness: 100,
            damping: 15
          }}
          className="w-full max-w-md mx-auto"
        >
          <GlassCard className="relative overflow-hidden">
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-sky-400/10 via-cyan-400/10 to-blue-400/10"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <div className="relative z-10">
              <motion.div
                className="flex items-center justify-center mb-6"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                }}
              >
                <div className="relative group">
                  <motion.div
                    className="absolute -inset-2 bg-sky-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <GraduationCap className="w-16 h-16 text-sky-500 relative drop-shadow-[0_0_15px_rgba(14,165,233,0.6)]" />
                </div>
              </motion.div>

              <motion.h2
                className="text-4xl font-black text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600 tracking-tight"
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Welcome Back
              </motion.h2>

              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                Login to your AlumniFusion account
              </p>

              {/* Login Type Selector */}
              <div className="flex gap-4 mb-6">
                <motion.button
                  onClick={() => setLoginType('user')}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all relative overflow-hidden ${loginType === 'user'
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg'
                    : 'glass dark:glass-dark text-gray-700 dark:text-gray-300'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loginType === 'user' && (
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  )}
                  <div className="flex items-center justify-center space-x-2 relative z-10">
                    <User size={20} />
                    <span>User</span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => setLoginType('admin')}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all relative overflow-hidden ${loginType === 'admin'
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg'
                    : 'glass dark:glass-dark text-gray-700 dark:text-gray-300'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loginType === 'admin' && (
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  )}
                  <div className="flex items-center justify-center space-x-2 relative z-10">
                    <Shield size={20} />
                    <span>Admin</span>
                  </div>
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <motion.input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="your.email@example.com"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <motion.input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="••••••••"
                      required
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  <Link to="/forgot-password" size="sm" className="text-sm text-sky-600 dark:text-sky-400 hover:underline">
                    Forgot password?
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <AnimatedButton type="submit" className="w-full relative overflow-hidden group">
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <Sparkles size={20} />
                      <span>Login as {loginType === 'admin' ? 'Admin' : 'User'}</span>
                    </span>
                  </AnimatedButton>
                </motion.div>
              </form>

              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-sky-600 dark:text-sky-400 hover:underline font-semibold">
                    Register here
                  </Link>
                </p>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
