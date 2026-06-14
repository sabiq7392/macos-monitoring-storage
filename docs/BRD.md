# Business Requirements Document (BRD)

## Junk-Detector

**Versi:** 1.0.0  
**Tanggal:** 14 Juni 2026  
**Platform:** macOS (Electron)

---

## 1. Executive Summary

**Junk-Detector** adalah aplikasi desktop macOS untuk mendeteksi dan membersihkan file-file sampah (cache, leftover, hidden files) yang menumpuk di sistem — terutama dari aktivitas developer. Aplikasi ini dirancang untuk membantu pengguna Mac menghemat ruang penyimpanan secara cepat, aman, dan transparan.

---

## 2. Latar Belakang & Masalah

### 2.1 Masalah Bisnis
- Developer macOS sering mengalami penyimpanan penuh akibat cache dari berbagai tools (npm, pip, Xcode, Docker, dsb).
- File leftover dari aplikasi yang sudah di-uninstall tetap memakan ruang.
- Folder tersembunyi (hidden files) berukuran besar tidak terlihat oleh Finder biasa.
- Tools pembersih komersial (seperti CleanMyMac) berbayar dan sering dianggap berlebihan (bloatware).

### 2.2 Peluang
- Developer membutuhkan tool ringan, gratis/open-source, dan transparan.
- Pendekatan berbasis kategori (Node.js, Python, Editor, AI) memudahkan pengguna memahami apa yang dibersihkan.
- Integrasi system tray memberikan akses cepat tanpa mengganggu workflow.

---

## 3. Tujuan Bisnis

| # | Tujuan | Metrik Keberhasilan |
|---|--------|---------------------|
| 1 | Mendeteksi cache developer secara akurat | 95%+ cache umum terdeteksi |
| 2 | Membersihkan file sampah dengan aman | 0 kasus kehilangan data penting |
| 3 | Memberikan UX yang cepat dan ringan | Scan selesai < 30 detik |
| 4 | Menjadi alternatif gratis untuk CleanMyMac | Feedback positif dari komunitas developer |

---

## 4. Target Pengguna

### 4.1 Persona Utama: Developer macOS
- **Usia:** 20–45 tahun
- **Profil:** Software engineer, full-stack developer, mobile developer
- **Kebutuhan:** Membersihkan cache Node.js, Python, Xcode, Editor, dan AI tools
- **Pain Point:** Storage penuh karena project-proyek yang menumpuk

### 4.2 Persona Sekunder: Power User macOS
- **Profil:** Non-developer yang sering install/uninstall aplikasi
- **Kebutuhan:** Membersihkan leftover apps dan file tersembunyi
- **Pain Point:** Tidak tahu folder mana yang aman dihapus

---

## 5. Ruang Lingkup (Scope)

### 5.1 In-Scope (Versi 1.0)
- Scan cache developer (Node.js, Python, Editor, AI, macOS Developer)
- Scan leftover dari aplikasi yang sudah di-uninstall
- Scan file & folder tersembunyi berukuran besar
- Pembersihan per-item dengan konfirmasi
- System tray integration (macOS Menu Bar)
- Progress bar real-time saat scanning
- Kategori visual dengan color coding

### 5.2 Out-of-Scope (Masa Depan)
- Scheduled/auto scanning
- Cloud sync atau multi-device support
- Windows/Linux support
- Integrasi dengan package manager (auto-cleanup)
- Plugin system untuk custom scan rules

---

## 6. Kebutuhan Tingkat Tinggi

| ID | Kebutuhan | Prioritas |
|----|-----------|-----------|
| BR-01 | Aplikasi dapat mendeteksi cache dari tools populer | Critical |
| BR-02 | Aplikasi dapat membersihkan cache secara aman | Critical |
| BR-03 | Menampilkan ukuran setiap item yang ditemukan | Critical |
| BR-04 | Kategori filter untuk memilah hasil scan | High |
| BR-05 | System tray icon dengan popup panel | High |
| BR-06 | Progress scanning real-time | High |
| BR-07 | Dark mode UI modern | Medium |
| BR-08 | macOS Dock badge untuk jumlah item | Medium |

---

## 7. Asumsi & Kendala

### Asumsi
- Pengguna menggunakan macOS sebagai sistem operasi utama.
- Pengguna memiliki pemahaman dasar tentang cache dan file system.
- Aplikasi dijalankan dengan permission user biasa (bukan root).

### Kendala
- Hanya mendukung macOS (tidak ada dukungan Windows/Linux di v1).
- Pembersihan menggunakan shell command (`rm -rf`, `npm cache clean`, dsb).
- Beberapa cache mungkin memerlukan restart aplikasi terkait setelah dibersihkan.

---

## 8. Risiko

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Pengguna salah menghapus file penting | Tinggi | Konfirmasi dialog sebelum setiap pembersihan |
| Perintah `rm -rf` terlalu agresif | Tinggi | Hanya target path yang sudah divalidasi |
| Scan terlalu lambat di sistem besar | Sedang | Skip folder non-relevan, depth limit 10 |
| False positive pada leftover detection | Sedang | Minimum size threshold, heuristic matching |

---

## 9. Stakeholder

| Peran | Tanggung Jawab |
|-------|----------------|
| Product Owner | Menentukan fitur dan prioritas |
| Developer | Implementasi fitur dan maintenance |
| End User | Menggunakan dan memberikan feedback |
