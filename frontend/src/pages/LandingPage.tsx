import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features: Feature[] = [
    {
      icon: '💬',
      title: 'AI Legal Chatbot',
      description: 'Get instant answers to your legal questions using advanced RAG (Retrieval-Augmented Generation) powered by Indian legal documents.',
      gradient: 'gradient-primary'
    },
    {
      icon: '⚖️',
      title: 'Mini Court Room',
      description: 'Simulate court proceedings with AI judge. Understand potential verdicts and strengthen your legal arguments.',
      gradient: 'gradient-secondary'
    },
    {
      icon: '📚',
      title: 'Legal Database',
      description: 'Access comprehensive Indian legal information, case laws, and precedents in real-time.',
      gradient: 'gradient-accent'
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar glass">
        <div className="container nav-inner">
          <div className="logo">
            <h3 className="text-gradient">⚖️ LawPal</h3>
          </div>
          <div className="nav-actions">
            <button className="btn btn-outline" onClick={() => navigate('/login')}>
              Sign In
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content animate-slideUp">
            <span className="eyebrow">AI-Driven Legal Support</span>
            <h1 className="text-gradient">Your Legal Clarity, On Demand</h1>
            <p className="hero-subtitle">
              Ask legal questions, explore realistic case outcomes, and access Indian law in minutes. Built for speed, accuracy, and clarity.
            </p>

            <div className="hero-cta">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                Start Free
              </button>
              <button className="btn btn-secondary btn-lg">
                See How It Works
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-card glass-sm">
                <span className="stat-number">5s</span>
                <span className="stat-label">Average answer time</span>
              </div>
              <div className="stat-card glass-sm">
                <span className="stat-number">RAG</span>
                <span className="stat-label">Verified legal sources</span>
              </div>
              <div className="stat-card glass-sm">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Always available</span>
              </div>
            </div>
          </div>

          <div className="hero-visual animate-slideInRight">
            <div className="preview-card glass">
              <div className="preview-header">
                <span>💬 Live Consultation</span>
                <span className="pill">Secure</span>
              </div>
              <div className="preview-body">
                <div className="message user">What are my rights as a tenant?</div>
                <div className="message bot">Here’s a concise breakdown based on the Rent Control Act and recent case law...</div>
              </div>
              <div className="preview-footer">
                <span className="mini-tag">RAG Verified</span>
                <span className="mini-tag">Indian Law</span>
              </div>
            </div>
            <div className="outline-card glass-sm">
              <h4>Structured Guidance</h4>
              <ul>
                <li>✅ Relevant sections</li>
                <li>✅ Actionable next steps</li>
                <li>✅ Case insights</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">A complete legal toolkit</h2>
            <p className="section-subtitle">
              Purpose-built for Indian law, with verified sources and courtroom simulations.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card glass">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">Three clear steps from question to resolution.</p>
          </div>

          <div className="steps-list">
            <div className="step-row glass">
              <div className="step-badge">1</div>
              <div>
                <h4>Ask your legal question</h4>
                <p>Use natural language — we parse it instantly.</p>
              </div>
            </div>
            <div className="step-row glass">
              <div className="step-badge">2</div>
              <div>
                <h4>RAG verifies legal sources</h4>
                <p>We retrieve relevant acts, sections, and precedents.</p>
              </div>
            </div>
            <div className="step-row glass">
              <div className="step-badge">3</div>
              <div>
                <h4>Receive structured guidance</h4>
                <p>Get a clean summary and recommended next steps.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <h2>Start your legal journey with confidence</h2>
            <p>Get reliable legal guidance backed by Indian law sources.</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <p>&copy; 2024 LawPal. All rights reserved.</p>
          <span>Made with ⚖️ for justice</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;