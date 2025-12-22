import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Users, DollarSign, Briefcase, BookOpen,
  TrendingUp, Activity, CheckCircle, XCircle, Search, Calendar as CalendarIcon
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts'
import api from '../utils/api'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    pendingStories: 0,
    pendingJobs: 0
  })
  const [graphs, setGraphs] = useState({
    userGrowth: [],
    donationTrends: []
  })
  const [approvals, setApprovals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [allDonations, setAllDonations] = useState([])
  const [showDonationsModal, setShowDonationsModal] = useState(false)
  const [donationFilter, setDonationFilter] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const results = await Promise.allSettled([
        api.get('/users'),
        api.get('/donations'),
        api.get('/stories/pending'),
        api.get('/jobs/pending')
      ])

      const users = results[0].status === 'fulfilled' ? results[0].value.data : []
      const donations = results[1].status === 'fulfilled' ? results[1].value.data : []
      const pendingStories = results[2].status === 'fulfilled' ? results[2].value.data : []
      const pendingJobs = results[3].status === 'fulfilled' ? results[3].value.data : []

      setAllDonations(donations)

      // Process Stats
      setStats({
        totalUsers: users.length,
        totalDonations: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
        pendingStories: pendingStories.length,
        pendingJobs: pendingJobs.length
      })

      // Process Approvals List (Combine Stories and Jobs)
      const storyApprovals = pendingStories.map(s => ({ ...s, type: 'story', title: s.name, subtitle: 'Success Story' }))
      const jobApprovals = pendingJobs.map(j => ({ ...j, type: 'job', title: j.title, subtitle: `Job at ${j.company}` }))

      setApprovals([...storyApprovals, ...jobApprovals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))

      // Process Graphs
      // 1. User Growth (Mocking monthly data based on joined dates if available, else random distribution for demo if dates missing)
      // Real implementation: Group users by month
      const userGrowthMap = {}
      users.forEach(u => {
        const date = new Date(u.createdAt || Date.now())
        const month = date.toLocaleString('default', { month: 'short' })
        userGrowthMap[month] = (userGrowthMap[month] || 0) + 1
      })
      const userGrowthData = Object.keys(userGrowthMap).map(key => ({ name: key, users: userGrowthMap[key] }))
      // If empty (no dates), provide placeholder
      if (userGrowthData.length === 0) {
        userGrowthData.push({ name: 'Jan', users: 10 }, { name: 'Feb', users: 25 }, { name: 'Mar', users: users.length })
      }
      setGraphs(prev => ({ ...prev, userGrowth: userGrowthData }))

      // 2. Donation Trends
      const donationMap = {}
      donations.forEach(d => {
        const date = new Date(d.createdAt || Date.now())
        const month = date.toLocaleString('default', { month: 'short' })
        donationMap[month] = (donationMap[month] || 0) + (d.amount || 0)
      })
      const donationData = Object.keys(donationMap).map(key => ({ name: key, amount: donationMap[key] }))
      if (donationData.length === 0) {
        // Default data if no donations
        donationData.push({ name: 'Jan', amount: 500 }, { name: 'Feb', amount: 1200 }, { name: 'Mar', amount: 800 })
      }
      setGraphs(prev => ({ ...prev, donationTrends: donationData }))

    } catch (error) {
      console.error('Dashboard Fetch Error:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (item) => {
    try {
      const endpoint = item.type === 'story' ? `/stories/${item._id}/status` : `/jobs/${item._id}/status`
      await api.put(endpoint, { status: 'approved' })
      toast.success(`${item.type === 'story' ? 'Story' : 'Job'} approved!`)
      fetchDashboardData() // Refresh
    } catch (error) {
      toast.error('Approval failed')
    }
  }

  const handleReject = async (item) => {
    try {
      const endpoint = item.type === 'story' ? `/stories/${item._id}/status` : `/jobs/${item._id}/status`
      await api.put(endpoint, { status: 'rejected' })
      toast.success(`${item.type === 'story' ? 'Story' : 'Job'} rejected`)
      fetchDashboardData() // Refresh
    } catch (error) {
      toast.error('Rejection failed')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(amount)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
    <motion.div
      variants={itemVariants}
      whileTap={{ scale: 0.98 }}
      className="h-full cursor-pointer"
      onClick={onClick}
    >
      <GlassCard className="relative overflow-hidden group h-full border-b-4 transition-all duration-300 hover:shadow-2xl"
        style={{ borderBottomColor: color.replace('bg-', '') }}>
        <div className={`absolute -right-4 -bottom-4 p-8 opacity-10 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 ${color}`}>
          <Icon size={80} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 dark:text-gray-400 font-semibold text-sm uppercase tracking-wider">{title}</h3>
            <div className={`p-2 rounded-lg ${color.replace('bg-', 'bg-').replace('500', '500/10')} ${color.replace('bg-', 'text-')}`}>
              <Icon size={18} />
            </div>
          </div>
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold mt-2 text-gray-800 dark:text-white"
          >
            {value}
          </motion.p>
          <div className={`mt-4 text-sm flex items-center font-medium ${color.replace('bg-', 'text-')}`}>
            <div className={`flex items-center px-2 py-0.5 rounded-full ${color.replace('bg-', 'bg-').replace('500', '500/10')} mr-2`}>
              <TrendingUp size={12} className="mr-1" />
              <span>+12.5%</span>
            </div>
            <span className="text-gray-400 font-normal italic">vs last month</span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8 pb-12"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Admin Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg font-medium flex items-center">
            <Activity size={18} className="mr-2 text-sky-500 animate-pulse" />
            Platform status and activity insights
          </p>
        </div>
        <div className="flex gap-3">
          <AnimatedButton
            onClick={fetchDashboardData}
            variant="outline"
            className="text-sm bg-white/50 dark:bg-white/5 hover:bg-sky-50 dark:hover:bg-sky-900/30 border-sky-200 dark:border-sky-800 shadow-sm"
          >
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Activity size={16} className="mr-2" />
            </motion.div>
            Refresh Analytics
          </AnimatedButton>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Alumni"
          value={stats.totalUsers}
          icon={Users}
          color="bg-sky-500"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Total Donations"
          value={formatCurrency(stats.totalDonations)}
          icon={DollarSign}
          color="bg-emerald-500"
          onClick={() => setShowDonationsModal(true)}
        />
        <StatCard
          title="Pending Stories"
          value={stats.pendingStories}
          icon={BookOpen}
          color="bg-indigo-500"
          onClick={() => navigate('/admin/content')}
        />
        <StatCard
          title="Pending Jobs"
          value={stats.pendingJobs}
          icon={Briefcase}
          color="bg-amber-500"
          onClick={() => navigate('/admin/jobs')}
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-8">
        <GlassCard className="hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <span className="w-1.5 h-6 bg-sky-500 rounded-full mr-3" />
              Alumni Growth Trend
            </h3>
            <select className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg text-xs px-2 py-1 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphs.userGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3" />
              Donation Insights
            </h3>
            <select className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg text-xs px-2 py-1 outline-none">
              <option>Monthly Revenue</option>
              <option>Goal Progress</option>
            </select>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphs.donationTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} animationDuration={2000}>
                  {graphs.donationTrends.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === graphs.donationTrends.length - 1 ? '#10b981' : '#10b981bb'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      {/* Recent Approvals */}
      <motion.div variants={itemVariants}>
        <GlassCard className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full mr-3" />
                Review Pipeline
              </h3>
              <p className="text-sm text-gray-500 mt-1 italic">Moderation queue for community content</p>
            </div>
            <div className="flex items-center bg-gray-50 dark:bg-gray-900/50 p-1 rounded-xl">
              <button className="px-4 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-gray-800 shadow-sm">All Items</button>
              <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700">Stories</button>
              <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700">Jobs</button>
            </div>
          </div>

          {approvals.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-20 text-gray-500"
            >
              <div className="relative w-20 h-20 mx-auto mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl"
                />
                <CheckCircle className="w-20 h-20 text-emerald-500/50 relative z-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">Everything is up to date!</h4>
              <p className="mt-2 font-medium">No new submissions require your attention today.</p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-bold text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                    <th className="pb-5 px-4 uppercase tracking-wider text-[11px]">Submission Detail</th>
                    <th className="pb-5 px-4 uppercase tracking-wider text-[11px]">Category</th>
                    <th className="pb-5 px-4 uppercase tracking-wider text-[11px]">Received On</th>
                    <th className="pb-5 px-4 text-right uppercase tracking-wider text-[11px]">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  <AnimatePresence mode='popLayout'>
                    {approvals.map((item, idx) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group hover:bg-sky-50/30 dark:hover:bg-sky-900/10 transition-colors cursor-default"
                      >
                        <td className="py-5 px-4">
                          <div className="flex items-center">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className={`p-2.5 rounded-xl mr-4 shadow-sm ${item.type === 'story'
                                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40'
                                : 'bg-amber-100 text-amber-600 dark:bg-amber-900/40'
                                }`}
                            >
                              {item.type === 'story' ? <BookOpen size={22} /> : <Briefcase size={22} />}
                            </motion.div>
                            <div>
                              <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-500 font-medium tracking-wide mt-0.5">{item.subtitle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest
                            ${item.type === 'story'
                              ? 'bg-indigo-100/50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                              : 'bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}
                          `}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-sm font-medium text-gray-500">
                          {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(item.createdAt))}
                        </td>
                        <td className="py-5 px-4 text-right">
                          <div className="flex justify-end space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.2, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleApprove(item)}
                              className="p-2 text-emerald-500 rounded-xl transition-all border border-emerald-100 dark:border-emerald-900/30"
                              title="Approve Content"
                            >
                              <CheckCircle size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.2, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleReject(item)}
                              className="p-2 text-rose-500 rounded-xl transition-all border border-rose-100 dark:border-rose-900/30"
                              title="Reject Content"
                            >
                              <XCircle size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Donations Detail Modal */}
      <AnimatePresence>
        {showDonationsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDonationsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass dark:glass-dark rounded-3xl p-8 max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-white/20"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-emerald-500 flex items-center">
                    <DollarSign className="mr-2" /> Donation Records
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Detailed transaction history</p>
                </div>
                <button
                  onClick={() => setShowDonationsModal(false)}
                  className="p-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 rounded-2xl transition-all"
                >
                  <XCircle size={28} />
                </button>
              </div>

              <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Filter by donor name, email or category..."
                  value={donationFilter}
                  onChange={(e) => setDonationFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl glass dark:glass-dark border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10">
                    <tr className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">
                      <th className="py-4 px-4">Donor</th>
                      <th className="py-4 px-4">Amount</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Transaction Date</th>
                      <th className="py-4 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {allDonations
                      .filter(d =>
                        (d.donorName || '').toLowerCase().includes(donationFilter.toLowerCase()) ||
                        (d.donorEmail || '').toLowerCase().includes(donationFilter.toLowerCase()) ||
                        (d.category || '').toLowerCase().includes(donationFilter.toLowerCase())
                      )
                      .map((d, i) => (
                        <motion.tr
                          key={d._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: Math.min(i * 0.05, 1) }}
                          className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="font-bold text-gray-800 dark:text-gray-200">{d.donorName}</div>
                            <div className="text-xs text-gray-500 font-medium">{d.donorEmail}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-emerald-600 dark:text-emerald-400 font-black">
                              {formatCurrency(d.amount)}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm font-bold text-gray-600 dark:text-gray-400">
                            {d.category}
                          </td>
                          <td className="py-4 px-4 text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon size={14} className="mr-2 opacity-50" />
                              {new Date(d.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
                              {d.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                  </tbody>
                </table>

                {allDonations.length === 0 && (
                  <div className="text-center py-20 text-gray-500">
                    <p className="text-lg font-bold">No donation data available.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <AnimatedButton onClick={() => setShowDonationsModal(false)} className="px-8 font-bold">
                  Close Records
                </AnimatedButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AdminDashboard
