import React, { useState } from 'react';
import { Save, Send, Check, Copy } from 'lucide-react';

const ResultsDisplay = ({ results, onSave }) => {
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [copiedBody, setCopiedBody] = useState(false);
    const [savedStatus, setSavedStatus] = useState(null); // 'draft' | 'ready' | null
    const [isSending, setIsSending] = useState(false);
    const [emailDetails, setEmailDetails] = useState({ from: '', to: '' });
    const [selectedSubject, setSelectedSubject] = useState(null);

    const copyToClipboard = (text, index = null) => {
        navigator.clipboard.writeText(text);
        if (index !== null) {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } else {
            setCopiedBody(true);
            setTimeout(() => setCopiedBody(false), 2000);
        }
    };

    const handleSave = (status) => {
        if (onSave) {
            onSave(status);
            setSavedStatus(status);
            setTimeout(() => setSavedStatus(null), 3000);
        }
    };

    const handleSendClick = () => {
        setIsSending(true);
    };

    const handleCancelSend = () => {
        setIsSending(false);
    };

    const handleConfirmSend = () => {
        if (!emailDetails.to) return;

        // specific logic to open Gmail
        const subject = selectedSubject || results.subjectLines[0] || "New Campaign";
        const body = encodeURIComponent(results.body);
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailDetails.to}&su=${encodeURIComponent(subject)}&body=${body}`;

        window.open(gmailLink, '_blank');

        handleSave('ready');
        setIsSending(false);
        setEmailDetails({ from: '', to: '' });
    };

    if (!results) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px', flexDirection: 'column', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>✨</div>
                <p>Enter details and click generate to see AI magic happen.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 className="gradient-text" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Subject Lines</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Select the subject line you want to use.</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {results.subjectLines.map((subject, index) => {
                        const isSelected = selectedSubject === subject;
                        return (
                            <li key={index} style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div
                                    className="glass-input"
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        border: isSelected ? '1px solid #8b5cf6' : '1px solid var(--border-color)',
                                        background: isSelected ? 'rgba(139, 92, 246, 0.1)' : undefined,
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => setSelectedSubject(subject)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '16px', height: '16px', borderRadius: '50%',
                                            border: isSelected ? '5px solid #8b5cf6' : '2px solid var(--text-muted)',
                                            boxSizing: 'border-box'
                                        }} />
                                        {subject}
                                    </div>
                                </div>
                                <button
                                    className="btn-secondary"
                                    onClick={() => copyToClipboard(subject, index)}
                                    title="Copy"
                                >
                                    {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 className="gradient-text" style={{ fontSize: '1.25rem', margin: 0 }}>Email Body</h3>
                    <button
                        className="btn-secondary"
                        onClick={() => copyToClipboard(results.body)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {copiedBody ? <Check size={16} /> : <Copy size={16} />}
                        {copiedBody ? 'Copied!' : 'Copy Body'}
                    </button>
                </div>
                <div
                    className="glass-input"
                    style={{
                        height: '300px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'sans-serif',
                        lineHeight: '1.6',
                        marginBottom: '1.5rem',
                        padding: '1rem'
                    }}
                >
                    {results.body.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={index} style={{ color: 'var(--primary)' }}>{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </div>

                {!isSending ? (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="btn-secondary"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderColor: savedStatus === 'draft' ? '#facc15' : '' }}
                            onClick={() => handleSave('draft')}
                        >
                            {savedStatus === 'draft' ? <Check size={18} /> : <Save size={18} />}
                            {savedStatus === 'draft' ? 'Saved as Draft' : 'Save as Draft'}
                        </button>

                        <button
                            className="btn-primary"
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            onClick={handleSendClick}
                        >
                            <Send size={18} />
                            Ready to Send
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="label" style={{ marginBottom: '0.5rem', display: 'block' }}>From:</label>
                            <input
                                type="email"
                                className="glass-input"
                                placeholder="sender@example.com"
                                value={emailDetails.from}
                                onChange={(e) => setEmailDetails({ ...emailDetails, from: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="label" style={{ marginBottom: '0.5rem', display: 'block' }}>To:</label>
                            <input
                                type="email"
                                className="glass-input"
                                placeholder="recipient@example.com"
                                value={emailDetails.to}
                                onChange={(e) => setEmailDetails({ ...emailDetails, to: e.target.value })}
                            />
                        </div>

                        {(selectedSubject) && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                                <strong>Sending with Subject:</strong> {selectedSubject}
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                            <button
                                className="btn-secondary"
                                onClick={handleCancelSend}
                                style={{ minWidth: '120px' }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleConfirmSend}
                                disabled={!emailDetails.to}
                                style={{
                                    minWidth: '120px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    opacity: !emailDetails.to ? 0.5 : 1,
                                    cursor: !emailDetails.to ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <Send size={16} />
                                Send Email
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsDisplay;
