// import express from 'express'
// import Donation from '../models/Donation.js'

// const router = express.Router()

// // Get all donations
// router.get('/', async (req, res) => {
//   try {
//     const donations = await Donation.find().sort({ createdAt: -1 })
//     res.json(donations)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

// // Get donation stats
// router.get('/stats/summary', async (req, res) => {
//   try {
//     const total = await Donation.aggregate([
//       { $match: { status: 'completed' } },
//       { $group: { _id: null, total: { $sum: '$amount' } } }
//     ])

//     const byCategory = await Donation.aggregate([
//       { $match: { status: 'completed' } },
//       { $group: { _id: '$category', total: { $sum: '$amount' } } }
//     ])

//     res.json({
//       total: total[0]?.total || 0,
//       byCategory,
//     })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

// // Get donation by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const donation = await Donation.findById(req.params.id)
//     if (!donation) {
//       return res.status(404).json({ message: 'Donation not found' })
//     }
//     res.json(donation)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

// export default router

import express from 'express'
import Donation from '../models/Donation.js'

const router = express.Router()

// ==============================
// CREATE A DONATION (FIX)
// ==============================
router.post('/', async (req, res) => {
  try {
    const {
      amount,
      category,
      donorName,
      donorEmail,
      paymentMethod,
      status
    } = req.body

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid donation amount' })
    }
    if (!category) {
      return res.status(400).json({ message: 'Donation category required' })
    }
    if (!donorName || !donorEmail) {
      return res.status(400).json({ message: 'Donor name and email required' })
    }

    const donation = new Donation({
      amount,
      category,
      donorName,
      donorEmail,
      paymentMethod: paymentMethod || 'razorpay',
      status: status || 'completed'
    })

    await donation.save()

    res.status(201).json({
      message: 'Donation successful',
      donation
    })
  } catch (error) {
    console.error('Donation POST error:', error)
    res.status(500).json({ message: 'Donation failed' })
  }
})

// ==============================
// GET ALL DONATIONS
// ==============================
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 })
    res.json(donations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ==============================
// DONATION STATS SUMMARY
// ==============================
router.get('/stats/summary', async (req, res) => {
  try {
    // Total donation amount
    const total = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])

    // Donation amounts by category
    const byCategory = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ])

    // Total unique donors count
    const totalDonors = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$donorEmail' } },
      { $count: 'count' }
    ])

    // Donors count by category
    const donorsByCategory = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { category: '$category', email: '$donorEmail' }
        }
      },
      {
        $group: {
          _id: '$_id.category',
          donors: { $sum: 1 }
        }
      }
    ])

    res.json({
      total: total[0]?.total || 0,
      totalDonors: totalDonors[0]?.count || 0,
      byCategory,
      donorsByCategory
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ==============================
// GET DONATION BY ID
// ==============================
router.get('/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' })
    }
    res.json(donation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
