import React from 'react';
import MessagesList from './MessagesList';
import InputForm from './InputForm';
import WelcomeMessage from './WelcomeMessage';
import QuickChat from './QuickChat';
import '../styles/ChatContainer.css';

const ChatContainer = ({ messages, onSubmit, isLoading, error }) => {
  const hasMessages = messages.length > 1;

  const handleSubmit = async (message, files) => {
    try {
      await onSubmit(message, files);
    } catch (error) {
      console.error('Error in message submission:', error);
    }
  };

  return (
    <div className={`chat-container ${!hasMessages ? 'welcome-state' : ''}`}>
      {hasMessages ? (
        <MessagesList messages={messages} />
      ) : (
        <WelcomeMessage />
      )}
      {isLoading && <div className="loading-indicator">AI is thinking...</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="input-section">
        <InputForm onSubmit={handleSubmit} disabled={isLoading} />
        <QuickChat onQuickChatSelect={handleSubmit} />
      </div>
    </div>
  );
};

export default ChatContainer; 