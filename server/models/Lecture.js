import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    file_url: {
        type: String,
        required: true
    },
    raw_content: {
        type: String,
        required: true
    },
    media_type: {
        type: String,
        required: true,
        enum: ['pdf', 'docx', 'txt', 'image']
    },
    uploaded_at: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
lectureSchema.index({ user_id: 1, uploaded_at: -1 });

const Lecture = mongoose.model('Lecture', lectureSchema);

export default Lecture;
