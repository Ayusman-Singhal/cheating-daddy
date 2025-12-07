import React, { useState, useEffect } from 'react';
import { Button, Input, Textarea } from '../components/ui';
import { applyAllSettings } from '../services/settings';
import styles from './CustomizeView.module.css';

const DEFAULT_SHORTCUTS = {
    moveUp: 'Ctrl+Up',
    moveDown: 'Ctrl+Down',
    moveLeft: 'Ctrl+Left',
    moveRight: 'Ctrl+Right',
    toggleVisibility: 'Ctrl+\\',
    toggleClickThrough: 'Ctrl+M',
    nextStep: 'Ctrl+Enter',
    previousResponse: 'Ctrl+[',
    nextResponse: 'Ctrl+]',
    scrollUp: 'Ctrl+Shift+Up',
    scrollDown: 'Ctrl+Shift+Down',
    emergencyErase: 'Ctrl+Shift+E'
};

const SHORTCUT_LABELS = {
    moveUp: 'Move Window Up',
    moveDown: 'Move Window Down',
    moveLeft: 'Move Window Left',
    moveRight: 'Move Window Right',
    toggleVisibility: 'Toggle Window Visibility',
    toggleClickThrough: 'Toggle Click-through Mode',
    nextStep: 'Ask Next Step',
    previousResponse: 'Previous Response',
    nextResponse: 'Next Response',
    scrollUp: 'Scroll Response Up',
    scrollDown: 'Scroll Response Down',
    emergencyErase: 'Emergency Erase (Clear All)'
};

const SHORTCUT_DESCRIPTIONS = {
    moveUp: 'Move the application window up',
    moveDown: 'Move the application window down',
    moveLeft: 'Move the application window left',
    moveRight: 'Move the application window right',
    toggleVisibility: 'Show/hide the application window',
    toggleClickThrough: 'Enable/disable click-through functionality',
    nextStep: 'Take screenshot and ask AI for the next step suggestion',
    previousResponse: 'Navigate to the previous AI response',
    nextResponse: 'Navigate to the next AI response',
    scrollUp: 'Scroll the AI response content up',
    scrollDown: 'Scroll the AI response content down',
    emergencyErase: 'Instantly clear all session data and quit the application'
};

const PROFILE_LABELS = {
    'job-interview': 'Job Interview',
    'coding-interview': 'Coding Interview',
    'general-assistant': 'General Assistant',
    'exam-helper': 'Exam Helper'
};

export const CustomizeView = () => {
    const [config, setConfig] = useState({
        profileType: 'job-interview',
        customInstructions: '',
        audioMode: 'speaker-only',
        stealthLevel: 'balanced',
        speechLanguage: 'en-US',
        layout: 'normal',
        backgroundTransparency: 80,
        responseFontSize: 28,
        captureInterval: 5,
        imageQuality: 'medium',
        enableGoogleSearch: true,
        enableAdvancedMode: false,
        shortcuts: DEFAULT_SHORTCUTS
    });
    
    const [isDirty, setIsDirty] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setIsLoading(true);
        try {
            if (window.electron?.ipcRenderer) {
                const result = await window.electron.ipcRenderer.invoke('get-config');
                if (result?.success && result?.config) {
                    setConfig(prev => ({
                        ...prev,
                        ...result.config,
                        shortcuts: { ...DEFAULT_SHORTCUTS, ...(result.config.shortcuts || {}) }
                    }));
                }
            }
        } catch (error) {
            console.error('Failed to load config:', error);
            setSaveStatus('Failed to load configuration');
        } finally {
            setIsLoading(false);
        }
    };

    const updateConfig = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
        setSaveStatus('');
    };

    const updateShortcut = (key, value) => {
        setConfig(prev => ({
            ...prev,
            shortcuts: { ...prev.shortcuts, [key]: value }
        }));
        setIsDirty(true);
        setSaveStatus('');
    };

    const saveSettings = async () => {
        try {
            if (!window.electron?.ipcRenderer) {
                setSaveStatus('Electron IPC not available');
                return;
            }

            const result = await window.electron.ipcRenderer.invoke('save-config', {
                ...config,
                onboarded: true
            });
            
            if (result?.success) {
                setIsDirty(false);
                setSaveStatus('✓ Settings saved successfully!');
                
                // Apply settings immediately (transparency, font size, etc.)
                applyAllSettings(config);
                
                // Update global shortcuts immediately
                if (window.electron?.ipcRenderer?.send) {
                    window.electron.ipcRenderer.send('update-keybinds', config.shortcuts);
                }
                
                // Store shortcuts in localStorage for compatibility with existing code
                try {
                    localStorage.setItem('customKeybinds', JSON.stringify(config.shortcuts));
                } catch (e) {
                    console.error('Failed to save shortcuts to localStorage:', e);
                }
                
                // Store advanced mode setting
                localStorage.setItem('advancedMode', config.enableAdvancedMode.toString());
                
                setTimeout(() => setSaveStatus(''), 3000);
            } else {
                setSaveStatus('Failed to save settings');
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
            setSaveStatus('Error saving settings');
        }
    };

    const resetToDefaults = () => {
        setConfig({
            profileType: 'job-interview',
            customInstructions: '',
            audioMode: 'speaker-only',
            stealthLevel: 'balanced',
            speechLanguage: 'en-US',
            layout: 'normal',
            backgroundTransparency: 80,
            responseFontSize: 28,
            captureInterval: 5,
            imageQuality: 'medium',
            enableGoogleSearch: true,
            enableAdvancedMode: false,
            shortcuts: DEFAULT_SHORTCUTS
        });
        setIsDirty(true);
        setSaveStatus('');
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading settings...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Settings</h1>
                <p>Configure application behavior, shortcuts, and preferences.</p>
            </header>

            {/* AI Profile & Behavior */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>AI PROFILE & BEHAVIOR</h2>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Profile Type
                        <span className={styles.badge}>{PROFILE_LABELS[config.profileType]}</span>
                    </label>
                    <select 
                        value={config.profileType}
                        onChange={(e) => updateConfig('profileType', e.target.value)}
                        className={styles.select}
                    >
                        <option value="job-interview">Job Interview</option>
                        <option value="coding-interview">Coding Interview</option>
                        <option value="general-assistant">General Assistant</option>
                        <option value="exam-helper">Exam Helper</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Custom AI Instructions</label>
                    <Textarea
                        value={config.customInstructions}
                        onChange={(e) => updateConfig('customInstructions', e.target.value)}
                        placeholder="Add specific instructions for how you want the AI to behave during Job Interview..."
                        rows={4}
                        className={styles.textarea}
                    />
                    <p className={styles.hint}>
                        Personalize the AI's behavior with specific instructions that will be added to the Job Interview base prompts
                    </p>
                </div>
            </section>

            {/* Audio & Microphone */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>AUDIO & MICROPHONE</h2>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Audio Mode</label>
                    <select 
                        value={config.audioMode}
                        onChange={(e) => updateConfig('audioMode', e.target.value)}
                        className={styles.select}
                    >
                        <option value="speaker-only">Speaker Only (Interviewer)</option>
                        <option value="microphone-only">Microphone Only (You)</option>
                        <option value="both">Both (Full Conversation)</option>
                    </select>
                    <p className={styles.hint}>Choose which audio sources to capture for the AI.</p>
                </div>
            </section>

            {/* Stealth Profile */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>STEALTH PROFILE</h2>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Profile</label>
                    <select 
                        value={config.stealthLevel}
                        onChange={(e) => updateConfig('stealthLevel', e.target.value)}
                        className={styles.select}
                    >
                        <option value="minimal">Minimal</option>
                        <option value="balanced">Balanced</option>
                        <option value="maximum">Maximum</option>
                    </select>
                    <p className={styles.hint}>
                        Adjusts visibility and detection resistance. A restart is required for changes to apply.
                    </p>
                </div>
            </section>

            {/* Language & Audio */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>LANGUAGE & AUDIO</h2>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Speech Language
                        <span className={styles.badge}>English (US)</span>
                    </label>
                    <select 
                        value={config.speechLanguage}
                        onChange={(e) => updateConfig('speechLanguage', e.target.value)}
                        className={styles.select}
                    >
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="es-ES">Spanish</option>
                        <option value="fr-FR">French</option>
                        <option value="de-DE">German</option>
                        <option value="ja-JP">Japanese</option>
                        <option value="zh-CN">Chinese (Simplified)</option>
                    </select>
                    <p className={styles.hint}>Language for speech recognition and AI responses</p>
                </div>
            </section>

            {/* Interface Layout */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>INTERFACE LAYOUT</h2>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Layout Mode
                        <span className={styles.badge}>Normal</span>
                    </label>
                    <select 
                        value={config.layout}
                        onChange={(e) => updateConfig('layout', e.target.value)}
                        className={styles.select}
                    >
                        <option value="compact">Compact</option>
                        <option value="normal">Normal</option>
                        <option value="expanded">Expanded</option>
                    </select>
                    <p className={styles.hint}>Standard layout with comfortable spacing and font sizes</p>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Background Transparency
                        <span className={styles.valueLabel}>{config.backgroundTransparency}%</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={config.backgroundTransparency}
                        onChange={(e) => updateConfig('backgroundTransparency', parseInt(e.target.value))}
                        className={styles.slider}
                    />
                    <div className={styles.sliderLabels}>
                        <span>Transparent</span>
                        <span>Opaque</span>
                    </div>
                    <p className={styles.hint}>Adjust the transparency of the interface background elements</p>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Response Font Size
                        <span className={styles.valueLabel}>{config.responseFontSize}px</span>
                    </label>
                    <input
                        type="range"
                        min="12"
                        max="32"
                        value={config.responseFontSize}
                        onChange={(e) => updateConfig('responseFontSize', parseInt(e.target.value))}
                        className={styles.slider}
                    />
                    <div className={styles.sliderLabels}>
                        <span>12px</span>
                        <span>32px</span>
                    </div>
                    <p className={styles.hint}>Adjust the font size of AI response text in the assistant view</p>
                </div>
            </section>

            {/* Screen Capture Settings */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>SCREEN CAPTURE SETTINGS</h2>
                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Capture Interval
                            <span className={styles.badge}>5s</span>
                        </label>
                        <select 
                            value={config.captureInterval}
                            onChange={(e) => updateConfig('captureInterval', parseInt(e.target.value))}
                            className={styles.select}
                        >
                            <option value="3">Every 3 seconds</option>
                            <option value="5">Every 5 seconds</option>
                            <option value="10">Every 10 seconds</option>
                            <option value="15">Every 15 seconds</option>
                            <option value="30">Every 30 seconds</option>
                        </select>
                        <p className={styles.hint}>Automatic screenshots will be taken at the specified interval</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Image Quality
                            <span className={styles.badge}>Medium</span>
                        </label>
                        <select 
                            value={config.imageQuality}
                            onChange={(e) => updateConfig('imageQuality', e.target.value)}
                            className={styles.select}
                        >
                            <option value="low">Low Quality</option>
                            <option value="medium">Medium Quality</option>
                            <option value="high">High Quality</option>
                        </select>
                        <p className={styles.hint}>Balanced quality and token usage</p>
                    </div>
                </div>
            </section>

            {/* Keyboard Shortcuts */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>KEYBOARD SHORTCUTS</h2>
                <div className={styles.shortcutList}>
                    {Object.entries(SHORTCUT_LABELS).map(([key, label]) => (
                        <div key={key} className={styles.shortcutItem}>
                            <div className={styles.shortcutInfo}>
                                <div className={styles.shortcutLabel}>{label}</div>
                                <div className={styles.shortcutDescription}>
                                    {SHORTCUT_DESCRIPTIONS[key]}
                                </div>
                            </div>
                            <Input
                                type="text"
                                value={config.shortcuts[key] || ''}
                                onChange={(e) => updateShortcut(key, e.target.value)}
                                className={styles.shortcutInput}
                            />
                        </div>
                    ))}
                </div>
                <Button
                    onClick={resetToDefaults}
                    variant="outline"
                    className={styles.resetButton}
                >
                    Reset to Defaults
                </Button>
                <p className={styles.hint}>
                    Restore all keyboard shortcuts to their default values
                </p>
            </section>

            {/* Google Search */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>GOOGLE SEARCH</h2>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={config.enableGoogleSearch}
                        onChange={(e) => updateConfig('enableGoogleSearch', e.target.checked)}
                        className={styles.checkbox}
                    />
                    <span>Enable Google Search</span>
                </label>
                <p className={styles.hint}>
                    Allow the AI to search Google for up-to-date information and facts during conversations<br/>
                    <strong>Note:</strong> Changes take effect when starting a new AI session
                </p>
            </section>

            {/* Advanced Mode */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <span className={styles.warningIcon}>⚠</span> ADVANCED MODE
                </h2>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={config.enableAdvancedMode}
                        onChange={(e) => updateConfig('enableAdvancedMode', e.target.checked)}
                        className={styles.checkbox}
                    />
                    <span>Enable Advanced Mode</span>
                </label>
                <p className={styles.hint}>
                    Unlock experimental features, developer tools, and advanced configuration options<br/>
                    <strong>Note:</strong> Advanced mode adds a new icon to the main navigation bar
                </p>
            </section>

            {/* Save Notice */}
            <div className={styles.saveNotice}>
                <span className={styles.saveIcon}>💡</span>
                Settings are automatically saved as you change them. Changes will take effect immediately or on the next session start.
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
                <Button
                    onClick={saveSettings}
                    disabled={!isDirty}
                    variant="default"
                >
                    Save All Settings
                </Button>
                <Button
                    onClick={resetToDefaults}
                    variant="outline"
                >
                    Reset Everything to Defaults
                </Button>
                {saveStatus && (
                    <span className={styles.status}>{saveStatus}</span>
                )}
            </div>
        </div>
    );
};
