import mongoose from 'mongoose';

const questionOptionSchema = new mongoose.Schema({
    option_text: {
        type: String,
        required: true
    },
    is_correct: {
        type: Boolean,
        required: true,
        default: false
    }
});

const questionSchema = new mongoose.Schema({
    question_text: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        default: ''
    },
    options: [questionOptionSchema]
});

const quizSchema = new mongoose.Schema({
    lecture_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    total_questions: {
        type: Number,
        required: true
    },
    questions: [questionSchema],
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
quizSchema.index({ lecture_id: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
