// import { useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Heart, GraduationCap, Building, Calendar, Code, CheckCircle, X } from 'lucide-react'
// import Lottie from 'lottie-react'
// import successAnimation from '../animations/success.json'
// import GlassCard from '../components/GlassCard'
// import SectionHeader from '../components/SectionHeader'
// import AnimatedButton from '../components/AnimatedButton'

// const DonationPortal = () => {
//   const [selectedCategory, setSelectedCategory] = useState(null)
//   const [donationAmount, setDonationAmount] = useState('')
//   const [showSuccess, setShowSuccess] = useState(false)

//   const categories = [
//     {
//       id: 'scholarship',
//       name: 'Scholarships',
//       icon: GraduationCap,
//       description: 'Support deserving students with scholarships',
//       current: 250000,
//       goal: 500000,
//       color: 'from-blue-500 to-cyan-500',
//     },
//     {
//       id: 'labs',
//       name: 'Campus Labs',
//       icon: Building,
//       description: 'Upgrade laboratory equipment and facilities',
//       current: 180000,
//       goal: 300000,
//       color: 'from-green-500 to-emerald-500',
//     },
//     {
//       id: 'events',
//       name: 'Events & Reunions',
//       icon: Calendar,
//       description: 'Fund alumni events and reunions',
//       current: 75000,
//       goal: 150000,
//       color: 'from-orange-500 to-amber-500',
//     },
//     {
//       id: 'tech',
//       name: 'Tech Fund',
//       icon: Code,
//       description: 'Support technology infrastructure and innovation',
//       current: 320000,
//       goal: 500000,
//       color: 'from-purple-500 to-indigo-500',
//     },
//   ]

//   const handleDonate = () => {
//     if (donationAmount && selectedCategory) {
//       // Simulate payment process
//       setTimeout(() => {
//         setShowSuccess(true)
//       }, 2000)
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <SectionHeader
//         title="Donation Portal"
//         subtitle="Give back to your alma mater and make a difference"
//       />

//       <div className="grid md:grid-cols-2 gap-6 mb-8">
//         {categories.map((category, index) => {
//           const Icon = category.icon
//           const progress = (category.current / category.goal) * 100
//           return (
//             <motion.div
//               key={category.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//             >
//               <GlassCard
//                 className="cursor-pointer"
//                 onClick={() => setSelectedCategory(category)}
//               >
//                 <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mb-4`}>
//                   <Icon className="text-white" size={32} />
//                 </div>
//                 <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{category.name}</h3>
//                 <p className="text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
//                 <div className="mb-2">
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-gray-600 dark:text-gray-400">Progress</span>
//                     <span className="font-semibold text-gray-900 dark:text-white">
//                       ₹{category.current.toLocaleString()} / ₹{category.goal.toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                     <motion.div
//                       initial={{ width: 0 }}
//                       animate={{ width: `${progress}%` }}
//                       transition={{ duration: 1, delay: index * 0.1 }}
//                       className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
//                     />
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
//                   {progress.toFixed(0)}% funded
//                 </p>
//               </GlassCard>
//             </motion.div>
//           )
//         })}
//       </div>

//       {/* Donation Form Modal */}
//       <AnimatePresence>
//         {selectedCategory && !showSuccess && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setSelectedCategory(null)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="glass dark:glass-dark rounded-xl p-8 max-w-md w-full"
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Make a Donation</h3>
//                 <button
//                   onClick={() => setSelectedCategory(null)}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Donation Amount (₹)</label>
//                   <input
//                     type="number"
//                     value={donationAmount}
//                     onChange={(e) => setDonationAmount(e.target.value)}
//                     placeholder="Enter amount"
//                     className="w-full px-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   />
//                   <div className="flex gap-2 mt-2">
//                     {[500, 1000, 2500, 5000].map((amount) => (
//                       <button
//                         key={amount}
//                         onClick={() => setDonationAmount(amount.toString())}
//                         className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800"
//                       >
//                         ₹{amount}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Name</label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Email</label>
//                   <input
//                     type="email"
//                     className="w-full px-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Payment Method</label>
//                   <div className="space-y-2">
//                     <label className="flex items-center p-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 cursor-pointer">
//                       <input type="radio" name="payment" value="razorpay" className="mr-2" defaultChecked />
//                       <span>Razorpay</span>
//                     </label>
//                     <label className="flex items-center p-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 cursor-pointer">
//                       <input type="radio" name="payment" value="stripe" className="mr-2" />
//                       <span>Stripe</span>
//                     </label>
//                   </div>
//                 </div>

//                 <AnimatedButton
//                   onClick={handleDonate}
//                   className="w-full"
//                   disabled={!donationAmount}
//                 >
//                   <Heart className="inline mr-2" size={20} />
//                   Donate ₹{donationAmount || '0'}
//                 </AnimatedButton>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Success Modal */}
//       <AnimatePresence>
//         {showSuccess && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => {
//               setShowSuccess(false)
//               setSelectedCategory(null)
//               setDonationAmount('')
//             }}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="glass dark:glass-dark rounded-xl p-8 max-w-md w-full text-center"
//             >
//               <Lottie animationData={successAnimation} className="w-48 h-48 mx-auto mb-4" />
//               <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//               <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Thank You!</h3>
//               <p className="text-gray-600 dark:text-gray-400 mb-6">
//                 Your donation of ₹{donationAmount} has been received. A receipt has been sent to your email.
//               </p>
//               <AnimatedButton
//                 onClick={() => {
//                   setShowSuccess(false)
//                   setSelectedCategory(null)
//                   setDonationAmount('')
//                 }}
//               >
//                 Close
//               </AnimatedButton>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// export default DonationPortal

import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, GraduationCap, Building, Calendar, Code, CheckCircle, X, CreditCard, Lock, TrendingUp, Users, Award } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import PayNow from '../components/PayNow'
import GlassCard from '../components/GlassCard'

const DonationPortal = () => {
  const location = useLocation()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [donationData, setDonationData] = useState({
    amount: '',
    name: '',
    email: '',
    paymentMethod: 'razorpay'
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Initial categories with goals (current will be updated from API)
  const initialCategories = [
    {
      id: 'scholarship',
      name: 'Scholarships',
      icon: GraduationCap,
      description: 'Support deserving students with scholarships',
      current: 0,
      goal: 500000,
      color: 'from-sky-400 to-cyan-500',
      donors: 0
    },
    {
      id: 'labs',
      name: 'Campus Labs',
      icon: Building,
      description: 'Upgrade laboratory equipment and facilities',
      current: 0,
      goal: 300000,
      color: 'from-blue-400 to-cyan-400',
      donors: 0
    },
    {
      id: 'events',
      name: 'Events & Reunions',
      icon: Calendar,
      description: 'Fund alumni events and reunions',
      current: 0,
      goal: 150000,
      color: 'from-cyan-500 to-sky-500',
      donors: 0
    },
    {
      id: 'tech',
      name: 'Tech Fund',
      icon: Code,
      description: 'Support technology infrastructure and innovation',
      current: 0,
      goal: 500000,
      color: 'from-blue-500 to-sky-400',
      donors: 0
    },
    {
      id: 'library',
      name: 'Library & Books',
      icon: Heart,
      description: 'Expand the library collection and digital resources',
      current: 0,
      goal: 200000,
      color: 'from-sky-500 to-blue-500',
      donors: 0
    },
    {
      id: 'sports',
      name: 'Sports Facilities',
      icon: TrendingUp,
      description: 'Improve sports infrastructure and equipment',
      current: 0,
      goal: 250000,
      color: 'from-cyan-400 to-blue-400',
      donors: 0
    },
    {
      id: 'research',
      name: 'Research Grants',
      icon: Award,
      description: 'Fund innovative research projects and publications',
      current: 0,
      goal: 400000,
      color: 'from-blue-400 to-sky-500',
      donors: 0
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure',
      icon: Building,
      description: 'Develop campus infrastructure and facilities',
      current: 0,
      goal: 600000,
      color: 'from-sky-500 to-cyan-500',
      donors: 0
    },
    {
      id: 'students',
      name: 'Student Welfare',
      icon: Users,
      description: 'Support student welfare programs and activities',
      current: 0,
      goal: 300000,
      color: 'from-cyan-500 to-blue-400',
      donors: 0
    },
    {
      id: 'environment',
      name: 'Green Campus',
      icon: Heart,
      description: 'Environmental initiatives and sustainable campus',
      current: 0,
      goal: 150000,
      color: 'from-sky-400 to-cyan-400',
      donors: 0
    },
    {
      id: 'arts',
      name: 'Arts & Culture',
      icon: Award,
      description: 'Promote arts, culture, and creative programs',
      current: 0,
      goal: 120000,
      color: 'from-blue-500 to-cyan-500',
      donors: 0
    },
    {
      id: 'emergency',
      name: 'Emergency Fund',
      icon: Heart,
      description: 'Support students facing financial emergencies',
      current: 0,
      goal: 200000,
      color: 'from-cyan-500 to-sky-500',
      donors: 0
    },
  ]

  const [categories, setCategories] = useState(initialCategories)

  useEffect(() => {
    fetchStats()

    // Check for success redirect from Razorpay
    const params = new URLSearchParams(location.search)
    if (params.get('success') === 'true') {
      setShowSuccess(true)
      toast.success('Payment completed successfully!')
    }
  }, [location])

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/donations/stats/summary')
      // data.byCategory is array of { _id: 'tech', total: 1000 }
      // data.donorsByCategory is array of { _id: 'tech', donors: 5 }

      setCategories(prev => prev.map(cat => {
        const foundAmount = data.byCategory?.find(c => c._id === cat.id)
        const foundDonors = data.donorsByCategory?.find(c => c._id === cat.id)
        return {
          ...cat,
          current: foundAmount ? foundAmount.total : cat.current,
          donors: foundDonors ? foundDonors.donors : 0
        }
      }))
    } catch (error) {
      console.error('Stats error:', error)
    }
  }

  const handleDonate = async () => {
    if (!donationData.amount || parseFloat(donationData.amount) <= 0) {
      toast.error('Please enter a valid donation amount')
      return
    }
    if (!donationData.name.trim()) {
      toast.error('Please enter your name')
      return
    }
    if (!donationData.email.trim()) {
      toast.error('Please enter your email')
      return
    }

    setIsProcessing(true)

    try {
      await api.post('/donations', {
        amount: parseFloat(donationData.amount),
        category: selectedCategory.id,
        donorName: donationData.name,
        donorEmail: donationData.email,
        paymentMethod: donationData.paymentMethod,
        status: 'completed' // Mocking successful payment
      })

      // Refresh stats
      await fetchStats()

      setIsProcessing(false)
      setShowSuccess(true)
    } catch (error) {
      console.error('Donation error:', error)
      toast.error('Donation failed')
      setIsProcessing(false)
    }
  }
  //   const handleDonate = async () => {
  //   if (!donationData.amount || parseFloat(donationData.amount) <= 0) {
  //     toast.error('Please enter a valid donation amount')
  //     return
  //   }
  //   if (!donationData.name.trim()) {
  //     toast.error('Please enter your name')
  //     return
  //   }
  //   if (!donationData.email.trim()) {
  //     toast.error('Please enter your email')
  //     return
  //   }

  //   setIsProcessing(true)

  //   try {
  //     // 🔗 RAZORPAY PAYMENT LINK (HERE IT IS ADDED)
  //     const razorpayLink = `https://razorpay.me/@adityasharma8526?amount=${parseFloat(
  //       donationData.amount
  //     ) * 100}` // amount in paise

  //     // 👉 Open Razorpay payment page
  //     window.open(razorpayLink, '_blank')

  //     // 👉 Save donation entry (temporary success)
  //     await api.post('/donations', {
  //       amount: parseFloat(donationData.amount),
  //       category: selectedCategory.id,
  //       donorName: donationData.name,
  //       donorEmail: donationData.email,
  //       paymentMethod: 'razorpay',
  //       status: 'pending'
  //     })

  //     await fetchStats()

  //     setIsProcessing(false)
  //     setShowSuccess(true)
  //   } catch (error) {
  //     console.error('Donation error:', error)
  //     toast.error('Donation failed')
  //     setIsProcessing(false)
  //   }
  // }

  const resetForm = () => {
    setShowSuccess(false)
    setSelectedCategory(null)
    setDonationData({
      amount: '',
      name: '',
      email: '',
      paymentMethod: 'razorpay'
    })
  }

  const totalRaised = categories.reduce((sum, cat) => sum + cat.current, 0)
  const totalGoal = categories.reduce((sum, cat) => sum + cat.goal, 0)
  const totalDonors = categories.reduce((sum, cat) => sum + cat.donors, 0)

  // Animated bubbles
  const bubbles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 60 + 20,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 5
  }))

  return (
    <div className="min-h-screen relative overflow-hidden px-4 py-12">
      {/* Animated Bubbles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              background: `radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.3), rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.1))`,
              boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.3)',
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.3, 1],
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
            {/* Inner shine effect */}
            <motion.div
              className="absolute top-2 left-2 w-1/3 h-1/3 bg-white/40 rounded-full blur-sm"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }, (_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-sky-500 dark:text-sky-400">
            Donation Portal
          </h1>
          <motion.p
            className="text-xl text-sky-700 dark:text-sky-300 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Give back to your alma mater and make a difference
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { label: 'Total Raised', value: `₹${(totalRaised / 100000).toFixed(1)}L`, icon: TrendingUp, color: 'from-sky-500 to-cyan-500' },
            { label: 'Total Donors', value: totalDonors, icon: Users, color: 'from-blue-500 to-sky-500' },
            { label: 'Impact Score', value: `${((totalRaised / totalGoal) * 100).toFixed(0)}%`, icon: Award, color: 'from-cyan-500 to-blue-500' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="relative group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.1, y: -10 }}
            >
              <div className={`relative bg-gradient-to-br ${stat.color} p-4 rounded-xl text-white shadow-xl overflow-hidden`}>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs font-medium opacity-90">{stat.label}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {categories.map((category, index) => {
            const Icon = category.icon
            const progress = (category.current / category.goal) * 100
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -20, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                className="h-full"
              >
                <GlassCard
                  className="relative cursor-pointer h-full group !p-5"
                  onClick={() => setSelectedCategory(category)}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-md relative z-10`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Icon className="text-white" size={24} />
                  </motion.div>

                  <h3 className="text-lg font-bold mb-2 text-white relative z-10 line-clamp-1">{category.name}</h3>
                  <p className="text-sky-200 mb-4 text-xs relative z-10 line-clamp-2 h-8">{category.description}</p>

                  <div className="space-y-2 relative z-10">
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, delay: 0.7 + index * 0.1 }}
                        className={`h-2 rounded-full bg-gradient-to-r ${category.color} relative`}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-sky-200 font-medium">{progress.toFixed(0)}%</span>
                      <span className="text-sky-300">
                        ₹{(category.current / 1000).toFixed(0)}K / ₹{(category.goal / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        <AnimatePresence>
          {selectedCategory && !showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedCategory(null)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto relative"
              >
                {/* Animated bubbles in modal */}
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
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 4 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                  />
                ))}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-black text-sky-400 relative z-10">Make a Donation</h3>
                  <motion.button
                    onClick={() => setSelectedCategory(null)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl relative z-10"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} className="text-white" />
                  </motion.button>
                </div>

                <div className={`bg-gradient-to-r ${selectedCategory.color} p-4 rounded-2xl mb-6 text-white relative z-10 overflow-hidden`}>
                  {/* Mini bubbles in category badge */}
                  {Array.from({ length: 3 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-white/20"
                      style={{
                        width: 15,
                        height: 15,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2 + i,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                  <div className="flex items-center mb-2 relative z-10">
                    <selectedCategory.icon size={24} className="mr-2" />
                    <h4 className="font-bold text-lg">{selectedCategory.name}</h4>
                  </div>
                  <p className="text-sm opacity-90 relative z-10">{selectedCategory.description}</p>
                </div>

                <div className="space-y-5 relative z-10">
                  <div>
                    <label className="block text-sm font-bold mb-3 text-sky-200">Donation Amount (₹)</label>
                    <input
                      type="number"
                      value={donationData.amount}
                      onChange={(e) => setDonationData({ ...donationData, amount: e.target.value })}
                      placeholder="Enter amount"
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-sky-400 focus:outline-none text-white placeholder-sky-300 backdrop-blur-xl text-lg font-semibold"
                    />
                    <div className="flex gap-2 mt-3">
                      {[500, 1000, 2500, 5000].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setDonationData({ ...donationData, amount: amount.toString() })}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500/80 to-blue-500/80 text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                        >
                          ₹{amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-3 text-sky-200">Name</label>
                    <input
                      type="text"
                      value={donationData.name}
                      onChange={(e) => setDonationData({ ...donationData, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-sky-400 focus:outline-none text-white placeholder-sky-300 backdrop-blur-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-3 text-sky-200">Email</label>
                    <input
                      type="email"
                      value={donationData.email}
                      onChange={(e) => setDonationData({ ...donationData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-5 py-4 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-sky-400 focus:outline-none text-white placeholder-sky-300 backdrop-blur-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-3 text-sky-200">Payment Method</label>
                    <div className="space-y-3">
                      {[
                        { value: 'razorpay', label: 'Razorpay', icon: CreditCard },
                        { value: 'stripe', label: 'Stripe', icon: Lock }
                      ].map((method) => (
                        <label
                          key={method.value}
                          className={`flex items-center p-4 rounded-2xl cursor-pointer ${donationData.paymentMethod === method.value
                            ? 'bg-gradient-to-r from-sky-500/80 to-blue-500/80 border-2 border-sky-400'
                            : 'bg-white/10 border-2 border-white/20'
                            }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.value}
                            checked={donationData.paymentMethod === method.value}
                            onChange={(e) => setDonationData({ ...donationData, paymentMethod: e.target.value })}
                            className="mr-3"
                          />
                          <method.icon size={20} className="mr-2 text-white" />
                          <span className="text-white font-semibold">{method.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {donationData.paymentMethod === 'razorpay' ? (
                    <PayNow
                      onClick={handleDonate}
                      className="w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl font-black text-xl shadow-2xl flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Heart className="mr-3" size={24} fill="currentColor" />
                      <span>Donate ₹{donationData.amount || '0'}</span>
                    </PayNow>
                  ) : (
                    <button
                      onClick={handleDonate}
                      disabled={isProcessing}
                      className="w-full py-5 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white rounded-2xl font-black text-xl shadow-2xl disabled:opacity-50 flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isProcessing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-7 h-7 border-4 border-white border-t-transparent rounded-full mr-3"
                          />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Heart className="mr-3" size={24} fill="currentColor" />
                          <span>Donate ₹{donationData.amount || '0'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={resetForm}
            >
              <motion.div
                initial={{ scale: 0.3, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.3, opacity: 0, rotate: 180 }}
                transition={{ type: "spring", damping: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/10 backdrop-blur-2xl rounded-3xl p-12 max-w-md w-full text-center shadow-2xl border border-white/20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl mx-auto mb-6"
                >
                  <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
                </motion.div>

                <h3 className="text-4xl font-black mb-4 text-green-400">Thank You! 🎉</h3>

                <p className="text-sky-200 mb-3 text-lg font-semibold">Your generous donation of</p>

                <div className="text-5xl font-black text-white mb-4">₹{donationData.amount}</div>

                <p className="text-sky-200 mb-8">
                  has been received successfully. A receipt has been sent to <span className="font-bold text-sky-300">{donationData.email}</span>
                </p>

                <button
                  onClick={resetForm}
                  className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DonationPortal