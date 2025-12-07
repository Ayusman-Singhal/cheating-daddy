import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '../components/ui';
import styles from './OnboardingView.module.css';

export const OnboardingView = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    apiKey: '',
    userName: '',
    preferences: {},
  });

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      localStorage.setItem('apiKey', formData.apiKey);
      localStorage.setItem('userName', formData.userName);
      localStorage.setItem('onboardingComplete', 'true');
      if (onComplete) {
        onComplete(formData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.container}>
      <Card className={styles.onboardingCard}>
        <CardHeader>
          <CardTitle>Welcome to Cheating Daddy</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <div className={styles.step}>
              <h3>Step 1: API Key</h3>
              <p>Enter your Gemini API key to get started</p>
              <Input
                type="password"
                placeholder="Gemini API Key"
                value={formData.apiKey}
                onChange={(e) => updateFormData('apiKey', e.target.value)}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className={styles.step}>
              <h3>Step 2: Profile</h3>
              <p>Tell us a bit about yourself (optional)</p>
              <Input
                type="text"
                placeholder="Your Name"
                value={formData.userName}
                onChange={(e) => updateFormData('userName', e.target.value)}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.step}>
              <h3>Step 3: Ready to Go!</h3>
              <p>You're all set to start using Cheating Daddy</p>
            </div>
          )}

          <div className={styles.actions}>
            {currentStep > 0 && (
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep < 2 ? 'Next' : 'Get Started'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
