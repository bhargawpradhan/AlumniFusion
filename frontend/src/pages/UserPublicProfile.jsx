import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Linkedin, Award, QrCode, ExternalLink, Loader2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import GlassCard from '../components/GlassCard'
import api from '../utils/api'
import toast from 'react-hot-toast'

const UserPublicProfile = () => {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [id])

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/users/${id}`)
      setProfile(data)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-sky-500" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-500">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 relative overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-sky-500/10"
            style={{
              width: Math.random() * 50 + 20,
              height: Math.random() * 50 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center overflow-hidden shadow-lg relative">
                {/* Rotating ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                {profile.photo ? (
                  <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover relative z-10" />
                ) : (
                  <span className="text-white text-4xl font-bold relative z-10">{profile.name ? profile.name[0] : '?'}</span>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">{profile.name}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-1">{profile.position}</p>
                <p className="text-lg text-gray-600 dark:text-gray-400">{profile.company}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  {profile.skills && profile.skills.slice(0, 5).map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
                <QRCodeSVG value={`${window.location.origin}/profile/${id}`} size={120} />
                <p className="text-xs text-center mt-2 text-gray-600 dark:text-gray-400">Share Profile</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            {/* About */}
            <GlassCard>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profile.about || 'Alumni of Government Engineering College.'}
              </p>
            </GlassCard>

            {/* Education */}
            <GlassCard>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <GraduationCap className="mr-2 text-sky-500" size={24} />
                Education
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{profile.branch}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Government Engineering College</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Batch {profile.batch}</p>
                </div>
              </div>
            </GlassCard>

            {/* Experience */}
            <GlassCard>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <Briefcase className="mr-2 text-sky-500" size={24} />
                Experience
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{profile.position}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{profile.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Current</p>
                </div>
              </div>
            </GlassCard>

            {/* Achievements */}
            {profile.achievements && (
              <GlassCard>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                  <Award className="mr-2 text-sky-500" size={24} />
                  Achievements
                </h2>
                <ul className="space-y-2">
                  {profile.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start">
                      <Award size={16} className="mr-2 mt-1 text-sky-600 dark:text-sky-400" />
                      <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Contact Card */}
            <GlassCard>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Contact</h3>
              <div className="space-y-3">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    <Mail size={20} className="text-sky-500" />
                    <span className="break-all">{profile.email}</span>
                  </a>
                )}
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    <Phone size={20} className="text-sky-500" />
                    <span>{profile.phone}</span>
                  </a>
                )}
                <div className="flex items-start space-x-3 text-gray-700 dark:text-gray-300">
                  <MapPin size={20} className="mt-1 text-sky-500" />
                  <span>{profile.location}</span>
                </div>
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    <Linkedin size={20} />
                    <span>LinkedIn Profile</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </GlassCard>

            {/* Skills */}
            <GlassCard>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default UserPublicProfile

