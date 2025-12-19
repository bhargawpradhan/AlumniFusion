import express from 'express'
import Feedback from '../models/Feedback.js'

const router = express.Router()

// Get all feedback
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('userId', 'firstName lastName').sort({ createdAt: -1 })
    res.json(feedback)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create feedback
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body)
    await feedback.save()
    res.status(201).json(feedback)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get feedback stats
router.get('/stats', async (req, res) => {
  try {
    const avgRating = await Feedback.aggregate([
      { $match: { rating: { $exists: true } } },
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ])
    
    const ratingCounts = await Feedback.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
    
    res.json({
      averageRating: avgRating[0]?.avg || 0,
      ratingCounts,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

