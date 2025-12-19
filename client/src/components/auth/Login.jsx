import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

const Login = () => {
    const [error, setError] = useState('');
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setError('');

        try {
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setIsGoogleLoading(true);

        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Google login failed. Please try again.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '3rem' }}>
            <div className="card fade-in">
                <h2 className="text-center mb-3">Welcome Back</h2>
                <p className="text-center mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Login to continue your learning journey
                </p>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label">
                            <FiMail style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-input"
                            {...register('email')}
                            placeholder="your@email.com"
                        />
                        {errors.email && (
                            <small style={{ color: 'var(--error)', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                                {errors.email.message}
                            </small>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FiLock style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-input"
                            {...register('password')}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <small style={{ color: 'var(--error)', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                                {errors.password.message}
                            </small>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                </div>

                <button 
                    onClick={handleGoogleLogin} 
                    className="btn btn-outline" 
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    disabled={isGoogleLoading}
                >
                    <FcGoogle size={20} />
                    {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
                </button>

                <p className="text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)' }}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
