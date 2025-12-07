// Service wrapper for window operations
// Interfaces with Electron IPC for window management

export const windowService = {
  minimize() {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.send('minimize-window');
    }
  },

  close() {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.send('close-window');
    }
  },

  toggleAlwaysOnTop() {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.send('toggle-always-on-top');
    }
  },

  setIgnoreMouseEvents(ignore) {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.send('set-ignore-mouse-events', ignore);
    }
  },

  resize(width, height, animated = true) {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.send('resize-window', { width, height, animated });
    }
  },

  setClickthrough(enabled) {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.send('set-clickthrough', enabled);
    }
  },

  async getWindowBounds() {
    if (window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer.invoke('get-window-bounds');
    }
    return null;
  },

  async getScreenSize() {
    if (window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer.invoke('get-screen-size');
    }
    return null;
  },

  centerWindow() {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.send('center-window');
    }
  },

  onWindowMoved(callback) {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('window-moved', (event, data) => {
        callback(data);
      });
    }
  },

  onWindowResized(callback) {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('window-resized', (event, data) => {
        callback(data);
      });
    }
  },

  cleanup() {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.removeAllListeners('window-moved');
      window.electron.ipcRenderer.removeAllListeners('window-resized');
    }
  },
};
