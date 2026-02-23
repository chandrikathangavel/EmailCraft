import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CampaignForm from './components/CampaignForm';
import ResultsDisplay from './components/ResultsDisplay';
import EmailEnhancer from './components/EmailEnhancer';
import Drafts from './components/Drafts';
import Profile from './components/Profile';
import { generateEmailCampaign } from './lib/mockAI';
import { authService } from './lib/authService';

import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [results, setResults] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [drafts, setDrafts] = useState(() => {
    const saved = localStorage.getItem('emailCraftDrafts');
    return saved ? JSON.parse(saved) : [];
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const sessionUser = await authService.checkSession();
      if (sessionUser) {
        setUser(sessionUser);
      }
    };
    checkAuth();
  }, []);

  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update background image for light mode if needed, or rely on CSS
    if (theme === 'light') {
      document.body.style.backgroundImage = 'linear-gradient(rgba(243, 244, 246, 0.9), rgba(243, 244, 246, 0.95))';
    } else {
      document.body.style.backgroundImage = "linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), url('/background.jpg')";
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    localStorage.setItem('emailCraftDrafts', JSON.stringify(drafts));
  }, [drafts]);

  const handleGenerate = async (formData) => {
    setIsGenerating(true);
    try {
      const data = await generateEmailCampaign(formData);
      setResults(data);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = (status) => {
    if (!results) return;
    const newDraft = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: status, // 'draft' | 'ready'
      ...results
    };
    setDrafts(prev => [newDraft, ...prev]);
  };

  const handleOpenDraft = (draft) => {
    setResults({
      subjectLines: draft.subjectLines,
      body: draft.body
    });
    setCurrentView('create');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard
          user={user}
          onViewProfile={() => setCurrentView('profile')}
          onNewCampaign={() => setCurrentView('create')}
          stats={{
            total: drafts.length,
            drafts: drafts.filter(d => d.status === 'draft').length,
            ready: drafts.filter(d => d.status === 'ready').length
          }}
          recentDrafts={drafts.slice(0, 4)}
          onOpenDraft={handleOpenDraft}
        />;

      case 'enhance':
        return <EmailEnhancer />;

      case 'drafts':
        return <Drafts drafts={drafts} onOpen={handleOpenDraft} />;

      case 'profile':
        return <Profile user={user} onUpdateUser={setUser} theme={theme} toggleTheme={toggleTheme} />;

      case 'create':
      default:
        return (
          <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>New Campaign</h1>
            <div className="container-grid">
              <section>
                <CampaignForm onGenerate={handleGenerate} isGenerating={isGenerating} />
              </section>
              <section>
                <ResultsDisplay results={results} onSave={handleSaveDraft} />
              </section>
            </div>
          </div>
        );
    }
  };

  if (!user) {
    return <Login onLogin={(userData) => setUser(userData)} />;
  }

  return (
    <>
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {renderContent()}
      </main>
    </>
  );
}

export default App;
