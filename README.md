<img width="1299" height="424" alt="cd (1)" src="https://github.com/user-attachments/assets/b25fff4d-043d-4f38-9985-f832ae0d0f6e" />

## Recall.ai - API for desktop recording

If you’re looking for a hosted desktop recording API, consider checking out [Recall.ai](https://www.recall.ai/product/desktop-recording-sdk/?utm_source=github&utm_medium=sponsorship&utm_campaign=sohzm-cheating-daddy), an API that records Zoom, Google Meet, Microsoft Teams, in-person meetings, and more.

This project is sponsored by Recall.ai.

---

> [!NOTE]  
> Use latest MacOS and Windows version, older versions have limited support

> [!NOTE]  
> During testing it wont answer if you ask something, you need to simulate interviewer asking question, which it will answer

A real-time AI assistant that provides contextual help during video calls, interviews, presentations, and meetings using screen capture and audio analysis.

## Tech Stack

- **Frontend**: React 19 + Vite
- **Desktop**: Electron 30
- **AI**: Google Gemini 2.0 Flash Live
- **Styling**: CSS Modules with translucent UI and backdrop blur effects

## Features

- **Live AI Assistance**: Real-time help powered by Google Gemini 2.0 Flash Live
- **Screen & Audio Capture**: Analyzes what you see and hear for contextual responses
- **Multiple Profiles**: Interview, Sales Call, Business Meeting, Presentation, Negotiation
- **Translucent Overlay**: Modern glassmorphism design with 80% transparency and blur effect
- **Always-on-top**: Stays visible above other applications
- **Click-through Mode**: Make window transparent to clicks when needed
- **Customizable Settings**: Adjust transparency, font size, shortcuts, and more
- **Cross-platform**: Works on macOS, Windows, and Linux

## Setup

1. **Get a Gemini API Key**: Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. **Install Dependencies**: 
   ```bash
   npm install
   cd frontend-react && npm install && cd ..
   ```
3. **Run the App**: `npm start` (automatically builds React and launches Electron)

## Usage

1. Enter your Gemini API key in the main window
2. Choose your profile and language in Customize settings
3. Adjust transparency and UI settings to your preference
4. Click "Start Session" to begin AI assistance
5. Position the window using keyboard shortcuts
6. The AI will provide real-time assistance based on screen content and audio

## Keyboard Shortcuts

Default shortcuts (customizable in settings):

- **Window Movement**: `Ctrl/Cmd + Arrow Keys` - Move window to screen edges
- **Click-through**: `Ctrl/Cmd + M` - Toggle mouse event passthrough
- **Close/Back**: `Ctrl/Cmd + \` - Close window or navigate back
- **Emergency Erase**: `Ctrl/Cmd + E` - Clear conversation history
- **Send Message**: `Enter` - Send text to AI

## Development

- **Start Dev Server**: `npm run dev` - Run React dev server (port 5173)
- **Build React**: `npm run build:react` - Build React to src/dist
- **Package App**: `npm run package` - Package Electron app
- **Make Distributables**: `npm run make` - Create platform-specific installers

## Audio Capture

- **macOS**: [SystemAudioDump](https://github.com/Mohammed-Yasin-Mulla/Sound) for system audio
- **Windows**: Loopback audio capture
- **Linux**: Microphone input

## Requirements

- Electron-compatible OS (macOS, Windows, Linux)
- Gemini API key
- Screen recording permissions
- Microphone/audio permissions
