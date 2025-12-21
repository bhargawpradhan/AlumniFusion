import mongoose from 'mongoose'

const contactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    adminReply: { type: String },
    status: {
        type: String,
        enum: ['pending', 'replied'],
        default: 'pending'
    }
}, {
    timestamps: true
})

export default mongoose.model('ContactMessage', contactMessageSchema)
