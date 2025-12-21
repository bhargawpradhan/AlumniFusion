import express from 'express'
import GroupMessage from '../models/GroupMessage.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// ADMIN ONLY: Get all group messages across all groups
router.get('/admin/all-groups', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }

        const limit = parseInt(req.query.limit) || 200

        // Get messages from all groups, sorted by most recent
        const messages = await GroupMessage.find({})
            .populate('user', 'firstName lastName email role')
            .sort({ createdAt: -1 })
            .limit(limit)

        // Group by groupId for easier display
        const groupedMessages = {
            general: [],
            jobs: [],
            tech: [],
            alumni: []
        }

        messages.forEach(msg => {
            if (groupedMessages[msg.groupId]) {
                groupedMessages[msg.groupId].push(msg)
            }
        })

        // Reverse each array to show oldest first
        Object.keys(groupedMessages).forEach(key => {
            groupedMessages[key].reverse()
        })

        res.json(groupedMessages)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// ADMIN ONLY: Reply to any group
router.post('/admin/:groupId/reply', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' })
        }

        const { groupId } = req.params
        const { text } = req.body

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Message text is required' })
        }

        const adminMessage = await GroupMessage.create({
            groupId,
            user: req.user._id,
            text: text.trim(),
            isAdminReply: true
        })

        const populatedMessage = await GroupMessage.findById(adminMessage._id)
            .populate('user', 'firstName lastName role')

        res.status(201).json(populatedMessage)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get messages for a specific group
router.get('/:groupId', auth, async (req, res) => {
    try {
        const { groupId } = req.params
        const limit = parseInt(req.query.limit) || 100

        const messages = await GroupMessage.find({ groupId })
            .populate('user', 'firstName lastName role')
            .sort({ createdAt: 1 })
            .limit(limit)

        res.json(messages)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Send message to a group
router.post('/:groupId', auth, async (req, res) => {
    try {
        const { groupId } = req.params
        const { text } = req.body

        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Message text is required' })
        }

        const newMessage = await GroupMessage.create({
            groupId,
            user: req.user._id,
            text: text.trim(),
            isAdminReply: req.user.role === 'admin'
        })

        const populatedMessage = await GroupMessage.findById(newMessage._id)
            .populate('user', 'firstName lastName role')

        res.status(201).json(populatedMessage)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router
