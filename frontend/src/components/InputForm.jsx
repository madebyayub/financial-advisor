import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../styles/InputForm.css';

const InputForm = ({ onSubmit, disabled }) => {
  const [currentInput, setCurrentInput] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    messageInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!(currentInput.trim() || files.length > 0)) return;

    try {
      // Send message and files to parent component
      await onSubmit(currentInput.trim(), files);
      
      // Reset form state
      setCurrentInput('');
      setFiles([]);
      messageInputRef.current?.focus();
    } catch (error) {
      console.error('Error handling submit:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const newFile = e.target.files[0];
    if (!newFile) return;
    setFiles(prev => [...prev, newFile]);
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
    messageInputRef.current?.focus();
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('document')) return '📝';
    if (fileType.includes('sheet')) return '📊';
    return '📎';
  };

  return (
    <div className="input-container">
      <form className="input-form" onSubmit={handleSubmit}>
        <div className="input-row">
          {files.length > 0 && (
            <div className="file-preview">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <span className="file-icon">{getFileIcon(file.type)}</span>
                  <span className="file-name">{file.name}</span>
                  <button
                    type="button"
                    className="remove-file"
                    onClick={() => removeFile(file)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="input-controls">
            <button
              type="button"
              className="upload-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <input
              type="text"
              className="message-input"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type a message..."
              disabled={disabled}
              ref={messageInputRef}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept=".pdf,.csv,.xlsx,.xls"
            />
            <button
              type="submit"
              className="send-button"
              disabled={disabled || (!currentInput.trim() && files.length === 0)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h14"></path>
                <path d="M17 8l4 4-4 4"></path>
                <path d="M21 12h-4"></path>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputForm; 