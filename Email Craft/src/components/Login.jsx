import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sparkles, User, ArrowLeft } from 'lucide-react';
import { authService } from '../lib/authService';
import './Login.css';

const Login = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // UI States
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            if (isForgotPassword) {
                const res = await authService.resetPassword(email);
                setSuccessMessage(res.message);
                setIsLoading(false);
                return;
            }

            if (isLogin) {
                const user = await authService.login(email, password);
                onLogin(user);
            } else {
                await authService.signup(name, email, password);
                setSuccessMessage('Account created successfully.');
                setIsLogin(true); // Switch to login mode
                // Reset form fields
                setEmail('');
                setPassword('');
                setName('');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };


    const toggleMode = (e) => {
        e.preventDefault();
        setIsLogin(!isLogin);
        setError('');
        setSuccessMessage('');
    };

    const toggleForgotPassword = (e) => {
        e.preventDefault();
        setIsForgotPassword(!isForgotPassword);
        setError('');
        setSuccessMessage('');
    };

    // Render Forgot Password View
    if (isForgotPassword) {
        return (
            <div className="login-container">
                <div className="login-card glass-panel">
                    <div className="login-header">
                        <button
                            onClick={toggleForgotPassword}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1rem',
                                padding: 0
                            }}
                        >
                            <ArrowLeft size={16} /> Back to Login
                        </button>
                        <h2>Reset Password</h2>
                        <p className="subtitle">Enter your email to receive a reset link</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}
                        {successMessage && (
                            <div className="error-message" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>
                                {successMessage}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="label" htmlFor="reset-email">Email Address</label>
                            <div className="input-with-icon">
                                <Mail size={18} className="input-icon" />
                                <input
                                    id="reset-email"
                                    type="email"
                                    className="glass-input has-icon"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary login-btn" disabled={isLoading}>
                            {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Render Login / Signup View
    return (
        <div className="login-container">
            <div className="login-card glass-panel">
                <div className="login-header">
                    <div className="login-logo" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'rgba(139, 92, 246, 0.2)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(139, 92, 246, 0.3)'
                        }}>
                            <Sparkles size={28} color="#a78bfa" />
                        </div>
                    </div>
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p className="subtitle">{isLogin ? 'Sign in to continue to Email Craft' : 'Get started with Email Craft today'}</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    {successMessage && (
                        <div className="error-message" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>
                            {successMessage}
                        </div>
                    )}

                    {!isLogin && (
                        <div className="form-group">
                            <label className="label" htmlFor="name">Full Name</label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input
                                    id="name"
                                    type="text"
                                    className="glass-input has-icon"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="label" htmlFor="email">Email or Username</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                id="email"
                                type="text"
                                className="glass-input has-icon"
                                placeholder="Enter your email or username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="glass-input has-icon"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {isLogin && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                <button onClick={toggleForgotPassword} className="forgot-password" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                    Forgot password?
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>


                    <div className="login-footer">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            className="text-link"
                            onClick={toggleMode}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                padding: 0,
                                font: 'inherit',
                                textDecoration: 'none',
                                fontWeight: 500
                            }}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
