// Service wrapper for audio operations
// Interfaces with Electron IPC for audio capture and processing

export const audioService = {
  async startCapture(config = {}) {
    if (window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer.invoke('audio-start-capture', config);
    }
    throw new Error('Electron IPC not available');
  },

  async stopCapture() {
    if (window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer.invoke('audio-stop-capture');
    }
    throw new Error('Electron IPC not available');
  },

  async getAudioDevices() {
    if (window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer.invoke('audio-get-devices');
    }
    return [];
  },

  async setAudioDevice(deviceId) {
    if (window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer.invoke('audio-set-device', deviceId);
    }
  },

  onAudioData(callback) {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('audio-data', (event, data) => {
        callback(data);
      });
    }
  },

  onAudioLevel(callback) {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('audio-level', (event, level) => {
        callback(level);
      });
    }
  },

  onTranscription(callback) {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('audio-transcription', (event, data) => {
        callback(data);
      });
    }
  },

  async saveAudioFile(buffer, filename) {
    if (window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer.invoke('audio-save-file', { buffer, filename });
    }
  },

  async getStorageInfo() {
    if (window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer.invoke('audio-get-storage-info');
    }
    return null;
  },

  cleanup() {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.removeAllListeners('audio-data');
      window.electron.ipcRenderer.removeAllListeners('audio-level');
      window.electron.ipcRenderer.removeAllListeners('audio-transcription');
    }
  },
};
