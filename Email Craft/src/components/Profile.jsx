import React, { useState, useRef, useEffect } from 'react';
import { User, Lock, Mail, Shield, Save, CheckCircle, AlertCircle, Camera, Edit, X, ZoomIn, ZoomOut, Sun, Moon } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../lib/cropUtils';
import { authService } from '../lib/authService';

const Profile = ({ user, onUpdateUser, theme, toggleTheme }) => {
    const [activeTab, setActiveTab] = useState('personal'); // personal | security
    const fileInputRef = useRef(null);

    // Personal Info State
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [initialState, setInitialState] = useState({ name: user.name, email: user.email });

    // Image Cropping State
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    // Security State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Status State
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    // Auto-dismiss message
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Check for changes
    const hasChanges = name !== initialState.name || email !== initialState.email;

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        try {
            const updatedUser = await authService.updateProfile(user.id, {
                name,
                email
            });
            onUpdateUser(updatedUser);
            setInitialState({ name: updatedUser.name, email: updatedUser.email });
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        setIsLoading(true);

        try {
            await authService.changePassword(user.id, currentPassword, newPassword);
            setMessage({ type: 'success', text: 'Password changed successfully.' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Only image files are allowed.' });
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImageSrc(reader.result);
            setIsCropping(true);
        });
        reader.readAsDataURL(file);
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSaveCroppedImage = async () => {
        setIsUploading(true);
        try {
            const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);

            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload

            const updatedUser = await authService.updateProfile(user.id, {
                avatar: croppedImageBase64
            });
            onUpdateUser(updatedUser);
            setMessage({ type: 'success', text: 'Profile picture updated successfully.' });
            setIsCropping(false);
            setImageSrc(null);
        } catch (e) {
            setMessage({ type: 'error', text: 'Failed to crop/upload image.' });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCancelCrop = () => {
        setIsCropping(false);
        setImageSrc(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Profile & Settings</h1>

            <div className="container-grid">
                {/* Sidebar / Tabs */}
                <div className="glass-panel" style={{ height: 'fit-content', padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <img
                                src={user.avatar}
                                alt={user.name}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    border: '3px solid var(--primary)',
                                    objectFit: 'cover'
                                }}
                            />
                            <button
                                onClick={triggerFileInput}
                                disabled={isUploading}
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    background: 'var(--primary)',
                                    border: '2px solid var(--bg-card)',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'white',
                                    padding: 0
                                }}
                            >
                                {isUploading ? (
                                    <div className="spinner" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                ) : (
                                    <Camera size={16} />
                                )}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{user.name}</h3>
                        <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                            onClick={() => setActiveTab('personal')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                                background: activeTab === 'personal' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: activeTab === 'personal' ? 'var(--primary)' : 'var(--text-muted)',
                                border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                                fontWeight: activeTab === 'personal' ? 500 : 400
                            }}
                        >
                            <User size={18} /> Personal Info
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                                background: activeTab === 'security' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-muted)',
                                border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                                fontWeight: activeTab === 'security' ? 500 : 400
                            }}
                        >
                            <Shield size={18} /> Security
                        </button>
                    </nav>

                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                        <button
                            onClick={toggleTheme}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                                padding: '0.75rem 1rem', background: 'transparent',
                                border: '1px solid var(--border-color)', borderRadius: '8px',
                                color: 'var(--text-main)', cursor: 'pointer'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {theme === 'light' ? <Sun size={18} className="text-primary" /> : <Moon size={18} className="text-primary" />}
                                <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                            </div>
                            <div style={{
                                width: '36px', height: '20px', background: theme === 'light' ? 'var(--primary)' : 'var(--border-color)',
                                borderRadius: '10px', position: 'relative', transition: 'background 0.3s'
                            }}>
                                <div style={{
                                    width: '16px', height: '16px', background: 'white', borderRadius: '50%',
                                    position: 'absolute', top: '2px', left: theme === 'light' ? '18px' : '2px',
                                    transition: 'left 0.3s'
                                }} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    {message && (
                        <div style={{
                            padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: message.type === 'success' ? '#4ade80' : '#ef4444',
                            border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                        }}>
                            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            {message.text}
                        </div>
                    )}

                    {activeTab === 'personal' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <User className="text-primary" /> Personal Information
                            </h2>
                            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="label">Full Name</label>
                                    <div className="input-with-icon">
                                        <Edit size={18} className="input-icon" />
                                        <input
                                            type="text"
                                            className="glass-input has-icon"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="label">Email Address</label>
                                    <div className="input-with-icon">
                                        <Mail size={18} className="input-icon" />
                                        <input
                                            type="email"
                                            className="glass-input has-icon"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={isLoading || !hasChanges}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: !hasChanges ? 0.5 : 1, cursor: !hasChanges ? 'not-allowed' : 'pointer' }}
                                    >
                                        {isLoading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Shield className="text-primary" /> Security Settings
                            </h2>
                            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="label">Current Password</label>
                                    <div className="input-with-icon">
                                        <Lock size={18} className="input-icon" />
                                        <input
                                            type="password"
                                            className="glass-input has-icon"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="label">New Password</label>
                                        <div className="input-with-icon">
                                            <Lock size={18} className="input-icon" />
                                            <input
                                                type="password"
                                                className="glass-input has-icon"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Confirm New Password</label>
                                        <div className="input-with-icon">
                                            <Lock size={18} className="input-icon" />
                                            <input
                                                type="password"
                                                className="glass-input has-icon"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <button type="submit" className="btn-primary" disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {isLoading ? 'Updating...' : <><Save size={18} /> Update Password</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Cropper Modal */}
            {isCropping && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h2 style={{ margin: 0 }}>Crop Profile Picture</h2>

                        <div style={{ position: 'relative', width: '100%', height: '300px', background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <ZoomOut size={20} />
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <ZoomIn size={20} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                onClick={handleCancelCrop}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'transparent',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveCroppedImage}
                                className="btn-primary"
                                disabled={isUploading}
                            >
                                {isUploading ? 'Saving...' : 'Apply & Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
