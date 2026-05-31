const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  scanCaches: () => ipcRenderer.invoke('scan-caches'),
  cleanCache: (cacheData) => ipcRenderer.invoke('clean-cache', cacheData)
});
