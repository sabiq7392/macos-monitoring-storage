# Architecture Document

## Junk-Detector

---

## 1. High-Level Architecture

Junk-Detector menggunakan arsitektur **Electron Main + Renderer Process** dengan React sebagai UI framework.

```
┌─────────────────────────────────────────────────┐
│                   Electron App                   │
├──────────────────────┬──────────────────────────┤
│    Main Process      │     Renderer Process      │
│    (Node.js)         │     (React + Vite)        │
│                      │                           │
│  ┌────────────────┐  │  ┌─────────────────────┐  │
│  │ File Scanner   │  │  │ WelcomeScreen       │  │
│  │ Cleanup Engine │  │  │ LoadingScreen       │  │
│  │ System Tray    │  │  │ Dashboard           │  │
│  │ IPC Handlers   │  │  │ useScanner hook     │  │
│  └────────────────┘  │  └─────────────────────┘  │
│          ↕           │           ↕               │
│      preload.js      │    window.electronAPI     │
│   (contextBridge)    │   (contextIsolation)      │
├──────────────────────┴──────────────────────────┤
│                  IPC Bridge                       │
│  scan-caches | clean-cache | scan-progress        │
│  trigger-scan | show-context-menu                 │
└─────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Electron | 31.x |
| UI Framework | React | 19.x |
| Routing | react-router-dom | 6.x |
| Build Tool | Vite | 8.x |
| CSS Framework | Tailwind CSS | 4.x |
| Language | TypeScript | 6.x |
| Dev Tool | concurrently | 10.x |

---

## 3. Process Architecture

### Main Process (main.js)
- Window management (BrowserWindow)
- System Tray integration
- File system scanning (fs/promises)
- Cleanup command execution (child_process)
- IPC handler registration (ipcMain)
- macOS Dock badge

### Preload Script (preload.js)
- contextBridge API untuk secure IPC
- Expose `window.electronAPI` ke renderer
- Channels: scanCaches, cleanCache, onScanProgress, onTriggerScan, showContextMenu

### Renderer Process (React)
- SPA dengan HashRouter
- State management via custom hooks
- Component-based UI architecture

---

## 4. Directory Structure

```
junk-detector/
├── main.js                  # Electron main process
├── preload.js               # IPC bridge (contextBridge)
├── package.json             # Dependencies & scripts
├── vite.config.js           # Vite build config
├── docs/                    # Documentation
│   ├── BRD.md
│   ├── SRS.md
│   ├── USAGE.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   └── FEATURES.md
└── src/
    ├── main.tsx             # React entry point
    ├── app.tsx              # Root component & routing
    ├── types.ts             # Shared TypeScript types
    ├── index.css            # Global styles (Tailwind)
    ├── screens/
    │   ├── welcome.screen.tsx   # Mode selection
    │   ├── loading.screen.tsx   # Scan progress
    │   └── dashboard.screen.tsx # Results & cleanup
    ├── components/
    │   ├── header.comp.tsx          # Top bar
    │   ├── category_card.comp.tsx   # Filter card
    │   └── cache_item_card.comp.tsx # Item row
    ├── hooks/
    │   └── use_scanner.hook.ts  # Scanner state logic
    └── utils/
        └── format.ts       # formatBytes, truncatePath, colors
```

---

## 5. Data Flow

### Scanning Flow

```
User clicks "Mulai Pindai"
       │
       ▼
WelcomeScreen → onStartScan(modes[])
       │
       ▼
app.tsx → navigate('/scanning') + scan(modes)
       │
       ▼
useScanner → window.electronAPI.scanCaches(modes)
       │
       ▼
IPC: 'scan-caches' → main.js
       │
       ├── Phase 1: Global caches (npm, pip, etc.)
       │   └── broadcastIPC('scan-progress', ...)
       ├── Phase 2: Local project scan (recursive)
       │   └── broadcastIPC('scan-progress', ...)
       ├── Phase 3: Calculate sizes
       │   └── broadcastIPC('scan-progress', ...)
       ├── Phase 4: Leftover apps (if mode active)
       └── Phase 5: Hidden files (if mode active)
       │
       ▼
Returns CacheItem[] → setState({ items, lastScanned })
       │
       ▼
navigate('/dashboard') → Render results
```

### Cleanup Flow

```
User clicks 🗑️ button
       │
       ▼
CacheItemCard → confirm() dialog
       │
       ▼ (confirmed)
window.electronAPI.cleanCache({ id, cleanupCmd })
       │
       ▼
IPC: 'clean-cache' → execAsync(cleanupCmd)
       │
       ▼
Returns { success: boolean }
       │
       ▼ (success)
onCleaned() → rescan → navigate('/dashboard')
```

---

## 6. IPC Communication

| Channel | Direction | Payload | Purpose |
|---------|-----------|---------|---------|
| scan-caches | renderer→main | ScanMode[] | Trigger scan |
| clean-cache | renderer→main | {id, cleanupCmd} | Execute cleanup |
| scan-progress | main→renderer | {path, status, progress} | Real-time update |
| trigger-scan | main→renderer | void | Tray menu trigger |
| show-context-menu | renderer→main | {path} | Show Finder option |

---

## 7. Security Model

- **contextIsolation: true** — Renderer tidak bisa akses Node.js langsung
- **nodeIntegration: false** — Tidak ada require() di renderer
- **contextBridge** — Hanya API yang di-expose via preload.js
- **Predefined commands** — Cleanup hanya menjalankan command yang sudah terdefinisi, bukan arbitrary input

---

## 8. Performance Strategy

- **Skip folders**: `.git`, `Library`, `Applications`, `System`, `Downloads`, dll.
- **Depth limit**: Maksimal 10 level dari root folder
- **Progressive progress**: Progress dihitung berdasarkan phase (0-20%, 20-70%, 70-99%)
- **Lazy rendering**: List virtualization via `max-h-[600px] overflow-y-auto`

---

## 9. Build & Deployment

```bash
# Development
npm run dev    # Vite dev server + Electron dengan HMR

# Production
npm run build  # Vite build → dist/
npm start      # Electron load dist/index.html
```

Vite config menggunakan `base: './'` agar compatible dengan `file://` protocol di Electron.
