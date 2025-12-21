import express from 'express'
import User from '../models/User.js'
import Event from '../models/Event.js'
import Donation from '../models/Donation.js'
import Job from '../models/Job.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Get user dashboard data
router.get('/', auth, async (req, res) => {
  try {
    // Safety check for auth middleware
    if (!req.user || !req.user._id) {
      console.error('Dashboard Route: No user found in request object after auth middleware')
      return res.status(401).json({ message: 'User not authenticated properly' })
    }

    const userId = req.user._id
    console.log(`[Dashboard] Fetching data for user: ${userId}`)

    // Initialize dashboard data with defaults
    const dashboardData = {
      connections: 0,
      jobsApplied: 0,
      donations: 0,
      eventsAttended: 0
    }

    // Parallel execution for better performance, but ensuring individual failures don't crash the whole request
    await Promise.all([
      // Get user's connections count
      (async () => {
        try {
          const user = await User.findById(userId).select('connections')
          if (user) {
            dashboardData.connections = user.connections ? user.connections.length : 0
          }
        } catch (error) {
          console.error(`[Dashboard] Error fetching connections for ${userId}:`, error.message)
        }
      })(),

      // Get jobs applied by user
      (async () => {
        try {
          dashboardData.jobsApplied = await Job.countDocuments({ applications: userId })
        } catch (error) {
          console.error(`[Dashboard] Error fetching jobs applied for ${userId}:`, error.message)
        }
      })(),

      // Get user's donations
      (async () => {
        try {
          const donations = await Donation.find({ donorId: userId, status: 'completed' })
          dashboardData.donations = donations.reduce((sum, donation) => {
            return sum + (Number(donation.amount) || 0)
          }, 0)
        } catch (error) {
          console.error(`[Dashboard] Error fetching donations for ${userId}:`, error.message)
        }
      })(),

      // Get events attended by user
      (async () => {
        try {
          // Count events where user is in attendees list AND event date is in the past
          dashboardData.eventsAttended = await Event.countDocuments({
            attendees: userId,
            date: { $lt: new Date() }
          })
        } catch (error) {
          console.error(`[Dashboard] Error fetching events attended for ${userId}:`, error.message)
        }
      })()
    ])

    console.log(`[Dashboard] Successfully fetched data for ${userId}:`, dashboardData)
    res.json(dashboardData)

  } catch (error) {
    console.error('[Dashboard] Critical Error:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?._id
    })

    // Send 500 but with the default structure so frontend doesn't crash completely
    res.status(500).json({
      message: 'Failed to fetch dashboard data',
      connections: 0,
      jobsApplied: 0,
      donations: 0,
      eventsAttended: 0
    })
  }
})

export default router
