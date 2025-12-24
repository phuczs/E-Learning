import { v2 as cloudinary } from 'cloudinary';

let isInitialized = false;

/**
 * Initialize Cloudinary (lazy initialization)
 * Called when first needed, ensuring env vars are loaded
 */
const initializeCloudinary = () => {
    if (isInitialized) {
        return; // Already initialized
    }

    try {
        // Validate required environment variables
        const requiredEnvVars = [
            'CLOUDINARY_CLOUD_NAME',
            'CLOUDINARY_API_KEY',
            'CLOUDINARY_API_SECRET'
        ];

        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }

        // Configure Cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true // Always use HTTPS
        });

        isInitialized = true;
        console.log('Cloudinary initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Cloudinary:', error.message);
        throw error;
    }
};

// Export function to get cloudinary instance
// This ensures initialization happens after env vars are loaded
export const getCloudinary = () => {
    if (!isInitialized) {
        initializeCloudinary();
    }
    return cloudinary;
};

export default cloudinary;
