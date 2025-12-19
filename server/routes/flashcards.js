import express from 'express';
import {
    generateFlashcardsFromLecture,
    getFlashcardsByLecture,
    updateFlashcard,
    deleteFlashcard
} from '../controllers/flashcardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate/:lectureId', protect, generateFlashcardsFromLecture);
router.get('/lecture/:lectureId', protect, getFlashcardsByLecture);
router.put('/:id', protect, updateFlashcard);
router.delete('/:id', protect, deleteFlashcard);

export default router;
