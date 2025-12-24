import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { getCloudinary } from './cloudinary.js';
import { Readable } from 'stream';

// Use memory storage - files are stored in memory temporarily before uploading to Cloudinary
const storage = multer.memoryStorage();

// File filter with security checks
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png'
    ];

    // Check MIME type
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only PDF, DOCX, TXT, and images are allowed.'), false);
    }

    // Additional security: Check file extension matches MIME type
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeExtMap = {
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'text/plain': ['.txt'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png']
    };

    const allowedExts = mimeExtMap[file.mimetype] || [];
    if (!allowedExts.includes(ext)) {
        return cb(new Error('File extension does not match file type.'), false);
    }

    cb(null, true);
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
        files: 1 // Only allow 1 file per request
    },
    fileFilter: fileFilter
});

/**
 * Upload file to Cloudinary
 * @param {Object} file - Multer file object (from req.file)
 * @param {string} folder - Optional folder path in Cloudinary (default: 'lectures')
 * @returns {Promise<Object>} - { filename, url, publicId, resourceType }
 */
export const uploadToCloudinary = async (file, folder = 'lectures') => {
    try {
        if (!file || !file.buffer) {
            throw new Error('No file provided or file buffer is empty');
        }

        // Get Cloudinary instance (initializes if needed)
        const cloudinary = getCloudinary();

        // Debug: verify credentials are loaded
        console.log('Cloudinary config check:', {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret_length: process.env.CLOUDINARY_API_SECRET?.length
        });

        // Generate unique filename
        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        const timestamp = Date.now();
        const filename = `${timestamp}-${uniqueSuffix}`;

        // Determine resource type based on MIME type
        let resourceType = 'auto';
        if (file.mimetype.startsWith('image/')) {
            resourceType = 'image';
        } else {
            resourceType = 'raw'; // For PDFs, DOCX, TXT
        }

        // Upload to Cloudinary with minimal parameters
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType,
                    folder: folder
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return reject(new Error('Failed to upload file to Cloudinary'));
                    }

                    resolve({
                        filename: file.originalname,
                        url: result.secure_url,
                        publicId: result.public_id,
                        resourceType: result.resource_type,
                        format: result.format,
                        size: result.bytes
                    });
                }
            );

            // Convert buffer to stream and pipe to Cloudinary
            const bufferStream = Readable.from(file.buffer);
            bufferStream.pipe(uploadStream);
        });
    } catch (error) {
        console.error('Upload to Cloudinary error:', error);
        throw error;
    }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID (e.g., 'lectures/filename')
 * @param {string} resourceType - Resource type ('image' or 'raw')
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'raw') => {
    try {
        if (!publicId) {
            throw new Error('No public ID provided');
        }

        // Get Cloudinary instance (initializes if needed)
        const cloudinary = getCloudinary();

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });

        if (result.result === 'ok') {
            console.log(`Deleted file: ${publicId}`);
        } else {
            console.log(`File not found or already deleted: ${publicId}`);
        }
    } catch (error) {
        console.error('Delete from Cloudinary error:', error);
        // Don't throw error if file doesn't exist
        if (error.http_code !== 404) {
            throw error;
        }
    }
};

export default upload;
