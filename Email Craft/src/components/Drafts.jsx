import React from 'react';
import { FileText, Calendar, ArrowRight } from 'lucide-react';

const Drafts = ({ drafts, onOpen }) => {
    if (!drafts || drafts.length === 0) {
        return (
            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    width: '64px', height: '64px',
                    background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
                }}>
                    <FileText size={32} color="var(--text-muted)" />
                </div>
                <h2 style={{ marginBottom: '0.5rem' }}>No drafts yet</h2>
                <p style={{ color: 'var(--text-muted)' }}>Generate a campaign and save it to see it here.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Drafts</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {drafts.map((draft) => (
                    <div key={draft.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <span style={{
                                background: draft.status === 'ready' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                color: draft.status === 'ready' ? '#4ade80' : '#facc15',
                                padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600
                            }}>
                                {draft.status === 'ready' ? 'Ready to Send' : 'Draft'}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={12} />
                                {new Date(draft.date).toLocaleDateString()}
                            </span>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {draft.subjectLines[0]}
                        </h3>

                        <p style={{
                            fontSize: '0.9rem', color: 'var(--text-muted)',
                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0
                        }}>
                            {draft.body}
                        </p>

                        <button
                            className="btn-secondary"
                            style={{ marginTop: 'auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            onClick={() => onOpen(draft)}
                        >
                            Open <ArrowRight size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Drafts;
