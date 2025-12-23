import { useState, useEffect } from 'react';
import { FiDownload, FiCheck, FiTrash2 } from 'react-icons/fi';
import { offlineStorage } from '../../utils/offlineStorage';
import { lectureService } from '../../services/lectureService';
import { flashcardService } from '../../services/flashcardService';
import { quizService } from '../../services/quizService';

const DownloadButton = ({ lecture, onDownloadComplete }) => {
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        checkIfDownloaded();
    }, [lecture._id]);

    const checkIfDownloaded = async () => {
        const cached = await offlineStorage.isLectureCached(lecture._id);
        setIsDownloaded(cached);
    };

    const handleDownload = async () => {
        setDownloading(true);
        setProgress(0);

        try {
            // Save lecture
            await offlineStorage.saveLecture(lecture);
            setProgress(33);

            // Fetch and save flashcards
            try {
                const flashcardsRes = await flashcardService.getByLecture(lecture._id);
                if (flashcardsRes.data.flashcards.length > 0) {
                    await offlineStorage.saveFlashcards(flashcardsRes.data.flashcards, lecture._id);
                }
            } catch (error) {
                console.log('No flashcards to cache');
            }
            setProgress(66);

            // Fetch and save quizzes
            try {
                const quizzesRes = await quizService.getByLecture(lecture._id);
                if (quizzesRes.data.quizzes.length > 0) {
                    await offlineStorage.saveQuizzes(quizzesRes.data.quizzes, lecture._id);
                }
            } catch (error) {
                console.log('No quizzes to cache');
            }
            setProgress(100);

            setIsDownloaded(true);
            if (onDownloadComplete) onDownloadComplete();
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download lecture for offline use');
        } finally {
            setDownloading(false);
            setProgress(0);
        }
    };

    const handleRemove = async () => {
        if (window.confirm('Remove this lecture from offline storage?')) {
            try {
                await offlineStorage.deleteLecture(lecture._id);
                setIsDownloaded(false);
            } catch (error) {
                console.error('Failed to remove:', error);
            }
        }
    };

    return (
        <div className="download-button-container">
            {!isDownloaded ? (
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="btn btn-outline btn-sm"
                    title="Download for offline access"
                >
                    <FiDownload />
                    {downloading ? `Downloading... ${progress}%` : 'Download Offline'}
                </button>
            ) : (
                <div className="downloaded-indicator">
                    <span className="downloaded-badge">
                        <FiCheck /> Available Offline
                    </span>
                    <button
                        onClick={handleRemove}
                        className="btn btn-ghost btn-sm"
                        title="Remove from offline storage"
                    >
                        <FiTrash2 />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DownloadButton;
