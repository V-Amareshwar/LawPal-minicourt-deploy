import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirm, setForgotConfirm] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${apiBaseUrl}/auth/login`, {
        email,
        password
      });

      // Store token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotEmail || !forgotPassword) {
      setError('Please enter email and new password.');
      return;
    }
    if (forgotPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (forgotPassword !== forgotConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${apiBaseUrl}/auth/forgot-password`, {
        email: forgotEmail,
        newPassword: forgotPassword
      });
      setSuccess('Password updated. You can sign in now.');
      setShowForgot(false);
      setForgotEmail('');
      setForgotPassword('');
      setForgotConfirm('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Password reset failed.');
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

        {/* Right Panel - Login Form */}
        <div className="auth-panel auth-panel-right animate-slideInRight">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to access your legal workspace</p>
            </div>

            <form onSubmit={showForgot ? handleForgotPassword : handleLogin} className="auth-form">
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

              {/* Email Input */}
              <div className="form-group">
                <label htmlFor={showForgot ? 'forgot-email' : 'email'}>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    id={showForgot ? 'forgot-email' : 'email'}
                    type="email"
                    placeholder="you@example.com"
                    value={showForgot ? forgotEmail : email}
                    onChange={(e) => (showForgot ? setForgotEmail(e.target.value) : setEmail(e.target.value))}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="password">{showForgot ? 'New Password' : 'Password'}</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔐</span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={showForgot ? forgotPassword : password}
                    onChange={(e) => (showForgot ? setForgotPassword(e.target.value) : setPassword(e.target.value))}
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

              {showForgot && (
                <div className="form-group">
                  <label htmlFor="confirm">Confirm Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔐</span>
                    <input
                      id="confirm"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={forgotConfirm}
                      onChange={(e) => setForgotConfirm(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              {!showForgot && (
                <div className="form-actions">
                  <label className="checkbox-group">
                    <input type="checkbox" defaultChecked />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="link-primary button-link"
                    onClick={() => {
                      setShowForgot(true);
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-login"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    {showForgot ? 'Updating...' : 'Signing in...'}
                  </>
                ) : (
                  showForgot ? 'Update Password' : 'Sign In'
                )}
              </button>

              {/* Divider */}
              {!showForgot && (
                <>
                  <div className="form-divider">
                    <span>or</span>
                  </div>

                  {/* Sign Up Link */}
                  <div className="signup-prompt">
                    <p>Don't have an account?</p>
                    <button
                      type="button"
                      className="btn btn-outline btn-signup"
                      onClick={() => navigate('/signup')}
                    >
                      Create Account
                    </button>
                  </div>
                </>
              )}

              {showForgot && (
                <button
                  type="button"
                  className="btn btn-outline btn-signup"
                  onClick={() => {
                    setShowForgot(false);
                    setError('');
                    setSuccess('');
                  }}
                >
                  Back to Sign In
                </button>
              )}
            </form>

            {/* Footer */}
            <div className="form-footer">
              <p>
                By signing in, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;