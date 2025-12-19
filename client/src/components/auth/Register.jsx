import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const registerSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

const Register = () => {
    const [error, setError] = useState('');
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const { register: registerUser, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        setError('');

        try {
            await registerUser(data.email, data.password, data.full_name);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    const handleGoogleSignUp = async () => {
        setError('');
        setIsGoogleLoading(true);

        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Google sign up failed. Please try again.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', marginTop: '3rem' }}>
            <div className="card fade-in">
                <h2 className="text-center mb-3">Create Account</h2>
                <p className="text-center mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Start your AI-powered learning journey
                </p>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="form-label">
                            <FiUser style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            {...register('full_name')}
                            placeholder="John Doe"
                        />
                        {errors.full_name && (
                            <small style={{ color: 'var(--error)', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                                {errors.full_name.message}
                            </small>
                        )}
                    </div>

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

                    <div className="form-group">
                        <label className="form-label">
                            <FiLock style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="form-input"
                            {...register('confirmPassword')}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <small style={{ color: 'var(--error)', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                                {errors.confirmPassword.message}
                            </small>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                </div>

                <button 
                    onClick={handleGoogleSignUp} 
                    className="btn btn-outline" 
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    disabled={isGoogleLoading}
                >
                    <FcGoogle size={20} />
                    {isGoogleLoading ? 'Signing up...' : 'Continue with Google'}
                </button>

                <p className="text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)' }}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
