import mongoose from 'mongoose'
import User from './models/User.js'
import GroupMessage from './models/GroupMessage.js'
import dotenv from 'dotenv'

dotenv.config()

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        // Create a test user
        const testEmail = `testuser_${Date.now()}@example.com`
        const testUser = await User.create({
            firstName: 'Test',
            lastName: 'User',
            email: testEmail,
            password: 'password123',
            department: 'CS',
            batch: '2024',
            role: 'user'
        })
        console.log(`✅ Created test user: ${testUser._id}`)

        // Create a test admin
        const adminEmail = `admin_${Date.now()}@example.com`
        const adminUser = await User.create({
            firstName: 'Admin',
            lastName: 'Test',
            email: adminEmail,
            password: 'password123',
            department: 'Admin',
            batch: '2024',
            role: 'admin'
        })
        console.log(`✅ Created admin user: ${adminUser._id}`)

        // Test creating group messages
        console.log('\n📝 Testing Group Message Creation...')

        // User sends message to general
        const msg1 = await GroupMessage.create({
            groupId: 'general',
            user: testUser._id,
            text: 'Hello everyone! This is a test message.',
            isAdminReply: false
        })
        console.log(`✅ Created user message in general: ${msg1._id}`)

        // Admin sends message to general
        const msg2 = await GroupMessage.create({
            groupId: 'general',
            user: adminUser._id,
            text: 'Welcome! Admin here.',
            isAdminReply: true
        })
        console.log(`✅ Created admin message in general: ${msg2._id}`)

        // Fetch messages from general group
        console.log('\n📥 Fetching messages from general group...')
        const messages = await GroupMessage.find({ groupId: 'general' })
            .populate('user', 'firstName lastName role')
            .sort({ createdAt: 1 })

        console.log(`✅ Found ${messages.length} messages in general group`)
        messages.forEach(msg => {
            console.log(`  - [${msg.isAdminReply ? 'ADMIN' : 'USER'}] ${msg.user.firstName}: "${msg.text}"`)
        })

        // Test fetching all groups
        console.log('\n📊 Testing admin all-groups query...')
        const allMessages = await GroupMessage.find({})
            .populate('user', 'firstName lastName email role')
            .sort({ createdAt: -1 })
            .limit(200)

        const groupedMessages = {
            general: [],
            jobs: [],
            tech: [],
            alumni: []
        }

        allMessages.forEach(msg => {
            if (groupedMessages[msg.groupId]) {
                groupedMessages[msg.groupId].push(msg)
            }
        })

        Object.keys(groupedMessages).forEach(key => {
            groupedMessages[key].reverse()
        })

        console.log('✅ Grouped messages:')
        Object.entries(groupedMessages).forEach(([groupId, msgs]) => {
            console.log(`  ${groupId}: ${msgs.length} messages`)
        })

        console.log('\n🎉 ALL TESTS PASSED!')
        console.log('✅ MongoDB storage working')
        console.log('✅ User messages working')
        console.log('✅ Admin messages working')
        console.log('✅ Query operations working')

        // Cleanup
        await User.deleteMany({ email: { $in: [testEmail, adminEmail] } })
        await GroupMessage.deleteMany({ user: { $in: [testUser._id, adminUser._id] } })
        console.log('\n🧹 Cleaned up test data')

        process.exit(0)

    } catch (error) {
        console.error('❌ TEST FAILED:', error)
        process.exit(1)
    }
}

run()
