import React, { useState, useEffect } from 'react';
import { X, Minus, Settings, HelpCircle, BookOpen, Microscope } from 'lucide-react';
import { Button } from '../ui';
import { windowService } from '../../services/window';
import styles from './Header.module.css';

export const Header = ({ 
  currentView = 'main',
  statusText = '',
  startTime = null,
  onCustomizeClick,
  onHelpClick,
  onHistoryClick,
  onAdvancedClick,
  onBackClick,
  isClickThrough = false,
  advancedMode = false,
}) => {
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    if (currentView === 'assistant' && startTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(`${elapsed}s`);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setElapsedTime('');
    }
  }, [currentView, startTime]);

  const getViewTitle = () => {
    const titles = {
      onboarding: 'Welcome to Cheating Daddy',
      main: 'Cheating Daddy',
      customize: 'Customize',
      help: 'Help & Shortcuts',
      history: 'Conversation History',
      advanced: 'Advanced Tools',
      assistant: 'Cheating Daddy',
    };
    return titles[currentView] || 'Cheating Daddy';
  };

  const isNavigationView = () => {
    const navigationViews = ['customize', 'help', 'history', 'advanced'];
    return navigationViews.includes(currentView);
  };

  const handleMinimize = () => {
    windowService.minimize();
  };

  const handleClose = () => {
    windowService.close();
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>{getViewTitle()}</div>
      <div className={styles.headerActions}>
        {currentView === 'assistant' && (
          <>
            <span className={styles.statusText}>{elapsedTime}</span>
            <span className={styles.statusText}>{statusText}</span>
          </>
        )}
        
        {currentView === 'main' && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onHistoryClick}
              className={styles.iconButton}
              title="History"
            >
              <BookOpen size={20} />
            </Button>
            
            {advancedMode && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onAdvancedClick}
                className={styles.iconButton}
                title="Advanced Tools"
              >
                <Microscope size={20} />
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onCustomizeClick}
              className={styles.iconButton}
              title="Customize"
            >
              <Settings size={20} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onHelpClick}
              className={styles.iconButton}
              title="Help"
            >
              <HelpCircle size={20} />
            </Button>
          </>
        )}

        {isNavigationView() && onBackClick && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onBackClick}
            className={styles.backButton}
          >
            ← Back
          </Button>
        )}

        {!isClickThrough && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleMinimize}
              className={styles.iconButton}
              title="Minimize"
            >
              <Minus size={20} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className={styles.iconButton}
              title="Close"
            >
              <X size={20} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
