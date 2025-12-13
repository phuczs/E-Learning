import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lectureAPI, flashcardAPI, quizAPI } from '../services/api';
import FlashcardViewer from '../components/flashcards/FlashcardViewer';
import QuizTaker from '../components/quiz/QuizTaker';
import { FiArrowLeft, FiCreditCard, FiFileText } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

const LectureDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lecture, setLecture] = useState(null);
    const [summary, setSummary] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('summary');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchLectureData();
    }, [id]);

    const fetchLectureData = async () => {
        try {
            const [lectureRes, flashcardsRes, quizzesRes] = await Promise.all([
                lectureAPI.getById(id),
                flashcardAPI.getByLecture(id),
                quizAPI.getByLecture(id)
            ]);

            setLecture(lectureRes.data.lecture);
            setSummary(lectureRes.data.summary);
            setFlashcards(flashcardsRes.data.flashcards);
            setQuizzes(quizzesRes.data.quizzes);
        } catch (error) {
            console.error('Failed to fetch lecture data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateFlashcards = async () => {
        setGenerating(true);
        try {
            await flashcardAPI.generate(id, 10);
            await fetchLectureData();
            setActiveTab('flashcards');
        } catch (error) {
            alert('Failed to generate flashcards');
        } finally {
            setGenerating(false);
        }
    };

    const handleGenerateQuiz = async () => {
        setGenerating(true);
        try {
            await quizAPI.generate(id, { title: `Quiz: ${lecture.title}`, questionCount: 5 });
            await fetchLectureData();
            setActiveTab('quiz');
        } catch (error) {
            alert('Failed to generate quiz');
        } finally {
            setGenerating(false);
        }
    };

    const handleUpdateFlashcard = async (flashcardId, data) => {
        try {
            await flashcardAPI.update(flashcardId, data);
            await fetchLectureData();
        } catch (error) {
            alert('Failed to update flashcard');
        }
    };

    const handleDeleteFlashcard = async (flashcardId) => {
        try {
            await flashcardAPI.delete(flashcardId);
            await fetchLectureData();
        } catch (error) {
            alert('Failed to delete flashcard');
        }
    };

    const handleSubmitQuiz = async (answers) => {
        try {
            const response = await quizAPI.submit(selectedQuiz._id, answers);
            return response.data;
        } catch (error) {
            alert('Failed to submit quiz');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline mb-3">
                <FiArrowLeft /> Back to Dashboard
            </button>

            <h1 className="mb-3">{lecture?.title}</h1>

            <div className="flex gap-2 mb-4">
                <button
                    className={`btn ${activeTab === 'summary' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('summary')}
                >
                    <FiFileText /> Summary
                </button>
                <button
                    className={`btn ${activeTab === 'flashcards' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('flashcards')}
                >
                    <FiCreditCard /> Flashcards ({flashcards.length})
                </button>
                <button
                    className={`btn ${activeTab === 'quiz' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setActiveTab('quiz')}
                >
                    📝 Quizzes ({quizzes.length})
                </button>
            </div>

            {activeTab === 'summary' && (
                <div className="card">
                    <h2 className="mb-3">AI Summary</h2>
                    {summary ? (
                        <div style={{ color: 'var(--text-secondary)' }}>
                            <ReactMarkdown>{summary.content_markdown}</ReactMarkdown>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>No summary available</p>
                    )}

                    <div className="flex gap-2 mt-4">
                        <button onClick={handleGenerateFlashcards} className="btn btn-primary" disabled={generating}>
                            {generating ? 'Generating...' : 'Generate Flashcards'}
                        </button>
                        <button onClick={handleGenerateQuiz} className="btn btn-secondary" disabled={generating}>
                            {generating ? 'Generating...' : 'Generate Quiz'}
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'flashcards' && (
                <>
                    {flashcards.length > 0 ? (
                        <FlashcardViewer
                            flashcards={flashcards}
                            onUpdate={handleUpdateFlashcard}
                            onDelete={handleDeleteFlashcard}
                        />
                    ) : (
                        <div className="card text-center">
                            <p className="mb-3" style={{ color: 'var(--text-muted)' }}>No flashcards yet</p>
                            <button onClick={handleGenerateFlashcards} className="btn btn-primary" disabled={generating}>
                                {generating ? 'Generating...' : 'Generate Flashcards'}
                            </button>
                        </div>
                    )}
                </>
            )}

            {activeTab === 'quiz' && (
                <>
                    {!selectedQuiz ? (
                        <div>
                            {quizzes.length > 0 ? (
                                <div className="grid grid-2">
                                    {quizzes.map((quiz) => (
                                        <div key={quiz._id} className="card" onClick={() => setSelectedQuiz(quiz)} style={{ cursor: 'pointer' }}>
                                            <h3>{quiz.title}</h3>
                                            <p style={{ color: 'var(--text-secondary)' }}>
                                                {quiz.total_questions} questions
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="card text-center">
                                    <p className="mb-3" style={{ color: 'var(--text-muted)' }}>No quizzes yet</p>
                                    <button onClick={handleGenerateQuiz} className="btn btn-primary" disabled={generating}>
                                        {generating ? 'Generating...' : 'Generate Quiz'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button onClick={() => setSelectedQuiz(null)} className="btn btn-outline mb-3">
                                <FiArrowLeft /> Back to Quizzes
                            </button>
                            <QuizTaker quiz={selectedQuiz} onSubmit={handleSubmitQuiz} />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default LectureDetail;
