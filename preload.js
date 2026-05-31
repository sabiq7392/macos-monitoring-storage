const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  scanCaches: () => ipcRenderer.invoke('scan-caches'),
  cleanCache: (cacheData) => ipcRenderer.invoke('clean-cache', cacheData),
  onScanProgress: (callback) => ipcRenderer.on('scan-progress', (event, data) => callback(data)),
  onTriggerScan: (callback) => ipcRenderer.on('trigger-scan', () => callback()),
  onHotReload: (callback) => ipcRenderer.on('hot-reload', () => callback())
});
