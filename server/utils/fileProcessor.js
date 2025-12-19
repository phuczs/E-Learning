import fs from 'fs/promises';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';

/**
 * Extract text from uploaded file based on file type
 * @param {string} filePath - Path to the uploaded file
 * @param {string} mediaType - Type of media (pdf, docx, txt)
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromFile = async (filePath, mediaType) => {
    try {
        switch (mediaType) {
            case 'pdf':
                const pdfBuffer = await fs.readFile(filePath);
                const pdfData = await pdf(pdfBuffer);
                return pdfData.text;

            case 'docx':
                const docxResult = await mammoth.extractRawText({ path: filePath });
                return docxResult.value;

            case 'txt':
                const txtContent = await fs.readFile(filePath, 'utf-8');
                return txtContent;

            case 'image':
                // For images, you would typically use OCR (like Tesseract.js)
                // For now, return a placeholder
                return '[Image content - OCR not implemented yet]';

            default:
                throw new Error('Unsupported file type');
        }
    } catch (error) {
        console.error('Error extracting text:', error);
        throw new Error('Failed to extract text from file');
    }
};

/**
 * Get media type from file extension
 * @param {string} filename - Original filename
 * @returns {string} - Media type
 */
export const getMediaType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    const typeMap = {
        '.pdf': 'pdf',
        '.docx': 'docx',
        '.txt': 'txt',
        '.jpg': 'image',
        '.jpeg': 'image',
        '.png': 'image'
    };
    return typeMap[ext] || 'unknown';
};
