/* ===== MARINE GUARD AI — MAIN APP SCRIPT ===== */

// ===== OCEAN CANVAS ANIMATION =====
(function initOcean() {
  const canvas = document.getElementById('ocean-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, time = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawWave(yBase, amp, freq, speed, color, alpha) {
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) {
      const y = yBase + Math.sin((x * freq) + time * speed) * amp
               + Math.sin((x * freq * 0.5) + time * speed * 1.3) * (amp * 0.5);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    time += 0.008;
    drawWave(h * 0.75, 30, 0.005, 0.8, '#0047ff', 0.2);
    drawWave(h * 0.8, 25, 0.007, 1.1, '#00d4ff', 0.15);
    drawWave(h * 0.85, 20, 0.009, 0.6, '#00ff9d', 0.1);
    drawWave(h * 0.9, 15, 0.011, 1.4, '#0047ff', 0.08);
    requestAnimationFrame(animate);
  }
  animate();
})();

// ===== FLOATING PARTICLES =====
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      width:${Math.random() * 4 + 1}px;
      height:${Math.random() * 4 + 1}px;
      background:rgba(0,212,255,${Math.random() * 0.5 + 0.1});
      border-radius:50%;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation:floatPart ${Math.random() * 8 + 6}s ease-in-out ${Math.random() * 5}s infinite;
      box-shadow:0 0 ${Math.random() * 6 + 2}px rgba(0,212,255,0.4);
    `;
    container.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatPart {
      0%,100%{transform:translateY(0) translateX(0);opacity:0.5}
      25%{transform:translateY(-30px) translateX(15px);opacity:1}
      50%{transform:translateY(-60px) translateX(-10px);opacity:0.7}
      75%{transform:translateY(-40px) translateX(20px);opacity:1}
    }
  `;
  document.head.appendChild(style);
})();

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ===== ANIMATED COUNTERS =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const decimal = parseInt(el.dataset.decimal || 0);
  const duration = 2000;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = decimal ? current.toFixed(decimal) : Math.round(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .stat-cards').forEach(el => counterObserver.observe(el));

// ===== OCEAN MAP (Leaflet) =====
let map, allMarkers = [];

function initMap() {
  const mapEl = document.getElementById('ocean-map');
  if (!mapEl || !window.L) return;

  map = L.map('ocean-map', { zoomControl: false, attributionControl: false }).setView([20, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18, opacity: 0.6
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  const pollutionData = [
    { lat: 35.6762, lng: 139.6503, level: 'critical', name: 'Tokyo Bay', type: '🗑️ Plastic Waste', severity: '94%' },
    { lat: -33.8688, lng: 151.2093, level: 'medium', name: 'Sydney Coast', type: '🛢️ Oil Spill', severity: '62%' },
    { lat: 25.0343, lng: 121.5654, level: 'critical', name: 'Taiwan Strait', type: '☣️ Chemical', severity: '87%' },
    { lat: 51.5074, lng: 1.1278, level: 'medium', name: 'North Sea', type: '🎣 Fishing Nets', severity: '55%' },
    { lat: -8.7832, lng: 124.5085, level: 'safe', name: 'Flores Sea', type: '✅ Monitored', severity: '12%' },
    { lat: 14.0583, lng: -87.2068, level: 'critical', name: 'Caribbean Zone 7', type: '🗑️ Plastic Patch', severity: '91%' },
    { lat: -17.6509, lng: 168.0922, level: 'cleanup', name: 'Pacific Cleanup Op', type: '♻️ Cleanup Active', severity: '—' },
    { lat: 1.3521, lng: 103.8198, level: 'critical', name: 'Strait of Malacca', type: '🛢️ Oil Spill', severity: '78%' },
    { lat: 43.7384, lng: 7.4246, level: 'medium', name: 'Mediterranean', type: '🗑️ Plastic', severity: '48%' },
    { lat: -23.5505, lng: -46.6333, level: 'medium', name: 'Santos Bay', type: '💧 Sewage', severity: '61%' },
    { lat: 37.9838, lng: 23.7275, level: 'medium', name: 'Aegean Sea', type: '🗑️ Plastic', severity: '53%' },
    { lat: 30.0626, lng: 31.2497, level: 'critical', name: 'Red Sea Entry', type: '🛢️ Oil', severity: '83%' },
  ];

  const colors = { critical: '#ff3b5c', medium: '#ff6b35', safe: '#00ff9d', cleanup: '#00d4ff' };
  const radius = { critical: 22, medium: 16, safe: 12, cleanup: 18 };

  pollutionData.forEach(d => {
    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:${radius[d.level]*2}px;height:${radius[d.level]*2}px;
        background:${colors[d.level]}22;border:2px solid ${colors[d.level]};
        border-radius:50%;position:relative;
        animation:ripple${d.level} 2s ease-out infinite;
      ">
        <div style="position:absolute;inset:4px;background:${colors[d.level]}55;border-radius:50%;"></div>
        <div style="position:absolute;inset:8px;background:${colors[d.level]};border-radius:50%;"></div>
      </div>`,
      iconSize: [radius[d.level]*2, radius[d.level]*2],
      iconAnchor: [radius[d.level], radius[d.level]],
    });
    const m = L.marker([d.lat, d.lng], { icon }).addTo(map);
    m.bindPopup(`
      <div style="font-family:'Exo 2',sans-serif;min-width:160px;">
        <strong style="color:#00d4ff;font-size:0.9rem">${d.name}</strong><br>
        <span>${d.type}</span><br>
        <span style="color:#6a9dbf;font-size:0.8rem">Severity: ${d.severity}</span><br>
        <span class="leaflet-status" style="font-size:0.75rem;padding:2px 8px;border-radius:50px;background:${colors[d.level]}22;color:${colors[d.level]};border:1px solid ${colors[d.level]}44">${d.level.toUpperCase()}</span>
      </div>
    `);
    m._level = d.level;
    allMarkers.push(m);
  });

  // Ripple animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripplecritical{0%{box-shadow:0 0 0 0 rgba(255,59,92,0.5)}100%{box-shadow:0 0 0 20px rgba(255,59,92,0)}}
    @keyframes ripplemedium{0%{box-shadow:0 0 0 0 rgba(255,107,53,0.5)}100%{box-shadow:0 0 0 15px rgba(255,107,53,0)}}
    @keyframes ripplesafe{0%{box-shadow:0 0 0 0 rgba(0,255,157,0.5)}100%{box-shadow:0 0 0 12px rgba(0,255,157,0)}}
    @keyframes ripplecleanup{0%{box-shadow:0 0 0 0 rgba(0,212,255,0.5)}100%{box-shadow:0 0 0 16px rgba(0,212,255,0)}}
  `;
  document.head.appendChild(style);
}

window.filterMap = function(level) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  allMarkers.forEach(m => {
    if (level === 'all' || m._level === level) map.addLayer(m);
    else map.removeLayer(m);
  });
};

// Initialize map after Leaflet loads
setTimeout(initMap, 1000);

// ===== CHARTS =====
function initCharts() {
  if (!window.Chart) return;

  // Trend Chart
  const trendCtx = document.getElementById('trend-chart');
  if (trendCtx) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const data = [45, 52, 49, 61, 68, 73, 70, 78, 82, 79, 85, 88];
    new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Pollution Index',
          data,
          fill: true,
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0,212,255,0.1)',
          tension: 0.4,
          pointBackgroundColor: '#00d4ff',
          pointRadius: 3,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { mode: 'index' } },
        scales: {
          x: { grid: { color: 'rgba(0,212,255,0.08)' }, ticks: { color: '#6a9dbf', font: { size: 10 } } },
          y: { grid: { color: 'rgba(0,212,255,0.08)' }, ticks: { color: '#6a9dbf', font: { size: 10 } } }
        },
        animation: { duration: 2000, easing: 'easeInOutQuart' }
      }
    });
  }

  // Donut Chart
  const donutCtx = document.getElementById('donut-chart');
  if (donutCtx) {
    new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Plastic Waste', 'Oil Spill', 'Fishing Nets', 'Chemical'],
        datasets: [{
          data: [45, 22, 18, 15],
          backgroundColor: ['#00d4ff', '#ff6b35', '#ffd700', '#ff3b5c'],
          borderColor: 'rgba(0,20,50,0.8)',
          borderWidth: 3,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        cutout: '65%',
        animation: { animateRotate: true, duration: 2000 }
      }
    });
  }
}

setTimeout(initCharts, 800);

// ===== AI DETECTION =====
const SAMPLE_DATA = {
  plastic: {
    img: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=600&q=80',
    detections: [
      { name: '🗑️ Plastic Waste', pct: 78, color: '#00d4ff' },
      { name: '🛢️ Oil Residue', pct: 12, color: '#ff6b35' },
      { name: '🎣 Fishing Line', pct: 10, color: '#ffd700' },
    ],
    risk: 76,
    riskLabel: 'HIGH RISK',
    action: '🚢 Recommend deploying 2 cleanup vessels. Priority: plastic extraction grid deployment. Estimated removal: 72 hours. Notify nearest coast guard station.'
  },
  oil: {
    img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    detections: [
      { name: '🛢️ Oil Spill', pct: 89, color: '#ff3b5c' },
      { name: '☣️ Chemical Trace', pct: 7, color: '#9b59b6' },
      { name: '🗑️ Debris', pct: 4, color: '#00d4ff' },
    ],
    risk: 91,
    riskLabel: '⚠️ CRITICAL',
    action: '🚨 EMERGENCY RESPONSE REQUIRED. Deploy oil containment booms immediately. Contact USCG and EPA. Evacuate 3km radius. Estimated containment: 48-96 hours.'
  },
  nets: {
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    detections: [
      { name: '🎣 Ghost Nets', pct: 71, color: '#ffd700' },
      { name: '🗑️ Plastic Mesh', pct: 19, color: '#00d4ff' },
      { name: '🐟 Marine Life Trapped', pct: 10, color: '#ff3b5c' },
    ],
    risk: 58,
    riskLabel: 'MODERATE RISK',
    action: '⚓ Deploy diver team for net removal. Use ROV for deep sections. Marine biologist required on-site. Estimated recovery: 12-24 hours. File wildlife impact report.'
  }
};

let currentSample = null;

window.loadSample = function(type) {
  currentSample = SAMPLE_DATA[type];
  showDetectionResult(currentSample, currentSample.img);
};

window.handleUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const randomSamples = Object.values(SAMPLE_DATA);
    const sample = randomSamples[Math.floor(Math.random() * randomSamples.length)];
    showDetectionResult(sample, e.target.result);
  };
  reader.readAsDataURL(file);
};

function showDetectionResult(data, imgSrc) {
  document.getElementById('upload-zone').style.display = 'none';
  const results = document.getElementById('detect-results');
  results.style.display = 'block';
  document.getElementById('preview-img').src = imgSrc;

  // Rebuild scan animation
  const scanLine = document.getElementById('scan-line');
  scanLine.style.animation = 'none';
  void scanLine.offsetWidth;
  scanLine.style.animation = 'scanAnim 1.5s linear 2';

  // Populate detections after delay
  setTimeout(() => {
    const list = document.getElementById('detections-list');
    list.innerHTML = data.detections.map(d => `
      <div class="det-item">
        <div class="det-header">
          <span class="det-name">${d.name}</span>
          <span class="det-pct">${d.pct}%</span>
        </div>
        <div class="det-bar">
          <div class="det-fill" style="width:0%;background:${d.color}" data-w="${d.pct}%"></div>
        </div>
      </div>
    `).join('');

    // Animate bars
    setTimeout(() => {
      list.querySelectorAll('.det-fill').forEach(el => {
        el.style.width = el.dataset.w;
      });
    }, 100);

    // Risk bar
    const riskBar = document.getElementById('risk-bar');
    const riskValue = document.getElementById('risk-value');
    setTimeout(() => {
      riskBar.style.width = data.risk + '%';
      riskValue.textContent = `${data.risk}% — ${data.riskLabel}`;
      riskValue.style.color = data.risk > 80 ? '#ff3b5c' : data.risk > 50 ? '#ffd700' : '#00ff9d';
    }, 500);

    document.getElementById('action-box').innerHTML = `<strong style="color:#00d4ff;font-size:0.8rem;font-family:'Orbitron',monospace">🤖 AI RECOMMENDED ACTION</strong><br><br>${data.action}`;
  }, 2000);
}

window.resetDetector = function() {
  document.getElementById('upload-zone').style.display = 'flex';
  document.getElementById('detect-results').style.display = 'none';
  document.getElementById('file-input').value = '';
};

// Drag and drop
const uploadZone = document.getElementById('upload-zone');
if (uploadZone) {
  uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.style.borderColor = '#00d4ff'; });
  uploadZone.addEventListener('dragleave', () => { uploadZone.style.borderColor = ''; });
  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file) handleUpload({ target: { files: [file] } });
  });
}

// ===== CITIZEN REPORTS =====
const sampleReports = [
  { title: '🗑️ Plastic Debris', loc: 'Bondi Beach, Sydney', time: '2 min ago', status: 'verified', cls: 'verified' },
  { title: '🛢️ Oil Sheen', loc: 'Gulf of Mexico, Zone 4', time: '15 min ago', status: 'Cleanup Initiated', cls: 'cleanup' },
  { title: '🎣 Ghost Net Found', loc: 'Coral Sea', time: '1 hr ago', status: 'Submitted', cls: 'submitted' },
  { title: '🐟 Fish Kill Event', loc: 'Baltic Sea Inlet', time: '3 hr ago', status: 'Resolved', cls: 'resolved' },
  { title: '☣️ Foam Discharge', loc: 'Yangtze Delta', time: '5 hr ago', status: 'Cleanup Initiated', cls: 'cleanup' },
];

function renderReports() {
  const list = document.getElementById('reports-list');
  if (!list) return;
  list.innerHTML = sampleReports.map(r => `
    <div class="report-item">
      <div>
        <div class="ri-title">${r.title}</div>
        <div class="ri-loc">📍 ${r.loc}</div>
        <div class="ri-time">⏱ ${r.time}</div>
      </div>
      <span class="ri-status ${r.cls}">${r.status}</span>
    </div>
  `).join('');
}
renderReports();

window.setSeverity = function(btn, level) {
  document.querySelectorAll('.sev-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};

window.submitReport = function() {
  showToast('📡 Report submitted! AI analyzing now...', 'success');
  const newReport = {
    title: `${document.getElementById('pol-type').value.split(' ').slice(0,2).join(' ')}`,
    loc: document.getElementById('lat-input').value || 'GPS Location',
    time: 'Just now',
    status: 'Submitted',
    cls: 'submitted'
  };
  sampleReports.unshift(newReport);
  renderReports();
};

// ===== LIVE ALERTS FEED =====
const alertData = [
  { type: 'critical', icon: '🚨', title: 'Critical Pollution Alert — Strait of Malacca', desc: 'Oil spill detected covering 4.2 km². Emergency response initiated. 3 vessels dispatched.', time: '2 min ago' },
  { type: 'warning', icon: '⚠️', title: 'Coral Bleaching Risk Elevated — GBR Sector 7-B', desc: 'Thermal stress index 8.2 DHW — bleaching probability 87%. Marine ranger team notified.', time: '18 min ago' },
  { type: 'info', icon: '🤖', title: 'AI Detection: New Plastic Patch Identified', desc: 'Satellite scan ID #4821 detected 2.3 km² floating debris field at 24°N, 155°W.', time: '34 min ago' },
  { type: 'success', icon: '✅', title: 'Cleanup Operation ALPHA-7 Completed', desc: 'Pacific Zone 3 cleanup successfully removed 847 tonnes of marine plastic debris.', time: '1 hr ago' },
  { type: 'warning', icon: '🐋', title: 'Whale Migration Corridor Threatened', desc: 'Pollution levels in humpback whale migratory path exceed safe thresholds in 3 zones.', time: '2 hr ago' },
  { type: 'info', icon: '📊', title: 'Monthly Ocean Health Report Generated', desc: 'Global ocean health index: 73.2/100. Improvement in 12 regions, decline in 8 regions.', time: '3 hr ago' },
];

function renderAlerts() {
  const feed = document.getElementById('alerts-feed');
  if (!feed) return;
  feed.innerHTML = alertData.map(a => `
    <div class="alert-item ${a.type}">
      <span class="alert-icon">${a.icon}</span>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.desc}</div>
      </div>
      <span class="alert-time">${a.time}</span>
    </div>
  `).join('');
}
renderAlerts();

// Live alert ticker — add new alert every 15s
let alertIndex = 0;
const liveAlerts = [
  { type: 'critical', icon: '🚨', title: 'New: High-Microplastic Zone Detected — Bay of Bengal', desc: 'Microplastic concentration 847 particles/L — 3x safe threshold.', time: 'Just now' },
  { type: 'info', icon: '🛰️', title: 'Satellite Pass #7742 Complete — 23 Regions Updated', desc: 'AI processed 142 km² of new imagery. 3 new pollution events flagged.', time: 'Just now' },
  { type: 'warning', icon: '🐠', title: 'Coral Spawn Season At Risk — Maldives Zone', desc: 'Water turbidity levels threatening upcoming spawning event in 6 days.', time: 'Just now' },
];

setInterval(() => {
  if (alertIndex >= liveAlerts.length) return;
  alertData.unshift(liveAlerts[alertIndex++]);
  renderAlerts();
  showToast(`🔔 New Alert: ${alertData[0].title.substring(0,40)}...`);
}, 15000);

// ===== AUTH MODAL =====
window.showAuth = function(tab) {
  document.getElementById('auth-modal').style.display = 'flex';
  switchTab(tab);
};

window.closeAuth = function() {
  document.getElementById('auth-modal').style.display = 'none';
};

window.switchTab = function(tab) {
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('signup-form').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
};

window.login = function() {
  closeAuth();
  showToast('🌊 Welcome back, Agent! Access granted.', 'success');
};

window.signup = function() {
  closeAuth();
  showToast('🎉 Account created! Welcome to Marine Guard AI.', 'success');
};

// Close modal on overlay click
document.getElementById('auth-modal').addEventListener('click', function(e) {
  if (e.target === this) closeAuth();
});

// ===== TOAST =====
window.showToast = function(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.background = type === 'success' ? 'rgba(0,255,157,0.15)' : 'rgba(0,212,255,0.15)';
  toast.style.borderColor = type === 'success' ? 'rgba(0,255,157,0.4)' : 'rgba(0,212,255,0.4)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
};

// ===== NAVBAR MOBILE TOGGLE =====
window.toggleMenu = function() {
  document.querySelector('.nav-links').classList.toggle('open');
};

// ===== SCROLL TO =====
window.scrollTo = function(selector) {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ===== NEWSLETTER =====
window.subscribe = function() {
  showToast('📬 Subscribed! Weekly ocean intelligence incoming.', 'success');
};

// ===== REAL-TIME DATA SIMULATION =====
function simulateLiveData() {
  // Randomly update one stat card
  const stats = document.querySelectorAll('.stat-value');
  if (stats.length === 0) return;

  const idx = Math.floor(Math.random() * stats.length);
  const el = stats[idx];
  const current = parseFloat(el.textContent.replace(/,/g, ''));
  if (isNaN(current)) return;

  const delta = (Math.random() - 0.5) * 0.5;
  const newVal = Math.max(0, current + delta);
  el.textContent = Number.isInteger(current) ? Math.round(newVal).toLocaleString() : newVal.toFixed(1);
  el.style.color = '#00d4ff';
  setTimeout(() => el.style.color = '', 500);
}

setInterval(simulateLiveData, 3000);

// ===== FORECAST FILL ANIMATION =====
const forecastObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.fc-fill').forEach(fill => {
        const w = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => fill.style.width = w, 100);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.forecast-section').forEach(el => forecastObserver.observe(el));

// ===== CONSOLE BRANDING =====
console.log(`
%c 🌊 MARINE GUARD AI 
%c Protecting Oceans with Artificial Intelligence
%c YOLOv8 · TensorFlow · FastAPI · React
`, 
'font-size:24px;color:#00d4ff;font-weight:bold;font-family:monospace',
'font-size:12px;color:#6a9dbf',
'font-size:10px;color:#6a9dbf'
);
