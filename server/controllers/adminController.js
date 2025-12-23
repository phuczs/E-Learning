import User from '../models/User.js';
import Lecture from '../models/Lecture.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import { getStats } from '../utils/jobTracker.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const [users, lectures, flashcards, quizzes] = await Promise.all([
      User.countDocuments(),
      Lecture.countDocuments(),
      Flashcard.countDocuments(),
      Quiz.countDocuments(),
    ]);

    const jobs = getStats();

    res.json({
      success: true,
      users,
      lectures,
      flashcards,
      quizzes,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password_hash').sort({ created_at: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const getAllLectures = async (req, res, next) => {
  try {
    const lectures = await Lecture.find().sort({ uploaded_at: -1 });
    res.json({ success: true, count: lectures.length, lectures });
  } catch (error) {
    next(error);
  }
};
