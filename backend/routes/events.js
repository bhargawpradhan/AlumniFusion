import express from 'express'
import Event from '../models/Event.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Get approved events (Public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ approvalStatus: 'approved' })
      .populate('createdBy', 'firstName lastName')
      .sort({ date: -1 })
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get pending events (Admin Only)
router.get('/pending', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    const events = await Event.find({ approvalStatus: 'pending' })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all events (Admin Only)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    const events = await Event.find()
      .populate('createdBy', 'firstName lastName')
      .sort({ date: -1 })
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'firstName lastName')
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create event
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body)
    await event.save()
    res.status(201).json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update event status (Approve/Reject) (Admin Only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    const { status } = req.body
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: status },
      { new: true }
    )
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete event (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json({ message: 'Event deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// RSVP to event
router.post('/:id/rsvp', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const userId = req.body.userId
    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId)
      await event.save()
    }

    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

