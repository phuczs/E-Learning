import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lectureService } from '../services/lectureService';
import { flashcardService } from '../services/flashcardService';
import { quizService } from '../services/quizService';
import { offlineStorage } from '../utils/offlineStorage';
import FlashcardViewer from '../components/flashcards/FlashcardViewer';
import QuizTaker from '../components/quiz/QuizTaker';
import { FiArrowLeft, FiCreditCard, FiFileText } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';

const LectureDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [lecture, setLecture] = useState(null);
    const [summary, setSummary] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('summary');
    const [generating, setGenerating] = useState(false);
    const [flashcardCount, setFlashcardCount] = useState(10);
    const [quizCount, setQuizCount] = useState(10);

    useEffect(() => {
        fetchLectureData();
    }, [id]);

    const fetchLectureData = async () => {
        try {
            const isOnline = navigator.onLine;

            // Try to load from IndexedDB first if offline or as fallback
            if (!isOnline) {
                console.log('Offline mode - loading from IndexedDB');
                const cachedLecture = await offlineStorage.getLecture(id);
                const cachedFlashcards = await offlineStorage.getFlashcardsByLecture(id);
                const cachedQuizzes = await offlineStorage.getQuizzesByLecture(id);
                const cachedSummary = await offlineStorage.getSummaryByLecture(id);

                if (cachedLecture) {
                    setLecture(cachedLecture);
                    setSummary(cachedSummary?.summary || null);
                    setFlashcards(cachedFlashcards || []);
                    setQuizzes(cachedQuizzes || []);
                    setLoading(false);
                    return;
                } else {
                    throw new Error('Lecture not available offline. Please download it first.');
                }
            }

            // Online - fetch from API
            const [lectureRes, flashcardsRes, quizzesRes] = await Promise.all([
                lectureService.getById(id),
                flashcardService.getByLecture(id),
                quizService.getByLecture(id)
            ]);

            setLecture(lectureRes.data.lecture);
            setSummary(lectureRes.data.summary);
            setFlashcards(flashcardsRes.data.flashcards);
            setQuizzes(quizzesRes.data.quizzes);
        } catch (error) {
            console.error('Failed to fetch lecture data:', error);

            // If online fetch fails, try IndexedDB as fallback
            if (navigator.onLine) {
                console.log('API failed - trying IndexedDB fallback');
                try {
                    const cachedLecture = await offlineStorage.getLecture(id);
                    if (cachedLecture) {
                        const cachedFlashcards = await offlineStorage.getFlashcardsByLecture(id);
                        const cachedQuizzes = await offlineStorage.getQuizzesByLecture(id);
                        const cachedSummary = await offlineStorage.getSummaryByLecture(id);

                        setLecture(cachedLecture);
                        setSummary(cachedSummary?.summary || null);
                        setFlashcards(cachedFlashcards || []);
                        setQuizzes(cachedQuizzes || []);
                    }
                } catch (offlineError) {
                    console.error('IndexedDB fallback also failed:', offlineError);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateFlashcards = async () => {
        setGenerating(true);
        try {
            await flashcardService.generate(id, flashcardCount);
            await fetchLectureData();
            setActiveTab('flashcards');
            toast({
                title: 'Flashcards generated',
                description: `Successfully created ${flashcardCount} flashcards.`,
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Generation failed',
                description: error?.response?.data?.message || 'Could not generate flashcards. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setGenerating(false);
        }
    };

    const handleGenerateQuiz = async () => {
        setGenerating(true);
        try {
            await quizService.generate(id, { title: `Quiz: ${lecture.title}`, questionCount: quizCount });
            await fetchLectureData();
            setActiveTab('quiz');
            toast({
                title: 'Quiz generated',
                description: `Successfully created a quiz with ${quizCount} questions.`,
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Generation failed',
                description: error?.response?.data?.message || 'Could not generate quiz. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setGenerating(false);
        }
    };

    const handleUpdateFlashcard = async (flashcardId, data) => {
        try {
            await flashcardService.update(flashcardId, data);
            await fetchLectureData();
            toast({
                title: 'Flashcard updated',
                description: 'Your changes have been saved.',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Update failed',
                description: error?.response?.data?.message || 'Could not update the flashcard.',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteFlashcard = async (flashcardId) => {
        try {
            await flashcardService.delete(flashcardId);
            await fetchLectureData();
            toast({
                title: 'Flashcard deleted',
                description: 'The flashcard has been removed.',
                variant: 'success',
            });
        } catch (error) {
            toast({
                title: 'Delete failed',
                description: error?.response?.data?.message || 'Could not delete the flashcard.',
                variant: 'destructive',
            });
        }
    };

    const handleSubmitQuiz = async (answers) => {
        try {
            const response = await quizService.submit(selectedQuiz._id, answers);
            toast({
                title: 'Quiz submitted',
                description: 'Your answers have been submitted.',
                variant: 'success',
            });
            return response.data;
        } catch (error) {
            toast({
                title: 'Submit failed',
                description: error?.response?.data?.message || 'Could not submit your quiz.',
                variant: 'destructive',
            });
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
                        <div className="markdown-content" style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.8',
                            fontSize: '1rem',
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            whiteSpace: 'pre-wrap'
                        }}>
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, ...props }) => <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', marginTop: '1.5rem', marginBottom: '0.75rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }} {...props} />,
                                    h2: ({ node, ...props }) => <h2 style={{ color: 'var(--text-primary)', fontSize: '1.75rem', marginTop: '1.5rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }} {...props} />,
                                    h3: ({ node, ...props }) => <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }} {...props} />,
                                    h4: ({ node, ...props }) => <h4 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }} {...props} />,
                                    p: ({ node, ...props }) => <p style={{ margin: '1rem 0', lineHeight: '1.8', wordBreak: 'break-word', overflowWrap: 'anywhere' }} {...props} />,
                                    ul: ({ node, ...props }) => <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }} {...props} />,
                                    ol: ({ node, ...props }) => <ol style={{ margin: '1rem 0', paddingLeft: '2rem' }} {...props} />,
                                    li: ({ node, ...props }) => <li style={{ margin: '0.5rem 0', lineHeight: '1.6', wordBreak: 'break-word' }} {...props} />,
                                    code: ({ node, inline, ...props }) => inline ?
                                        <code style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.4rem', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '0.9em', color: 'var(--primary-light)' }} {...props} /> :
                                        <code style={{ display: 'block', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', overflowX: 'auto', margin: '1rem 0' }} {...props} />,
                                    strong: ({ node, ...props }) => <strong style={{ fontWeight: 700, color: 'var(--text-primary)' }} {...props} />,
                                }}
                            >
                                {summary.content_markdown}
                            </ReactMarkdown>
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

                    {flashcards.length > 0 && (
                        <div className="card mt-3" style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                            border: '2px dashed var(--primary)',
                            textAlign: 'center',
                            padding: 'var(--spacing-lg)'
                        }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)', fontSize: '0.95rem' }}>
                                Want more practice? Generate additional flashcards!
                            </p>
                            <button
                                onClick={handleGenerateFlashcards}
                                className="btn btn-primary"
                                disabled={generating}
                                style={{
                                    fontSize: '1rem',
                                    padding: '0.75rem 1.5rem',
                                    fontWeight: '600'
                                }}
                            >
                                <FiCreditCard style={{ marginRight: '0.5rem' }} />
                                {generating ? 'Generating...' : 'Generate More Flashcards'}
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

                            {quizzes.length > 0 && (
                                <div className="card mt-3" style={{
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                                    border: '2px dashed var(--success)',
                                    textAlign: 'center',
                                    padding: 'var(--spacing-lg)'
                                }}>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)', fontSize: '0.95rem' }}>
                                        Test your knowledge with another quiz!
                                    </p>
                                    <button
                                        onClick={handleGenerateQuiz}
                                        className="btn btn-primary"
                                        disabled={generating}
                                        style={{
                                            fontSize: '1rem',
                                            padding: '0.75rem 1.5rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        <FiFileText style={{ marginRight: '0.5rem' }} />
                                        {generating ? 'Generating...' : 'Generate Another Quiz'}
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
