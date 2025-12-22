import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import passport from 'passport'
import './config/passport.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'alumnifusion_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true if using https
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import eventRoutes from './routes/events.js'
import jobRoutes from './routes/jobs.js'
import donationRoutes from './routes/donations.js'
import storyRoutes from './routes/stories.js'
import feedbackRoutes from './routes/feedback.js'
import announcementRoutes from './routes/announcements.js'
import contactRoutes from './routes/contact.js'
import dashboardRoutes from './routes/dashboard.js'
import messageRoutes from './routes/messages.js'
import groupMessageRoutes from './routes/groupMessages.js'

import { createServer } from 'http'
import { Server } from 'socket.io'
import connectionRoutes from './routes/connections.js'
import Message from './models/Message.js'
import GroupMessage from './models/GroupMessage.js'

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/connections', connectionRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/group-messages', groupMessageRoutes)
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

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

// Store online users: userId -> socketId
const onlineUsers = new Map()

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id)

  socket.on('join', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id)
      console.log(`User ${userId} joined with socket ${socket.id}`)
      io.emit('onlineUsers', Array.from(onlineUsers.keys()))

      // Update last seen in DB
      import('./models/User.js').then(({ default: User }) => {
        User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() }).exec()
      })
    }
  })

  socket.on('sendMessage', async (data) => {
    try {
      const { to, from, text, user } = data

      // Save to database
      const newMessage = new Message({
        from,
        to,
        text
      })
      await newMessage.save()

      const receiverSocketId = onlineUsers.get(to)

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', {
          from,
          text,
          user, // Sender details
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })
      }
    } catch (error) {
      console.error('Socket message error:', error)
    }
  })

  // Handle group messages
  socket.on('sendGroupMessage', async (data) => {
    try {
      const { groupId, userId, text, user } = data

      // Save to database
      const newGroupMessage = new GroupMessage({
        groupId,
        user: userId,
        text,
        isAdminReply: user.role === 'admin'
      })
      await newGroupMessage.save()

      // Broadcast to all connected clients
      io.emit('receiveGroupMessage', {
        groupId,
        userId,
        text,
        user,
        _id: newGroupMessage._id,
        createdAt: newGroupMessage.createdAt,
        isAdminReply: newGroupMessage.isAdminReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    } catch (error) {
      console.error('Socket group message error:', error)
    }
  })

  socket.on('disconnect', () => {
    let disconnectedUserId
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId
        onlineUsers.delete(userId)
        break
      }
    }

    if (disconnectedUserId) {
      console.log(`User ${disconnectedUserId} disconnected`)
      io.emit('onlineUsers', Array.from(onlineUsers.keys()))

      // Update last seen
      import('./models/User.js').then(({ default: User }) => {
        User.findByIdAndUpdate(disconnectedUserId, { isOnline: false, lastSeen: new Date() }).exec()
      })
    }
  })
})

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

