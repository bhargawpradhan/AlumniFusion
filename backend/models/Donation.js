import mongoose from 'mongoose'

const donationSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  donorName: { type: String, required: true },
  donorEmail: { type: String, required: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentMethod: { type: String },
  paymentId: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, {
  timestamps: true
})

export default mongoose.model('Donation', donationSchema)

