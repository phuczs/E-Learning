import fs from 'fs/promises';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';

/**
 * Extract text from uploaded file based on file type
 * @param {Buffer|string} fileInput - File buffer or path to the uploaded file
 * @param {string} mediaType - Type of media (pdf, docx, txt)
 * @param {string} originalname - Original filename (optional, for buffer input)
 * @returns {Promise<string>} - Extracted text content
 */
export const extractTextFromFile = async (fileInput, mediaType, originalname = '') => {
    try {
        // Check if input is a buffer or file path
        const isBuffer = Buffer.isBuffer(fileInput);

        switch (mediaType) {
            case 'pdf':
                let pdfBuffer;
                if (isBuffer) {
                    pdfBuffer = fileInput;
                } else {
                    pdfBuffer = await fs.readFile(fileInput);
                }
                const pdfData = await pdf(pdfBuffer);
                return pdfData.text;

            case 'docx':
                let docxResult;
                if (isBuffer) {
                    docxResult = await mammoth.extractRawText({ buffer: fileInput });
                } else {
                    docxResult = await mammoth.extractRawText({ path: fileInput });
                }
                return docxResult.value;

            case 'txt':
                let txtContent;
                if (isBuffer) {
                    txtContent = fileInput.toString('utf-8');
                } else {
                    txtContent = await fs.readFile(fileInput, 'utf-8');
                }
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
