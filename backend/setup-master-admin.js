import mongoose from 'mongoose'
import User from './models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const setupAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        const adminEmail = 'bhargawpradhan@gmail.com'
        const adminPassword = '12345' // The login code handles this specifically, but we'll set it here too

        let admin = await User.findOne({ email: adminEmail })

        if (!admin) {
            admin = new User({
                firstName: 'Bhargaw',
                lastName: 'Pradhan',
                email: adminEmail,
                password: adminPassword,
                department: 'Admin',
                batch: '2024',
                role: 'admin',
                isVerified: true
            })
            await admin.save()
            console.log('✅ Master admin user created')
        } else {
            admin.role = 'admin'
            admin.password = adminPassword // This will be hashed by the pre-save hook
            await admin.save()
            console.log('✅ Master admin user updated with role: admin')
        }

        process.exit(0)
    } catch (error) {
        console.error('❌ Error setting up admin:', error)
        process.exit(1)
    }
}

setupAdmin()
