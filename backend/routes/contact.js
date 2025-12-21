import express from 'express'
import ContactMessage from '../models/ContactMessage.js'
import Announcement from '../models/Announcement.js'

const router = express.Router()

// Submit a contact message (Public)
router.post('/', async (req, res) => {
    try {
        const contactMessage = new ContactMessage(req.body)
        await contactMessage.save()
        res.status(201).json({ message: 'Message sent successfully', contactMessage })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get all contact messages (Admin)
router.get('/all', async (req, res) => {
    try {
        const messages = await ContactMessage.find()
            .populate('userId', 'firstName lastName email')
            .sort({ createdAt: -1 })
        res.json(messages)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Reply to a contact message (Admin)
router.put('/:id/reply', async (req, res) => {
    try {
        const { adminReply } = req.body
        const message = await ContactMessage.findById(req.params.id).populate('userId', 'firstName lastName')

        if (!message) {
            return res.status(404).json({ message: 'Message not found' })
        }

        message.adminReply = adminReply
        message.status = 'replied'
        await message.save()

        // Create Announcement for the user (only if they are a registered user)
        // Even if not registered by userId, if we have their name/email we can try to find them or just send general if userId exists
        if (message.userId) {
            const announcement = new Announcement({
                title: `Reply to your message: ${message.subject || 'Inquiry'}`,
                content: `Hi ${message.userId.firstName},\n\nAdmin has replied to your message:\n\n"${adminReply}"\n\nThank you for reaching out!`,
                type: 'general',
                isActive: true
            })
            await announcement.save()
        } else {
            // Option: Send email if not a registered user, but here user asked for Announcement section
            // We'll create a general announcement if they aren't logged in? 
            // Usually announcements are for all users. If user is anonymous, announcements won't be private.
            // But user said "message comes in user Announcement section". This implies the user should be logged in to see it.
        }

        res.json({ message: 'Reply sent successfully', contactMessage: message })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router
