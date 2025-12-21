import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'

const OAuthCallback = () => {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const token = params.get('token')
        const userStr = params.get('user')

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr)
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))

                toast.success('Login successful!')

                if (user.role === 'admin') {
                    navigate('/admin/dashboard')
                } else {
                    navigate('/user/dashboard')
                }
            } catch (error) {
                console.error('OAuth Callback Error:', error)
                toast.error('Failed to process login data.')
                navigate('/login')
            }
        } else {
            toast.error('Login failed. Please try again.')
            navigate('/login')
        }
    }, [location, navigate])

    return (
        <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-slate-900">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Completing login...</p>
            </div>
        </div>
    )
}

export default OAuthCallback
