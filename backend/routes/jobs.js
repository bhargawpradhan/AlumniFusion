import express from 'express'
import Job from '../models/Job.js'

const router = express.Router()

// Get all approved jobs (Public)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'approved' }).populate('postedBy', 'firstName lastName').sort({ createdAt: -1 })
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get pending jobs (Admin)
router.get('/pending', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'pending' }).populate('postedBy', 'firstName lastName').sort({ createdAt: -1 })
    res.json(jobs)
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

// Update job status (Admin)
router.put('/:id/status', async (req, res) => {
  try {
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

// Delete job
router.delete('/:id', async (req, res) => {
  try {
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
router.post('/:id/apply', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    const userId = req.body.userId
    if (!job.applications.includes(userId)) {
      job.applications.push(userId)
      await job.save()
    }

    res.json({ message: 'Application submitted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

