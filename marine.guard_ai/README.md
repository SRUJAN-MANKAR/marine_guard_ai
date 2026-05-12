# 🌊 Marine Guard AI

**Protecting Oceans with Artificial Intelligence**

A futuristic AI-powered ocean pollution monitoring and environmental protection platform.

---

## 🚀 Quick Start

Just open `index.html` in your browser — no build step required.

```bash
# Option 1: Direct open
open index.html

# Option 2: Local server (recommended)
npx serve .
# or
python3 -m http.server 8080
```

---

## 📁 File Structure

```
marine-guard-ai/
├── index.html      # Complete single-page application
├── style.css       # Full glassmorphism + cyberpunk styles
├── app.js          # All interactivity, charts, maps, AI sim
└── README.md       # Documentation
```

---

## ✨ Features Implemented

### 🎨 Frontend
- **Hero Section** — Animated ocean canvas, floating particles, glitch text, animated counters
- **Features Grid** — 8 feature cards with hover effects
- **AI Workflow** — Animated 5-step pipeline visualization
- **Live Dashboard** — 6 stat cards with real-time simulation
- **Interactive Map** — Leaflet.js with 12 pollution markers, filters, popups
- **Analytics Charts** — Chart.js pollution trend line + waste composition donut
- **AI Detection Panel** — Drag-and-drop upload, scan animation, bounding box overlays, detection results
- **Forecasting System** — 6 holographic prediction cards with animated progress bars
- **Citizen Reporting** — Full form with GPS, severity, live report tracker
- **Alerts Feed** — Real-time intel feed with live alert injection
- **Auth Modal** — Login/Signup with role selection, glassmorphism UI
- **Footer** — Social links, newsletter, compliance badges

### 🎭 Design
- Dark ocean cyberpunk aesthetic
- Glassmorphism cards with glow effects
- Orbitron + Exo 2 typography
- CSS animations: waves, particles, scan lines, glitch effects, counter animations
- Fully responsive (mobile, tablet, desktop)

---

## 🤖 AI Detection

Click **"Try AI Detection"** and either:
- Upload any ocean/beach image
- Use a sample image (Plastic Waste, Oil Spill, Fishing Nets)

The system simulates YOLOv8 detection with:
- Scan line animation
- Waste type classifications + confidence bars
- Environmental risk meter
- AI-recommended cleanup action

---

## 🗺️ Interactive Map

- 12 global pollution hotspots with animated markers
- Filter by: All / Critical / Medium / Safe
- Click any marker for pollution details
- Dark-themed Leaflet with OpenStreetMap tiles

---

## 🔧 Production Backend Stack (Architecture)

```
Backend:        FastAPI + Python
Database:       MongoDB / PostgreSQL
AI Models:      YOLOv8, TensorFlow, PyTorch, OpenCV
Auth:           JWT + bcrypt
Real-time:      WebSockets
Containerization: Docker + Docker Compose
Deployment:     AWS / GCP / Azure
```

### API Endpoints Design
```
POST /api/auth/login
POST /api/auth/signup
GET  /api/reports
POST /api/reports/submit
POST /api/ai/detect
GET  /api/analytics/health
GET  /api/forecast
GET  /api/notifications/live (WebSocket)
```

---

## 🌐 Environment Variables (Production)

```env
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key
ANTHROPIC_API_KEY=sk-ant-...
MAPBOX_TOKEN=pk.eyJ1...
AWS_S3_BUCKET=marine-guard-uploads
OPENAI_API_KEY=sk-...
```

---

## 🐳 Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]
```

---

## 📊 Tech Stack Used

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Maps | Leaflet.js |
| Charts | Chart.js |
| Fonts | Orbitron, Exo 2 (Google Fonts) |
| Canvas | HTML5 Canvas API |
| Animation | CSS Keyframes + JS |

---

## 🏆 Hackathon Highlights

- ⚡ Zero build step — open instantly
- 🌊 Ocean canvas wave simulation
- 🤖 Realistic AI detection simulation
- 📡 Live data feed simulation
- 🗺️ Real interactive map with global data
- 📱 Fully mobile responsive
- 🎨 Production-grade visual design

---

*Built with 💙 for our oceans | Marine Guard AI © 2025*
