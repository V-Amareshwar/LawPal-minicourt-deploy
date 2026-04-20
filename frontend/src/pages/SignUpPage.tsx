import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.css';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${apiBaseUrl}/auth/register`, {
        email,
        password,
        displayName
      });

      // Store token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Elements */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      <div className="bg-blob blob-3"></div>

      <div className="auth-container">
        {/* Left Panel - Branding */}
        <div className="auth-panel auth-panel-left animate-slideInLeft">
          <div className="panel-content">
            <h1 className="text-gradient">⚖️ LawPal</h1>
            <p className="panel-subtitle">Your AI-Powered Legal Assistant</p>
            
            <div className="benefits">
              <div className="benefit-item">
                <span className="benefit-icon">💬</span>
                <div>
                  <h4>24/7 Legal Support</h4>
                  <p>Get instant answers anytime</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">⚖️</span>
                <div>
                  <h4>AI Judge Simulation</h4>
                  <p>Understand potential verdicts</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">📚</span>
                <div>
                  <h4>Legal Knowledge Base</h4>
                  <p>Access Indian law expertise</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Sign Up Form */}
        <div className="auth-panel auth-panel-right animate-slideInRight">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Join thousands using LawPal for legal guidance</p>
            </div>

            <form onSubmit={handleSignUp} className="auth-form">
              {error && (
                <div className="error-message glass">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Display Name Input */}
              <div className="form-group">
                <label htmlFor="displayName">Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    id="displayName"
                    type="text"
                    placeholder="Your full name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔐</span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔐</span>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-login"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Divider */}
              <div className="form-divider">
                <span>or</span>
              </div>

              {/* Login Link */}
              <div className="signup-prompt">
                <p>Already have an account?</p>
                <button
                  type="button"
                  className="btn btn-outline btn-signup"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="form-footer">
              <p>
                By creating an account, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;