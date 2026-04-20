import React, { useState } from 'react';
import axios from 'axios';
import './MiniCourt.css';

interface Verdict {
  petitioner_argument: string;
  respondent_argument: string;
  judge_verdict: string;
  win_probability: number;
  critical_warning: string;
}

const MiniCourt: React.FC = () => {
  const [caseDescription, setCaseDescription] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  const handleSimulateTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseDescription.trim()) return;

    setIsLoading(true);
    setError('');
    setVerdict(null);

    try {
      const response = await api.post('/simulate-trial', {
        description: caseDescription.trim()
      });
      setVerdict(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to simulate trial');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setCaseDescription('');
    setVerdict(null);
    setError('');
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return '#10b981';
    if (probability >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="minicourt-wrapper">
      <div className="minicourt-container">
        {/* Left Panel - Input */}
        <div className="input-section">
          <div className="section-header">
            <h2>⚖️ Simulate Your Trial</h2>
            <p>Describe your legal case and get AI-powered verdict analysis</p>
          </div>

          <form className="trial-form" onSubmit={handleSimulateTrial}>
            {error && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="caseDescription">Case Description</label>
              <textarea
                id="caseDescription"
                placeholder="Describe your case in detail. Include parties involved, key facts, claims, and any evidence..."
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                disabled={isLoading}
                rows={10}
                className="case-textarea"
              />
              <div className="char-count">
                {caseDescription.length} / 2000 characters
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-simulate"
                disabled={!caseDescription.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-small"></span>
                    Analyzing...
                  </>
                ) : (
                  '⚡ Simulate Trial'
                )}
              </button>
              <button
                type="button"
                className="btn-clear"
                onClick={handleClear}
                disabled={isLoading}
              >
                🔄 Clear
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel - Result */}
        <div className="result-section">
          {!verdict ? (
            <div className="empty-result">
              <div className="empty-result-icon">📊</div>
              <h3>No Verdict Yet</h3>
              <p>Submit a case description to see AI-powered trial analysis</p>
            </div>
          ) : (
            <div className="verdict-display">
              {/* Probability Gauge */}
              <div className="probability-section">
                <div className="probability-gauge">
                  <svg className="gauge-svg" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={getProbabilityColor(verdict.win_probability)}
                      strokeWidth="3"
                      strokeDasharray={`${verdict.win_probability * 2.827} 282.7`}
                      strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                  </svg>
                  <div className="probability-text">
                    <div className="probability-value">{verdict.win_probability}%</div>
                    <div className="probability-label">Win Probability</div>
                  </div>
                </div>
              </div>

              {/* Verdict Section */}
              <div className="verdict-section">
                <h3>⚖️ Judge's Verdict</h3>
                <p>{verdict.judge_verdict}</p>
              </div>

              {/* Warning Section */}
              {verdict.critical_warning && (
                <div className="warning-section">
                  <h3>🔴 Critical Warning</h3>
                  <p>{verdict.critical_warning}</p>
                </div>
              )}

              {/* Arguments Section */}
              <div className="arguments-section">
                <div className="argument-box petitioner">
                  <h4>👨‍⚖️ Petitioner's Argument</h4>
                  <p>{verdict.petitioner_argument}</p>
                </div>
                <div className="argument-box respondent">
                  <h4>👩‍⚖️ Respondent's Argument</h4>
                  <p>{verdict.respondent_argument}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniCourt;
