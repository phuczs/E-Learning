import { useNavigate } from 'react-router-dom';
import { FiFile, FiTrash2, FiClock } from 'react-icons/fi';
import { lectureAPI } from '../../services/api';

const LectureList = ({ lectures, onDelete }) => {
    const navigate = useNavigate();

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this lecture?')) {
            try {
                await lectureAPI.delete(id);
                if (onDelete) onDelete();
            } catch (err) {
                alert('Failed to delete lecture');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!lectures || lectures.length === 0) {
        return (
            <div className="card text-center">
                <FiFile size={48} style={{ color: 'var(--text-muted)', margin: '2rem auto' }} />
                <p style={{ color: 'var(--text-muted)' }}>No lectures uploaded yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-2">
            {lectures.map((lecture) => (
                <div
                    key={lecture._id}
                    className="card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/lecture/${lecture._id}`)}
                >
                    <div className="flex-between mb-2">
                        <span className="badge">{lecture.media_type.toUpperCase()}</span>
                        <button
                            onClick={(e) => handleDelete(lecture._id, e)}
                            className="btn btn-danger"
                            style={{ padding: '0.5rem' }}
                        >
                            <FiTrash2 />
                        </button>
                    </div>

                    <h4 className="mb-2">{lecture.title}</h4>

                    <div className="flex gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        <FiClock />
                        <span>{formatDate(lecture.uploaded_at)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LectureList;
