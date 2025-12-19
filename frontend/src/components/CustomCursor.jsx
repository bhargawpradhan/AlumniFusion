// import { useEffect, useRef, useState } from 'react'
// import { motion } from 'framer-motion'

// const CustomCursor = () => {
//   // Use refs for animation loop performance
//   const mousePos = useRef({ x: 0, y: 0 })
//   const trailRef = useRef(Array(25).fill({ x: 0, y: 0 }))
//   const [trail, setTrail] = useState(Array(25).fill({ x: 0, y: 0 }))

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       mousePos.current = { x: e.clientX, y: e.clientY }
//     }

//     window.addEventListener('mousemove', handleMouseMove)

//     // Animation loop to make circles follow and catch up
//     let animationFrameId
//     const animateTrail = () => {
//       const currentTrail = trailRef.current
//       const target = mousePos.current

//       // First point moves to mouse
//       const newTrail = [...currentTrail]

//       // Calculate new positions with "follow the leader" logic
//       // This ensures they converge when stopped
//       newTrail[0] = {
//         x: newTrail[0].x + (target.x - newTrail[0].x) * 0.8, // Fast lead
//         y: newTrail[0].y + (target.y - newTrail[0].y) * 0.8
//       }

//       for (let i = 1; i < newTrail.length; i++) {
//         const leader = newTrail[i - 1]
//         const follower = newTrail[i]

//         // Very tight gap (high speed factor)
//         newTrail[i] = {
//           x: follower.x + (leader.x - follower.x) * 0.4, // Speed of following
//           y: follower.y + (leader.y - follower.y) * 0.4
//         }
//       }

//       trailRef.current = newTrail
//       setTrail(newTrail)

//       animationFrameId = requestAnimationFrame(animateTrail)
//     }

//     animateTrail()

//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove)
//       cancelAnimationFrame(animationFrameId)
//     }
//   }, [])

//   // Vibrant "different-different" colors based on the Sky Blue theme + accents
  

//   return (
//     <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
//       {trail.map((pos, index) => {
//         // Big to small order
//         const size = 24 * (1 - index / trail.length)

//         return (
//           <motion.div
//             key={index}
//             className="absolute rounded-full"
//             style={{
//               left: pos.x,
//               top: pos.y,
//               width: Math.max(size, 2), // Ensure min size
//               height: Math.max(size, 2),
//               backgroundColor: colors[index % colors.length],
//               translateX: '-50%',
//               translateY: '-50%',
//               // Don't fade out completely so we can see them overlap when stopped
//               opacity: 1 - (index / trail.length) * 0.5,
//             }}
//           />
//         )
//       })}
//     </div>
//   )
// }

// export default CustomCursor
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const CustomCursor = () => {
  // Use refs for animation loop performance
  const mousePos = useRef({ x: 0, y: 0 })
  const trailRef = useRef(Array(25).fill({ x: 0, y: 0 }))
  const [trail, setTrail] = useState(Array(25).fill({ x: 0, y: 0 }))

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop to make circles follow and catch up
    let animationFrameId
    const animateTrail = () => {
      const currentTrail = trailRef.current
      const target = mousePos.current

      // First point moves to mouse
      const newTrail = [...currentTrail]

      // Calculate new positions with "follow the leader" logic
      // This ensures they converge when stopped
      newTrail[0] = {
        x: newTrail[0].x + (target.x - newTrail[0].x) * 0.8, // Fast lead
        y: newTrail[0].y + (target.y - newTrail[0].y) * 0.8
      }

      for (let i = 1; i < newTrail.length; i++) {
        const leader = newTrail[i - 1]
        const follower = newTrail[i]

        // Very tight gap (high speed factor)
        newTrail[i] = {
          x: follower.x + (leader.x - follower.x) * 0.4, // Speed of following
          y: follower.y + (leader.y - follower.y) * 0.4
        }
      }

      trailRef.current = newTrail
      setTrail(newTrail)

      animationFrameId = requestAnimationFrame(animateTrail)
    }

    animateTrail()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // All sky blue color flame
  const colors = [
    '#0ea5e9', // sky-500
    '#38bdf8', // sky-400
    '#7dd3fc', // sky-300
    '#bae6fd', // sky-200
    '#e0f2fe', // sky-100
    '#f0f9ff', // sky-50
  ]

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {trail.map((pos, index) => {
        // Big to small order
        const size = 24 * (1 - index / trail.length)

        return (
          <motion.div
            key={index}
            className="absolute rounded-full"
            style={{
              left: pos.x,
              top: pos.y,
              width: Math.max(size, 2), // Ensure min size
              height: Math.max(size, 2),
              backgroundColor: colors[index % colors.length],
              translateX: '-50%',
              translateY: '-50%',
              // Don't fade out completely so we can see them overlap when stopped
              opacity: 1 - (index / trail.length) * 0.5,
            }}
          />
        )
      })}
    </div>
  )
}

export default CustomCursor