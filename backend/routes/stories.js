import express from 'express'
import Story from '../models/Story.js'

const router = express.Router()

// Get all stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find({ status: 'approved' }).sort({ createdAt: -1 })
    res.json(stories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get pending stories (Admin)
router.get('/pending', async (req, res) => {
  try {
    const stories = await Story.find({ status: 'pending' }).sort({ createdAt: -1 })
    res.json(stories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get story by ID
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
    if (!story) {
      return res.status(404).json({ message: 'Story not found' })
    }
    res.json(story)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create story
router.post('/', async (req, res) => {
  try {
    const story = new Story({
      ...req.body,
      status: 'pending' // Enforce pending
    })
    await story.save()
    res.status(201).json(story)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update story
router.put('/:id', async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!story) {
      return res.status(404).json({ message: 'Story not found' })
    }

    res.json(story)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update generic status (Admin - Approve/Reject)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!story) {
      return res.status(404).json({ message: 'Story not found' })
    }

    res.json(story)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

