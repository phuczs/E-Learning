import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Lecture from '../models/Lecture.js';
import { generateQuiz } from '../services/aiService.js';

// @desc    Generate quiz from lecture
// @route   POST /api/quizzes/generate/:lectureId
// @access  Private
export const generateQuizFromLecture = async (req, res, next) => {
    try {
        const { lectureId } = req.params;
        const { title, questionCount = 5 } = req.body;

        // Get lecture
        const lecture = await Lecture.findById(lectureId);

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Check ownership
        if (lecture.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Generate quiz using AI
        const quizData = await generateQuiz(lecture.raw_content, questionCount);

        // Create quiz
        const quiz = await Quiz.create({
            lecture_id: lectureId,
            title: title || `Quiz: ${lecture.title}`,
            total_questions: quizData.questions.length,
            questions: quizData.questions
        });

        res.status(201).json({
            success: true,
            quiz
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get quizzes for a lecture
// @route   GET /api/quizzes/lecture/:lectureId
// @access  Private
export const getQuizzesByLecture = async (req, res, next) => {
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

        const quizzes = await Quiz.find({ lecture_id: lectureId });

        res.json({
            success: true,
            count: quizzes.length,
            quizzes
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Verify ownership through lecture
        const lecture = await Lecture.findById(quiz.lecture_id);
        if (lecture.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json({
            success: true,
            quiz
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuizAttempt = async (req, res, next) => {
    try {
        const { answers } = req.body; // Array of selected option indices

        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Verify ownership through lecture
        const lecture = await Lecture.findById(quiz.lecture_id);
        if (lecture.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Calculate score
        let correctAnswers = 0;
        const results = quiz.questions.map((question, index) => {
            const userAnswer = answers[index];
            const correctOption = question.options.findIndex(opt => opt.is_correct);
            const isCorrect = userAnswer === correctOption;

            if (isCorrect) correctAnswers++;

            return {
                question: question.question_text,
                userAnswer: question.options[userAnswer]?.option_text,
                correctAnswer: question.options[correctOption]?.option_text,
                isCorrect,
                explanation: question.explanation
            };
        });

        const score = (correctAnswers / quiz.total_questions) * 100;

        // Save attempt
        const attempt = await QuizAttempt.create({
            user_id: req.user._id,
            quiz_id: quiz._id,
            score
        });

        res.json({
            success: true,
            score,
            correctAnswers,
            totalQuestions: quiz.total_questions,
            results,
            attempt
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get quiz attempts for user
// @route   GET /api/quizzes/attempts
// @access  Private
export const getUserQuizAttempts = async (req, res, next) => {
    try {
        const attempts = await QuizAttempt.find({ user_id: req.user._id })
            .populate('quiz_id')
            .sort({ attempted_at: -1 });

        res.json({
            success: true,
            count: attempts.length,
            attempts
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private
export const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Verify ownership through lecture
        const lecture = await Lecture.findById(quiz.lecture_id);
        if (lecture.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Quiz.findByIdAndDelete(req.params.id);
        await QuizAttempt.deleteMany({ quiz_id: req.params.id });

        res.json({
            success: true,
            message: 'Quiz deleted'
        });
    } catch (error) {
        next(error);
    }
};
