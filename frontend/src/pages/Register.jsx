
// import { useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useNavigate, Link } from 'react-router-dom'
// import { User, Mail, Lock, Building, Briefcase, GraduationCap, Upload, Linkedin, Award, Trophy, ArrowRight, ArrowLeft, Loader2, Camera, MapPin } from 'lucide-react'
// import api from '../utils/api'
// import AnimatedButton from '../components/AnimatedButton'
// import GlassCard from '../components/GlassCard'
// import toast from 'react-hot-toast'

// const Register = () => {
//   const [step, setStep] = useState(1)
//   const [isAssuming, setIsAssuming] = useState(false) // loading state
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     department: '',
//     batch: '',
//     linkedin: '',
//     about: '',
//     achievements: '',
//     skills: [],
//     profilePhoto: null,
//     otp: '',
//   })
//   const navigate = useNavigate()

//   const departments = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT']
//   const batches = Array.from({ length: 30 }, (_, i) => 1995 + i)

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData({ ...formData, [name]: value })
//   }

//   const handleSkillAdd = (e) => {
//     if (e.key === 'Enter' && e.target.value) {
//       setFormData({
//         ...formData,
//         skills: [...formData.skills, e.target.value],
//       })
//       e.target.value = ''
//     }
//   }

//   const handleSkillRemove = (skill) => {
//     setFormData({
//       ...formData,
//       skills: formData.skills.filter((s) => s !== skill),
//     })
//   }

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setFormData({ ...formData, profilePhoto: file })
//     }
//   }

//   const handleNext = () => {
//     if (step === 1) {
//       if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
//         toast.error('Please fill all required fields')
//         return
//       }
//       if (formData.password !== formData.confirmPassword) {
//         toast.error('Passwords do not match')
//         return
//       }
//     }
//     if (step < 3) setStep(step + 1)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsAssuming(true)

//     // Basic validation
//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords don't match!")
//       setIsAssuming(false)
//       return
//     }

//     try {
//       // Correct payload for Backend Schema
//       const payload = {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         password: formData.password,
//         role: 'user', // Default to user
//         department: formData.department,
//         batch: formData.batch,
//         location: formData.location,
//         linkedin: formData.linkedin,
//         skills: formData.skills,
//         // Convert achievements string to array if present
//         achievements: formData.achievements ? formData.achievements.split('\n').filter(Boolean) : [],
//         about: formData.about
//       }

//       const registerResponse = await api.post('/auth/register', payload)

//       // Automatically log in after successful registration
//       try {
//         const loginResponse = await api.post('/auth/login', {
//           email: formData.email,
//           password: formData.password
//         })

//         // Save token and user info
//         localStorage.setItem('token', loginResponse.data.token)
//         localStorage.setItem('user', JSON.stringify(loginResponse.data.user || {}))

//         toast.success('Registration & Login successful!')
//         navigate('/user/dashboard')
//       } catch (loginError) {
//         // If auto-login fails, redirect to login page
//         console.error('Auto-login after registration failed:', loginError)
//         toast.success('Registration successful! Please login with your credentials.')
//         navigate('/login')
//       }

//     } catch (error) {
//       console.error('Registration Error:', error)
//       const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.'
//       toast.error(errorMsg)
//     } finally {
//       setIsAssuming(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden">
//       {/* Background Decor */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
//       </div>

//       <div className="w-full max-w-2xl relative z-10">
//         <GlassCard>
//           <div className="flex items-center justify-center mb-6">
//             <GraduationCap className="w-12 h-12 text-sky-500" />
//           </div>
//           <h2 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">Join AlumniFusion</h2>
//           <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
//             Step {step} of 3
//           </p>

//           {/* Progress Bar */}
//           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8 overflow-hidden">
//             <motion.div
//               className="bg-gradient-to-r from-sky-500 to-cyan-500 h-2 rounded-full"
//               initial={{ width: 0 }}
//               animate={{ width: `${(step / 3) * 100}%` }}
//               transition={{ duration: 0.3 }}
//             />
//           </div>

//           <form onSubmit={handleSubmit}>
//             <AnimatePresence mode="wait">
//               {step === 1 && (
//                 <motion.div
//                   key="step1"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   className="space-y-6"
//                 >
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                         First Name *
//                       </label>
//                       <div className="relative">
//                         <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                         <input
//                           type="text"
//                           name="firstName"
//                           value={formData.firstName}
//                           onChange={handleInputChange}
//                           className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
//                           required
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                         Last Name *
//                       </label>
//                       <div className="relative">
//                         <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                         <input
//                           type="text"
//                           name="lastName"
//                           value={formData.lastName}
//                           onChange={handleInputChange}
//                           className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                       Email *
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                         Password *
//                       </label>
//                       <div className="relative">
//                         <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                         <input
//                           type="password"
//                           name="password"
//                           value={formData.password}
//                           onChange={handleInputChange}
//                           className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
//                           required
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                         Confirm Password *
//                       </label>
//                       <div className="relative">
//                         <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                         <input
//                           type="password"
//                           name="confirmPassword"
//                           value={formData.confirmPassword}
//                           onChange={handleInputChange}
//                           className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex justify-end">
//                     <AnimatedButton type="button" onClick={handleNext}>
//                       Next <ArrowRight className="inline ml-2" size={20} />
//                     </AnimatedButton>
//                   </div>
//                 </motion.div>
//               )}

//               {step === 2 && (
//                 <motion.div
//                   key="step2"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   className="space-y-6"
//                 >
//                   <div>
//                     <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                       Profile Photo
//                     </label>
//                     <div className="flex items-center space-x-4">
//                       <div className="w-24 h-24 rounded-full glass dark:glass-dark flex items-center justify-center overflow-hidden">
//                         {formData.profilePhoto ? (
//                           <img
//                             src={URL.createObjectURL(formData.profilePhoto)}
//                             alt="Profile"
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <Camera className="text-gray-400" size={32} />
//                         )}
//                       </div>
//                       <label className="px-4 py-2 bg-sky-500 text-white rounded-lg cursor-pointer hover:bg-sky-600 transition-colors">
//                         Upload Photo
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handlePhotoUpload}
//                           className="hidden"
//                         />
//                       </label>
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                         Department *
//                       </label>
//                       <div className="relative">
//                         <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                         <select
//                           name="department"
//                           value={formData.department}
//                           onChange={handleInputChange}
//                           className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
//                           required
//                         >
//                           <option value="">Select Department</option>
//                           {departments.map((dept) => (
//                             <option key={dept} value={dept}>{dept}</option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                         Batch *
//                       </label>
//                       <div className="relative">
//                         <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                         <select
//                           name="batch"
//                           value={formData.batch}
//                           onChange={handleInputChange}
//                           className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
//                           required
//                         >
//                           <option value="">Select Batch</option>
//                           {batches.map((batch) => (
//                             <option key={batch} value={batch}>{batch}</option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                       LinkedIn Profile
//                     </label>
//                     <div className="relative">
//                       <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                       <input
//                         type="url"
//                         name="linkedin"
//                         value={formData.linkedin}
//                         onChange={handleInputChange}
//                         className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white transition-all"
//                         placeholder="https://linkedin.com/in/yourprofile"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                       Location
//                     </label>
//                     <div className="relative">
//                       <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                       <input
//                         type="text"
//                         name="location"
//                         value={formData.location || ''}
//                         onChange={handleInputChange}
//                         className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
//                         placeholder="City, Country"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                       Skills
//                     </label>
//                     <input
//                       type="text"
//                       onKeyPress={handleSkillAdd}
//                       className="w-full px-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
//                       placeholder="Type a skill and press Enter"
//                     />
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {formData.skills.map((skill, index) => (
//                         <span
//                           key={index}
//                           className="px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-full text-sm flex items-center"
//                         >
//                           {skill}
//                           <button
//                             type="button"
//                             onClick={() => handleSkillRemove(skill)}
//                             className="ml-2 hover:text-red-500"
//                           >
//                             ×
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="flex justify-between">
//                     <AnimatedButton type="button" variant="outline" onClick={() => setStep(step - 1)}>
//                       <ArrowLeft className="inline mr-2" size={20} /> Previous
//                     </AnimatedButton>
//                     <AnimatedButton type="button" onClick={handleNext}>
//                       Next <ArrowRight className="inline ml-2" size={20} />
//                     </AnimatedButton>
//                   </div>
//                 </motion.div>
//               )}

//               {step === 3 && (
//                 <motion.div
//                   key="step3"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   className="space-y-6"
//                 >
//                   <div>
//                     <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                       About Me
//                     </label>
//                     <textarea
//                       name="about"
//                       value={formData.about}
//                       onChange={handleInputChange}
//                       rows="4"
//                       className="w-full px-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
//                       placeholder="Tell us about yourself..."
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                       Achievements
//                     </label>
//                     <div className="relative">
//                       <Award className="absolute left-3 top-3 text-gray-400" size={20} />
//                       <textarea
//                         name="achievements"
//                         value={formData.achievements}
//                         onChange={handleInputChange}
//                         rows="4"
//                         className="w-full pl-10 pr-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
//                         placeholder="List your achievements..."
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
//                       OTP Verification
//                     </label>
//                     <input
//                       type="text"
//                       name="otp"
//                       value={formData.otp}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 rounded-lg glass dark:glass-dark border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 dark:text-white"
//                       placeholder="Enter OTP sent to your email"
//                       maxLength="6"
//                     />
//                     <button
//                       type="button"
//                       className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
//                     >
//                       Resend OTP
//                     </button>
//                   </div>

//                   <div className="flex justify-between">
//                     <AnimatedButton type="button" variant="outline" onClick={() => setStep(step - 1)}>
//                       <ArrowLeft className="inline mr-2" size={20} /> Previous
//                     </AnimatedButton>
//                     <AnimatedButton type="submit">
//                       Complete Registration
//                     </AnimatedButton>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-gray-600 dark:text-gray-400">
//               Already have an account?{' '}
//               <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
//                 Login here
//               </Link>
//             </p>
//           </div>
//         </GlassCard>
//       </div>
//     </div>
//   )
// }

// export default Register

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Building, Briefcase, GraduationCap, Upload, Linkedin, Award, Trophy, ArrowRight, ArrowLeft, Loader2, Camera, MapPin } from 'lucide-react'
import api from '../utils/api'
import AnimatedButton from '../components/AnimatedButton'
import GlassCard from '../components/GlassCard'
import toast from 'react-hot-toast'

const Register = () => {
  const [step, setStep] = useState(1)
  const [isAssuming, setIsAssuming] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    batch: '',
    linkedin: '',
    location: '',
    about: '',
    achievements: '',
    skills: [],
    profilePhoto: null,
  })

  const navigate = useNavigate()
  const departments = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT']
  const batches = Array.from({ length: 30 }, (_, i) => 1995 + i)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // ================================
  // Step-wise Validation (REQUIRED)
  // ================================
  const validateStep = () => {
    // ---------- STEP 1 ----------
    if (step === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        toast.error('All fields are required')
        return false
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return false
      }
    }

    // ---------- STEP 2 ----------
    if (step === 2) {
      if (
        !formData.profilePhoto ||
        !formData.department ||
        !formData.batch ||
        !formData.location
      ) {
        toast.error('Please complete all profile details')
        return false
      }
    }

    // ---------- STEP 3 ----------
    if (step === 3) {
      if (
        !formData.about ||
        !formData.achievements
      ) {
        toast.error('All fields are required')
        return false
      }
    }

    return true
  }

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!e.target.value.trim()) return

      setFormData({
        ...formData,
        skills: [...formData.skills, e.target.value.trim()],
      })
      e.target.value = ''
    }
  }

  const handleSkillRemove = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    })
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) {
      toast.error('Profile photo is required')
      return
    }
    setFormData({ ...formData, profilePhoto: file })
  }

  const handleNext = () => {
    if (!validateStep()) return
    if (step < 3) setStep(step + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // FINAL SAFETY CHECK
    if (!validateStep()) return

    setIsAssuming(true)

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: 'user',
        department: formData.department,
        batch: formData.batch,
        location: formData.location,
        linkedin: formData.linkedin,
        skills: formData.skills,
        achievements: formData.achievements ? formData.achievements.split('\n').filter(Boolean) : [],
        about: formData.about
      }

      const registerResponse = await api.post('/auth/register', payload)

      // Show success message and redirect to login page
      toast.success('Registration successful! Please login with your credentials.')
      navigate('/login')

    } catch (error) {
      console.error('Registration Error:', error)
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(errorMsg)
    } finally {
      setIsAssuming(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-300 dark:bg-sky-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-300 dark:bg-cyan-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="p-8 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border border-sky-200/50 dark:border-sky-800/50">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/50">
                <GraduationCap className="text-white" size={32} />
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent">
              Join AlumniFusion
            </h2>
            <p className="mt-2 text-sky-700 dark:text-sky-300 font-medium">
              Step {step} of 3
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 mx-1 rounded-full transition-all ${s <= step
                      ? 'bg-gradient-to-r from-sky-500 to-blue-500 shadow-lg shadow-sky-500/50'
                      : 'bg-sky-200 dark:bg-sky-900'
                    }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-sky-700 dark:text-sky-300">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-sky-400" size={20} />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg bg-sky-50/50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white placeholder-sky-400 dark:placeholder-sky-600"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-sky-700 dark:text-sky-300">
                        Last Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-sky-400" size={20} />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg bg-sky-50/50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white placeholder-sky-400 dark:placeholder-sky-600"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-sky-700 dark:text-sky-300">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-sky-400" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-sky-50/50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white placeholder-sky-400 dark:placeholder-sky-600"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-sky-700 dark:text-sky-300">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-sky-400" size={20} />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-sky-50/50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white placeholder-sky-400 dark:placeholder-sky-600"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-sky-700 dark:text-sky-300">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-sky-400" size={20} />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-sky-50/50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white placeholder-sky-400 dark:placeholder-sky-600"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-sky-500/50 hover:shadow-xl hover:shadow-sky-500/60"
                  >
                    Next
                    <ArrowRight className="inline ml-2" size={20} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2 text-sky-700 dark:text-sky-300">
                      Profile Photo
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 rounded-full bg-sky-100 dark:bg-sky-900 border-4 border-sky-200 dark:border-sky-800 flex items-center justify-center overflow-hidden shadow-lg">
                        {formData.profilePhoto ? (
                          <img
                            src={URL.createObjectURL(formData.profilePhoto)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="text-sky-400" size={32} />
                        )}
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <div className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white rounded-lg transition-all shadow-lg shadow-sky-500/50">
                          <Upload className="inline mr-2" size={16} />
                          Upload Photo
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-sky-700 dark:text-sky-300">
                      Department *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 text-sky-400" size={20} />
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-sky-50/50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-sky-700 dark:text-sky-300">
                      Batch *
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 text-sky-400" size={20} />
                      <select
                        name="batch"
                        value={formData.batch}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-sky-50/50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white"
                      >
                        <option value="">Select Batch</option>
                        {batches.map((batch) => (
                          <option key={batch} value={batch}>
                            {batch}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-sky-700 dark:text-sky-300">
                      LinkedIn Profile
                    </label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 text-sky-400" size={20} />
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-sky-50/50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white placeholder-sky-400 dark:placeholder-sky-600"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-sky-700 dark:text-sky-300">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-sky-400" size={20} />
                      <input
                        required
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-sky-50/50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white placeholder-sky-400 dark:placeholder-sky-600"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-sky-700 dark:text-sky-300">
                      Skills (Optional - Press Enter to add)
                    </label>
                    <input
                      type="text"
                      onKeyDown={handleSkillAdd}
                      className="w-full px-4 py-3 rounded-lg bg-sky-50/50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white placeholder-sky-400 dark:placeholder-sky-600"
                      placeholder="Type a skill and press Enter"
                    />
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900 dark:to-blue-900 text-sky-800 dark:text-sky-200 rounded-full text-sm border border-sky-200 dark:border-sky-700 shadow-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleSkillRemove(skill)}
                              className="ml-2 hover:text-red-500 transition-colors"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-3 bg-sky-100 hover:bg-sky-200 dark:bg-sky-900 dark:hover:bg-sky-800 text-sky-700 dark:text-sky-300 rounded-lg font-medium transition-all border border-sky-200 dark:border-sky-700"
                    >
                      <ArrowLeft className="inline mr-2" size={20} />
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-sky-500/50 hover:shadow-xl hover:shadow-sky-500/60"
                    >
                      Next
                      <ArrowRight className="inline ml-2" size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2 text-sky-700 dark:text-sky-300">
                      About Me
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-sky-400" size={20} />
                      <textarea
                        required
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-sky-50/50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white placeholder-sky-400 dark:placeholder-sky-600"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-sky-700 dark:text-sky-300">
                      Achievements
                    </label>
                    <div className="relative">
                      <Award className="absolute left-3 top-3 text-sky-400" size={20} />
                      <textarea
                        required
                        name="achievements"
                        value={formData.achievements}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-sky-50/50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-900 dark:text-white placeholder-sky-400 dark:placeholder-sky-600"
                        placeholder="List your achievements..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-3 bg-sky-100 hover:bg-sky-200 dark:bg-sky-900 dark:hover:bg-sky-800 text-sky-700 dark:text-sky-300 rounded-lg font-medium transition-all border border-sky-200 dark:border-sky-700"
                    >
                      <ArrowLeft className="inline mr-2" size={20} />
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={isAssuming}
                      className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 disabled:from-sky-300 disabled:to-blue-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-lg shadow-sky-500/50 hover:shadow-xl hover:shadow-sky-500/60"
                    >
                      {isAssuming ? (
                        <>
                          <Loader2 className="inline mr-2 animate-spin" size={20} />
                          Registering...
                        </>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sky-700 dark:text-sky-300">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register