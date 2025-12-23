import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { lectureService } from '../../services/lectureService';
import { FiUpload, FiFile } from 'react-icons/fi';

const LectureUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [tone, setTone] = useState('concise');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const { toast } = useToast();

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            if (!title) {
                setTitle(e.dataTransfer.files[0].name);
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            if (!title) {
                setTitle(e.target.files[0].name);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('tone', tone);

        try {
            await lectureService.upload(formData);
            setFile(null);
            setTitle('');
            setTone('concise');
            if (onUploadSuccess) onUploadSuccess();
            toast({
                title: 'Upload successful',
                description: 'Your lecture was uploaded and summarized successfully.',
                variant: 'success',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
            toast({
                title: 'Upload failed',
                description: err?.response?.data?.message || 'An error occurred. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 className="mb-3">Upload Lecture</h3>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div
                    className={`file-upload ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    <input
                        id="fileInput"
                        type="file"
                        accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <FiUpload size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                    <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                        {file ? file.name : 'Drop your file here or click to browse'}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Supports PDF, DOCX, TXT, and images (max 10MB)
                    </p>
                </div>

                {file && (
                    <>
                        <div className="form-group mt-3">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Lecture title"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Summary Tone</label>
                            <select
                                className="form-select"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                            >
                                <option value="concise">Concise</option>
                                <option value="detailed">Detailed</option>
                                <option value="simple">Simple</option>
                                <option value="academic">Academic</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Uploading & Generating Summary...' : 'Upload & Generate Summary'}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
};

export default LectureUpload;
