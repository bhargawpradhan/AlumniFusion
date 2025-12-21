import mongoose from 'mongoose'

const groupMessageSchema = new mongoose.Schema({
    groupId: {
        type: String,
        required: true,
        enum: ['general', 'jobs', 'tech', 'alumni']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    isAdminReply: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Index for efficient queries
groupMessageSchema.index({ groupId: 1, createdAt: -1 })

const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema)
export default GroupMessage
