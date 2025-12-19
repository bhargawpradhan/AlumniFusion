import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, max: 5 },
  emoji: { type: String },
  feedback: { type: String },
  surveyAnswers: [{
    question: String,
    answer: String
  }],
}, {
  timestamps: true
})

export default mongoose.model('Feedback', feedbackSchema)

