import express from 'express'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Get "People You May Know" suggestions (Users not connected yet)
router.get('/suggestions', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id)

        // Get list of connected users and pending requests (outgoing)
        const connectedIds = currentUser.connections.map(id => id.toString())
        // Note: We might want to filter outgoing requests too, but schema changes were minimal. 
        // Assuming we check 'connections' array primarily.

        // Find users NOT in connections list and NOT the current user
        const suggestions = await User.find({
            _id: { $ne: req.user._id, $nin: connectedIds },
            role: 'user' // Only suggest regular users, maybe not admin?
        })
            .select('firstName lastName position company profilePhoto connections')
            .limit(10)

        // Calculate mutual connections (mock for now, or real intersection)
        const suggestionsWithMutual = suggestions.map(user => {
            const userObj = user.toObject()
            // Simple mutual check intersection
            const mutualCount = user.connections.filter(c => connectedIds.includes(c.toString())).length
            return {
                ...userObj,
                mutual: mutualCount
            }
        })

        res.json(suggestionsWithMutual)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get Pending Connection Requests
router.get('/requests', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id)
            .populate('connectionRequests.from', 'firstName lastName position company profilePhoto')

        const pendingRequests = currentUser.connectionRequests.filter(req => req.status === 'pending')

        res.json(pendingRequests)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get My Connections (Already accepted connections)
router.get('/my-connections', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id)
            .populate('connections', 'firstName lastName position company profilePhoto isOnline lastSeen')

        res.json(currentUser.connections)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Send Connection Request
router.post('/request/:userId', auth, async (req, res) => {
    try {
        const targetUserId = req.params.userId
        const senderId = req.user._id

        if (targetUserId === senderId.toString()) {
            return res.status(400).json({ message: "Cannot connect with yourself" })
        }

        const targetUser = await User.findById(targetUserId)
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" })
        }

        // Check if already connected
        if (targetUser.connections.includes(senderId)) {
            return res.status(400).json({ message: "Already connected" })
        }

        // Check if request already pending
        const existingRequest = targetUser.connectionRequests.find(
            req => req.from.toString() === senderId.toString() && req.status === 'pending'
        )

        if (existingRequest) {
            return res.status(400).json({ message: "Request already sent" })
        }

        // Add request
        targetUser.connectionRequests.push({
            from: senderId,
            status: 'pending'
        })

        await targetUser.save()
        res.json({ message: "Connection request sent" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Accept Request
router.post('/accept/:requestId', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id)
        const request = currentUser.connectionRequests.id(req.params.requestId)

        if (!request) {
            return res.status(404).json({ message: "Request not found" })
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: "Request already handled" })
        }

        const senderId = request.from

        // Update status
        request.status = 'accepted'

        // Add to connections for both users
        currentUser.connections.push(senderId)
        await currentUser.save()

        await User.findByIdAndUpdate(senderId, {
            $push: { connections: currentUser._id }
        })

        res.json({ message: "Connection accepted" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Reject Request
router.post('/reject/:requestId', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id)
        const request = currentUser.connectionRequests.id(req.params.requestId)

        if (!request) {
            return res.status(404).json({ message: "Request not found" })
        }

        request.status = 'rejected'
        await currentUser.save()

        res.json({ message: "Connection request rejected" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router
