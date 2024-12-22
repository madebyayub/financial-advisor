import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import RobotIcon from './RobotIcon';
import '../styles/MessagesList.css';

const MessagesList = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const messagesListRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const supportsScrollAnimations = CSS.supports('animation-timeline: view()');
    
    if (!supportsScrollAnimations && messagesListRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.target.classList.contains('message')) {
              if (!entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
              } else {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
              }
            }
          });
        },
        {
          root: messagesListRef.current,
          threshold: 0.1,
          rootMargin: '-20% 0px -20% 0px'
        }
      );

      const messages = messagesListRef.current.getElementsByClassName('message');
      Array.from(messages).forEach(message => {
        observer.observe(message);
      });

      return () => observer.disconnect();
    }
  }, [messages]);

  return (
    <div className="messages-list" ref={messagesListRef}>
      {messages.map((message, index) => {
        const isAI = message.startsWith('AI:');
        const messageContent = message.substring(message.indexOf(':') + 1).trim();
        
        return (
          <div key={index} className={`message ${isAI ? 'ai' : 'user'}`}>
            {isAI && <RobotIcon />}
            <div className="message-content">
              <ReactMarkdown>{messageContent}</ReactMarkdown>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList; 