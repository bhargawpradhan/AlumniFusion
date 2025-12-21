import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const PageTransition = ({ children }) => {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    duration: 0.4,
                    ease: "linear"
                }}
                style={{
                    width: '100%',
                    minHeight: '100vh'
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default PageTransition
