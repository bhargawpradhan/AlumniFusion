import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Heart, CheckCircle, Sparkles, TrendingUp, Users, Award, ShieldCheck } from 'lucide-react'
import PayNow from '../components/PayNow'
import GlassCard from '../components/GlassCard'
import toast from 'react-hot-toast'

const Donation = () => {
    const location = useLocation()
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        if (params.get('success') === 'true') {
            setShowSuccess(true)
            toast.success('Donation successful!', {
                icon: '🎉',
                style: {
                    borderRadius: '15px',
                    background: '#0ea5e9',
                    color: '#fff',
                }
            })
        }
    }, [location])

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-slate-900">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <GlassCard className="p-8 md:p-12 text-center border-white/10 backdrop-blur-3xl shadow-2xl">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                            className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-sky-500/20"
                        >
                            <Heart className="text-white w-10 h-10" fill="currentColor" />
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                            Support Our Mission
                        </h1>

                        <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-md mx-auto">
                            Your contribution helps us build a stronger alumni community and support the next generation of leaders.
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-10">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <TrendingUp className="text-sky-400 mx-auto mb-2" size={20} />
                                <div className="text-white font-bold text-sm">Impact</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <Users className="text-blue-400 mx-auto mb-2" size={20} />
                                <div className="text-white font-bold text-sm">Community</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <Award className="text-cyan-400 mx-auto mb-2" size={20} />
                                <div className="text-white font-bold text-sm">Future</div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <PayNow className="w-full !py-6 text-xl shadow-sky-500/20">
                                <Sparkles className="mr-2" size={20} />
                                Donate with Razorpay
                            </PayNow>

                            <div className="flex items-center justify-center text-gray-500 text-sm gap-2">
                                <ShieldCheck size={16} />
                                Secure 256-bit SSL Encrypted Payment
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
                        onClick={() => setShowSuccess(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl shadow-sky-500/10"
                        >
                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="text-green-500 w-12 h-12" strokeWidth={3} />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4">Payment Successful!</h2>
                            <p className="text-gray-400 mb-8">
                                Thank you for your generous contribution. Your support makes a world of difference.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSuccess(false)}
                                className="w-full py-4 bg-sky-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/20"
                            >
                                Continue
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Donation
