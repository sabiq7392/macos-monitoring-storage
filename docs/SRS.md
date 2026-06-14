# Software Requirements Specification (SRS)

## Junk-Detector v1.0.0

---

## 1. Introduction

### 1.1 Purpose
Dokumen ini menjelaskan spesifikasi teknis lengkap aplikasi Junk-Detector.

### 1.2 Scope
Aplikasi desktop Electron untuk macOS yang mendeteksi dan membersihkan file cache developer.

### 1.3 Definitions
- **Cache**: File temporary yang dibuat oleh tools developer
- **Leftover**: Sisa file dari aplikasi yang sudah di-uninstall
- **Hidden Files**: File/folder tersembunyi (diawali titik)

---

## 2. Overall Description

### 2.1 Product Perspective
Junk-Detector adalah standalone desktop application yang berjalan di macOS dengan Electron framework.

### 2.2 Product Features
- Multi-mode scanning (Developer, Leftover, Hidden)
- Real-time progress tracking
- Category-based filtering
- Safe cleanup with confirmation
- System tray integration

### 2.3 User Classes
- **Developer**: Primary user, butuh cleanup cache Node.js, Python, Editor, AI
- **Power User**: Secondary user, butuh cleanup leftover apps

### 2.4 Operating Environment
- **OS**: macOS 10.15+ (Catalina atau lebih baru)
- **Runtime**: Electron 31+
- **Node.js**: v18+ (bundled dengan Electron)

---

## 3. Functional Requirements

### FR-01: Cache Scanning
**Deskripsi**: Sistem harus dapat memindai cache dari berbagai tools developer.

**Priority**: Critical

**Requirements**:
- FR-01.1: Scan npm cache (`~/.npm`)
- FR-01.2: Scan yarn cache (`~/Library/Caches/Yarn`)
- FR-01.3: Scan pnpm store (`~/Library/Caches/pnpm`)
- FR-01.4: Scan pip cache (`~/Library/Caches/pip`)
- FR-01.5: Scan Xcode DerivedData
- FR-01.6: Scan VS Code & Cursor cache
- FR-01.7: Scan Claude & Antigravity cache
- FR-01.8: Scan node_modules di project lokal (depth max 10)
- FR-01.9: Scan Python venv & __pycache__

**Acceptance Criteria**:
- Sistem mengembalikan list CacheItem dengan id, name, category, path, size, cleanupCmd
- Size dihitung dalam bytes
- Path menunjukkan lokasi file/folder yang terdeteksi

---

### FR-02: Cleanup Operation
**Deskripsi**: Sistem harus dapat membersihkan cache yang dipilih dengan aman.

**Priority**: Critical

**Requirements**:
- FR-02.1: Menampilkan dialog konfirmasi sebelum cleanup
- FR-02.2: Menjalankan cleanup command via shell
- FR-02.3: Menampilkan status success/failure
- FR-02.4: Trigger rescan setelah cleanup berhasil

**Acceptance Criteria**:
- User harus confirm via dialog sebelum file dihapus
- Cleanup menggunakan command yang sudah terdefinisi (npm cache clean, rm -rf, dll)
- UI menampilkan feedback visual (loading state, success message)

---

### FR-03: Category Filtering
**Deskripsi**: Sistem harus memfilter hasil scan berdasarkan kategori.

**Priority**: High

**Requirements**:
- FR-03.1: Menampilkan 7 kategori (Node.js, Python, Developer/macOS, Editor, AI, Leftover App, Hidden File)
- FR-03.2: Menghitung total bytes per kategori
- FR-03.3: Toggle filter on/off
- FR-03.4: Menampilkan progress bar per kategori

**Acceptance Criteria**:
- Klik category card untuk filter
- Klik lagi untuk reset ke "all"
- Progress bar menunjukkan persentase dari total

---

### FR-04: Real-time Progress
**Deskripsi**: Sistem harus menampilkan progress scanning secara real-time.

**Priority**: High

**Requirements**:
- FR-04.1: Menampilkan progress bar (0-100%)
- FR-04.2: Menampilkan status text yang berubah
- FR-04.3: Menampilkan path yang sedang discan
- FR-04.4: Menggunakan IPC untuk komunikasi main-renderer

**Acceptance Criteria**:
- Progress bar smooth animation
- Status text update setiap phase
- Path ter-update setiap directory yang discan

---

### FR-05: System Tray
**Deskripsi**: Sistem harus menyediakan icon di macOS Menu Bar.

**Priority**: High

**Requirements**:
- FR-05.1: Menampilkan tray icon
- FR-05.2: Left click untuk toggle popup panel
- FR-05.3: Right click untuk context menu
- FR-05.4: Context menu: Buka Jendela, Pindai Ulang, Keluar

**Acceptance Criteria**:
- Tray icon muncul di menu bar
- Popup panel muncul di bawah tray icon
- Popup auto-hide saat kehilangan focus

---

### FR-06: Scan Modes
**Deskripsi**: Sistem harus mendukung multiple scan modes.

**Priority**: High

**Requirements**:
- FR-06.1: Mode "developer" - scan cache developer tools
- FR-06.2: Mode "leftover" - scan leftover apps
- FR-06.3: Mode "hidden" - scan hidden files > 10MB
- FR-06.4: User dapat memilih multiple modes sekaligus

**Acceptance Criteria**:
- Welcome screen menampilkan 3 mode toggle
- Default: developer mode active
- Scan menjalankan semua mode yang dipilih

---

## 4. Non-Functional Requirements

### NFR-01: Performance
- Scan harus selesai dalam < 30 detik (typical system)
- UI harus responsive (60 FPS)
- Memory usage < 200MB saat idle

### NFR-02: Security
- contextIsolation: true
- nodeIntegration: false
- Hanya menjalankan command yang sudah terdefinisi
- Tidak ada arbitrary code execution

### NFR-03: Usability
- Dark mode UI
- Color-coded categories
- Clear visual feedback
- Bahasa Indonesia untuk semua text

### NFR-04: Reliability
- Graceful handling untuk permission errors
- Skip folder yang tidak accessible
- Auto-recover dari scan errors

### NFR-05: Maintainability
- Modular architecture (screens, components, hooks, utils)
- TypeScript untuk type safety
- Clear separation antara main process & renderer

---

## 5. Interface Requirements

### 5.1 User Interfaces
- Welcome Screen: Mode selection + start button
- Loading Screen: Progress bar + status
- Dashboard: Category cards + item list
- Header: App title + status badge

### 5.2 Hardware Interfaces
- Tidak ada requirement khusus
- Menggunakan standard macOS file system API

### 5.3 Software Interfaces
- Electron IPC (main <-> renderer)
- Node.js fs/promises API
- child_process.exec untuk cleanup commands

### 5.4 Communication Interfaces
- IPC channels: scan-caches, clean-cache, scan-progress, trigger-scan, show-context-menu

---

## 6. Data Requirements

### 6.1 CacheItem Schema
```typescript
{
  id: string,           // Unique identifier
  name: string,         // Display name
  category: CategoryKey,// Kategori cache
  path: string,         // Full path ke file/folder
  size: number,         // Size dalam bytes
  cleanupCmd: string    // Shell command untuk cleanup
}
```

### 6.2 CategoryKey Type
```typescript
type CategoryKey = 
  | 'Node.js' 
  | 'Python' 
  | 'Developer/macOS' 
  | 'Editor' 
  | 'AI' 
  | 'Leftover App' 
  | 'Hidden File'
  | 'all'
```

---

## 7. Constraints & Assumptions

### Constraints
- Hanya support macOS
- Cleanup menggunakan shell commands
- Tidak ada undo functionality
- Scan depth limited to 10 levels

### Assumptions
- User memiliki read/write permission di home directory
- Tools developer terinstall di standard locations
- User memahami risiko menghapus cache

---

## 8. Acceptance Criteria

### Overall System
- [ ] Aplikasi dapat di-launch dari command line (`npm run dev`)
- [ ] Aplikasi dapat di-build untuk production (`npm run build`)
- [ ] Semua scan modes berfungsi
- [ ] Cleanup berfungsi dengan konfirmasi
- [ ] System tray muncul dan berfungsi
- [ ] UI responsive dan tidak lag
- [ ] Tidak ada critical errors di console

---

## 9. Testing Requirements

### Unit Testing
- formatBytes() function
- truncatePath() function
- getCategoryColor() function

### Integration Testing
- IPC communication flow
- Scan workflow end-to-end
- Cleanup workflow end-to-end

### Manual Testing
- Test di macOS dengan berbagai versi
- Test dengan berbagai ukuran cache
- Test permission errors
- Test folder yang tidak accessible
