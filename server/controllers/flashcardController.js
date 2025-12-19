import Flashcard from '../models/Flashcard.js';
import Lecture from '../models/Lecture.js';
import { generateFlashcards } from '../services/aiService.js';

// @desc    Generate flashcards from lecture
// @route   POST /api/flashcards/generate/:lectureId
// @access  Private
export const generateFlashcardsFromLecture = async (req, res, next) => {
    try {
        const { lectureId } = req.params;
        const { count = 10 } = req.body;

        // Get lecture
        const lecture = await Lecture.findById(lectureId);

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Check ownership
        if (lecture.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Generate flashcards using AI
        const flashcardsData = await generateFlashcards(lecture.raw_content, count);

        // Save flashcards to database
        const flashcards = await Flashcard.insertMany(
            flashcardsData.map(fc => ({
                lecture_id: lectureId,
                ...fc
            }))
        );

        res.status(201).json({
            success: true,
            count: flashcards.length,
            flashcards
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get flashcards for a lecture
// @route   GET /api/flashcards/lecture/:lectureId
// @access  Private
export const getFlashcardsByLecture = async (req, res, next) => {
    try {
        const { lectureId } = req.params;

        // Verify lecture ownership
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }
        if (lecture.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const flashcards = await Flashcard.find({ lecture_id: lectureId });

        res.json({
            success: true,
            count: flashcards.length,
            flashcards
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update flashcard
// @route   PUT /api/flashcards/:id
// @access  Private
export const updateFlashcard = async (req, res, next) => {
    try {
        const { front_text, back_text, mastery_level } = req.body;

        const flashcard = await Flashcard.findById(req.params.id);

        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard not found' });
        }

        // Verify ownership through lecture
        const lecture = await Lecture.findById(flashcard.lecture_id);
        if (lecture.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Update fields
        if (front_text !== undefined) flashcard.front_text = front_text;
        if (back_text !== undefined) flashcard.back_text = back_text;
        if (mastery_level !== undefined) flashcard.mastery_level = mastery_level;

        await flashcard.save();

        res.json({
            success: true,
            flashcard
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete flashcard
// @route   DELETE /api/flashcards/:id
// @access  Private
export const deleteFlashcard = async (req, res, next) => {
    try {
        const flashcard = await Flashcard.findById(req.params.id);

        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard not found' });
        }

        // Verify ownership through lecture
        const lecture = await Lecture.findById(flashcard.lecture_id);
        if (lecture.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Flashcard.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Flashcard deleted'
        });
    } catch (error) {
        next(error);
    }
};
