# Features Specification

## Junk-Detector

---

## Feature Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     JUNK-DETECTOR                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  F1. Scan Modes          F4. Dashboard                      │
│  ├─ Developer Cache      ├─ Total Cache Display             │
│  ├─ Leftover Apps        ├─ Category Cards                  │
│  └─ Hidden Files         └─ Cache Item List                 │
│                                                              │
│  F2. Progress Tracking   F5. Cleanup                        │
│  ├─ Real-time %          ├─ Per-item deletion               │
│  ├─ Status text          ├─ Confirmation dialog             │
│  └─ Path display         └─ Auto-rescan                     │
│                                                              │
│  F3. System Tray         F6. UX Enhancements                │
│  ├─ Menu Bar icon        ├─ Context menu (Finder)           │
│  ├─ Popup panel          ├─ Dark mode                       │
│  └─ Context menu         └─ Dock badge                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## F1. Scan Modes

### F1.1 Developer Cache (Default)
**Status**: Implemented  
**Priority**: Critical

Mendeteksi cache dari tools developer populer:

#### Global Caches
| Tool | Category | Path | Cleanup Command |
|------|----------|------|-----------------|
| npm | Node.js | `~/.npm` | `npm cache clean --force` |
| npx | Node.js | `~/.npm/_npx` | `rm -rf ~/.npm/_npx` |
| node-gyp | Node.js | `~/.node-gyp` | `rm -rf ~/.node-gyp` |
| Yarn | Node.js | `~/Library/Caches/Yarn` | `yarn cache clean` |
| pnpm | Node.js | `~/Library/Caches/pnpm` | `pnpm store prune` |
| Bun | Node.js | `~/.bun/install/cache` | `bun pm cache rm` |
| pip | Python | `~/Library/Caches/pip` | `pip cache purge` |
| Poetry | Python | `~/Library/Caches/pypoetry` | `poetry cache clear --all .` |
| Pipenv | Python | `~/Library/Caches/pipenv` | `pipenv --clear` |
| Xcode | Developer/macOS | `~/Library/Developer/Xcode/DerivedData` | `rm -rf ~/Library/Developer/Xcode/DerivedData/*` |
| CocoaPods | Developer/macOS | `~/Library/Caches/CocoaPods` | `pod cache clean --all` |
| Homebrew | Developer/macOS | `~/Library/Caches/Homebrew` | `brew cleanup` |
| VS Code | Editor | `~/Library/Application Support/Code/CachedData` | `rm -rf ...` |
| Cursor | Editor | `~/Library/Application Support/Cursor/CachedData` | `rm -rf ...` |
| Claude | AI | `~/Library/Application Support/Claude/Cache` | `rm -rf ...` |
| Antigravity | AI | `~/.gemini/antigravity-ide/brain` | `find ... -delete` |

#### Local Project Caches (Recursive Scan)
- `node_modules` → Category: Node.js
- `__pycache__`, `.pytest_cache`, `.mypy_cache`, `.ruff_cache` → Category: Python
- `.venv`, `venv`, `.tox` → Category: Python
- `.gemini`, `antigravity`, `claude` → Category: AI
- Hidden files (dotfiles) → Category: Editor

**Scan Depth**: Maximum 10 levels dari root folder  
**Skip Folders**: `.git`, `Library`, `Applications`, `System`, `Pictures`, `Music`, `Movies`, `.npm`, `.nvm`, `.cargo`, `.rustup`, `.docker`, `Downloads`

---

### F1.2 Leftover Apps
**Status**: Implemented  
**Priority**: High

Mendeteksi sisa file dari aplikasi yang sudah di-uninstall.

**Scan Locations**:
- `~/Library/Application Support` (min size: 1 MB)
- `~/Library/Preferences` (min size: 0)
- `~/Library/Containers` (min size: 1 MB)
- `~/Library/Saved Application State` (min size: 0)
- `~/Library/Caches` (min size: 5 MB)

**Heuristic**:
1. Collect bundle IDs dari `/Applications` dan `~/Applications`
2. Match entry name dengan installed app names
3. Jika tidak match dan size > threshold → flag as leftover

---

### F1.3 Hidden Files
**Status**: Implemented  
**Priority**: High

Mendeteksi file dan folder tersembunyi berukuran besar.

**Known Heavy Folders**:
`.gradle`, `.m2`, `.android`, `.cache`, `.local`, `.docker`, `.vagrant`, `.minikube`, `.kube`, `.terraform`, `.pulumi`, `.venv`, `.pyenv`, `.rbenv`, `.nvm`, `.cargo`, `.rustup`, `.gem`, `.bundle`, `.nuget`, `.dotnet`

**Filter Criteria**:
- Known heavy folder → selalu include
- Hidden folder lain → include jika size >= 10 MB

---

## F2. Progress Tracking

**Status**: Implemented  
**Priority**: High

### Progress Phases

| Phase | Range | Activity |
|-------|-------|----------|
| 1 | 0–20% | Scan global caches |
| 2 | 20–70% | Scan local project folders (recursive) |
| 3 | 70–99% | Calculate sizes of discovered caches |
| 4 | 100% | Complete |

### UI Elements
- **Spinner**: Animated border spinning
- **Percentage**: "(XX%)" di title
- **Progress Bar**: Gradient teal dengan glow shadow
- **Status Text**: Berubah setiap phase
- **Path Display**: Font mono, truncate jika terlalu panjang
- **Mode Badges**: Pill-shaped colored badges

---

## F3. System Tray

**Status**: Implemented  
**Priority**: High

### Menu Bar Icon
- Menggunakan `NSFolder` native icon (resized 18x18)
- Tooltip: "Junk-Detector"

### Left Click Action
Toggle popup panel (mini dashboard) yang:
- Posisi di bawah tray icon
- Auto-hide saat kehilangan focus
- Ukuran: 420x680px
- Frameless, always-on-top

### Right Click Menu
| Item | Action |
|------|--------|
| Buka Jendela Utama | Create/focus main window |
| Tampilkan Panel Tray | Toggle popup |
| Pindai Ulang | Show popup + trigger scan |
| Keluar | `app.quit()` |

---

## F4. Dashboard

**Status**: Implemented  
**Priority**: Critical

### Total Cache Card
- Large display (4xl–5xl font)
- Gradient background dengan radial glow
- Description text

### Category Cards (7 items)
| Category | Color | Filter Key |
|----------|-------|------------|
| Node.js & npm | `#2dd4bf` | `Node.js` |
| Python | `#a78bfa` | `Python` |
| Developer/macOS | `#60a5fa` | `Developer/macOS` |
| Editor Caches | `#fb923c` | `Editor` |
| AI Caches | `#f472b6` | `AI` |
| Leftover Apps | `#fbbf24` | `Leftover App` |
| Hidden Files | `#e879f9` | `Hidden File` |

**Interactions**:
- Click → toggle filter
- Click lagi → reset ke "all"
- Progress bar per kategori

### Cache Item List
- Scrollable (max-height: 600px)
- Sort by discovery order
- Empty state: "Sistem Anda Bersih!"

**Item Card Display**:
- Category badge (colored)
- Special badge untuk "node_modules"
- Item name (semibold)
- Path (mono font, truncated)
- Size (human-readable)
- Delete button (🗑️)

---

## F5. Cleanup

**Status**: Implemented  
**Priority**: Critical

### Flow
1. User klik tombol 🗑️
2. Confirm dialog muncul dengan detail item
3. Jika OK → jalankan `cleanupCmd` via shell
4. Loading state (⏳) pada button
5. Jika success → rescan otomatis
6. Jika gagal → alert error

### Safety
- Dialog konfirmasi wajib
- Command sudah predefined (tidak arbitrary)
- Error handling untuk permission denied

---

## F6. UX Enhancements

### F6.1 Context Menu
- Right-click pada item → "Tampilkan di Finder"
- Menggunakan `shell.showItemInFolder(path)`

### F6.2 Dark Mode
- Background: `#0f172a` (slate-900)
- Text: `#e2e8f0` (slate-200)
- Glass morphism effects (backdrop-blur)

### F6.3 Dock Badge
- Menampilkan jumlah item yang ditemukan
- Update otomatis setelah scan
- macOS only (`app.dock.setBadge()`)

### F6.4 Header Status
- "Monitoring Aktif" saat idle
- "Sedang Memindai..." saat scanning
- Pulsing dot indicator

### F6.5 Timestamp
- "Terakhir diperbarui: HH:MM:SS"
- Format Indonesian locale (`id-ID`)

---

## Feature Roadmap

### v1.1 (Planned)
- [ ] Scheduled auto-scan
- [ ] Batch cleanup (select all)
- [ ] Export scan results to file
- [ ] Undo cleanup (move to trash instead of delete)

### v1.2 (Future)
- [ ] Windows support
- [ ] Linux support
- [ ] Custom scan rules (plugin system)
- [ ] Integration dengan package managers

### v2.0 (Vision)
- [ ] Cloud sync (multi-device dashboard)
- [ ] Historical tracking (cache growth over time)
- [ ] Smart recommendations (AI-based)
- [ ] Team/organization mode
