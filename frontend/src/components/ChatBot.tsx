import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

interface Message {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

interface ChatSession {
  _id: string;
  title: string;
  type: 'ai' | 'judge';
  messages?: Message[];
}

const ChatBot: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('token');
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;

  // Create axios instance with auth
  const api = axios.create({
    baseURL: apiBaseUrl,
    headers: { Authorization: `Bearer ${token}` }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load or create session on mount
  useEffect(() => {
    loadOrCreateSession();
  }, []);

  const loadOrCreateSession = async () => {
    try {
      const response = await api.get('/chat/sessions');
      setSessions(response.data);
      if (response.data.length > 0) {
        loadSession(response.data[0]);
      } else {
        createNewSession();
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      createNewSession();
    }
  };

  const loadSession = async (session: ChatSession) => {
    try {
      const response = await api.get(`/chat/sessions/${session._id}/messages`);
      setCurrentSession(session);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const createNewSession = async (): Promise<ChatSession | null> => {
    try {
      const response = await api.post('/chat/sessions', {
        title: `Chat ${new Date().toLocaleDateString()}`,
        type: 'ai'
      });
      setCurrentSession(response.data);
      setMessages([]);
      setSessions((prev) => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Failed to create session:', error);
      return null;
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await api.delete(`/chat/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s._id !== sessionId));
      if (currentSession?._id === sessionId) {
        loadOrCreateSession();
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let activeSession = currentSession;
    if (!activeSession) {
      activeSession = await createNewSession();
      if (!activeSession) return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const messageContent = userMessage.content;
    const sessionId = activeSession._id;
    let assistantContent = '';

    try {
      if (!token) {
        setIsLoading(false);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '❌ Please log in again to continue chatting.'
        }]);
        return;
      }

      const eventSourceUrl = `${apiBaseUrl}/chat?message=${encodeURIComponent(
        messageContent
      )}&sessionId=${encodeURIComponent(sessionId)}&token=${encodeURIComponent(token)}`;

      const eventSource = new EventSource(eventSourceUrl);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.done) {
            eventSource.close();
            setIsLoading(false);
            return;
          }
          if (data?.type === 'thinking') {
            return;
          }
          assistantContent += data.content || '';
          
          setMessages(prev => {
            const updated = [...prev];
            if (updated[updated.length - 1]?.role === 'assistant') {
              updated[updated.length - 1].content = assistantContent;
            } else {
              updated.push({
                role: 'assistant',
                content: assistantContent
              });
            }
            return updated;
          });
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsLoading(false);
        
        if (assistantContent.trim()) {
          setMessages(prev => {
            const updated = [...prev];
            if (updated[updated.length - 1]?.role === 'assistant') {
              return updated;
            }
            return updated;
          });
        } else {
          try {
            loadSession(activeSession);
          } catch (error) {
            console.error('Fallback failed:', error);
          }
        }
      };

      setTimeout(() => {
        if (eventSource.readyState !== EventSource.CLOSED) {
          eventSource.close();
          setIsLoading(false);
        }
      }, 300000); // 5 minutes timeout

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      setIsLoading(false);

      try {
        console.log('⚠️ Attempting fallback: Loading from database...');
        await loadSession(activeSession);
      } catch (fallbackError) {
        console.error('❌ Fallback failed:', fallbackError);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '❌ Error: Could not connect to server. Please try again.'
        }]);
      }
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat History Sidebar */}
      <aside className={`chat-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h3>Chat History</h3>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle sidebar"
          >
            {sidebarOpen ? '✕' : '≡'}
          </button>
        </div>
        
        <button className="btn-new-chat" onClick={createNewSession}>
          + New Chat
        </button>

        <div className="sessions-list">
          {sessions.map((session) => (
            <div
              key={session._id}
              className={`session-item ${currentSession?._id === session._id ? 'active' : ''}`}
              onClick={() => loadSession(session)}
            >
              <span className="session-title">{session.title}</span>
              <button
                className="btn-delete-session"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session._id);
                }}
                title="Delete chat"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="chatbot-wrapper">
        {/* Messages Container */}
        <div className="messages-wrapper">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-content">
                <div className="empty-icon">⚖️</div>
                <h2>Start Your Legal Consultation</h2>
                <p>Ask any legal question and get AI-powered answers instantly</p>
                
                <div className="suggestions-grid">
                  <button
                    className="suggestion-item"
                    onClick={() => setInput('What is bail and how does it work?')}
                  >
                    <span className="suggestion-icon">🔔</span>
                    <span className="suggestion-text">Bail Process</span>
                  </button>
                  <button
                    className="suggestion-item"
                    onClick={() => setInput('Explain property laws in India')}
                  >
                    <span className="suggestion-icon">🏘️</span>
                    <span className="suggestion-text">Property Laws</span>
                  </button>
                  <button
                    className="suggestion-item"
                    onClick={() => setInput('What are my rights as a tenant?')}
                  >
                    <span className="suggestion-icon">🏠</span>
                    <span className="suggestion-text">Tenant Rights</span>
                  </button>
                  <button
                    className="suggestion-item"
                    onClick={() => setInput('How does contract law work?')}
                  >
                    <span className="suggestion-icon">📋</span>
                    <span className="suggestion-text">Contract Law</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {(() => {
                const lastMessage = messages[messages.length - 1];
                const showTypingIndicator = isLoading && (!lastMessage || lastMessage.role !== 'assistant');
                return (
                  <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message-item message-${msg.role}`}
                >
                  <div className={`message-bubble message-${msg.role}`}>
                    {msg.role === 'assistant' && <span className="msg-avatar">⚖️</span>}
                    <div className="msg-body">
                      <div className="msg-text">{msg.content}</div>
                    </div>
                    {msg.role === 'user' && <span className="msg-avatar">👤</span>}
                  </div>
                </div>
              ))}
              {showTypingIndicator && (
                <div className="message-item message-assistant">
                  <div className="message-bubble message-assistant">
                    <span className="msg-avatar">⚖️</span>
                    <div className="msg-body">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Input Area */}
        <form className="input-form" onSubmit={sendMessage}>
          <div className="input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage({ preventDefault: () => {} } as React.FormEvent);
                }
              }}
              placeholder="Ask your legal question..."
              className="input-field"
              disabled={isLoading}
              rows={1}
            />
            <button
              type="submit"
              className="btn-send"
              disabled={!input.trim() || isLoading}
              title="Send message"
            >
              {isLoading ? <span className="spinner-small"></span> : '➤'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
