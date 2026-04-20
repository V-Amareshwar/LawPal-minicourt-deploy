import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBot from '../components/ChatBot';
import MiniCourt from '../components/MiniCourt';
import ProfileSheet from '../components/ProfileSheet';
import './Dashboard.css';

type ActiveView = 'chat' | 'judge';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    if (stored && !stored._id && stored.id) {
      return { ...stored, _id: stored.id };
    }
    return stored;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleUpdateProfile = (updatedUser: any) => {
    const normalized = updatedUser && !updatedUser._id && updatedUser.id
      ? { ...updatedUser, _id: updatedUser.id }
      : updatedUser;
    setUser(normalized);
    localStorage.setItem('user', JSON.stringify(normalized));
  };

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <nav className="top-navbar">
        <div className="navbar-left">
          <h1 className="navbar-logo">⚖️ LawPal</h1>
        </div>

        <div className="navbar-center">
          <button
            className={`nav-tab ${activeView === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveView('chat')}
          >
            <span className="tab-icon">💬</span>
            <span className="tab-text">Legal Chatbot</span>
          </button>
          <button
            className={`nav-tab ${activeView === 'judge' ? 'active' : ''}`}
            onClick={() => setActiveView('judge')}
          >
            <span className="tab-icon">⚖️</span>
            <span className="tab-text">Mini Court</span>
          </button>
        </div>

        <div className="navbar-right">
          <button
            className="navbar-profile-btn"
            onClick={() => setShowProfile(true)}
            title={user?.displayName || 'User'}
          >
            <span className="navbar-avatar">{user?.displayName?.charAt(0) || 'U'}</span>
          </button>
          <button
            className="navbar-logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            🚪
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-view">
        {activeView === 'chat' && <ChatBot />}
        {activeView === 'judge' && <MiniCourt />}
      </main>

      {/* Profile Sheet */}
      {showProfile && (
        <ProfileSheet
          user={user}
          onClose={() => setShowProfile(false)}
          onUpdate={handleUpdateProfile}
        />
      )}
    </div>
  );
};

export default Dashboard;