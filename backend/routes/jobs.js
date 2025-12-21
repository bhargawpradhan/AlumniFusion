import express from 'express'
import Job from '../models/Job.js'
import Application from '../models/Application.js'
import Announcement from '../models/Announcement.js'
import multer from 'multer'
import path from 'path'
import auth from '../middleware/auth.js'

const router = express.Router()

// Multer configuration for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedTypes.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'))
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

// Get all approved jobs (Public)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'approved' }).populate('postedBy', 'firstName lastName').sort({ createdAt: -1 })
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get pending jobs (Admin Only)
router.get('/pending', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    const jobs = await Job.find({ status: 'pending' }).populate('postedBy', 'firstName lastName').sort({ createdAt: -1 })
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update application status (Admin Only)
router.put('/applications/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    const { status } = req.body // 'accepted' or 'rejected'
    const application = await Application.findById(req.params.id)
      .populate('job', 'title company')
      .populate('user', 'firstName lastName email')

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    application.status = status
    await application.save()

    // Create Announcement for the user
    const announcementTitle = status === 'accepted'
      ? `Congratulations! Job Application Accepted`
      : `Update on your Job Application`

    const announcementContent = status === 'accepted'
      ? `Great news, ${application.user.firstName}! Your application for the ${application.job.title} position at ${application.job.company} has been accepted. The employer will contact you soon.`
      : `Hi ${application.user.firstName}, thank you for your interest in the ${application.job.title} position at ${application.job.company}. We regret to inform you that we are not moving forward with your application at this time.`

    const announcement = new Announcement({
      title: announcementTitle,
      content: announcementContent,
      type: status === 'accepted' ? 'news' : 'general',
      priority: status === 'accepted' ? 'high' : 'normal',
      isActive: true
    })
    await announcement.save()

    res.json({ message: `Application ${status} successfully`, application })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all applications (Admin Only)
router.get('/applications/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    const applications = await Application.find()
      .populate('job', 'title company')
      .populate('user', 'firstName lastName email profilePhoto phone department batch')
      .sort({ createdAt: -1 })
    res.json(applications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'firstName lastName')
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    res.json(job)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create job
router.post('/', async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      status: 'pending' // Enforce pending status
    })
    await job.save()
    res.status(201).json(job)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update job
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    res.json(job)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update job status (Admin Only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    const { status } = req.body
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    res.json(job)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete job (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    const job = await Job.findByIdAndDelete(req.params.id)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }
    res.json({ message: 'Job deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Apply to job
router.post('/:id/apply', upload.single('resume'), async (req, res) => {
  try {
    const { userId, coverLetter } = req.body
    const resumePath = req.file ? `/uploads/resumes/${req.file.filename}` : null

    const job = await Job.findById(req.params.id)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ job: req.params.id, user: userId })
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' })
    }

    // Create new application record
    const application = new Application({
      job: req.params.id,
      user: userId,
      coverLetter,
      resume: resumePath
    })
    await application.save()

    // Add to job applications array for quick reference
    const hasAppliedInJob = job.applications.some(appId => appId.toString() === userId)
    if (!hasAppliedInJob) {
      job.applications.push(userId)
      await job.save()
    }

    res.json({ message: 'Application submitted successfully', application })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


export default router

