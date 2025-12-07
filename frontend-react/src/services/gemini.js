// Service wrapper for Gemini AI interactions
// This will interface with Electron IPC once integrated

export class GeminiService {
  constructor() {
    this.sessionId = null;
    this.conversationHistory = [];
  }

  async initializeSession(apiKey, config = {}) {
    if (window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer.invoke('gemini-init-session', { apiKey, config });
    }
    throw new Error('Electron IPC not available');
  }

  async sendMessage(message) {
    if (window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer.invoke('gemini-send-message', { message });
    }
    throw new Error('Electron IPC not available');
  }

  onStreamingUpdate(callback) {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('gemini-streaming-update', (event, data) => {
        callback(data);
      });
    }
  }

  onSessionEnd(callback) {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('gemini-session-end', (event, data) => {
        callback(data);
      });
    }
  }

  async getSessionHistory() {
    if (window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer.invoke('gemini-get-history');
    }
    return this.conversationHistory;
  }

  async saveConversationTurn(transcription, response) {
    const turn = {
      timestamp: Date.now(),
      transcription,
      response,
    };
    this.conversationHistory.push(turn);
    
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.send('save-conversation-turn', {
        sessionId: this.sessionId,
        turn,
        fullHistory: this.conversationHistory,
      });
    }
  }

  cleanup() {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.removeAllListeners('gemini-streaming-update');
      window.electron.ipcRenderer.removeAllListeners('gemini-session-end');
    }
  }
}

export const geminiService = new GeminiService();
