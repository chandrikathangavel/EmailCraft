import React from 'react';
import { LayoutDashboard, PenLine, Zap, Wand2, FileText, LogOut, User } from 'lucide-react';

const Sidebar = ({ currentView, onViewChange, onLogout }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'create', label: 'New Campaign', icon: PenLine },
        { id: 'enhance', label: 'Enhance', icon: Wand2 },
        { id: 'drafts', label: 'Drafts', icon: FileText },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <aside style={{
            width: '260px',
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            flexShrink: 0,
            justifyContent: 'space-between'
        }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                    <div style={{
                        background: 'var(--primary-gradient)',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Zap size={20} color="white" fill="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>MailCraft</h2>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Email Writer</span>
                    </div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => {
                        const isActive = currentView === item.id;
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onViewChange(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    background: isActive ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)' : 'transparent',
                                    border: isActive ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
                                    borderRadius: '8px',
                                    color: isActive ? '#fff' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '0.95rem',
                                    fontWeight: isActive ? 500 : 400
                                }}
                            >
                                <Icon size={18} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <button
                onClick={onLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginTop: 'auto',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                }}
            >
                <LogOut size={18} />
                Log Out
            </button>
        </aside>
    );
};

export default Sidebar;
