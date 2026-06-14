import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';
const VITE_DEV_URL = 'http://localhost:5173';

let mainWindow;
let trayWindow;
let tray;

function createMainWindow() {
  if (mainWindow) {
    mainWindow.focus();
    return;
  }
  
  mainWindow = new BrowserWindow({
    width: 900,
    height: 650,
    show: true,
    frame: true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    mainWindow.loadURL(VITE_DEV_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTrayWindow() {
  trayWindow = new BrowserWindow({
    width: 420,
    height: 680,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    trayWindow.loadURL(VITE_DEV_URL);
  } else {
    trayWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Hide the window when it loses focus (acting exactly like a dropdown panel)
  trayWindow.on('blur', () => {
    if (!trayWindow.webContents.isDevToolsOpened()) {
      trayWindow.hide();
    }
  });
}

function positionTrayWindow() {
  if (!tray || !trayWindow) return;
  const trayBounds = tray.getBounds();
  const windowBounds = trayWindow.getBounds();

  // Center window horizontally below tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
  
  // Position window vertically below tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  trayWindow.setPosition(x, y, false);
}

function toggleTrayWindow() {
  if (!trayWindow) return;
  if (trayWindow.isVisible()) {
    trayWindow.hide();
  } else {
    positionTrayWindow();
    trayWindow.show();
    trayWindow.focus();
  }
}

app.whenReady().then(() => {
  createMainWindow();
  createTrayWindow();

  // Hot-reload is now handled by Vite HMR in development mode.
  // No manual file watcher needed.

  // Create system tray icon next to clock (macOS Menu Bar)
  try {
    const icon = nativeImage.createFromNamedImage('NSFolder');
    tray = new Tray(icon.resize({ width: 18, height: 18 }));
    
    // Left click toggles the CleanMyMac-style popup panel
    tray.on('click', () => {
      toggleTrayWindow();
    });

    // Right click shows standard context menu (with Quit option)
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Buka Jendela Utama', click: () => { createMainWindow(); } },
      { label: 'Tampilkan Panel Tray', click: () => { toggleTrayWindow(); } },
      { label: 'Pindai Ulang', click: () => { 
          positionTrayWindow();
          if (trayWindow) {
            trayWindow.show();
            trayWindow.focus();
          }
          broadcastIPC('trigger-scan');
        } 
      },
      { type: 'separator' },
      { label: 'Keluar', click: () => { app.quit(); } }
    ]);

    tray.on('right-click', () => {
      tray.popUpContextMenu(contextMenu);
    });

    tray.setToolTip('Junk-Detector');
  } catch (error) {
    console.error('Gagal inisialisasi System Tray:', error);
  }

  app.on('activate', () => {
    if (!mainWindow) createMainWindow();
  });
});

// Helper to send IPC to all windows
function broadcastIPC(channel, ...args) {
  BrowserWindow.getAllWindows().forEach(win => {
    if (win && !win.isDestroyed()) {
      win.webContents.send(channel, ...args);
    }
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Cache Scanning Logic
const home = os.homedir();

const globalCaches = [
  {
    id: 'npm',
    name: 'npm Cache',
    category: 'Node.js',
    paths: [path.join(home, '.npm')],
    cleanupCmd: 'npm cache clean --force'
  },
  {
    id: 'npx',
    name: 'npx Cache',
    category: 'Node.js',
    paths: [path.join(home, '.npm/_npx')],
    cleanupCmd: 'rm -rf ~/.npm/_npx'
  },
  {
    id: 'node-gyp',
    name: 'node-gyp Cache',
    category: 'Node.js',
    paths: [path.join(home, '.node-gyp')],
    cleanupCmd: 'rm -rf ~/.node-gyp'
  },
  {
    id: 'yarn',
    name: 'Yarn Cache',
    category: 'Node.js',
    paths: [
      path.join(home, 'Library/Caches/Yarn'),
      path.join(home, '.cache/yarn')
    ],
    cleanupCmd: 'yarn cache clean'
  },
  {
    id: 'pnpm',
    name: 'pnpm Store',
    category: 'Node.js',
    paths: [
      path.join(home, 'Library/Caches/pnpm'),
      path.join(home, '.cache/pnpm'),
      path.join(home, '.local/share/pnpm/store')
    ],
    cleanupCmd: 'pnpm store prune'
  },
  {
    id: 'bun',
    name: 'Bun Cache',
    category: 'Node.js',
    paths: [
      path.join(home, '.bun/install/cache'),
      path.join(home, 'Library/Caches/bun')
    ],
    cleanupCmd: 'bun pm cache rm'
  },
  {
    id: 'pip',
    name: 'pip Cache',
    category: 'Python',
    paths: [
      path.join(home, 'Library/Caches/pip'),
      path.join(home, '.cache/pip')
    ],
    cleanupCmd: 'pip cache purge'
  },
  {
    id: 'poetry',
    name: 'Poetry Cache',
    category: 'Python',
    paths: [
      path.join(home, 'Library/Caches/pypoetry'),
      path.join(home, '.cache/pypoetry')
    ],
    cleanupCmd: 'poetry cache clear --all .'
  },
  {
    id: 'pipenv',
    name: 'Pipenv Cache',
    category: 'Python',
    paths: [
      path.join(home, 'Library/Caches/pipenv'),
      path.join(home, '.cache/pipenv')
    ],
    cleanupCmd: 'pipenv --clear'
  },
  {
    id: 'xcode',
    name: 'Xcode DerivedData',
    category: 'Developer/macOS',
    paths: [path.join(home, 'Library/Developer/Xcode/DerivedData')],
    cleanupCmd: 'rm -rf ~/Library/Developer/Xcode/DerivedData/*'
  },
  {
    id: 'cocoapods',
    name: 'CocoaPods Cache',
    category: 'Developer/macOS',
    paths: [path.join(home, 'Library/Caches/CocoaPods')],
    cleanupCmd: 'pod cache clean --all'
  },
  {
    id: 'homebrew',
    name: 'Homebrew Cache',
    category: 'Developer/macOS',
    paths: [
      path.join(home, 'Library/Caches/Homebrew'),
      path.join(home, '.cache/Homebrew')
    ],
    cleanupCmd: 'brew cleanup'
  },
  {
    id: 'vscode',
    name: 'VS Code Cache',
    category: 'Editor',
    paths: [
      path.join(home, 'Library/Application Support/Code/CachedData'),
      path.join(home, 'Library/Application Support/Code/User/workspaceStorage')
    ],
    cleanupCmd: 'rm -rf ~/Library/Application\\ Support/Code/CachedData/* ~/Library/Application\\ Support/Code/User/workspaceStorage/*'
  },
  {
    id: 'cursor',
    name: 'Cursor AI Editor Cache',
    category: 'Editor',
    paths: [
      path.join(home, 'Library/Application Support/Cursor/CachedData'),
      path.join(home, 'Library/Application Support/Cursor/User/workspaceStorage')
    ],
    cleanupCmd: 'rm -rf ~/Library/Application\\ Support/Cursor/CachedData/* ~/Library/Application\\ Support/Cursor/User/workspaceStorage/*'
  },
  {
    id: 'claude',
    name: 'Claude Desktop Cache',
    category: 'AI',
    paths: [
      path.join(home, 'Library/Application Support/Claude/Cache'),
      path.join(home, 'Library/Application Support/Claude/Code Cache')
    ],
    cleanupCmd: 'rm -rf ~/Library/Application\\ Support/Claude/Cache/* ~/Library/Application\\ Support/Claude/Code\\ Cache/*'
  },
  {
    id: 'antigravity',
    name: 'Antigravity (Gemini) Logs',
    category: 'AI',
    paths: [
      path.join(home, '.gemini/antigravity-ide/brain')
    ],
    cleanupCmd: 'find ~/.gemini/antigravity-ide/brain -name "*.log" -o -name "*.jsonl" -mtime +3 -delete'
  }
];

async function getPathSize(targetPath) {
  try {
    const stats = await fs.lstat(targetPath);
    if (stats.isFile()) {
      return stats.size;
    }
    if (stats.isDirectory()) {
      let totalSize = 0;
      const files = await fs.readdir(targetPath);
      for (const file of files) {
        totalSize += await getPathSize(path.join(targetPath, file));
      }
      return totalSize;
    }
  } catch (err) {
    // Suppress file not found
  }
  return 0;
}

async function scanLocalCaches(dir, foundCaches = [], startDir = dir) {
  try {
    if (mainWindow && !mainWindow.isDestroyed()) {
      broadcastIPC('scan-progress', { path: dir, status: 'Memindai direktori' });
    }
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      // Skip non-developer and extremely heavy system folders to maintain blazing fast speed
      const skipDirs = [
        '.git', 'Library', 'Applications', 'System', 'Pictures', 'Music', 'Movies',
        '.npm', '.nvm', '.cargo', '.rustup', '.docker', '.vscode', '.cursor', 
        'Public', 'Creative Cloud Files', 'Downloads', 'Applications (Parallels)'
      ];
      if (skipDirs.includes(file.name)) {
        continue;
      }

      // Check if it's a hidden file/folder (starts with dot) or standard junk
      const isHidden = file.name.startsWith('.');
      const isStandardJunk = [
        '__pycache__',
        'node_modules',
        'venv'
      ].includes(file.name);

      if (isHidden || isStandardJunk) {
        let category = 'Editor';

        // Define category based on name
        if (file.name === 'node_modules') {
          category = 'Node.js';
        } else if ([
          '__pycache__',
          '.pytest_cache',
          '.mypy_cache',
          '.ruff_cache',
          '.tox',
          '.venv',
          'venv'
        ].includes(file.name)) {
          category = 'Python';
        } else if (file.name.toLowerCase().includes('gemini') || file.name.toLowerCase().includes('antigravity') || file.name.toLowerCase().includes('claude')) {
          category = 'AI';
        }

        foundCaches.push({
          id: `local-${file.name}-${Math.random().toString(36).substr(2, 5)}`,
          name: `Lokal (${file.isDirectory() ? 'Folder' : 'File'}): ${file.name}`,
          category,
          path: fullPath,
          cleanupCmd: `rm -rf "${fullPath}"`
        });
      } else if (file.isDirectory()) {
        // Increase depth to 10 to find deeply nested developer projects relative to startDir
        const depth = fullPath.split(path.sep).length - startDir.split(path.sep).length;
        if (depth <= 10) {
          await scanLocalCaches(fullPath, foundCaches, startDir);
        }
      }
    }
  } catch (err) {
    // Ignore read errors
  }
  return foundCaches;
}

// IPC Handlers
ipcMain.handle('scan-caches', async (event, modes = ['developer']) => {
  const results = [];
  const skipDirs = [
    '.git', 'Library', 'Applications', 'System', 'Pictures', 'Music', 'Movies',
    '.npm', '.nvm', '.cargo', '.rustup', '.docker', '.vscode', '.cursor', 
    'Public', 'Creative Cloud Files', 'Downloads', 'Applications (Parallels)'
  ];

  // ─── PHASE: Developer Cache ────────────────────────────────────────────────
  if (modes.includes('developer')) {
    // 1. Scan Global Caches (Phase 1: 0% to 20%)
    for (let i = 0; i < globalCaches.length; i++) {
      const cache = globalCaches[i];
      const progress = Math.round((i / globalCaches.length) * 20);
      
      if (mainWindow && !mainWindow.isDestroyed()) {
        broadcastIPC('scan-progress', { 
          path: cache.name, 
          status: 'Memindai cache global', 
          progress 
        });
      }

      let size = 0;
      let foundPath = null;
      for (const p of cache.paths) {
        const s = await getPathSize(p);
        if (s > 0) {
          size += s;
          foundPath = p;
        }
      }

      if (size > 0) {
        results.push({
          id: cache.id,
          name: cache.name,
          category: cache.category,
          path: foundPath,
          size,
          cleanupCmd: cache.cleanupCmd
        });
      }
    }

    // 2. Scan Local Project Caches (Phase 2: 20% to 70%)
    const locals = [];
    try {
      const homeFiles = await fs.readdir(home, { withFileTypes: true });
      const foldersToScan = homeFiles.filter(file => file.isDirectory() && !skipDirs.includes(file.name));

      for (let i = 0; i < foldersToScan.length; i++) {
        const folder = foldersToScan[i];
        const fullPath = path.join(home, folder.name);
        
        const progress = Math.round(20 + (i / foldersToScan.length) * 50);
        if (mainWindow && !mainWindow.isDestroyed()) {
          broadcastIPC('scan-progress', { 
            path: fullPath, 
            status: `Menyisir folder ${folder.name}`, 
            progress 
          });
        }
        
        await scanLocalCaches(fullPath, locals, fullPath);
      }
    } catch (err) {
      console.error('Gagal membaca direktori Home:', err);
    }

    // 3. Calculate discovered cache sizes (Phase 3: 70% to 99%)
    for (let i = 0; i < locals.length; i++) {
      const local = locals[i];
      const progress = Math.round(70 + (i / locals.length) * 29);
      
      if (mainWindow && !mainWindow.isDestroyed()) {
        broadcastIPC('scan-progress', { 
          path: local.path, 
          status: `Menghitung kapasitas (${i + 1}/${locals.length})`, 
          progress 
        });
      }
      
      const size = await getPathSize(local.path);
      if (size > 0) {
        results.push({
          id: local.id,
          name: local.name,
          category: local.category,
          path: local.path,
          size,
          cleanupCmd: local.cleanupCmd
        });
      }
    }
  }

  // ─── PHASE: Leftover Apps ──────────────────────────────────────────────────
  if (modes.includes('leftover')) {
    broadcastIPC('scan-progress', {
      path: path.join(home, 'Library'),
      status: 'Mencari sisa aplikasi yang sudah di-uninstall...',
      progress: 10
    });

    // Collect bundle IDs of installed apps from /Applications & ~/Applications
    const getInstalledBundleIds = async () => {
      const ids = new Set();
      const appDirs = ['/Applications', path.join(home, 'Applications')];
      for (const dir of appDirs) {
        try {
          const apps = await fs.readdir(dir);
          for (const app of apps) {
            if (app.endsWith('.app')) {
              // Bundle ID is usually the folder name without .app, but we just use app name as heuristic
              ids.add(app.replace(/\.app$/, '').toLowerCase());
            }
          }
        } catch (_) {}
      }
      return ids;
    };

    const installedIds = await getInstalledBundleIds();

    const leftoverDirs = [
      { dir: path.join(home, 'Library/Application Support'), minSize: 1024 * 1024 },      // > 1 MB
      { dir: path.join(home, 'Library/Preferences'), minSize: 0 },
      { dir: path.join(home, 'Library/Containers'), minSize: 1024 * 1024 },               // > 1 MB
      { dir: path.join(home, 'Library/Saved Application State'), minSize: 0 },
      { dir: path.join(home, 'Library/Caches'), minSize: 1024 * 1024 * 5 },              // > 5 MB
    ];

    let leftoverProgress = 10;
    const leftoverStep = 80 / leftoverDirs.length;

    for (const { dir, minSize } of leftoverDirs) {
      leftoverProgress += leftoverStep;
      broadcastIPC('scan-progress', { path: dir, status: `Memeriksa ${path.basename(dir)}...`, progress: Math.round(leftoverProgress) });

      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const entryName = entry.name.replace(/\.plist$/, '').toLowerCase();
          // Heuristic: if the entry name contains no part of an installed app name, flag as leftover
          const isInstalled = [...installedIds].some(id => entryName.includes(id) || id.includes(entryName));
          if (isInstalled) continue;

          const fullPath = path.join(dir, entry.name);
          const size = await getPathSize(fullPath);
          if (size < minSize) continue;

          results.push({
            id: `leftover-${entry.name}-${Math.random().toString(36).substr(2, 5)}`,
            name: `Leftover: ${entry.name}`,
            category: 'Leftover App',
            path: fullPath,
            size,
            cleanupCmd: `rm -rf "${fullPath}"`
          });
        }
      } catch (_) {}
    }
  }

  // ─── PHASE: Hidden Files ───────────────────────────────────────────────────
  if (modes.includes('hidden')) {
    broadcastIPC('scan-progress', {
      path: home,
      status: 'Mencari file & folder tersembunyi besar...',
      progress: 5
    });

    // Known heavy hidden folders to always check
    const knownHiddenHeavy = [
      '.gradle', '.m2', '.android', '.cache', '.local', '.docker',
      '.vagrant', '.minikube', '.kube', '.terraform', '.pulumi',
      '.venv', '.pyenv', '.rbenv', '.nvm', '.cargo', '.rustup',
      '.gem', '.bundle', '.nuget', '.dotnet'
    ];

    try {
      const homeEntries = await fs.readdir(home, { withFileTypes: true });
      const hiddenEntries = homeEntries.filter(e => e.name.startsWith('.') && e.isDirectory());

      for (let i = 0; i < hiddenEntries.length; i++) {
        const entry = hiddenEntries[i];
        const fullPath = path.join(home, entry.name);
        const progress = Math.round(5 + (i / hiddenEntries.length) * 90);

        broadcastIPC('scan-progress', { path: fullPath, status: `Memeriksa ${entry.name}...`, progress });

        // Only include if it's a known heavy folder OR size > 10 MB
        const isKnown = knownHiddenHeavy.includes(entry.name);
        const size = await getPathSize(fullPath);
        const MIN_HIDDEN_SIZE = 10 * 1024 * 1024; // 10 MB

        if (size > 0 && (isKnown || size >= MIN_HIDDEN_SIZE)) {
          results.push({
            id: `hidden-${entry.name}-${Math.random().toString(36).substr(2, 5)}`,
            name: `Hidden: ${entry.name}`,
            category: 'Hidden File',
            path: fullPath,
            size,
            cleanupCmd: `rm -rf "${fullPath}"`
          });
        }
      }
    } catch (err) {
      console.error('Gagal scan hidden files:', err);
    }
  }

  // Update macOS Dock badge count
  if (process.platform === 'darwin') {
    try {
      if (results.length > 0) {
        app.dock.setBadge(`${results.length}`);
      } else {
        app.dock.setBadge('');
      }
    } catch (err) {
      console.error('Gagal memperbarui Dock Badge:', err);
    }
  }

  return results;
});

ipcMain.handle('clean-cache', async (event, { id, cleanupCmd }) => {
  try {
    // Safe execution of cleanup command
    await execAsync(cleanupCmd);
    return { success: true };
  } catch (error) {
    console.error('Pembersihan gagal:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.on('show-context-menu', (event, { path }) => {
  const template = [
    {
      label: 'Tampilkan di Finder',
      click: () => {
        shell.showItemInFolder(path);
      }
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  menu.popup({ window: BrowserWindow.fromWebContents(event.sender) });
});
