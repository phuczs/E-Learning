import express from 'express';
import {
    generateQuizFromLecture,
    getQuizzesByLecture,
    getQuizById,
    submitQuizAttempt,
    getUserQuizAttempts,
    deleteQuiz
} from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate/:lectureId', protect, generateQuizFromLecture);
router.get('/lecture/:lectureId', protect, getQuizzesByLecture);
router.get('/attempts', protect, getUserQuizAttempts);
router.get('/:id', protect, getQuizById);
router.post('/:id/submit', protect, submitQuizAttempt);
router.delete('/:id', protect, deleteQuiz);

export default router;
