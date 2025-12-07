// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

// Expose Electron APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => {
            // Whitelist channels
            const validChannels = [
                'minimize-window',
                'close-window',
                'resize-window',
                'set-ignore-mouse-events',
                'set-clickthrough',
                'toggle-always-on-top',
                'center-window',
                'update-keybinds',
                'gemini-send-message',
                'save-conversation-turn',
                'audio-start-capture',
                'audio-stop-capture',
            ];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        invoke: (channel, data) => {
            // Whitelist channels for invoke
            const validChannels = [
                'gemini-init-session',
                'gemini-send-message',
                'gemini-get-history',
                'get-window-bounds',
                'get-screen-size',
                'get-config',
                'save-config',
                'audio-get-devices',
                'audio-set-device',
                'audio-save-file',
                'audio-get-storage-info',
            ];
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, data);
            }
        },
        on: (channel, func) => {
            // Whitelist channels for listeners
            const validChannels = [
                'gemini-streaming-update',
                'gemini-session-end',
                'session-initializing',
                'window-moved',
                'window-resized',
                'audio-data',
                'audio-level',
                'audio-transcription',
            ];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        removeAllListeners: (channel) => {
            ipcRenderer.removeAllListeners(channel);
        },
    },
});
