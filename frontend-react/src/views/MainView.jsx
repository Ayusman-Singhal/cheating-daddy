import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardContent } from '../components/ui';
import styles from './MainView.module.css';

export const MainView = ({ onStart }) => {
  const [apiKey, setApiKey] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Load API key from localStorage
    const savedKey = localStorage.getItem('apiKey');
    if (savedKey) {
      setApiKey(savedKey);
    }

    // Listen for initialization status
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('session-initializing', (event, status) => {
        setIsInitializing(status);
      });
    }

    // Keyboard shortcut listener
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isStartShortcut = isMac 
        ? e.metaKey && e.key === 'Enter' 
        : e.ctrlKey && e.key === 'Enter';

      if (isStartShortcut) {
        e.preventDefault();
        handleStartClick();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (window.electron?.ipcRenderer) {
        window.electron.ipcRenderer.removeAllListeners('session-initializing');
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleApiKeyChange = (e) => {
    const value = e.target.value;
    setApiKey(value);
    localStorage.setItem('apiKey', value);
    if (showError) {
      setShowError(false);
    }
  };

  const handleStartClick = () => {
    if (!apiKey.trim()) {
      setShowError(true);
      return;
    }
    
    if (!isInitializing && onStart) {
      onStart(apiKey);
    }
  };

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutKey = isMac ? 'Cmd' : 'Ctrl';

  return (
    <div className={styles.container}>
      <Card className={styles.mainCard}>
        <CardContent>
          <h1 className={styles.welcome}>Welcome to Cheating Daddy</h1>
          
          <p className={styles.description}>
            Your AI-powered assistant for interviews and meetings. 
            Enter your Gemini API key to get started.
          </p>

          <div className={styles.inputGroup}>
            <Input
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={handleApiKeyChange}
              error={showError}
              className={showError ? styles.apiKeyError : ''}
            />
            
            <Button
              onClick={handleStartClick}
              disabled={isInitializing}
              className={`${styles.startButton} ${isInitializing ? styles.initializing : ''}`}
            >
              {isInitializing ? 'Initializing...' : 'Start'}
              <span className={styles.shortcutHint}>
                ({shortcutKey}+Enter)
              </span>
            </Button>
          </div>

          {showError && (
            <p className={styles.errorMessage}>
              Please enter a valid API key
            </p>
          )}

          <p className={styles.helpText}>
            Don't have an API key?{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Get one here
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
