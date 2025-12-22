import { motion } from 'framer-motion'
import { GraduationCap, Target, Eye, Users, Award, Heart } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import SectionHeader from '../components/SectionHeader'

const AboutUs = () => {
  const values = [
    { icon: Users, title: 'Community', description: 'Building a strong, connected alumni network' },
    { icon: Award, title: 'Excellence', description: 'Celebrating achievements and success stories' },
    { icon: Heart, title: 'Giving Back', description: 'Supporting our alma mater and students' },
  ]

  const timeline = [
    { year: '2025', event: 'Lovely Professional University established' },
    { year: '2025', event: 'First alumni association formed' },
    { year: '2025', event: 'Digital platform launched' },
    { year: '2025', event: 'AlumniFusion platform launched' },
    { year: '2025', event: '10,000+ alumni connected' },
  ]

  const team = [
    { name: 'Bhargaw Pradhan', role: 'Full Stack developer', department: 'Digital Platform' },
    { name: 'Mahendra Singh Barod', role: 'UI/UX engineer', department: 'Events & Outreach' },
    { name: 'Aditya Sharma', role: 'Management', department: 'Alumni Relations' },
  ]

  return (
    <div className="container mx-auto px-4 py-12 relative overflow-hidden">
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

      <div className="relative z-10">
        <SectionHeader
          title="About AlumniFusion"
          subtitle="Connecting Lovely Professional University alumni worldwide"
        />

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <GlassCard className="relative overflow-hidden group">

              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4 relative z-10"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Target className="text-white" size={32} />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white relative z-10">Our Mission</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                To create a vibrant, connected community of Lovely Professional University alumni, fostering professional growth,
                knowledge sharing, and meaningful relationships that benefit both alumni and the institution.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <GlassCard className="relative overflow-hidden group">

              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 flex items-center justify-center mb-4 relative z-10"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Eye className="text-white" size={32} />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white relative z-10">Our Vision</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                To be the leading alumni platform that empowers graduates to achieve their goals, contribute to their
                communities, and support the next generation of engineers and innovators.
              </p>
            </GlassCard>
          </motion.div>
        </div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
          whileHover={{ scale: 1.01 }}
        >
          <GlassCard className="relative overflow-hidden group">

            <div className="flex items-center mb-6 relative z-10">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-4 shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                whileHover={{ scale: 1.1, rotate: 360 }}
              >
                <GraduationCap className="text-white" size={32} />
              </motion.div>
              <h2 className="text-3xl font-bold text-gradient">College History</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 relative z-10">
              Lovely Professional University was established in 1990 with a vision to provide quality engineering education
              to students from all walks of life. Over the years, the college has produced thousands of successful engineers
              who have made significant contributions to various industries worldwide.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
              Our alumni network spans across the globe, with graduates working in top companies, leading innovative startups,
              and contributing to research and development in their respective fields. AlumniFusion was created to bring this
              diverse community together and create opportunities for collaboration, mentorship, and growth.
            </p>
          </GlassCard>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-gradient text-center">Timeline</h2>
          <div className="relative">
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-500 to-cyan-500"
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: index * 0.2 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <motion.div whileHover={{ scale: 1.05, y: -5 }}>
                      <GlassCard className="relative overflow-hidden group">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100"
                          transition={{ duration: 0.3 }}
                        />
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2 relative z-10">{item.year}</div>
                        <p className="text-gray-700 dark:text-gray-300 relative z-10">{item.event}</p>
                      </GlassCard>
                    </motion.div>
                  </div>
                  <motion.div
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 border-4 border-white dark:border-gray-900 z-10"
                    whileHover={{ scale: 1.5, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-gradient text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <GlassCard className="text-center relative overflow-hidden group">

                    <motion.div
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 relative z-10"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      animate={{ boxShadow: ['0 0 20px rgba(59, 130, 246, 0.5)', '0 0 40px rgba(147, 51, 234, 0.5)', '0 0 20px rgba(59, 130, 246, 0.5)'] }}
                    >
                      <Icon className="text-white" size={32} />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white relative z-10">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 relative z-10">{value.description}</p>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6 text-gradient text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5, rotateY: -20 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <GlassCard className="text-center relative overflow-hidden group">

                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 relative z-10"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(59, 130, 246, 0.5)',
                        '0 0 40px rgba(147, 51, 234, 0.5)',
                        '0 0 20px rgba(59, 130, 246, 0.5)',
                      ],
                    }}
                  >
                    <motion.span
                      className="text-white text-3xl font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {member.name[0]}
                    </motion.span>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white relative z-10">{member.name}</h3>
                  <p className="text-primary-600 dark:text-primary-400 mb-1 relative z-10">{member.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">{member.department}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutUs

