import React, { useState, useEffect } from 'react';

const CLIENT_ID = 'YOUR_GITHUB_OAUTH_CLIENT_ID';
const REDIRECT_URI = window.location.origin;

function App() {
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Check for GitHub OAuth code in URL
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    if (code && !token) {
      // Exchange code for access token (needs backend)
      // For demo, just save code as token placeholder
      setToken(code);
      window.history.replaceState({}, document.title, '/');
    }
  }, [token]);

  const loginWithGitHub = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo`;
    window.location.href = githubAuthUrl;
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
    // Placeholder for AI response
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'ai', text: 'AI response placeholder for: ' + input }]);
    }, 1000);
  };

  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h1>AI Chat with GitHub OAuth</h1>
        <button onClick={loginWithGitHub}>Login with GitHub</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Chat</h1>
      <div style={{ border: '1px solid #ccc', padding: 10, height: 400, overflowY: 'auto', marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === 'user' ? 'right' : 'left', margin: '5px 0' }}>
            <span style={{ background: msg.from === 'user' ? '#daf1da' : '#f1f0f0', padding: 8, borderRadius: 5, display: 'inline-block' }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ width: '80%', padding: 8 }}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} style={{ padding: '8px 12px', marginLeft: 8 }}>Send</button>
      </div>
    </div>
  );
}

export default App;
