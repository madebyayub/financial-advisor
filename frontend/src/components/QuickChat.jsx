import React from 'react';
import '../styles/QuickChat.css';

const QuickChat = ({ onQuickChatSelect }) => {
  const quickOptions = [
    {
      text: "Review finances",
      icon: "💰"
    },
    {
      text: "Investment advice",
      icon: "📈"
    },
    {
      text: "Budgeting help",
      icon: "📊"
    }
  ];

  return (
    <div className="quick-chat-container">
      <div className="quick-chat-options">
        {quickOptions.map((option, index) => (
          <button 
            key={index}
            className="quick-chat-button"
            onClick={() => onQuickChatSelect(option.text)}
          >
            <span className="quick-chat-icon">{option.icon}</span>
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickChat; 