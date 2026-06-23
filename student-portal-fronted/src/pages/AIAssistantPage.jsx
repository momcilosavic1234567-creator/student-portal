import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import { askAI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'ai',
  content: `Hi! I'm your **AI Academic Assistant** powered by Gemini. 🎓

I can help you with:
- **Explaining concepts** from any subject
- **Study tips** and learning strategies
- **Essay and writing** guidance
- **Math and science** problem solving
- **Career advice** for students

What would you like to explore today?`,
};

const SUGGESTIONS = [
  'Explain the difference between supervised and unsupervised learning',
  'Give me tips for writing a strong research paper',
  'What is the central limit theorem?',
  'How do I prepare for a technical interview?',
];

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);
  const textareaRef             = useRef(null);

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'SU';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const prompt = text.trim();
    if (!prompt || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: prompt }]);
    setLoading(true);

    try {
      const { data } = await askAI(prompt);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', content: data.response }]);
    } catch (err) {
      const msg = err.response?.data?.detail || 'AI request failed. Please try again.';
      toast.error(msg);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: `Sorry, I encountered an error: ${msg}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    toast.success('Chat cleared');
  };

  return (
    <Layout title="AI Assistant">
      <div className="page-header">
        <div className="page-header-left">
          <h1>AI Academic Assistant</h1>
          <p>Ask anything about your studies, career, or coursework</p>
        </div>
        {messages.length > 1 && (
          <button className="btn btn-ghost btn-sm" onClick={clearChat} id="ai-clear-btn">
            <Trash2 size={14} />
            Clear chat
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #cba6f7, #89b4fa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={16} color="#1e1e2e" />
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>Gemini Academic Assistant</div>
            <div style={{ fontSize: '0.73rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
              Online
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <div className="chat-container">
            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-message ${msg.role}`}>
                  <div className={`chat-avatar ${msg.role === 'ai' ? 'ai-avatar' : 'user-avatar-chat'}`}>
                    {msg.role === 'ai' ? <Bot size={16} /> : initials}
                  </div>
                  <div className="chat-bubble">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="chat-message ai">
                  <div className="chat-avatar ai-avatar">
                    <Bot size={16} />
                  </div>
                  <div className="chat-typing">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 16 }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="btn btn-secondary btn-sm"
                    onClick={() => send(s)}
                    style={{ fontSize: '0.78rem', borderRadius: 'var(--radius-full)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="chat-input-area">
              <textarea
                ref={textareaRef}
                id="ai-chat-input"
                className="chat-input"
                placeholder="Ask me anything… (Enter to send, Shift+Enter for new line)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                id="ai-send-btn"
                className="chat-send-btn"
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
