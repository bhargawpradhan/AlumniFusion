export const cardContinuousAnimation = {
    animate: {
        opacity: [1, 0.8, 1],
        scale: [1, 1.05, 1],
        rotate: [0, 0.5, -0.5, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const cardHoverAnimation = {
    whileHover: {
        scale: 1.1,
        y: -10,
        rotateY: 5,
        transition: { duration: 0.3 }
    },
    whileTap: { scale: 0.95 }
};
