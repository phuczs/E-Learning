import express from 'express';
import { protect } from '../middleware/auth.js';
import { getAdminStats, getAllUsers, getAllLectures } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/lectures', getAllLectures);

export default router;
