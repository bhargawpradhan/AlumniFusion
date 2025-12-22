import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const GlassCard = forwardRef(({ children, className = '', hover = true, ...props }, ref) => {
  return (
    <div className="relative group perspective-1000">
      {/* Background Glow Effect */}
      {hover && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      <motion.div
        ref={ref}
        whileHover={hover ? {
          y: -15,
          rotateX: 8,
          rotateY: -8,
          transition: { duration: 0.4, ease: "easeOut" }
        } : {}}
        whileTap={hover ? { scale: 0.98 } : {}}
        className={`glass dark:glass-dark rounded-2xl p-6 shadow-xl relative z-10 
          border border-white/20 dark:border-white/10 backdrop-blur-xl
          transition-colors duration-300 group-hover:bg-white/30 dark:group-hover:bg-white/5
          ${className}`}
        style={{ transformStyle: 'preserve-3d' }}
        {...props}
      >
        <div style={{ transform: 'translateZ(30px)' }}>
          {children}
        </div>
      </motion.div>
    </div>
  )
})

GlassCard.displayName = 'GlassCard'

export default GlassCard


