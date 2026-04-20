import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfileSheet.css';

interface User {
  _id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt?: string;
}

interface ProfileSheetProps {
  user: User;
  onClose: () => void;
  onUpdate: (user: User) => void;
}

const ProfileSheet: React.FC<ProfileSheetProps> = ({ user, onClose, onUpdate }) => {
  const userId = user?._id || (user as any)?.id || '';
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;
      try {
        const response = await api.get('/auth/profile');
        onUpdate(response.data);
        setDisplayName(response.data.displayName || '');
        setEmail(response.data.email || '');
        setAvatarUrl(response.data.avatarUrl || '');
      } catch (err) {
        // Silent fail to avoid blocking UI when offline
      }
    };
    loadProfile();
  }, [token]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await api.patch('/auth/profile', {
        displayName,
        email,
        avatarUrl
      });
      onUpdate(response.data.user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await api.patch('/auth/change-password', {
        currentPassword,
        newPassword
      });
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="profile-backdrop" onClick={onClose}></div>

      {/* Profile Sheet */}
      <div className="profile-sheet glass animate-slideUp">
        {/* Header */}
        <div className="sheet-header">
          <h2>Profile</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Summary */}
        <div className="profile-summary">
          <div className="summary-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName || 'User'} />
            ) : (
              <div className="summary-initial">{(displayName || email || 'U').charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className="summary-info">
            <h3>{displayName || 'User'}</h3>
            <p>{email || 'Email not available'}</p>
            {user.createdAt && (
              <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
            )}
          </div>
          <div className="summary-actions">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsEditing(true);
                setActiveTab('general');
              }}
            >
              Edit Profile
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setIsEditing(true);
                setActiveTab('security');
              }}
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="error-message glass">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message glass">
            <span>✓</span>
            <span>{success}</span>
          </div>
        )}

        {/* General Tab */}
        {activeTab === 'general' && isEditing && (
          <form onSubmit={handleSaveProfile} className="profile-form">
            {/* Avatar Section */}
            <div className="avatar-section">
              <div className="avatar-display">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} />
                ) : (
                  <div className="avatar-initial">{(displayName || user.email).charAt(0).toUpperCase()}</div>
                )}
              </div>
              <div className="avatar-info">
                <h4>{displayName || 'User'}</h4>
                <p>{email}</p>
                {user.createdAt && (
                  <p className="joined-date">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatarUrl">Avatar URL</label>
              <input
                id="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                disabled={isLoading}
              />
              {avatarUrl && (
                <p className="hint">Avatar preview will update above</p>
              )}
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-item glass-sm">
                <span className="stat-label">User ID</span>
                <span className="stat-value">{userId ? `${userId.slice(0, 8)}...` : 'N/A'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setDisplayName(user.displayName || '');
                  setEmail(user.email || '');
                  setAvatarUrl(user.avatarUrl || '');
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && isEditing && (
          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="security-info">
              <h4>Change Password</h4>
              <p>Enter your current password and then set a new one</p>
            </div>

            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={isLoading}
                required
              />
            </div>

            <p className="password-hint">
              Password must be at least 6 characters long
            </p>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setIsEditing(false);
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default ProfileSheet;