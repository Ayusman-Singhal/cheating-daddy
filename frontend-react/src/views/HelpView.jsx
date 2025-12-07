import React from 'react';
import styles from './HelpView.module.css';

const shortcuts = [
    { action: 'Move Up', key: 'Ctrl+Up' },
    { action: 'Move Down', key: 'Ctrl+Down' },
    { action: 'Move Left', key: 'Ctrl+Left' },
    { action: 'Move Right', key: 'Ctrl+Right' },
    { action: 'Toggle Visibility', key: 'Ctrl+\\' },
    { action: 'Toggle Click-Through', key: 'Ctrl+M' },
    { action: 'Next Step', key: 'Ctrl+Enter' },
    { action: 'Previous Response', key: 'Ctrl+[' },
    { action: 'Next Response', key: 'Ctrl+]' },
    { action: 'Scroll Up', key: 'Ctrl+Shift+Up' },
    { action: 'Scroll Down', key: 'Ctrl+Shift+Down' },
    { action: 'Emergency Erase', key: 'Ctrl+Shift+E' }
];

export const HelpView = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Help & Documentation</h1>
                <p>Reference guide for application controls and shortcuts.</p>
            </header>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Global Keyboard Shortcuts</h2>
                <div className={styles.shortcutGrid}>
                    {shortcuts.map((item, index) => (
                        <div key={index} className={styles.shortcutCard}>
                            <span className={styles.actionName}>{item.action}</span>
                            <kbd className={styles.keyCombo}>{item.key}</kbd>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Usage Tips</h2>
                <ul className={styles.tipsList}>
                    <li>Use <strong>Toggle Visibility</strong> to quickly hide the overlay during screen shares.</li>
                    <li><strong>Click-Through Mode</strong> allows you to interact with windows behind the application.</li>
                    <li>Use <strong>Emergency Erase</strong> to instantly clear all current session data.</li>
                </ul>
            </section>
        </div>
    );
};
