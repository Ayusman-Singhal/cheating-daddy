if (require('electron-squirrel-startup')) {
    process.exit(0);
}

const { app, BrowserWindow, shell, ipcMain } = require('electron');
const { createWindow, updateGlobalShortcuts } = require('./utils/window');
const { setupGeminiIpcHandlers, stopMacOSAudioCapture, sendToRenderer } = require('./utils/gemini');
const { initializeRandomProcessNames } = require('./utils/processRandomizer');
const { applyAntiAnalysisMeasures } = require('./utils/stealthFeatures');
const { getLocalConfig, writeConfig } = require('./config');

const geminiSessionRef = { current: null };
let mainWindow = null;

// Initialize random process names for stealth
const randomNames = initializeRandomProcessNames();

function createMainWindow() {
    mainWindow = createWindow(sendToRenderer, geminiSessionRef, randomNames);
    return mainWindow;
}

app.whenReady().then(async () => {
    // Apply anti-analysis measures with random delay
    await applyAntiAnalysisMeasures();

    createMainWindow();
    setupGeminiIpcHandlers(geminiSessionRef);
    setupGeneralIpcHandlers();
    setupReactCompatibleHandlers(geminiSessionRef);
});

app.on('window-all-closed', () => {
    stopMacOSAudioCapture();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    stopMacOSAudioCapture();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

function setupGeneralIpcHandlers() {
    // Window operation handlers
    ipcMain.on('minimize-window', () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) win.minimize();
    });

    ipcMain.on('close-window', () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) win.close();
    });

    ipcMain.on('resize-window', (event, { width, height, animated }) => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
            if (animated) {
                win.setSize(width, height, true);
            } else {
                win.setSize(width, height);
            }
        }
    });

    ipcMain.on('set-ignore-mouse-events', (event, { ignore, options }) => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
            win.setIgnoreMouseEvents(ignore, options);
        }
    });

    ipcMain.on('set-clickthrough', (event, enabled) => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
            win.setIgnoreMouseEvents(enabled, { forward: true });
        }
    });

    ipcMain.on('toggle-always-on-top', () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
            const isAlwaysOnTop = win.isAlwaysOnTop();
            win.setAlwaysOnTop(!isAlwaysOnTop);
        }
    });

    ipcMain.on('center-window', () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) win.center();
    });

    ipcMain.handle('get-window-bounds', () => {
        const win = BrowserWindow.getFocusedWindow();
        return win ? win.getBounds() : null;
    });

    ipcMain.handle('get-screen-size', () => {
        const { screen } = require('electron');
        const primaryDisplay = screen.getPrimaryDisplay();
        return primaryDisplay.workAreaSize;
    });

    // Config-related IPC handlers
    ipcMain.handle('set-onboarded', async (event) => {
        try {
            const config = getLocalConfig();
            config.onboarded = true;
            writeConfig(config);
            return { success: true, config };
        } catch (error) {
            console.error('Error setting onboarded:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('set-stealth-level', async (event, stealthLevel) => {
        try {
            const validLevels = ['visible', 'balanced', 'ultra'];
            if (!validLevels.includes(stealthLevel)) {
                throw new Error(`Invalid stealth level: ${stealthLevel}. Must be one of: ${validLevels.join(', ')}`);
            }
            
            const config = getLocalConfig();
            config.stealthLevel = stealthLevel;
            writeConfig(config);
            return { success: true, config };
        } catch (error) {
            console.error('Error setting stealth level:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('set-layout', async (event, layout) => {
        try {
            const validLayouts = ['normal', 'compact'];
            if (!validLayouts.includes(layout)) {
                throw new Error(`Invalid layout: ${layout}. Must be one of: ${validLayouts.join(', ')}`);
            }
            
            const config = getLocalConfig();
            config.layout = layout;
            writeConfig(config);
            return { success: true, config };
        } catch (error) {
            console.error('Error setting layout:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('get-config', async (event) => {
        try {
            const config = getLocalConfig();
            return { success: true, config };
        } catch (error) {
            console.error('Error getting config:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('save-config', async (event, newConfig) => {
        try {
            writeConfig(newConfig);
            return { success: true };
        } catch (error) {
            console.error('Error saving config:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('quit-application', async event => {
        try {
            stopMacOSAudioCapture();
            app.quit();
            return { success: true };
        } catch (error) {
            console.error('Error quitting application:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('open-external', async (event, url) => {
        try {
            await shell.openExternal(url);
            return { success: true };
        } catch (error) {
            console.error('Error opening external URL:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.on('update-keybinds', (event, newKeybinds) => {
        if (mainWindow) {
            updateGlobalShortcuts(newKeybinds, mainWindow, sendToRenderer, geminiSessionRef);
        }
    });

    ipcMain.handle('update-content-protection', async (event, contentProtection) => {
        try {
            if (mainWindow) {

                // Get content protection setting from localStorage via cheddar
                const contentProtection = await mainWindow.webContents.executeJavaScript('cheddar.getContentProtection()');
                mainWindow.setContentProtection(contentProtection);
                console.log('Content protection updated:', contentProtection);
            }
            return { success: true };
        } catch (error) {
            console.error('Error updating content protection:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('get-random-display-name', async event => {
        try {
            return randomNames ? randomNames.displayName : 'System Monitor';
        } catch (error) {
            console.error('Error getting random display name:', error);
            return 'System Monitor';
        }
    });
}

// React-compatible IPC handlers
function setupReactCompatibleHandlers(geminiSessionRef) {
    // Gemini operations for React frontend
    ipcMain.handle('gemini-init-session', async (event, { apiKey, config = {} }) => {
        try {
            const { initializeGeminiSession } = require('./utils/gemini');
            const customPrompt = config.customPrompt || '';
            const profile = config.profile || 'interview';
            const language = config.language || 'en-US';
            
            const session = await initializeGeminiSession(apiKey, customPrompt, profile, language);
            if (session) {
                geminiSessionRef.current = session;
                return { success: true };
            }
            return { success: false, error: 'Failed to initialize session' };
        } catch (error) {
            console.error('Error initializing Gemini session:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('gemini-send-message', async (event, { message }) => {
        try {
            if (!geminiSessionRef.current) {
                return { success: false, error: 'No active session' };
            }
            
            await geminiSessionRef.current.sendRealtimeInput({
                text: message,
            });
            
            return { success: true };
        } catch (error) {
            console.error('Error sending message:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('gemini-get-history', async (event) => {
        try {
            const { getCurrentSessionData } = require('./utils/gemini');
            const sessionData = getCurrentSessionData();
            return { success: true, data: sessionData };
        } catch (error) {
            console.error('Error getting history:', error);
            return { success: false, error: error.message };
        }
    });

    // Audio operation handlers
    ipcMain.handle('audio-start-capture', async (event, config = {}) => {
        try {
            const { startMacOSAudioCapture } = require('./utils/gemini');
            const success = await startMacOSAudioCapture(geminiSessionRef);
            return { success };
        } catch (error) {
            console.error('Error starting audio capture:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('audio-stop-capture', async (event) => {
        try {
            const { stopMacOSAudioCapture } = require('./utils/gemini');
            stopMacOSAudioCapture();
            return { success: true };
        } catch (error) {
            console.error('Error stopping audio capture:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('audio-get-devices', async (event) => {
        try {
            // Placeholder - implement actual device enumeration if needed
            return { success: true, devices: [] };
        } catch (error) {
            console.error('Error getting audio devices:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('audio-set-device', async (event, deviceId) => {
        try {
            // Placeholder - implement device selection if needed
            return { success: true };
        } catch (error) {
            console.error('Error setting audio device:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('audio-save-file', async (event, { buffer, filename }) => {
        try {
            const fs = require('fs');
            const path = require('path');
            const os = require('os');
            
            const audioDir = path.join(os.homedir(), 'cheddar', 'data', 'audio');
            const filePath = path.join(audioDir, filename);
            
            fs.writeFileSync(filePath, buffer);
            return { success: true, path: filePath };
        } catch (error) {
            console.error('Error saving audio file:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('audio-get-storage-info', async (event) => {
        try {
            const fs = require('fs');
            const path = require('path');
            const os = require('os');
            
            const audioDir = path.join(os.homedir(), 'cheddar', 'data', 'audio');
            const files = fs.existsSync(audioDir) ? fs.readdirSync(audioDir) : [];
            
            return { 
                success: true, 
                info: {
                    directory: audioDir,
                    fileCount: files.length,
                    files: files
                }
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return { success: false, error: error.message };
        }
    });
}
