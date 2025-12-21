import mongoose from 'mongoose'
import User from './models/User.js'
import Message from './models/Message.js'
import dotenv from 'dotenv'

dotenv.config()

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to DB')

        // 1. Create 2 dummy users
        const u1Email = `test1_${Date.now()}@example.com`
        const u2Email = `test2_${Date.now()}@example.com`

        const user1 = await User.create({
            firstName: 'Test', lastName: 'One', email: u1Email, password: 'password', role: 'user',
            department: 'CS', batch: '2024'
        })

        const user2 = await User.create({
            firstName: 'Test', lastName: 'Two', email: u2Email, password: 'password', role: 'user',
            department: 'CS', batch: '2024'
        })

        console.log(`Created Users: ${user1._id}, ${user2._id}`)

        // 2. Test Connection Request Logic (simulate via DB manipulation or logic)
        // Since we can't easily call express routes here without supertest, we verify logic manually

        // User 1 sends request to User 2
        user2.connectionRequests.push({ from: user1._id, status: 'pending' })
        await user2.save()
        console.log('Request sent (simulated)')

        // Verify fetching requests
        const fetchedUser2 = await User.findById(user2._id).populate('connectionRequests.from')
        const pending = fetchedUser2.connectionRequests.filter(r => r.status === 'pending')
        console.log('Pending Requests count:', pending.length)
        if (pending.length !== 1) throw new Error('Request not found')

        // Accept request
        const reqId = pending[0]._id
        const request = fetchedUser2.connectionRequests.id(reqId)
        request.status = 'accepted'
        fetchedUser2.connections.push(user1._id)
        await fetchedUser2.save()

        await User.findByIdAndUpdate(user1._id, { $push: { connections: user2._id } })
        console.log('Request accepted (simulated)')

        // 3. Test Messages
        // Create message
        await Message.create({ from: user1._id, to: user2._id, text: 'Hello World' })
        console.log('Message created')

        // Fetch history
        const messages = await Message.find({
            $or: [
                { from: user1._id, to: user2._id },
                { from: user2._id, to: user1._id }
            ]
        }).sort({ createdAt: 1 })

        console.log('Messages fetch count:', messages.length)
        if (messages.length !== 1) throw new Error('Message not retrieved')
        if (messages[0].text !== 'Hello World') throw new Error('Message text mismatch')

        console.log('VERIFICATION SUCCESSFUL')

        // Cleanup
        await User.deleteMany({ email: { $in: [u1Email, u2Email] } })
        await Message.deleteMany({ from: user1._id })

        process.exit(0)

    } catch (error) {
        console.error('Verification Failed:', error)
        process.exit(1)
    }
}

run()
