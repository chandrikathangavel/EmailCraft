import React from 'react';

const Header = () => {
    return (
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                <span className="gradient-text">Email Craft</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
                Your AI-powered partner for crafting high-converting email campaigns.
            </p>
        </header>
    );
};

export default Header;
