// State of the application
let cachedItems = [];
let activeCategoryFilter = 'all';

// Helper: Format bytes nicely
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Elements
const totalSizeEl = document.getElementById('total-size');
const nodeSizeEl = document.getElementById('node-size');
const pythonSizeEl = document.getElementById('python-size');
const macosSizeEl = document.getElementById('macos-size');
const editorSizeEl = document.getElementById('editor-size');
const aiSizeEl = document.getElementById('ai-size');

const nodeProgressEl = document.getElementById('node-progress');
const pythonProgressEl = document.getElementById('python-progress');
const macosProgressEl = document.getElementById('macos-progress');
const editorProgressEl = document.getElementById('editor-progress');
const aiProgressEl = document.getElementById('ai-progress');

const cacheListEl = document.getElementById('cache-list');
const spinnerEl = document.getElementById('loading-spinner');
const emptyStateEl = document.getElementById('empty-state');
const scanTimeEl = document.getElementById('scan-time');
const loadingPathEl = document.getElementById('loading-path');
const refreshBtn = document.getElementById('refresh-btn');

const startScanBtn = document.getElementById('start-scan-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const overviewSection = document.querySelector('.overview-section');
const listSection = document.querySelector('.list-section');

// Initial loading state
let isScanning = false;

// Scan function
async function scan() {
  if (isScanning) return;
  isScanning = true;

  // Show loading state and clear old data for a fresh start
  if (spinnerEl) spinnerEl.classList.remove('hidden');
  if (emptyStateEl) emptyStateEl.classList.add('hidden');
  if (cacheListEl) cacheListEl.innerHTML = '';
  if (loadingPathEl) loadingPathEl.textContent = 'Menghubungkan ke scanner...';

  try {
    const data = await window.electronAPI.scanCaches();
    cachedItems = data;
    updateUI();
  } catch (error) {
    console.error('Scan failed:', error);
  } finally {
    isScanning = false;
    if (spinnerEl) spinnerEl.classList.add('hidden');
  }
}

// Update the entire dashboard UI
function updateUI() {
  let totalBytes = 0;
  let nodeBytes = 0;
  let pythonBytes = 0;
  let macosBytes = 0;
  let editorBytes = 0;
  let aiBytes = 0;

  // 1. Calculate Sums for all items regardless of filter
  cachedItems.forEach(item => {
    totalBytes += item.size;
    if (item.category === 'Node.js') {
      nodeBytes += item.size;
    } else if (item.category === 'Python') {
      pythonBytes += item.size;
    } else if (item.category === 'Developer/macOS') {
      macosBytes += item.size;
    } else if (item.category === 'Editor') {
      editorBytes += item.size;
    } else if (item.category === 'AI') {
      aiBytes += item.size;
    }
  });

  // Update big totals
  totalSizeEl.textContent = formatBytes(totalBytes);
  nodeSizeEl.textContent = formatBytes(nodeBytes);
  pythonSizeEl.textContent = formatBytes(pythonBytes);
  macosSizeEl.textContent = formatBytes(macosBytes);
  editorSizeEl.textContent = formatBytes(editorBytes);
  aiSizeEl.textContent = formatBytes(aiBytes);

  // Update Progress bars (percentage of total size)
  if (totalBytes > 0) {
    nodeProgressEl.style.width = `${(nodeBytes / totalBytes) * 100}%`;
    pythonProgressEl.style.width = `${(pythonBytes / totalBytes) * 100}%`;
    macosProgressEl.style.width = `${(macosBytes / totalBytes) * 100}%`;
    editorProgressEl.style.width = `${(editorBytes / totalBytes) * 100}%`;
    aiProgressEl.style.width = `${(aiBytes / totalBytes) * 100}%`;
  } else {
    nodeProgressEl.style.width = '0%';
    pythonProgressEl.style.width = '0%';
    macosProgressEl.style.width = '0%';
    editorProgressEl.style.width = '0%';
    aiProgressEl.style.width = '0%';
  }

  // 2. Highlight the active mini card
  const cards = [
    { id: 'card-node', category: 'Node.js' },
    { id: 'card-python', category: 'Python' },
    { id: 'card-macos', category: 'Developer/macOS' },
    { id: 'card-editor', category: 'Editor' },
    { id: 'card-ai', category: 'AI' }
  ];

  cards.forEach(card => {
    const el = document.getElementById(card.id);
    if (el) {
      if (activeCategoryFilter === card.category) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });

  // Clear list
  cacheListEl.innerHTML = '';

  // 3. Filter items for displaying in the list
  const filteredItems = cachedItems.filter(item => {
    if (activeCategoryFilter === 'all') return true;
    return item.category === activeCategoryFilter;
  });

  if (filteredItems.length === 0) {
    emptyStateEl.classList.remove('hidden');
    return;
  }

  emptyStateEl.classList.add('hidden');

  // 4. Render filtered items
  filteredItems.forEach(item => {
    const li = document.createElement('li');
    li.className = 'cache-item';

    // Badge styling class
    const badgeClass = item.category.toLowerCase().replace('/', '');
    let extraBadges = '';
    if (item.name.toLowerCase().includes('node_modules')) {
      extraBadges = `<span class="item-badge node-modules-badge">node_modules</span>`;
    }

    li.innerHTML = `
      <div class="item-info">
        <div class="item-title-row">
          <span class="item-name">${item.name}</span>
          <span class="item-badge ${badgeClass}">${item.category}</span>
          ${extraBadges}
        </div>
        <span class="item-path" title="${item.path}">${item.path}</span>
      </div>
      <div class="item-action-row">
        <span class="item-size">${formatBytes(item.size)}</span>
        <button class="clean-btn" data-id="${item.id}">Bersihkan</button>
      </div>
    `;

    // Hook single cleanup click
    li.querySelector('.clean-btn').addEventListener('click', async (e) => {
      const isConfirmed = confirm(`Apakah Anda yakin ingin membersihkan "${item.name}"?\n\nTindakan ini akan menghapus file di:\n${item.path}\n\nTindakan ini tidak dapat dibatalkan!`);
      if (!isConfirmed) return;

      const btn = e.target;
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Membersihkan...';
      
      const success = await window.electronAPI.cleanCache({ id: item.id, cleanupCmd: item.cleanupCmd });
      if (success) {
        // Trigger immediate scan
        scan();
      } else {
        btn.disabled = false;
        btn.textContent = originalText;
        alert('Gagal membersihkan cache ini.');
      }
    });

    cacheListEl.appendChild(li);
  });

  // Update scan time string
  const now = new Date();
  scanTimeEl.textContent = `Terakhir diperbarui: ${now.toLocaleTimeString()}`;
}

// Filter Card Click Listeners
const filterCards = [
  { id: 'card-node', category: 'Node.js' },
  { id: 'card-python', category: 'Python' },
  { id: 'card-macos', category: 'Developer/macOS' },
  { id: 'card-editor', category: 'Editor' },
  { id: 'card-ai', category: 'AI' }
];

filterCards.forEach(card => {
  const el = document.getElementById(card.id);
  if (el) {
    el.addEventListener('click', () => {
      if (activeCategoryFilter === card.category) {
        activeCategoryFilter = 'all'; // toggle off filter to show all
      } else {
        activeCategoryFilter = card.category;
      }
      updateUI();
    });
  }
});

// Start Scan Button Click Event (Landing Page to Main Dashboard transition)
if (startScanBtn) {
  startScanBtn.addEventListener('click', () => {
    if (welcomeScreen) welcomeScreen.classList.add('hidden');
    if (overviewSection) overviewSection.classList.remove('hidden');
    if (listSection) listSection.classList.remove('hidden');
    scan();
  });
}

// Manual Refresh Button Click Event
if (refreshBtn) {
  refreshBtn.addEventListener('click', () => {
    scan();
  });
}



// Listen to real-time scanning progress updates from main process
window.electronAPI.onScanProgress((data) => {
  if (loadingPathEl) {
    const statusText = data.status ? `${data.status}: ` : 'Sedang membaca: ';
    loadingPathEl.textContent = `${statusText}${data.path}`;
  }
});

// Listen to trigger-scan event from System Tray Menu Bar
window.electronAPI.onTriggerScan(() => {
  if (welcomeScreen) welcomeScreen.classList.add('hidden');
  if (overviewSection) overviewSection.classList.remove('hidden');
  if (listSection) listSection.classList.remove('hidden');
  scan();
});
