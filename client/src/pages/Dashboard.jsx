import { useState, useEffect } from 'react';
import { lectureService } from '../services/lectureService';
import { offlineStorage } from '../utils/offlineStorage';
import LectureUpload from '../components/lectures/LectureUpload';
import LectureList from '../components/lectures/LectureList';

const Dashboard = () => {
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLectures = async () => {
        try {
            const isOnline = navigator.onLine;

            // If offline, load from IndexedDB
            if (!isOnline) {
                console.log('Offline mode - loading lectures from IndexedDB');
                const cachedLectures = await offlineStorage.getAllLectures();
                setLectures(cachedLectures || []);
                setLoading(false);
                return;
            }

            // Online - fetch from API
            const response = await lectureService.getAll();
            setLectures(response.data.lectures);
        } catch (error) {
            console.error('Failed to fetch lectures:', error);

            // If API fails, try IndexedDB fallback
            try {
                const cachedLectures = await offlineStorage.getAllLectures();
                if (cachedLectures && cachedLectures.length > 0) {
                    console.log('Using cached lectures as fallback');
                    setLectures(cachedLectures);
                }
            } catch (offlineError) {
                console.error('IndexedDB fallback failed:', offlineError);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLectures();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1 className="mb-4">Dashboard</h1>

            <div className="grid grid-2 mb-4">
                <div className="card">
                    <h3>Total Lectures</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {lectures.length}
                    </p>
                </div>
                <div className="card">
                    <h3>Quick Stats</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Keep learning and growing! 🚀
                    </p>
                </div>
            </div>

            <LectureUpload onUploadSuccess={fetchLectures} />

            <div className="mt-4">
                <h2 className="mb-3">Your Lectures</h2>
                <LectureList lectures={lectures} onDelete={fetchLectures} />
            </div>
        </div>
    );
};

export default Dashboard;
