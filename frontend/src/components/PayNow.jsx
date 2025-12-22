import React from 'react'

const PayNow = ({ className = '', children = 'Pay with Razorpay', onClick }) => {
    return (
        <a
            href="https://rzp.io/rzp/MsCBp5yj"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all inline-block text-center ${className}`}
            onClick={onClick}
        >
            {children}
        </a>
    )
}

export default PayNow
