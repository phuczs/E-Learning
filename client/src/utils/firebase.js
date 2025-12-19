import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyANFzRjdpl7WYAf5fjqzMjz_n0R4WIDrY4",
    authDomain: "newtech-d9a18.firebaseapp.com",
    projectId: "newtech-d9a18",
    storageBucket: "newtech-d9a18.firebasestorage.app",
    messagingSenderId: "659944269678",
    appId: "1:659944269678:web:2545473e6a80d23a39037f",
    measurementId: "G-XEED6GN0KY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error('Firebase auth error:', error);
        if (error.code === 'auth/configuration-not-found') {
            throw new Error('Google Sign-In is not configured. Please enable it in Firebase Console.');
        }
        throw error;
    }
};

export { auth, googleProvider };
