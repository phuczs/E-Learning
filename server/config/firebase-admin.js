import admin from 'firebase-admin';

let bucket;

/**
 * Initialize Firebase Admin SDK
 * Uses service account credentials from environment variables
 */
const initializeFirebaseAdmin = () => {
    try {
        // Check if already initialized
        if (admin.apps.length > 0) {
            console.log('Firebase Admin already initialized');
            bucket = admin.storage().bucket();
            return;
        }

        // Validate required environment variables
        const requiredEnvVars = [
            'FIREBASE_PROJECT_ID',
            'FIREBASE_CLIENT_EMAIL',
            'FIREBASE_PRIVATE_KEY',
            'FIREBASE_STORAGE_BUCKET'
        ];

        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }

        // Initialize with service account credentials
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Replace escaped newlines in private key
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            }),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });

        bucket = admin.storage().bucket();
        console.log('Firebase Admin initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error.message);
        throw error;
    }
};

// Initialize on module load
initializeFirebaseAdmin();

export { admin, bucket };
