import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import User from './models/User.js'
import Job from './models/Job.js'
import Event from './models/Event.js'
import Donation from './models/Donation.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const verifyDashboard = async () => {
    try {
        console.log('Connecting to MongoDB...')
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alumnifusion')
        console.log('Connected to MongoDB')

        // 1. Find a test user
        const user = await User.findOne()
        if (!user) {
            console.error('No users found in database')
            process.exit(1)
        }
        console.log(`Testing with user: ${user.email} (${user._id})`)

        // 2. Test Connections
        console.log('--- Testing Connections ---')
        const connectionCount = user.connections ? user.connections.length : 0
        console.log(`Connections: ${connectionCount}`)

        // 3. Test Jobs Applied
        console.log('--- Testing Jobs Applied ---')
        const jobsApplied = await Job.countDocuments({ applications: user._id })
        console.log(`Jobs Applied: ${jobsApplied}`)

        // 4. Test Donations
        console.log('--- Testing Donations ---')
        const donations = await Donation.find({ donorId: user._id, status: 'completed' })
        const totalDonation = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
        console.log(`Total Donations: ${totalDonation} (from ${donations.length} records)`)

        // 5. Test Events Attended
        console.log('--- Testing Events Attended ---')
        const eventsAttended = await Event.countDocuments({
            attendees: user._id,
            date: { $lt: new Date() }
        })
        console.log(`Events Attended: ${eventsAttended}`)

        console.log('\nVerification Complete. Data queries are valid.')
        process.exit(0)

    } catch (error) {
        console.error('Verification Failed:', error)
        process.exit(1)
    }
}

verifyDashboard()
