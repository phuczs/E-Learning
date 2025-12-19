import express from 'express';
import {
    uploadLecture,
    getLectures,
    getLectureById,
    deleteLecture
} from '../controllers/lectureController.js';
import { protect } from '../middleware/auth.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/upload', protect, upload.single('file'), uploadLecture);
router.get('/', protect, getLectures);
router.get('/:id', protect, getLectureById);
router.delete('/:id', protect, deleteLecture);

export default router;
