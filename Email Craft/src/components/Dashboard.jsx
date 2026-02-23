import { Plus, Search, Mail, FileText, TrendingUp, Sparkles, User } from 'lucide-react';

const Dashboard = ({ user, onViewProfile, onNewCampaign, stats, recentDrafts, onOpenDraft }) => {
    // Default values if no stats provided
    const { total = 0, drafts = 0, ready = 0 } = stats || {};

    return (
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Your Campaigns</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create AI-powered emails that convert</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button className="btn-new-campaign" onClick={onNewCampaign}>
                        <Plus size={18} />
                        New Campaign
                    </button>
                    <button
                        onClick={onViewProfile}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer'
                        }}
                        title="View Profile"
                    >
                        {user && user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                        ) : (
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                            }}>
                                {user ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                            </div>
                        )}
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Total Campaigns</div>
                        <div className="stat-value">{total}</div>
                    </div>
                    <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
                        <Mail size={20} />
                    </div>
                </div>

                <div className="stat-card">
                    <div>
                        <div className="stat-label">Drafts</div>
                        <div className="stat-value">{drafts}</div>
                    </div>
                    <div className="stat-icon" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#facc15' }}>
                        <FileText size={20} />
                    </div>
                </div>

                <div className="stat-card">
                    <div>
                        <div className="stat-label">Ready to Send</div>
                        <div className="stat-value">{ready}</div>
                    </div>
                    <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>
                        <TrendingUp size={20} />
                    </div>
                </div>
            </div>

            <div style={{ position: 'relative', marginBottom: '3rem' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="search-input"
                />
            </div>

            {recentDrafts && recentDrafts.length > 0 ? (
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Recall Recent Drafts</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {recentDrafts.map(draft => (
                            <div
                                key={draft.id}
                                className="glass-panel"
                                style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--border-color)' }}
                                onClick={() => onOpenDraft(draft)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                    <div style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        background: draft.status === 'ready' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                                        color: draft.status === 'ready' ? '#4ade80' : '#facc15',
                                        textTransform: 'uppercase',
                                        fontWeight: 600
                                    }}>
                                        {draft.status}
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {new Date(draft.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {draft.subjectLines && draft.subjectLines[0] ? draft.subjectLines[0] : 'Untitled Campaign'}
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {draft.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4rem 0',
                    marginTop: '2rem'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.5) 0%, rgba(15, 23, 42, 0) 100%)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                        <Sparkles size={32} color="#a78bfa" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Create your first campaign</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Let AI craft compelling email copy that drives conversions</p>
                    <button className="btn-new-campaign" onClick={onNewCampaign}>
                        <Plus size={18} />
                        New Campaign
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
