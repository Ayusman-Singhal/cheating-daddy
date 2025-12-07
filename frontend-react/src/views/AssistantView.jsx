import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Send, Save } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { MarkdownRenderer } from '../components/shared/MarkdownRenderer';
import { geminiService } from '../services/gemini';
import styles from './AssistantView.module.css';

export const AssistantView = ({ selectedProfile = 'default' }) => {
  const [messages, setMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [savedResponses, setSavedResponses] = useState([]);
  const containerRef = useRef(null);
  const shouldAnimateRef = useRef(true);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, currentIndex]);

  useEffect(() => {
    // Listen for streaming updates from Gemini
    geminiService.onStreamingUpdate((data) => {
      if (data.text) {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          
          if (lastMessage && lastMessage.role === 'assistant') {
            // Update existing assistant message
            lastMessage.text = data.text;
            lastMessage.isComplete = data.isComplete;
          } else {
            // Add new assistant message
            newMessages.push({
              role: 'assistant',
              text: data.text,
              isComplete: data.isComplete,
              timestamp: Date.now(),
            });
          }
          
          return newMessages;
        });
        setIsLoading(!data.isComplete);
      }
    });

    return () => {
      geminiService.cleanup();
    };
  }, []);

  const handleSendText = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      text: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      await geminiService.sendMessage(input.trim());
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Error: ${error.message}`,
          isComplete: true,
          isError: true,
          timestamp: Date.now(),
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleNavigate = (direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < messages.length) {
      setCurrentIndex(newIndex);
      shouldAnimateRef.current = false;
    }
  };

  const handleSaveResponse = () => {
    if (messages.length > 0 && currentIndex >= 0) {
      const currentMessage = messages[currentIndex];
      if (currentMessage.role === 'assistant') {
        setSavedResponses((prev) => {
          if (prev.some((msg) => msg.timestamp === currentMessage.timestamp)) {
            return prev.filter((msg) => msg.timestamp !== currentMessage.timestamp);
          }
          return [...prev, currentMessage];
        });
      }
    }
  };

  const isCurrentSaved = () => {
    if (messages.length > 0 && currentIndex >= 0) {
      const currentMessage = messages[currentIndex];
      return savedResponses.some((msg) => msg.timestamp === currentMessage.timestamp);
    }
    return false;
  };

  const currentMessage = messages[currentIndex] || { role: 'assistant', text: '', isComplete: true };
  const assistantMessages = messages.filter((msg) => msg.role === 'assistant');
  const assistantIndex = assistantMessages.findIndex(
    (msg) => msg.timestamp === currentMessage.timestamp
  );

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.responseContainer}>
        {messages.length === 0 && !isLoading && (
          <div className={styles.emptyState}>
            <p>Start a conversation by typing a message below...</p>
          </div>
        )}
        
        {currentMessage.text && (
          <div className={styles.messageWrapper}>
            <MarkdownRenderer 
              content={currentMessage.text}
              className={shouldAnimateRef.current ? styles.animated : ''}
            />
          </div>
        )}
      </div>

      <div className={styles.textInputContainer}>
        {assistantMessages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className={styles.navButton}
              onClick={() => handleNavigate(-1)}
              disabled={assistantIndex <= 0}
            >
              <ChevronLeft size={20} />
            </Button>
            
            <span className={styles.responseCounter}>
              {assistantIndex + 1} / {assistantMessages.length}
            </span>
            
            <Button
              variant="ghost"
              size="icon"
              className={styles.navButton}
              onClick={() => handleNavigate(1)}
              disabled={assistantIndex >= assistantMessages.length - 1}
            >
              <ChevronRight size={20} />
            </Button>
          </>
        )}

        {currentMessage.role === 'assistant' && currentMessage.isComplete && (
          <Button
            variant="ghost"
            size="icon"
            className={`${styles.saveButton} ${isCurrentSaved() ? styles.saved : ''}`}
            onClick={handleSaveResponse}
            title={isCurrentSaved() ? 'Unsave Response' : 'Save Response'}
          >
            <Save size={20} />
          </Button>
        )}

        <Input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className={styles.textInput}
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={handleSendText}
          disabled={!input.trim() || isLoading}
          className={styles.sendButton}
        >
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
};
