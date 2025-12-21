import mongoose from 'mongoose'
import User from './models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to DB')

        // Create 2 dummy users
        const u1Email = `test_mycon1_${Date.now()}@example.com`
        const u2Email = `test_mycon2_${Date.now()}@example.com`

        const user1 = await User.create({
            firstName: 'Alice', lastName: 'Smith', email: u1Email, password: 'password',
            role: 'user', department: 'CS', batch: '2024'
        })

        const user2 = await User.create({
            firstName: 'Bob', lastName: 'Jones', email: u2Email, password: 'password',
            role: 'user', department: 'IT', batch: '2024'
        })

        console.log(`Created Users: ${user1._id}, ${user2._id}`)

        // Simulate connection (both users add each other)
        user1.connections.push(user2._id)
        await user1.save()

        user2.connections.push(user1._id)
        await user2.save()

        console.log('Connected both users')

        // Test fetching connections for user1
        const fetchedUser1 = await User.findById(user1._id)
            .populate('connections', 'firstName lastName position company profilePhoto isOnline lastSeen')

        console.log('User1 Connections count:', fetchedUser1.connections.length)
        if (fetchedUser1.connections.length !== 1) throw new Error('Connection count mismatch')

        const connection = fetchedUser1.connections[0]
        console.log('Connection Details:', connection.firstName, connection.lastName)
        if (connection.firstName !== 'Bob') throw new Error('Connection name mismatch')

        console.log('MY CONNECTIONS VERIFICATION SUCCESSFUL')

        // Cleanup
        await User.deleteMany({ email: { $in: [u1Email, u2Email] } })

        process.exit(0)

    } catch (error) {
        console.error('Verification Failed:', error)
        process.exit(1)
    }
}

run()
