import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const GlassCard = forwardRef(({ children, className = '', hover = true, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      className={`glass dark:glass-dark rounded-xl p-6 shadow-lg ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
})

GlassCard.displayName = 'GlassCard'

export default GlassCard

