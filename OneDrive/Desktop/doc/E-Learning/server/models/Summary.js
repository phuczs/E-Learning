import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
    lecture_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
        required: true
    },
    content_markdown: {
        type: String,
        required: true
    },
    tone: {
        type: String,
        enum: ['concise', 'detailed', 'simple', 'academic'],
        default: 'concise'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
summarySchema.index({ lecture_id: 1 });

const Summary = mongoose.model('Summary', summarySchema);

export default Summary;
