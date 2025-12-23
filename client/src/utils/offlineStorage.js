const DB_NAME = 'StudyAssistantDB';
const DB_VERSION = 1;

class OfflineStorage {
    constructor() {
        this.db = null;
        this.initPromise = this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores if they don't exist
                if (!db.objectStoreNames.contains('lectures')) {
                    db.createObjectStore('lectures', { keyPath: '_id' });
                }
                if (!db.objectStoreNames.contains('flashcards')) {
                    const flashcardStore = db.createObjectStore('flashcards', { keyPath: '_id' });
                    flashcardStore.createIndex('lecture_id', 'lecture_id', { unique: false });
                }
                if (!db.objectStoreNames.contains('quizzes')) {
                    const quizStore = db.createObjectStore('quizzes', { keyPath: '_id' });
                    quizStore.createIndex('lecture_id', 'lecture_id', { unique: false });
                }
                if (!db.objectStoreNames.contains('summaries')) {
                    const summaryStore = db.createObjectStore('summaries', { keyPath: '_id' });
                    summaryStore.createIndex('lecture_id', 'lecture_id', { unique: false });
                }
            };
        });
    }

    async ensureDB() {
        if (!this.db) {
            await this.initPromise;
        }
    }

    // Lecture operations
    async saveLecture(lecture) {
        await this.ensureDB();
        const tx = this.db.transaction(['lectures'], 'readwrite');
        const store = tx.objectStore('lectures');
        await store.put({ ...lecture, cached_at: new Date().toISOString() });
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async getLecture(id) {
        await this.ensureDB();
        const tx = this.db.transaction(['lectures'], 'readonly');
        const store = tx.objectStore('lectures');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllLectures() {
        await this.ensureDB();
        const tx = this.db.transaction(['lectures'], 'readonly');
        const store = tx.objectStore('lectures');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteLecture(id) {
        await this.ensureDB();
        const tx = this.db.transaction(['lectures'], 'readwrite');
        const store = tx.objectStore('lectures');
        await store.delete(id);
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    // Flashcard operations
    async saveFlashcards(flashcards, lectureId) {
        await this.ensureDB();
        const tx = this.db.transaction(['flashcards'], 'readwrite');
        const store = tx.objectStore('flashcards');

        for (const flashcard of flashcards) {
            await store.put({ ...flashcard, lecture_id: lectureId, cached_at: new Date().toISOString() });
        }

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async getFlashcardsByLecture(lectureId) {
        await this.ensureDB();
        const tx = this.db.transaction(['flashcards'], 'readonly');
        const store = tx.objectStore('flashcards');
        const index = store.index('lecture_id');

        return new Promise((resolve, reject) => {
            const request = index.getAll(lectureId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Quiz operations
    async saveQuizzes(quizzes, lectureId) {
        await this.ensureDB();
        const tx = this.db.transaction(['quizzes'], 'readwrite');
        const store = tx.objectStore('quizzes');

        for (const quiz of quizzes) {
            await store.put({ ...quiz, lecture_id: lectureId, cached_at: new Date().toISOString() });
        }

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async getQuizzesByLecture(lectureId) {
        await this.ensureDB();
        const tx = this.db.transaction(['quizzes'], 'readonly');
        const store = tx.objectStore('quizzes');
        const index = store.index('lecture_id');

        return new Promise((resolve, reject) => {
            const request = index.getAll(lectureId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Summary operations
    async saveSummary(summary, lectureId) {
        await this.ensureDB();
        const tx = this.db.transaction(['summaries'], 'readwrite');
        const store = tx.objectStore('summaries');
        await store.put({ ...summary, lecture_id: lectureId, cached_at: new Date().toISOString() });
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async getSummaryByLecture(lectureId) {
        await this.ensureDB();
        const tx = this.db.transaction(['summaries'], 'readonly');
        const store = tx.objectStore('summaries');
        const index = store.index('lecture_id');

        return new Promise((resolve, reject) => {
            const request = index.get(lectureId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Check if lecture is cached
    async isLectureCached(lectureId) {
        const lecture = await this.getLecture(lectureId);
        return !!lecture;
    }

    // Get cache size
    async getCacheSize() {
        await this.ensureDB();
        const lectures = await this.getAllLectures();
        return {
            lectures: lectures.length,
            totalSize: JSON.stringify(lectures).length
        };
    }
}

export const offlineStorage = new OfflineStorage();
