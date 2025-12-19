import mongoose from 'mongoose'

const storySchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  company: { type: String, required: true },
  branch: { type: String, required: true },
  batch: { type: String, required: true },
  location: { type: String },
  story: { type: String, required: true },
  achievements: [String],
  photo: { type: String },
  link: { type: String },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, {
  timestamps: true
})

export default mongoose.model('Story', storySchema)

