import express from 'express'
import Message from '../models/Message.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Get conversation with a specific user
router.get('/:userId', auth, async (req, res) => {
    try {
        const myId = req.user._id
        const otherId = req.params.userId

        const messages = await Message.find({
            $or: [
                { from: myId, to: otherId },
                { from: otherId, to: myId }
            ]
        }).sort({ createdAt: 1 })

        res.json(messages)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get unread message counts per user
router.get('/unread/counts', auth, async (req, res) => {
    try {
        const myId = req.user._id

        // Get all unread messages sent to me
        const unreadMessages = await Message.find({
            to: myId,
            read: false
        })

        // Group by sender and count
        const unreadCounts = {}
        unreadMessages.forEach(msg => {
            const senderId = msg.from.toString()
            unreadCounts[senderId] = (unreadCounts[senderId] || 0) + 1
        })

        res.json(unreadCounts)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Mark messages as read
router.post('/:userId/mark-read', auth, async (req, res) => {
    try {
        const myId = req.user._id
        const otherId = req.params.userId

        await Message.updateMany(
            { from: otherId, to: myId, read: false },
            { $set: { read: true } }
        )

        res.json({ message: 'Messages marked as read' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router
