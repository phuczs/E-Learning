import { Link } from 'react-router-dom';
import { FiBook, FiZap, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

const Home = () => {
    return (
        <div className="container">
            <div className="hero fade-in">
                <h1 className="hero-title">AI Study Assistant</h1>
                <p className="hero-subtitle">
                    Transform your lectures into summaries, flashcards, and quizzes with the power of AI
                </p>
                <div className="flex-center gap-3">
                    <Link to="/register" className="btn btn-primary">
                        Get Started Free
                    </Link>
                    <Link to="/login" className="btn btn-outline">
                        Login
                    </Link>
                </div>
            </div>

            <div className="grid grid-3 mt-4">
                <div className="card text-center">
                    <FiBook size={48} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
                    <h3 className="mb-2">Upload Lectures</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Upload PDF, DOCX, or text files of your lecture materials
                    </p>
                </div>

                <div className="card text-center">
                    <FiZap size={48} style={{ color: 'var(--secondary)', margin: '0 auto 1rem' }} />
                    <h3 className="mb-2">AI Summarization</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Get instant AI-generated summaries in your preferred tone
                    </p>
                </div>

                <div className="card text-center">
                    <FiCreditCard size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
                    <h3 className="mb-2">Flashcards & Quizzes</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Generate interactive flashcards and quizzes to test your knowledge
                    </p>
                </div>
            </div>

            <div className="card mt-4">
                <h2 className="mb-3 text-center">How It Works</h2>
                <div className="grid grid-2">
                    <div className="flex gap-2 mb-3">
                        <FiCheckCircle size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
                        <div>
                            <h4>1. Upload Your Content</h4>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Drag and drop your lecture files or browse to upload
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                        <FiCheckCircle size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
                        <div>
                            <h4>2. AI Processing</h4>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Our AI analyzes and extracts key concepts automatically
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                        <FiCheckCircle size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
                        <div>
                            <h4>3. Get Summaries</h4>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Receive well-structured summaries in markdown format
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                        <FiCheckCircle size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
                        <div>
                            <h4>4. Study & Practice</h4>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Use flashcards and quizzes to reinforce your learning
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
