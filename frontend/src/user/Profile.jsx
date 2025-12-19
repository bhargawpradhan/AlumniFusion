import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Linkedin, Award, Camera, Save, Edit2, Loader2 } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'
import toast from 'react-hot-toast'
import api from '../utils/api'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    department: '',
    batch: '',
    linkedin: '',
    company: '',
    position: '',
    about: '',
    skills: [],
    achievements: [],
    profilePhoto: null,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        toast.error('User not found. Please log in again.')
        return
      }
      const user = JSON.parse(userStr)
      const userId = user.id || user._id

      const { data } = await api.get(`/users/${userId}`)
      setProfileData({
        ...data,
        skills: data.skills || [],
        achievements: data.achievements || [],
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData({ ...profileData, [name]: value })
  }

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, e.target.value],
      })
      e.target.value = ''
    }
  }

  const handleSkillRemove = (skill) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((s) => s !== skill),
    })
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileData({ ...profileData, profilePhoto: file })
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const userStr = localStorage.getItem('user')
      const user = JSON.parse(userStr)
      const userId = user.id || user._id

      // In a real app, you might use FormData if uploading photos
      // For now, let's send JSON
      await api.put(`/users/${userId}`, profileData)

      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-sky-600" size={48} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-4xl font-bold text-gradient">My Profile</h1>
        {!isEditing ? (
          <AnimatedButton onClick={() => setIsEditing(true)}>
            <Edit2 className="inline mr-2" size={20} />
            Edit Profile
          </AnimatedButton>
        ) : (
          <AnimatedButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="inline mr-2 animate-spin" size={20} />
            ) : (
              <Save className="inline mr-2" size={20} />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </AnimatedButton>
        )}
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Photo & Basic Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <GlassCard>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full glass dark:glass-dark flex items-center justify-center overflow-hidden mx-auto">
                  {profileData.profilePhoto ? (
                    <img
                      src={URL.createObjectURL(profileData.profilePhoto)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-gray-400" size={64} />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-sky-600 text-white rounded-full cursor-pointer hover:bg-sky-700">
                    <Camera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{profileData.position}</p>
              <p className="text-gray-600 dark:text-gray-400">{profileData.company}</p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Main Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2"
        >
          <GlassCard>
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                  <Mail size={16} className="mr-2" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                  <Phone size={16} className="mr-2" />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profileData.location}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                    <GraduationCap size={16} className="mr-2" />
                    Department
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={profileData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.department}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Batch
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="batch"
                      value={profileData.batch}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{profileData.batch}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
                  <Linkedin size={16} className="mr-2" />
                  LinkedIn
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="linkedin"
                    value={profileData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
                  />
                ) : (
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    {profileData.linkedin}
                  </a>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  About Me
                </label>
                {isEditing ? (
                  <textarea
                    name="about"
                    value={profileData.about}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profileData.about}</p>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Skills */}
          <GlassCard className="mt-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Skills</h3>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  onKeyPress={handleSkillAdd}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white mb-3"
                  placeholder="Type a skill and press Enter"
                />
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-full text-sm flex items-center"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleSkillRemove(skill)}
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Achievements */}
          <GlassCard className="mt-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
              <Award className="mr-2" size={24} />
              Achievements
            </h3>
            {isEditing ? (
              <div>
                <textarea
                  name="achievements"
                  value={profileData.achievements.join('\n')}
                  onChange={(e) => setProfileData({ ...profileData, achievements: e.target.value.split('\n') })}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
                  placeholder="Enter achievements, one per line"
                />
              </div>
            ) : (
              <ul className="space-y-2">
                {profileData.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <Award size={16} className="mr-2 mt-1 text-sky-600 dark:text-sky-400" />
                    <span className="text-gray-900 dark:text-white">{achievement}</span>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile

