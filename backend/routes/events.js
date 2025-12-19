import express from 'express'
import Event from '../models/Event.js'

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

// Get pending events (Admin)
router.get('/pending', async (req, res) => {
  try {
    const events = await Event.find({ approvalStatus: 'pending' })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all events (Admin)
router.get('/all', async (req, res) => {
  try {
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

// Update event status (Approve/Reject)
router.put('/:id/status', async (req, res) => {
  try {
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

// Delete event
router.delete('/:id', async (req, res) => {
  try {
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

