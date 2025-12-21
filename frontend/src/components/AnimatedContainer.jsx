import { motion } from 'framer-motion'

const AnimatedContainer = ({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    distance = 20,
    duration = 0.5,
    ...props
}) => {
    const variants = {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
            x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            x: 0,
            transition: {
                duration: duration,
                delay: delay,
                ease: 'easeOut'
            }
        }
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            variants={variants}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export default AnimatedContainer
