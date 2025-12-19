import mongoose from 'mongoose'

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: {
        type: String,
        enum: ['news', 'event', 'general', 'urgent'],
        default: 'general'
    },
    priority: {
        type: String,
        enum: ['normal', 'high'],
        default: 'normal'
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
})

export default mongoose.model('Announcement', announcementSchema)
