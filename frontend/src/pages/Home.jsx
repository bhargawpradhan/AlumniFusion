// import { motion } from 'framer-motion'
// import { Link } from 'react-router-dom'
// import { Users, Heart, Briefcase, Calendar, Network, BookOpen, Trophy, UserPlus, BookOpenText } from 'lucide-react'
// import Lottie from 'lottie-react'
// import heroAnimation from '../animations/hero.json'
// import AnimatedButton from '../components/AnimatedButton'
// import GlassCard from '../components/GlassCard'
// import SectionHeader from '../components/SectionHeader'
// import Chatbot from '../components/Chatbot'

// const Home = () => {
//   const stats = [
//     { icon: Users, value: '10,000+', label: 'Alumni' },
//     { icon: Heart, value: '₹50L+', label: 'Donations' },
//     { icon: Briefcase, value: '500+', label: 'Jobs' },
//     { icon: Calendar, value: '100+', label: 'Events' },
//   ]

//   const features = [
//     {
//       icon: Network,
//       title: 'Networking Hub',
//       description: 'Connect with alumni worldwide and build professional relationships.',
//       link: '/networking',
//       color: 'from-sky-400 to-cyan-500',
//     },
//     {
//       icon: Heart,
//       title: 'Donation Portal',
//       description: 'Support your alma mater through various donation categories.',
//       link: '/donate',
//       color: 'from-pink-400 to-rose-500',
//     },
//     {
//       icon: Briefcase,
//       title: 'Job Portal',
//       description: 'Find opportunities or post jobs for fellow alumni.',
//       link: '/jobs',
//       color: 'from-emerald-400 to-teal-500',
//     },
//     {
//       icon: Users,
//       title: 'Alumni Directory',
//       description: 'Search and connect with alumni by batch, branch, or location.',
//       link: '/directory',
//       color: 'from-blue-500 to-indigo-500',
//     },
//     {
//       icon: Calendar,
//       title: 'Events & Reunions',
//       description: 'Stay updated with upcoming events and reunions.',
//       link: '/events',
//       color: 'from-amber-400 to-orange-500',
//     },
//     {
//       icon: Trophy,
//       title: 'Success Stories',
//       description: 'Read inspiring stories from our accomplished alumni.',
//       link: '/success-stories',
//       color: 'from-yellow-400 to-amber-500',
//     },
//   ]

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="container mx-auto px-4 py-20">
//         <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
//           <div className="md:w-1/2">
//             <motion.h1
//               className="text-5xl md:text-6xl font-bold mb-6"
//               animate={{
//                 backgroundPosition: ['0%', '100%', '0%'],
//               }}
//               transition={{
//                 duration: 5,
//                 repeat: Infinity,
//                 ease: 'linear',
//               }}
//             >
//               Welcome to{' '}
//               <span className="text-gradient">AlumniFusion</span>
//             </motion.h1>
//             <motion.p
//               className="text-xl text-gray-600 dark:text-gray-400 mb-8"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3, duration: 0.6 }}
//             >
//               Connecting Government Engineering College alumni worldwide. Build your network, share opportunities, and give back to your alma mater.
//             </motion.p>
//             <motion.div
//               className="flex flex-wrap gap-4"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5, duration: 0.6 }}
//             >
//               <Link to="/register">
//                 <AnimatedButton>Register Now</AnimatedButton>
//               </Link>
//               <Link to="/directory">
//                 <AnimatedButton variant="outline">Find Alumni</AnimatedButton>
//               </Link>
//               <Link to="/donate">
//                 <AnimatedButton variant="secondary">Donate</AnimatedButton>
//               </Link>
//             </motion.div>
//           </div>
//           <div className="md:w-1/2 mt-8 md:mt-0">
//             <div className="relative">
//               <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 blur-xl"></div>
//               <img 
//                 src="/images/home.png" 
//                 alt="Alumni Network" 
//                 className="relative w-full h-auto rounded-xl shadow-2xl"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* AI Chatbot */}
//       <Chatbot />

//       {/* Animated Images Section */}
//       <section className="container mx-auto px-4 py-12">
//         <SectionHeader
//           title="Connect & Grow"
//           subtitle="Join thousands of alumni building their careers and networks"
//         />
//         <div className="grid md:grid-cols-3 gap-8 mb-12">
//           {/* Connecting People */}
//           <motion.div
//             initial={{ opacity: 0, y: 50, rotateY: -15 }}
//             whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8, type: 'spring' }}
//             whileHover={{ scale: 1.05, rotateY: 5 }}
//             className="relative"
//           >
//             <GlassCard className="text-center overflow-hidden">
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-sky-400/20 via-cyan-400/20 to-blue-400/20"
//                 animate={{
//                   x: ['-100%', '100%'],
//                 }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   ease: 'linear',
//                 }}
//               />
//               <motion.div
//                 animate={{
//                   y: [0, -15, 0],
//                   rotate: [0, 5, -5, 0],
//                 }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   ease: 'easeInOut',
//                 }}
//                 className="relative z-10"
//               >
//                 <div className="w-32 h-32 mx-auto mb-4 relative">
//                   <motion.div
//                     className="absolute inset-0 bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full"
//                     animate={{
//                       scale: [1, 1.2, 1],
//                       opacity: [0.5, 0.8, 0.5],
//                     }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                     }}
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <UserPlus className="w-16 h-16 text-white" />
//                   </div>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connect with People</h3>
//                 <p className="text-gray-600 dark:text-gray-400">Build meaningful professional relationships</p>
//               </motion.div>
//             </GlassCard>
//           </motion.div>

//           {/* Jobs */}
//           <motion.div
//             initial={{ opacity: 0, y: 50, rotateY: -15 }}
//             whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8, type: 'spring', delay: 0.2 }}
//             whileHover={{ scale: 1.05, rotateY: 5 }}
//             className="relative"
//           >
//             <GlassCard className="text-center overflow-hidden">
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20"
//                 animate={{
//                   x: ['-100%', '100%'],
//                 }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   ease: 'linear',
//                   delay: 0.5,
//                 }}
//               />
//               <motion.div
//                 animate={{
//                   y: [0, -15, 0],
//                   rotate: [0, -5, 5, 0],
//                 }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   ease: 'easeInOut',
//                   delay: 0.3,
//                 }}
//                 className="relative z-10"
//               >
//                 <div className="w-32 h-32 mx-auto mb-4 relative">
//                   <motion.div
//                     className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
//                     animate={{
//                       scale: [1, 1.2, 1],
//                       opacity: [0.5, 0.8, 0.5],
//                     }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       delay: 0.5,
//                     }}
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <Briefcase className="w-16 h-16 text-white" />
//                   </div>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Find Jobs</h3>
//                 <p className="text-gray-600 dark:text-gray-400">Discover opportunities from top companies</p>
//               </motion.div>
//             </GlassCard>
//           </motion.div>

//           {/* Success Stories */}
//           <motion.div
//             initial={{ opacity: 0, y: 50, rotateY: -15 }}
//             whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8, type: 'spring', delay: 0.4 }}
//             whileHover={{ scale: 1.05, rotateY: 5 }}
//             className="relative"
//           >
//             <GlassCard className="text-center overflow-hidden">
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-orange-400/20"
//                 animate={{
//                   x: ['-100%', '100%'],
//                 }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   ease: 'linear',
//                   delay: 1,
//                 }}
//               />
//               <motion.div
//                 animate={{
//                   y: [0, -15, 0],
//                   rotate: [0, 5, -5, 0],
//                 }}
//                 transition={{
//                   duration: 3,
//                   repeat: Infinity,
//                   ease: 'easeInOut',
//                   delay: 0.6,
//                 }}
//                 className="relative z-10"
//               >
//                 <div className="w-32 h-32 mx-auto mb-4 relative">
//                   <motion.div
//                     className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
//                     animate={{
//                       scale: [1, 1.2, 1],
//                       opacity: [0.5, 0.8, 0.5],
//                     }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       delay: 1,
//                     }}
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <BookOpenText className="w-16 h-16 text-white" />
//                   </div>
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Success Stories</h3>
//                 <p className="text-gray-600 dark:text-gray-400">Get inspired by alumni achievements</p>
//               </motion.div>
//             </GlassCard>
//           </motion.div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {stats.map((stat, index) => {
//             const Icon = stat.icon
//             return (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 30, scale: 0.8 }}
//                 whileInView={{ opacity: 1, y: 0, scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ 
//                   delay: index * 0.15,
//                   type: 'spring',
//                   stiffness: 100,
//                   damping: 15
//                 }}
//                 whileHover={{ 
//                   scale: 1.05, 
//                   y: -5,
//                   rotate: [0, -2, 2, 0]
//                 }}
//               >
//                 <GlassCard className="text-center relative overflow-hidden">
//                   <motion.div
//                     className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-cyan-400/10"
//                     animate={{
//                       x: ['-100%', '100%'],
//                     }}
//                     transition={{
//                       duration: 3,
//                       repeat: Infinity,
//                       delay: index * 0.3,
//                     }}
//                   />
//                   <motion.div
//                     animate={{
//                       rotate: [0, 360],
//                     }}
//                     transition={{
//                       duration: 20,
//                       repeat: Infinity,
//                       ease: 'linear',
//                     }}
//                   >
//                     <Icon className="w-12 h-12 mx-auto mb-4 text-sky-600 dark:text-sky-400" />
//                   </motion.div>
//                   <motion.div
//                     className="text-3xl font-bold text-gradient mb-2"
//                     animate={{
//                       scale: [1, 1.1, 1],
//                     }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       delay: index * 0.2,
//                     }}
//                   >
//                     {stat.value}
//                   </motion.div>
//                   <div className="text-gray-600 dark:text-gray-400 relative z-10">{stat.label}</div>
//                 </GlassCard>
//               </motion.div>
//             )
//           })}
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="container mx-auto px-4 py-20">
//         <SectionHeader
//           title="Explore Our Platform"
//           subtitle="Discover all the ways AlumniFusion helps you stay connected"
//         />
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {features.map((feature, index) => {
//             const Icon = feature.icon
//             return (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 50, rotateX: -15 }}
//                 whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ 
//                   delay: index * 0.15,
//                   type: 'spring',
//                   stiffness: 100,
//                   damping: 15
//                 }}
//                 whileHover={{ 
//                   scale: 1.05, 
//                   y: -10,
//                   rotateY: 5
//                 }}
//               >
//                 <Link to={feature.link}>
//                   <GlassCard className="h-full cursor-pointer relative overflow-hidden group">
//                     <motion.div
//                       className="absolute inset-0 bg-gradient-to-r from-sky-400/0 via-cyan-400/20 to-sky-400/0"
//                       animate={{
//                         x: ['-100%', '100%'],
//                       }}
//                       transition={{
//                         duration: 3,
//                         repeat: Infinity,
//                         delay: index * 0.4,
//                       }}
//                     />
//                     <motion.div
//                       className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 relative z-10 shadow-lg`}
//                       whileHover={{ 
//                         rotate: 360,
//                         scale: 1.1
//                       }}
//                       transition={{ duration: 0.6 }}
//                     >
//                       <Icon className="w-8 h-8 text-white" />
//                     </motion.div>
//                     <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white relative z-10">{feature.title}</h3>
//                     <p className="text-gray-600 dark:text-gray-400 relative z-10">{feature.description}</p>
//                   </GlassCard>
//                 </Link>
//               </motion.div>
//             )
//           })}
//         </div>
//       </section>
//     </div>
//   )
// }

// export default Home

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Users, Heart, Briefcase, Calendar, Network, BookOpen, Trophy, UserPlus, BookOpenText } from 'lucide-react'
import Lottie from 'lottie-react'
import heroAnimation from '../animations/hero.json'
import AnimatedButton from '../components/AnimatedButton'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'
import Chatbot from '../components/Chatbot'

const Home = () => {
  const stats = [
    { icon: Users, value: '10,000+', label: 'Alumni' },
    { icon: Heart, value: '₹50L+', label: 'Donations' },
    { icon: Briefcase, value: '500+', label: 'Jobs' },
    { icon: Calendar, value: '100+', label: 'Events' },
  ]

  const features = [
    {
      icon: Network,
      title: 'Networking Hub',
      description: 'Connect with alumni worldwide and build professional relationships.',
      link: '/networking',
      color: 'from-sky-400 to-cyan-500',
    },
    {
      icon: Heart,
      title: 'Donation Portal',
      description: 'Support your alma mater through various donation categories.',
      link: '/donate',
      color: 'from-pink-400 to-rose-500',
    },
    {
      icon: Briefcase,
      title: 'Job Portal',
      description: 'Find opportunities or post jobs for fellow alumni.',
      link: '/jobs',
      color: 'from-emerald-400 to-teal-500',
    },
    {
      icon: Users,
      title: 'Alumni Directory',
      description: 'Search and connect with alumni by batch, branch, or location.',
      link: '/directory',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Calendar,
      title: 'Events & Reunions',
      description: 'Stay updated with upcoming events and reunions.',
      link: '/events',
      color: 'from-amber-400 to-orange-500',
    },
    {
      icon: Trophy,
      title: 'Success Stories',
      description: 'Read inspiring stories from our accomplished alumni.',
      link: '/success-stories',
      color: 'from-yellow-400 to-amber-500',
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating background bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => {
          const size = 20 + Math.random() * 80; // Bubble size between 20-100px
          const duration = 8 + Math.random() * 12; // Float duration 8-20s
          const delay = Math.random() * 5; // Random start delay
          const leftPosition = Math.random() * 100; // Random horizontal position

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
              {/* Inner bubble highlight */}
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

        {/* Additional smaller sparkle particles */}
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6 text-sky-600 dark:text-sky-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 animate-gradient">
                AlumniFusion
              </span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Connecting LOVELY PROFESSIONAL UNIVERSITY alumni worldwide. Build your network, share opportunities, and give back to your alma mater.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link to="/register">
                <AnimatedButton>Register Now</AnimatedButton>
              </Link>
              <Link to="/directory">
                <AnimatedButton variant="outline">Find Alumni</AnimatedButton>
              </Link>
              <Link to="/donate">
                <AnimatedButton variant="secondary">Donate</AnimatedButton>
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Image Section - Animated with Wave Effect */}
          <motion.div
            className="md:w-1/2 mt-8 md:mt-0 md:pl-12"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative group cursor-pointer h-[550px] flex items-center justify-center overflow-visible">
              {/* Image - disappears with wave animation on hover */}
              <motion.div
                className="relative w-full h-full flex items-center justify-center"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.img
                  src="/images/home.png"
                  alt="Alumni Network"
                  className="w-full h-auto scale-110 transition-all duration-700 group-hover:opacity-0"
                  style={{
                    filter: 'drop-shadow(0 10px 30px rgba(59, 130, 246, 0.2))',
                  }}
                  animate={{
                    scale: [1.1, 1.12, 1.1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Wave Animation - appears when hovering */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-4 border-blue-500/30 rounded-full hidden group-hover:block"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 2.5],
                      opacity: [0.6, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>

              {/* Text - appears on hover with wave effect */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 20 }}
                  animate={{ scale: 0.8, y: 20 }}
                  whileHover={{ scale: 1, y: 0 }}
                  className="relative"
                >
                  {/* Animated waves behind text */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 blur-xl"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 1,
                        ease: "easeInOut",
                      }}
                      style={{
                        background: `radial-gradient(circle, ${i === 0 ? 'rgba(59, 130, 246, 0.4)' :
                          i === 1 ? 'rgba(147, 51, 234, 0.4)' :
                            'rgba(236, 72, 153, 0.4)'
                          } 0%, transparent 70%)`,
                      }}
                    />
                  ))}

                  <motion.h2
                    className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 relative z-10 group-hover:scale-110 transition-transform duration-700"
                    animate={{
                      backgroundPosition: ['0%', '100%', '0%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{
                      backgroundSize: '200% 200%',
                    }}
                  >
                  </motion.h2>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Chatbot */}
      <Chatbot />

      {/* Animated Images Section */}
      <section className="container mx-auto px-4 py-12 relative z-10">
        <SectionHeader
          title="Connect & Grow"
          subtitle="Join thousands of alumni building their careers and networks"
        />
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Connecting People */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring' }}
            whileHover={{
              scale: 1.08,
              y: -10,
              rotateY: 5,
              transition: { duration: 0.3 }
            }}
            className="relative"
          >
            <GlassCard className="text-center overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-sky-400/20 via-cyan-400/20 to-blue-400/20"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10"
              >
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <UserPlus className="w-16 h-16 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connect with People</h3>
                <p className="text-gray-600 dark:text-gray-400">Build meaningful professional relationships</p>
              </motion.div>
            </GlassCard>
          </motion.div>

          {/* Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring', delay: 0.2 }}
            whileHover={{
              scale: 1.08,
              y: -10,
              rotateY: 5,
              transition: { duration: 0.3 }
            }}
            className="relative"
          >
            <GlassCard className="text-center overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 0.5,
                }}
              />
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.3,
                }}
                className="relative z-10"
              >
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.5,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Briefcase className="w-16 h-16 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Find Jobs</h3>
                <p className="text-gray-600 dark:text-gray-400">Discover opportunities from top companies</p>
              </motion.div>
            </GlassCard>
          </motion.div>

          {/* Success Stories */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring', delay: 0.4 }}
            whileHover={{
              scale: 1.08,
              y: -10,
              rotateY: 5,
              transition: { duration: 0.3 }
            }}
            className="relative"
          >
            <GlassCard className="text-center overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-orange-400/20"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 1,
                }}
              />
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.6,
                }}
                className="relative z-10"
              >
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpenText className="w-16 h-16 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Success Stories</h3>
                <p className="text-gray-600 dark:text-gray-400">Get inspired by alumni achievements</p>
              </motion.div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  rotate: [0, -2, 2, 0]
                }}
              >
                <GlassCard className="text-center relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-cyan-400/10"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  />
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Icon className="w-12 h-12 mx-auto mb-4 text-sky-600 dark:text-sky-400" />
                  </motion.div>
                  <motion.div
                    className="text-3xl font-bold text-gradient mb-2"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-600 dark:text-gray-400 relative z-10">{stat.label}</div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <SectionHeader
          title="Explore Our Platform"
          subtitle="Discover all the ways AlumniFusion helps you stay connected"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  rotateY: 5
                }}
              >
                <Link to={feature.link}>
                  <GlassCard className="h-full cursor-pointer relative overflow-hidden group">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-sky-400/0 via-cyan-400/20 to-sky-400/0"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.4,
                      }}
                    />
                    <motion.div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 relative z-10 shadow-lg`}
                      whileHover={{
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white relative z-10">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 relative z-10">{feature.description}</p>
                  </GlassCard>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Home