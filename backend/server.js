import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import eventRoutes from './routes/events.js'
import jobRoutes from './routes/jobs.js'
import donationRoutes from './routes/donations.js'
import storyRoutes from './routes/stories.js'
import feedbackRoutes from './routes/feedback.js'
import announcementRoutes from './routes/announcements.js'

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/announcements', announcementRoutes)
app.use(express.json())


// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alumnifusion')
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    console.error('Make sure MONGODB_URI is set in .env file for MongoDB Atlas connection')
    process.exit(1)
  }
}

// Connect to MongoDB
connectDB()

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB')
})

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected')
})

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AlumniFusion API is running' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

