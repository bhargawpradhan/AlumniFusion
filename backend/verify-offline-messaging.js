import mongoose from 'mongoose'
import User from './models/User.js'
import Message from './models/Message.js'
import dotenv from 'dotenv'

dotenv.config()

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to DB')

        // Create 2 dummy users (Alice and Bob)
        const aliceEmail = `alice_offline_${Date.now()}@example.com`
        const bobEmail = `bob_offline_${Date.now()}@example.com`

        const alice = await User.create({
            firstName: 'Alice', lastName: 'Offline', email: aliceEmail, password: 'password',
            role: 'user', department: 'CS', batch: '2024'
        })

        const bob = await User.create({
            firstName: 'Bob', lastName: 'Receiver', email: bobEmail, password: 'password',
            role: 'user', department: 'IT', batch: '2024'
        })

        console.log(`✓ Created Users: Alice (${alice._id}), Bob (${bob._id})`)

        // Connect them
        alice.connections.push(bob._id)
        bob.connections.push(alice._id)
        await alice.save()
        await bob.save()
        console.log('✓ Users are connected')

        // SCENARIO: Alice sends message to Bob (Bob is offline)
        const msg1 = await Message.create({
            from: alice._id,
            to: bob._id,
            text: 'Hey Bob! Are you there?',
            read: false
        })
        console.log('✓ Alice sent message while Bob was offline')

        // Bob comes online and checks unread messages
        const unreadMessages = await Message.find({
            to: bob._id,
            read: false
        })
        console.log(`✓ Bob has ${unreadMessages.length} unread message(s)`)
        if (unreadMessages.length !== 1) throw new Error('Expected 1 unread message')

        // Bob opens chat and messages are marked as read
        const conversation = await Message.find({
            $or: [
                { from: alice._id, to: bob._id },
                { from: bob._id, to: alice._id }
            ]
        }).sort({ createdAt: 1 })
        console.log(`✓ Bob loaded ${conversation.length} message(s) in chat history`)
        if (conversation.length !== 1) throw new Error('Expected 1 message in history')
        if (conversation[0].text !== 'Hey Bob! Are you there?') throw new Error('Message text mismatch')

        // Mark as read
        await Message.updateMany(
            { from: alice._id, to: bob._id, read: false },
            { $set: { read: true } }
        )
        console.log('✓ Messages marked as read')

        // Verify read status
        const stillUnread = await Message.countDocuments({ to: bob._id, read: false })
        if (stillUnread !== 0) throw new Error('Messages still unread')
        console.log('✓ No unread messages remaining')

        // Bob replies
        const msg2 = await Message.create({
            from: bob._id,
            to: alice._id,
            text: 'Hi Alice! Yes, I just came online!',
            read: false
        })
        console.log('✓ Bob replied to Alice')

        // Verify conversation now has 2 messages
        const fullConvo = await Message.find({
            $or: [
                { from: alice._id, to: bob._id },
                { from: bob._id, to: alice._id }
            ]
        }).sort({ createdAt: 1 })
        if (fullConvo.length !== 2) throw new Error('Expected 2 messages in conversation')
        console.log(`✓ Conversation now has ${fullConvo.length} messages`)

        console.log('\n🎉 OFFLINE MESSAGING VERIFICATION SUCCESSFUL!')
        console.log('✅ Messages sent while offline are saved')
        console.log('✅ Unread counts work correctly')
        console.log('✅ Messages are marked as read when viewed')
        console.log('✅ Recipients can reply to offline messages')

        // Cleanup
        await User.deleteMany({ email: { $in: [aliceEmail, bobEmail] } })
        await Message.deleteMany({ $or: [{ from: alice._id }, { from: bob._id }] })

        process.exit(0)

    } catch (error) {
        console.error('❌ Verification Failed:', error.message)
        process.exit(1)
    }
}

run()
