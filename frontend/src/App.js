import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ChatContainer from './components/ChatContainer';
import FinancialSidebar from './components/FinancialSidebar';
import axios from 'axios';
import './App.css';

function ChatView() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMessages(["AI: Hi! I'm your AI financial advisor, let's chat!"]);
  }, []);

  const handleNewMessage = async (message, files) => {
    setError(null);
    
    if (message) {
      setMessages(prev => [...prev, `You: ${message}`]);
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/chat/message', {
        message,
        files: files ? files.map(f => ({ name: f.name, type: f.type, analysis: f.analysis })) : []
      });
      setMessages(prev => [...prev, `AI: ${response.data.response}`]);
    } catch (error) {
      console.error('Error:', error);
      setError("Sorry, your message can't be processed right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <div className="main-content">
        <header className="chat-header">
          <h1>Personal Financial Advisor</h1>
          <p>Your AI-powered guide to financial success</p>
        </header>
        <div className="chat-section">
          <ChatContainer 
            messages={messages} 
            onSubmit={handleNewMessage}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
      <FinancialSidebar />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/chat" element={<ChatView />} />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App; 