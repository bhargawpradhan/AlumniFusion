import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token')

    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' })
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret')
      const user = await User.findById(decoded.userId).select('-password')
      
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' })
      }

      req.user = user
      next()
    } catch (err) {
      return res.status(401).json({ message: 'Token is not valid' })
    }
  } catch (err) {
    console.error('Something went wrong with auth middleware', err)
    res.status(500).json({ message: 'Server Error' })
  }
}

export default auth
