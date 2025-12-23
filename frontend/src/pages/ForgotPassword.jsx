import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ShieldCheck, ArrowLeft, Sparkles, Loader2 } from 'lucide-react'
import AnimatedButton from '../components/AnimatedButton'
import GlassCard from '../components/GlassCard'
import toast from 'react-hot-toast'
import api from '../utils/api'

const ForgotPassword = () => {
    const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: '',
    })
    const [resetToken, setResetToken] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleRequestOtp = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await api.post('/auth/forgot-password', { email })
            toast.success('OTP sent to your email!')
            setStep(2)
        } catch (error) {
            console.error('OTP Request Error Details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            })
            const statusInfo = error.response ? ` (Error: ${error.response.status})` : ' (Connection Error)'
            toast.error((error.response?.data?.message || 'Failed to send OTP') + statusInfo)
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await api.post('/auth/verify-otp', { email, otp })
            setResetToken(response.data.resetToken)
            toast.success('OTP verified successfully!')
            setStep(3)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid or expired OTP')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Passwords do not match')
        }
        setIsLoading(true)
        try {
            await api.post('/auth/reset-password', {
                token: resetToken,
                newPassword: passwordData.newPassword,
            })
            toast.success('Password reset successfully! Please login.')
            navigate('/login')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="w-full max-w-md mx-auto relative z-10">
                <GlassCard hover={false}>
                    <div className="mb-6">
                        <Link to="/login" className="text-sky-600 dark:text-sky-400 flex items-center hover:underline mb-6 group w-fit">
                            <ArrowLeft size={18} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>
                        <h2 className="text-3xl font-bold text-gradient mb-2">Reset Password</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {step === 1 && "Enter your email to receive a password reset OTP."}
                            {step === 2 && "Enter the 6-digit OTP sent to your email."}
                            {step === 3 && "Create a new strong password for your account."}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleRequestOtp}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <AnimatedButton type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Send OTP'}
                                </AnimatedButton>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerifyOtp}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Enter OTP
                                    </label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white text-center text-2xl tracking-[1em]"
                                            maxLength={6}
                                            placeholder="000000"
                                            required
                                        />
                                    </div>
                                </div>
                                <AnimatedButton type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Verify OTP'}
                                </AnimatedButton>
                                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Didn't receive code?{' '}
                                    <button type="button" onClick={handleRequestOtp} className="text-sky-600 hover:underline">
                                        Resend
                                    </button>
                                </p>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.form
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleResetPassword}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                                <AnimatedButton type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Update Password'}
                                </AnimatedButton>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </GlassCard>
            </div>
        </div>
    )
}

export default ForgotPassword
