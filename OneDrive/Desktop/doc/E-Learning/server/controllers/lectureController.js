import Lecture from '../models/Lecture.js';
import Summary from '../models/Summary.js';
import { extractTextFromFile, getMediaType } from '../utils/fileProcessor.js';
import { generateSummary } from '../services/aiService.js';
import path from 'path';
import fs from 'fs/promises';

// @desc    Upload lecture file
// @route   POST /api/lectures/upload
// @access  Private
export const uploadLecture = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const { title, tone } = req.body;
        const mediaType = getMediaType(req.file.originalname);

        // Extract text from file
        const rawContent = await extractTextFromFile(req.file.path, mediaType);

        // Create lecture
        const lecture = await Lecture.create({
            user_id: req.user._id,
            title: title || req.file.originalname,
            file_url: req.file.path,
            raw_content: rawContent,
            media_type: mediaType
        });

        // Generate AI summary
        try {
            const summaryContent = await generateSummary(rawContent, tone || 'concise');

            await Summary.create({
                lecture_id: lecture._id,
                content_markdown: summaryContent,
                tone: tone || 'concise'
            });
        } catch (aiError) {
            console.error('AI summary generation failed:', aiError);
            // Continue even if AI fails
        }

        res.status(201).json({
            success: true,
            lecture: {
                id: lecture._id,
                title: lecture.title,
                media_type: lecture.media_type,
                uploaded_at: lecture.uploaded_at
            }
        });
    } catch (error) {
        // Clean up uploaded file on error
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        next(error);
    }
};

// @desc    Get all lectures for user
// @route   GET /api/lectures
// @access  Private
export const getLectures = async (req, res, next) => {
    try {
        const lectures = await Lecture.find({ user_id: req.user._id })
            .sort({ uploaded_at: -1 })
            .select('-raw_content'); // Exclude large text field

        res.json({
            success: true,
            count: lectures.length,
            lectures
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single lecture with summary
// @route   GET /api/lectures/:id
// @access  Private
export const getLectureById = async (req, res, next) => {
    try {
        const lecture = await Lecture.findById(req.params.id);

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Check ownership
        if (lecture.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Get summary
        const summary = await Summary.findOne({ lecture_id: lecture._id });

        res.json({
            success: true,
            lecture,
            summary
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete lecture
// @route   DELETE /api/lectures/:id
// @access  Private
export const deleteLecture = async (req, res, next) => {
    try {
        const lecture = await Lecture.findById(req.params.id);

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Check ownership
        if (lecture.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Delete file
        await fs.unlink(lecture.file_url).catch(console.error);

        // Delete lecture and related data
        await Lecture.findByIdAndDelete(req.params.id);
        await Summary.deleteMany({ lecture_id: req.params.id });

        res.json({
            success: true,
            message: 'Lecture deleted'
        });
    } catch (error) {
        next(error);
    }
};
