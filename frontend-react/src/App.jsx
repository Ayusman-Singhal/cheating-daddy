import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { MainView } from './views/MainView';
import { AssistantView } from './views/AssistantView';
import { OnboardingView } from './views/OnboardingView';
import { CustomizeView } from './views/CustomizeView';
import { HelpView } from './views/HelpView';
import { HistoryView } from './views/HistoryView';
import { AdvancedView } from './views/AdvancedView';
import { geminiService } from './services/gemini';
import { loadSettings, applyAllSettings } from './services/settings';
import styles from './App.module.css';

function App() {
  const [currentView, setCurrentView] = useState('onboarding');
  const [isClickThrough, setIsClickThrough] = useState(false);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    // Load and apply settings
    const initializeSettings = async () => {
      const config = await loadSettings();
      if (config) {
        applyAllSettings(config);
        
        // Check advanced mode from config
        if (config.enableAdvancedMode !== undefined) {
          setAdvancedMode(config.enableAdvancedMode);
        }
      }
    };

    initializeSettings();

    // Check if onboarding is complete
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (onboardingComplete === 'true') {
      setCurrentView('main');
    }

    // Check for advanced mode setting (fallback to localStorage)
    const savedAdvancedMode = localStorage.getItem('advancedMode');
    if (savedAdvancedMode === 'true') {
      setAdvancedMode(true);
    }
  }, []);

  const handleOnboardingComplete = (data) => {
    setCurrentView('main');
  };

  const handleStart = async (apiKey) => {
    try {
      setStatusText('Initializing...');
      await geminiService.initializeSession(apiKey);
      setCurrentView('assistant');
      setStartTime(Date.now());
      setStatusText('Ready');
    } catch (error) {
      console.error('Failed to start session:', error);
      setStatusText('Error');
    }
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setStartTime(null);
    setStatusText('');
  };

  const renderView = () => {
    switch (currentView) {
      case 'onboarding':
        return <OnboardingView onComplete={handleOnboardingComplete} />;
      case 'main':
        return <MainView onStart={handleStart} />;
      case 'assistant':
        return <AssistantView />;
      case 'customize':
        return <CustomizeView />;
      case 'help':
        return <HelpView />;
      case 'history':
        return <HistoryView />;
      case 'advanced':
        return <AdvancedView />;
      default:
        return <MainView onStart={handleStart} />;
    }
  };

  const getMainContentClass = () => {
    const classes = [styles.mainContent];
    
    if (currentView === 'assistant') {
      classes.push(styles.assistantView);
    } else if (currentView === 'onboarding') {
      classes.push(styles.onboardingView);
    } else {
      classes.push(styles.withBorder);
    }
    
    return classes.join(' ');
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.windowContainer}>
        <div className={styles.container}>
          <Header
            currentView={currentView}
            statusText={statusText}
            startTime={startTime}
            onCustomizeClick={() => setCurrentView('customize')}
            onHelpClick={() => setCurrentView('help')}
            onHistoryClick={() => setCurrentView('history')}
            onAdvancedClick={() => setCurrentView('advanced')}
            onBackClick={handleBackToMain}
            isClickThrough={isClickThrough}
            advancedMode={advancedMode}
          />
          
          <main className={getMainContentClass()}>
            <div className={styles.viewContainer}>
              {renderView()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
