import { motion } from 'framer-motion'

const FloatingBackground = () => {
  const shapes = Array.from({ length: 25 }, (_, i) => i) // More shapes
  const bubbles = Array.from({ length: 30 }, (_, i) => i) // Bubbles
  const stars = Array.from({ length: 40 }, (_, i) => i) // Stars

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Floating Shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape}
          className="absolute rounded-full opacity-20 blur-xl"
          style={{
            width: Math.random() * 300 + 100,
            height: Math.random() * 300 + 100,
            background: `linear-gradient(135deg, 
              hsl(${Math.random() * 40 + 190}, 80%, 70%), 
              hsl(${Math.random() * 40 + 200}, 80%, 70%))`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Moving Bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={`bubble-${bubble}`}
          className="absolute rounded-full bg-gradient-to-r from-sky-400/20 to-cyan-400/20 blur-sm"
          style={{
            width: Math.random() * 150 + 30,
            height: Math.random() * 150 + 30,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 80 - 40, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 8 + 5,
            repeat: Infinity,
            delay: bubble * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Blinking Stars */}
      {stars.map((star) => (
        <motion.div
          key={`star-${star}`}
          className="absolute text-sky-300 dark:text-sky-400"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 12 + 6}px`,
          }}
          animate={{
            opacity: [0, 1, 0.5, 1, 0],
            scale: [0.3, 1, 0.8, 1.2, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: star * 0.05,
            ease: 'easeInOut',
          }}
        >
          ✦
        </motion.div>
      ))}
    </div>
  )
}

export default FloatingBackground
