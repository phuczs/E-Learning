import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
    lecture_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
        required: true
    },
    front_text: {
        type: String,
        required: true
    },
    back_text: {
        type: String,
        required: true
    },
    mastery_level: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    }
});

// Index for faster queries
flashcardSchema.index({ lecture_id: 1 });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

export default Flashcard;
