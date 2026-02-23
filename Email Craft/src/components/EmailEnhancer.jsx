import React, { useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import { enhanceEmailText } from '../lib/mockAI';

const EmailEnhancer = () => {
    const [inputText, setInputText] = useState('');
    const [tone, setTone] = useState('Professional');
    const [enhancedText, setEnhancedText] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleEnhance = async () => {
        if (!inputText) return;
        setIsEnhancing(true);
        try {
            const result = await enhanceEmailText(inputText, tone);
            setEnhancedText(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsEnhancing(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(enhancedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Enhance Copy</h1>

            <div className="container-grid">
                <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Input</h3>
                    <textarea
                        className="glass-input"
                        rows="10"
                        placeholder="Paste your rough draft here..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        style={{ resize: 'vertical' }}
                    />

                    <div className="form-group">
                        <label className="label">Desired Tone</label>
                        <select
                            className="glass-input"
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                        >
                            <option value="Professional">Professional</option>
                            <option value="Witty">Witty</option>
                            <option value="Persuasive">Persuasive</option>
                            <option value="Friendly">Friendly</option>
                        </select>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={handleEnhance}
                        disabled={isEnhancing || !inputText}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <Wand2 size={18} />
                        {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                    </button>
                </section>

                <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Result</h3>
                        {enhancedText && (
                            <button className="btn-secondary" onClick={copyToClipboard} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        )}
                    </div>

                    <div className="glass-input" style={{ flex: 1, minHeight: '300px', whiteSpace: 'pre-line', background: 'rgba(0,0,0,0.2)' }}>
                        {enhancedText || <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>Enhanced result will appear here...</span>}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default EmailEnhancer;
