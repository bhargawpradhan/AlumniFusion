import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const AnimatedButton = forwardRef(({ children, className = '', variant = 'primary', ...props }, ref) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300'
  
  const variants = {
    primary: 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-sky-500/50',
    secondary: 'glass dark:glass-dark text-gray-900 dark:text-white hover:bg-sky-100 dark:hover:bg-sky-900',
    outline: 'border-2 border-sky-600 text-sky-600 dark:text-sky-400 hover:bg-sky-600 hover:text-white',
  }

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
})

AnimatedButton.displayName = 'AnimatedButton'

export default AnimatedButton

