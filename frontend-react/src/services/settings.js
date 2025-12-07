/**
 * Settings service to apply configuration changes to the UI
 */

/**
 * Apply background transparency setting
 * @param {number} transparencyPercent - 0-100, where 100 is fully opaque
 */
export function applyBackgroundTransparency(transparencyPercent) {
    const opacity = transparencyPercent / 100;
    document.documentElement.style.setProperty('--background-opacity', opacity.toString());
}

/**
 * Apply response font size setting
 * @param {number} fontSize - Font size in pixels (12-32)
 */
export function applyResponseFontSize(fontSize) {
    document.documentElement.style.setProperty('--response-font-size', `${fontSize}px`);
}

/**
 * Apply all settings from config object
 * @param {Object} config - Configuration object
 */
export function applyAllSettings(config) {
    if (config.backgroundTransparency !== undefined) {
        applyBackgroundTransparency(config.backgroundTransparency);
    }
    
    if (config.responseFontSize !== undefined) {
        applyResponseFontSize(config.responseFontSize);
    }
}

/**
 * Get settings from Electron config
 * @returns {Promise<Object>} Configuration object
 */
export async function loadSettings() {
    try {
        if (window.electron?.ipcRenderer) {
            const result = await window.electron.ipcRenderer.invoke('get-config');
            if (result?.success && result?.config) {
                return result.config;
            }
        }
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
    return null;
}
