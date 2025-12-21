import mongoose from 'mongoose'
import User from './models/User.js'
import GroupMessage from './models/GroupMessage.js'
import dotenv from 'dotenv'

dotenv.config()

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        // Find or create test users
        let testUser = await User.findOne({ email: 'test@example.com' })
        if (!testUser) {
            testUser = await User.create({
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                password: 'password123',
                department: 'CS',
                batch: '2024',
                role: 'user'
            })
            console.log('Created test user')
        }

        let adminUser = await User.findOne({ role: 'admin' })
        if (!adminUser) {
            adminUser = await User.create({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@example.com',
                password: 'password123',
                department: 'Admin',
                batch: '2024',
                role: 'admin'
            })
            console.log('Created admin user')
        }

        console.log(`Test User: ${testUser._id}`)
        console.log(`Admin User: ${adminUser._id}`)

        // Seed messages in all groups
        const groups = ['general', 'jobs', 'tech', 'alumni']

        for (const groupId of groups) {
            // User message
            await GroupMessage.create({
                groupId,
                user: testUser._id,
                text: `Hello from ${groupId} group! This is a test message.`,
                isAdminReply: false
            })

            // Admin reply
            await GroupMessage.create({
                groupId,
                user: adminUser._id,
                text: `Admin response in ${groupId}. Welcome everyone!`,
                isAdminReply: true
            })
        }

        console.log('✅ Seeded messages in all 4 groups')

        // Verify
        const totalMessages = await GroupMessage.countDocuments()
        console.log(`Total messages in DB: ${totalMessages}`)

        // Show sample
        const sampleMessages = await GroupMessage.find({ groupId: 'general' })
            .populate('user', 'firstName lastName role')
            .limit(5)

        console.log('\nSample messages from general:')
        sampleMessages.forEach(msg => {
            console.log(`  ${msg.isAdminReply ? '👑' : '💬'} ${msg.user.firstName}: ${msg.text}`)
        })

        console.log('\n✅ Database seeded successfully!')
        console.log('Now refresh your app and check Admin → Messages → Group Chats')

        process.exit(0)

    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

run()
