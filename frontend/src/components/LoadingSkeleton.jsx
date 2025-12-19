import { motion } from 'framer-motion'

const LoadingSkeleton = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={`bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    />
  )
}

export default LoadingSkeleton

