import express from 'express'
import Announcement from '../models/Announcement.js'

const router = express.Router()

// Get all active announcements
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find({ isActive: true })
            .sort({ createdAt: -1 })
            .populate('author', 'firstName lastName')
        res.json(announcements)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Create announcement
router.post('/', async (req, res) => {
    try {
        const announcement = new Announcement(req.body)
        await announcement.save()
        res.status(201).json(announcement)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Delete announcement
router.delete('/:id', async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id)
        res.json({ message: 'Announcement deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router
