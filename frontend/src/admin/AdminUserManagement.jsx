import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, UserCheck, UserX, Eye, Ban, CheckCircle, Trash2, Loader2, RefreshCw } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'active', 'blocked', 'pending'

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get('/users')
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlockUser = async (user) => {
    const action = user.isActive ? 'block' : 'unblock'
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        const { data } = await api.put(`/users/${user._id}/status`, {
          isActive: !user.isActive
        })
        setUsers(users.map(u => u._id === user._id ? data : u))
        toast.success(`User ${user.isActive ? 'blocked' : 'unblocked'} successfully`)
      } catch (error) {
        toast.error(`Failed to ${action} user`)
      }
    }
  }

  const handleApproveUser = async (user) => {
    if (window.confirm('Are you sure you want to approve this user?')) {
      try {
        const { data } = await api.put(`/users/${user._id}/status`, {
          isVerified: true
        })
        setUsers(users.map(u => u._id === user._id ? data : u))
        toast.success('User approved successfully')
      } catch (error) {
        toast.error('Failed to approve user')
      }
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/users/${id}`)
        setUsers(users.filter(u => u._id !== id))
        toast.success('User deleted successfully')
      } catch (error) {
        toast.error('Failed to delete user')
      }
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch) return false

    if (filter === 'all') return true
    if (filter === 'active') return user.isActive && user.isVerified
    if (filter === 'blocked') return !user.isActive
    if (filter === 'pending') return !user.isVerified
    return true
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gradient">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all registered alumni</p>
        </div>
        <AnimatedButton onClick={fetchUsers} variant="outline" className="text-sm">
          <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh List
        </AnimatedButton>
      </motion.div>

      {/* Search and Filters */}
      <GlassCard>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex space-x-2 w-full md:w-auto overflow-x-auto">
            {['all', 'active', 'pending', 'blocked'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition-colors ${filter === f
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'glass dark:glass-dark text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Users Table */}
      <GlassCard>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Name</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Email</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Branch/Batch</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Approval</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold uppercase shrink-0">
                            {user.firstName ? user.firstName[0] : '?'}
                          </div>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {user.firstName} {user.lastName}
                            {user.role === 'admin' && <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Admin</span>}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email || 'N/A'}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        <div className="flex flex-col">
                          <span>{user.department || user.branch}</span>
                          <span className="text-xs opacity-70">{user.batch}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${!user.isActive
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-green-100 text-green-700 border border-green-200'
                          }`}>
                          {user.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.isVerified ? (
                          <span className="text-green-600 flex items-center text-sm"><CheckCircle size={14} className="mr-1" /> Verified</span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs border border-yellow-200">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>

                          {!user.isVerified && (
                            <button
                              onClick={() => handleApproveUser(user)}
                              className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg text-green-600 dark:text-green-400 transition-colors"
                              title="Approve User"
                            >
                              <UserCheck size={18} />
                            </button>
                          )}

                          <button
                            onClick={() => handleBlockUser(user)}
                            className={`p-2 rounded-lg transition-colors ${user.isActive
                                ? 'hover:bg-orange-100 dark:hover:bg-orange-900 text-orange-600 dark:text-orange-400'
                                : 'hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-400'
                              }`}
                            title={user.isActive ? "Block User" : "Unblock User"}
                          >
                            {user.isActive ? <Ban size={18} /> : <CheckCircle size={18} />}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-600 dark:text-red-400 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg mb-2">No users found matching your criteria.</p>
                <button onClick={() => { setFilter('all'); setSearchTerm('') }} className="text-primary-500 hover:underline">Clear Filters</button>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      {/* User Detail Modal */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass dark:glass-dark rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
              User Details
              {selectedUser.isVerified && <CheckCircle className="ml-2 text-green-500" size={24} />}
            </h2>

            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold uppercase shadow-lg">
                {selectedUser.firstName ? selectedUser.firstName[0] : '?'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
                <p className="text-sm mt-1 uppercase tracking-wide text-primary-600 font-semibold">{selectedUser.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Department</label>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedUser.department || selectedUser.branch || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Batch</label>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedUser.batch || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedUser.location || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">LinkedIn</label>
                  <p className="text-gray-900 dark:text-white font-medium truncate">{selectedUser.linkedin || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Company</label>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedUser.company || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Position</label>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedUser.position || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Status</label>
                <div className="flex space-x-3 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedUser.isActive ? 'Active' : 'Blocked'}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedUser.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {selectedUser.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <AnimatedButton variant="outline" onClick={() => setSelectedUser(null)} className="w-full">
                Close
              </AnimatedButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminUserManagement
