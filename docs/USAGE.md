# Usage Guide

## Junk-Detector — Panduan Penggunaan

---

## 1. Instalasi

### Prasyarat
- macOS (Catalina 10.15+)
- Node.js v18+
- npm atau yarn

### Langkah Instalasi

```bash
# 1. Clone repository
git clone <repo-url>
cd junk-detector

# 2. Install dependencies
npm install

# 3. Jalankan di mode development
npm run dev
```

### Build untuk Production

```bash
# Build aplikasi
npm run build

# Jalankan production build
npm start
```

---

## 2. Alur Penggunaan

### 2.1 Welcome Screen
Saat aplikasi dibuka, Anda akan melihat **Welcome Screen** dengan 3 mode scan:

| Mode | Ikon | Deskripsi |
|------|------|-----------|
| **Developer Cache** | 💻 | Node.js, Python, Editor, AI — scan bawaan (default aktif) |
| **Leftover Apps** | 🗑️ | Sisa file dari aplikasi yang sudah di-uninstall |
| **Hidden Files** | 👁️ | File & folder tersembunyi besar yang tak terlihat di Finder |

**Langkah:**
1. Pilih mode scan yang diinginkan (klik untuk toggle on/off)
2. Minimal 1 mode harus aktif
3. Klik tombol **"Mulai Pindai"**

---

### 2.2 Loading Screen
Saat scanning berjalan, Anda akan melihat:
- **Progress bar** (0–100%) dengan animasi smooth
- **Status text** yang berubah sesuai fase scanning
- **Path** yang sedang dipindai (real-time)
- **Badge mode** yang menunjukkan mode aktif

Contoh status text:
- "Mencari berkas cache Node.js & npm..."
- "Menyisir dependensi python virtualenv..."
- "Memindai riwayat chat AI (Claude & Antigravity)..."
- "Menghitung kapasitas ruang yang bisa dilegakan..."

---

### 2.3 Dashboard
Setelah scan selesai, Dashboard menampilkan:

#### Kolom Kiri
- **Total Cache** — ukuran total semua cache yang ditemukan
- **Category Cards** — 7 kartu kategori yang bisa diklik untuk filter:
  - Node.js & npm (teal)
  - Python (purple)
  - Developer/macOS (blue)
  - Editor Caches (orange)
  - AI Caches (pink)
  - Leftover Apps (yellow)
  - Hidden Files (fuchsia)

#### Kolom Kanan
- **Detail Folder Cache** — daftar lengkap item yang ditemukan
- **Tombol Refresh (↻)** — pindai ulang sistem
- **Timestamp** — waktu terakhir scan dilakukan

#### Setiap Item Menampilkan:
- Kategori badge berwarna
- Nama item
- Path file/folder
- Ukuran dalam format human-readable
- Tombol hapus (🗑️)

---

### 2.4 Membersihkan Cache

1. Klik tombol **🗑️** pada item yang ingin dibersihkan
2. Dialog konfirmasi akan muncul dengan detail:
   - Nama item
   - Path lengkap
   - Peringatan bahwa tindakan tidak dapat dibatalkan
3. Klik **OK** untuk melanjutkan
4. Item akan dihapus dan dashboard otomatis refresh

---

### 2.5 Filter Kategori

- Klik salah satu **Category Card** untuk memfilter hasil
- Klik lagi untuk kembali menampilkan semua item
- Progress bar di card menunjukkan persentase dari total cache

---

### 2.6 Context Menu

- **Klik kanan** pada item cache untuk membuka context menu
- Pilih **"Tampilkan di Finder"** untuk membuka lokasi file di Finder

---

## 3. System Tray

### macOS Menu Bar
- Ikon Junk-Detector muncul di **Menu Bar** (sebelah jam)
- **Left click** — toggle popup panel (mini dashboard)
- **Right click** — context menu:

| Menu | Fungsi |
|------|--------|
| Buka Jendela Utama | Buka window utama aplikasi |
| Tampilkan Panel Tray | Toggle popup panel |
| Pindai Ulang | Trigger scan ulang |
| Keluar | Tutup aplikasi sepenuhnya |

---

## 4. Kategori yang Dideteksi

### Node.js
- npm cache (`~/.npm`)
- npx cache (`~/.npm/_npx`)
- node-gyp cache (`~/.node-gyp`)
- Yarn cache
- pnpm store
- Bun cache
- node_modules di project lokal

### Python
- pip cache
- Poetry cache
- Pipenv cache
- `__pycache__`, `.pytest_cache`, `.mypy_cache`, `.ruff_cache`
- `.venv`, `venv`

### Developer/macOS
- Xcode DerivedData
- CocoaPods cache
- Homebrew cache

### Editor
- VS Code cache & workspace storage
- Cursor AI Editor cache & workspace storage

### AI
- Claude Desktop cache
- Antigravity (Gemini) logs

### Leftover App
- Sisa file di `~/Library/Application Support`
- Sisa file di `~/Library/Preferences`
- Sisa file di `~/Library/Containers`
- Sisa file di `~/Library/Caches`

### Hidden File
- Folder tersembunyi besar (> 10 MB) di home directory
- `.gradle`, `.m2`, `.android`, `.cache`, `.docker`, dsb.

---

## 5. Tips & Best Practices

1. **Scan rutin** — Jalankan scan setiap minggu untuk menjaga storage tetap lega
2. **Perhatikan path** — Pastikan path yang dihapus memang cache, bukan data penting
3. **Gunakan filter** — Filter per kategori untuk fokus pada area tertentu
4. **Mode kombinasi** — Aktifkan semua mode untuk scan menyeluruh
5. **Refresh setelah cleanup** — Selalu rescan setelah membersihkan cache untuk memastikan hasil terbaru

---

## 6. Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Aplikasi tidak terbuka | Pastikan `npm install` sudah selesai tanpa error |
| Scan sangat lambat | Kurangi mode scan, atau tutup aplikasi berat lainnya |
| Cleanup gagal | Coba jalankan cleanup command secara manual di terminal |
| Tray icon tidak muncul | Restart aplikasi, pastikan macOS Menu Bar tidak penuh |
| Hasil scan kosong | Sistem Anda sudah bersih! Atau coba aktifkan semua mode |
| Permission denied | Beberapa folder memerlukan akses khusus |
