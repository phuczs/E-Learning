import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiEdit2, FiTrash2 } from 'react-icons/fi';

const FlashcardViewer = ({ flashcards, onUpdate, onDelete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({});

    if (!flashcards || flashcards.length === 0) {
        return (
            <div className="card text-center">
                <p style={{ color: 'var(--text-muted)' }}>No flashcards available</p>
            </div>
        );
    }

    const currentCard = flashcards[currentIndex];

    const handleNext = () => {
        setFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    };

    const handlePrev = () => {
        setFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    };

    const handleEdit = () => {
        setEditData({
            front_text: currentCard.front_text,
            back_text: currentCard.back_text
        });
        setEditing(true);
    };

    const handleSave = async () => {
        if (onUpdate) {
            await onUpdate(currentCard._id, editData);
        }
        setEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm('Delete this flashcard?')) {
            if (onDelete) {
                await onDelete(currentCard._id);
            }
        }
    };

    return (
        <div>
            <div className="flex-between mb-3">
                <h3>Flashcards ({currentIndex + 1} / {flashcards.length})</h3>
                <div className="flex gap-2">
                    <button onClick={handleEdit} className="btn btn-outline">
                        <FiEdit2 /> Edit
                    </button>
                    <button onClick={handleDelete} className="btn btn-danger">
                        <FiTrash2 /> Delete
                    </button>
                </div>
            </div>

            {editing ? (
                <div className="card">
                    <div className="form-group">
                        <label className="form-label">Front (Question)</label>
                        <textarea
                            className="form-textarea"
                            value={editData.front_text}
                            onChange={(e) => setEditData({ ...editData, front_text: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Back (Answer)</label>
                        <textarea
                            className="form-textarea"
                            value={editData.back_text}
                            onChange={(e) => setEditData({ ...editData, back_text: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="btn btn-primary">Save</button>
                        <button onClick={() => setEditing(false)} className="btn btn-outline">Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <div
                        className={`flashcard ${flipped ? 'flipped' : ''}`}
                        onClick={() => setFlipped(!flipped)}
                    >
                        <div className="flashcard-inner">
                            <div className="flashcard-front">
                                <h3>{currentCard.front_text}</h3>
                                <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
                                    Click to reveal answer
                                </p>
                            </div>
                            <div className="flashcard-back">
                                <h3>{currentCard.back_text}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="flex-between mt-3">
                        <button onClick={handlePrev} className="btn btn-outline" disabled={flashcards.length === 1}>
                            <FiChevronLeft /> Previous
                        </button>
                        <button onClick={handleNext} className="btn btn-outline" disabled={flashcards.length === 1}>
                            Next <FiChevronRight />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default FlashcardViewer;
