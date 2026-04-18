require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const BASE = process.env.BASE_PATH || '/project';
const PORT = process.env.PORT || 3030;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'bergman-hub-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  res.redirect(BASE + '/login');
}

// Login page
app.get(BASE + '/login', (req, res) => {
  const error = req.query.error ? 'Invalid username or password' : '';
  res.send(loginPage(error));
});

app.post(BASE + '/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    req.session.authenticated = true;
    res.redirect(BASE);
  } else {
    res.redirect(BASE + '/login?error=1');
  }
});

app.get(BASE + '/logout', (req, res) => {
  req.session.destroy();
  res.redirect(BASE + '/login');
});

// Main dashboard - protected
app.get(BASE, requireAuth, (req, res) => {
  res.send(dashboardPage());
});

// API for project details
app.get(BASE + '/api/projects', requireAuth, (req, res) => {
  res.json(getProjects());
});

app.listen(PORT, () => {
  console.log(`Project Hub running on port ${PORT}`);
  console.log(`${BASE} -> http://localhost:${PORT}${BASE}`);
});

function getProjects() {
  return [
    {
      name: 'TapIn NFC Attendance',
      icon: 'fa-id-badge',
      color: '#00d4ff',
      status: 'Live',
      category: ['business', 'ai'],
      url: 'https://skylarkmedia.se/tapin/',
      github: 'https://github.com/anirudhatalmale6-alt/nfc-tapin-attendance',
      description: 'Complete NFC attendance system with employee management, citizen profiles, journals/diary, planning/scheduling, contracts, data processing log, IP lock, custom themes, AI insights, HR module, guard routines, room management.',
      tech: ['Node.js', 'Express', 'EJS', 'SQLite', 'NFC', 'AI'],
      credentials: [
        { label: 'Admin Login', user: 'admin', pass: 'Admin2024!' }
      ],
      paths: {
        server: '/var/www/nfc-attendance/',
        pm2: 'nfc-tapin (port 3002, BASE=/tapin)',
        altUrl: 'Also available at /id/ (nfc-attendance, port 3001, BASE=/id)'
      },
      docs: '41 employees, 21 citizens. Modules: Dashboard, People, Documentation, Planning, Time & Attendance, Stays & Billing, Communication, Tasks, AI Insights, HR, Settings. NFC tag scanning for check-in/checkout. OpenAI + Anthropic AI integration for assistant and insights.'
    },
    {
      name: 'NordJournal Marketplace',
      icon: 'fa-building',
      color: '#6366f1',
      status: 'Live',
      category: ['business'],
      url: 'https://skylarkmedia.se/nordjournal/',
      github: 'https://github.com/anirudhatalmale6-alt/nordjournal-marketplace',
      description: 'Danish social services marketplace connecting case workers with care providers. Search across categories, target groups, regions. Provider profiles with verification.',
      tech: ['Node.js', 'Express', 'SQLite', 'SPA'],
      credentials: [
        { label: 'Super Admin', user: 'admin@tapin.se', pass: 'admin123' },
        { label: 'Case Worker', user: 'anna@koebenhavn.dk', pass: 'Test1234!' },
        { label: 'Provider', user: 'provider@solhojgard.dk', pass: 'Test1234!' }
      ],
      paths: {
        server: '/var/www/nordjournal-marketplace/',
        pm2: 'nordjournal-marketplace (port 3025, BASE=/nordjournal)'
      },
      docs: '12 Danish service categories with legal refs (SEL paragraphs), 16 target groups. 3 roles: case_worker, provider_admin, super_admin. Phase 1 deployed. Inquiry system between case workers and providers.'
    },
    {
      name: 'NordJournal Demo',
      icon: 'fa-desktop',
      color: '#10b981',
      status: 'Live',
      category: ['business'],
      url: 'https://skylarkmedia.se/nordjournal/demo/',
      github: 'https://github.com/anirudhatalmale6-alt/nordjournal-demo',
      description: 'Interactive demo of the NordJournal care management system for presentations and sales.',
      tech: ['Node.js', 'Express', 'EJS'],
      credentials: [
        { label: 'Demo Login', user: 'admin', pass: 'Admin2024!' }
      ],
      paths: {
        server: '/var/www/nordjournal-demo/',
        pm2: 'nordjournal-demo (port 3021, BASE=/nordjournal/demo)'
      },
      docs: 'Full demo environment with sample data. Citizen profiles, journals, planning modules, attendance tracking.'
    },
    {
      name: 'NordJournal Admin',
      icon: 'fa-cog',
      color: '#f59e0b',
      status: 'Live',
      category: ['business'],
      url: 'https://skylarkmedia.se/nordjournal/admin/',
      github: 'https://github.com/anirudhatalmale6-alt/nordjournal-admin',
      description: 'Administration panel for NordJournal system management and configuration.',
      tech: ['Node.js', 'Express'],
      credentials: [
        { label: 'Admin Login', user: 'admin', pass: 'Admin2024!' }
      ],
      paths: {
        server: '/var/www/nordjournal-admin/',
        pm2: 'nordjournal-admin (port 3020, BASE=/nordjournal/admin)'
      },
      docs: 'System configuration, user management, data import/export.'
    },
    {
      name: 'FC Distribution',
      icon: 'fa-film',
      color: '#ef4444',
      status: 'Live',
      category: ['media', 'business'],
      url: 'https://skylarkmedia.se/fc/',
      description: 'Film distribution platform with 317 films, 18 catalogues, member directory with 410 members, newsletter system, invoice generator, digital membership cards.',
      tech: ['React', 'Vite', 'TypeScript', 'Tailwind', 'Express API'],
      credentials: [
        { label: 'Admin Panel', user: 'admin@fcdistribution.se', pass: 'FCAdmin2026!' }
      ],
      github: 'https://github.com/anirudhatalmale6-alt/fc-distribution',
      paths: {
        server: '/opt/fc-distribution/ (frontend) + API on port 3011',
        pm2: 'fc-api (port 3011)',
        build: 'React SPA at /var/www/skylarkmedia/fc/'
      },
      docs: '317 films seeded, 410 members imported from IdrottOnline XLS. Features: Catalogue PDF Builder (3 templates), Invoice Generator (Swedish faktura), Member Directory + Profiles, Digital Membership Cards with QR, Newsletter system with campaigns. Multi-language: sv, en, da, no, fi, fr.'
    },
    {
      name: 'KulturAI',
      icon: 'fa-palette',
      color: '#8b5cf6',
      status: 'Live',
      category: ['ai', 'business'],
      url: 'https://skylarkmedia.se/kai/',
      description: 'AI-powered grant writing platform for cultural workers in Sweden/EU. 32 funding sources from 9 countries, AI writer, chatbot with knowledge base, artist directory.',
      tech: ['Node.js', 'Express', 'SQLite', 'AI'],
      credentials: [
        { label: 'Admin', user: 'admin@kulturai.se', pass: 'KulturAdmin2026!' }
      ],
      github: 'https://github.com/anirudhatalmale6-alt/kulturai',
      paths: {
        server: '/var/www/skylarkmedia/kai/',
        pm2: 'kulturai (port 3010, BASE=/kai)'
      },
      docs: '32 funding sources, detailed art form categories. Features: Funding Explorer, AI Writer, Chatbot (knowledge base), Admin Panel, Artist Profiles/Directory, Video embeds. 14-page project proposal PDF generator.'
    },
    {
      name: 'Festival AI',
      icon: 'fa-music',
      color: '#ec4899',
      status: 'Live',
      category: ['ai', 'media'],
      url: 'https://skylarkmedia.se/fai/',
      github: 'https://github.com/anirudhatalmale6-alt/festival-ai',
      description: 'AI-powered festival planning and management platform with intelligent scheduling and resource allocation.',
      tech: ['Node.js', 'Express', 'SQLite', 'AI'],
      credentials: [
        { label: 'Admin', user: 'admin@festival.ai', pass: 'FestAdmin2026!' }
      ],
      paths: {
        server: '/var/www/skylarkmedia/fai/',
        pm2: 'festivalai (port 3012, BASE=/fai)'
      },
      docs: 'Festival event planning with AI assistance. Artist booking, stage scheduling, volunteer management.'
    },
    {
      name: 'Val - Election Intelligence',
      icon: 'fa-chart-bar',
      color: '#3b82f6',
      status: 'Beta',
      category: ['ai', 'business'],
      url: 'https://skylarkmedia.se/val/',
      github: 'https://github.com/anirudhatalmale6-alt/election-intelligence',
      description: 'Election analytics platform with voter analysis, field operations coordination, demographic tracking, AI briefings. Swedish election data visualization.',
      tech: ['Node.js', 'Express', 'SQLite', 'AI'],
      credentials: [
        { label: 'Admin', user: 'admin', pass: 'Admin2024!' }
      ],
      paths: {
        server: '/var/www/skylarkmedia/election-ai/',
        pm2: 'election-ai (port 3022)'
      },
      docs: 'Election results visualization and mapping. Voter database with smart search. Phone banking and door-knocking coordination. AI scoring per district. Languages: Swedish, English, Hindi, Urdu.'
    },
    {
      name: 'Playout AI',
      icon: 'fa-tv',
      color: '#14b8a6',
      status: 'Live',
      category: ['media'],
      url: 'https://skylarkmedia.se/playout/',
      github: 'https://github.com/anirudhatalmale6-alt/playout-ai',
      description: 'Web-based 24/7 video playout and multi-RTMP streaming panel. Media upload/transcode, playlists, multi-destination RTMP, live control, scheduler, overlays.',
      tech: ['Node.js', 'Express', 'Socket.IO', 'FFmpeg'],
      credentials: [
        { label: 'Admin', user: 'admin@playout.local', pass: 'PlayoutAdmin2026!' }
      ],
      paths: {
        server: '/var/www/skylarkmedia/playout/',
        pm2: 'playout (port 3015, BASE=/playout)'
      },
      docs: 'Features: Media upload/transcode, playlists (drag-drop reorder, loop), multi-destination RTMP, live control, scheduler, overlays, 4-channel switcher, YouTube import, audio mixing, aspect ratio control, activity log. Dashboard with live stream preview and circular gauges.'
    },
    {
      name: 'Kasamira Live Studio',
      icon: 'fa-video',
      color: '#f97316',
      status: 'Live',
      category: ['media'],
      url: 'https://skylarkmedia.se/studio/',
      github: 'https://github.com/anirudhatalmale6-alt/kasamira-livestudio',
      description: 'Browser-based live production platform (StreamYard-like) with WebRTC, canvas compositing, multi-stream RTMP, guest invites, lower thirds, recording.',
      tech: ['Node.js', 'Express', 'WebRTC', 'Socket.IO', 'Canvas API'],
      credentials: [
        { label: 'Admin', user: 'admin@livestudio.local', pass: 'StudioAdmin2026!' }
      ],
      paths: {
        server: '/var/www/skylarkmedia/studio/',
        pm2: 'livestudio (port 3016, BASE=/studio)'
      },
      docs: 'Studio rooms, guest invite links, backstage/green room, WebRTC peer connections, canvas compositing (layouts: single/side-by-side/grid), lower thirds, ticker, logo overlay, backgrounds, RTMP multistream via FFmpeg, local recording, chat. Phase 1 MVP deployed.'
    },
    {
      name: 'VaxelNord IVR',
      icon: 'fa-phone',
      color: '#06b6d4',
      status: 'Development',
      category: ['business'],
      url: 'https://skylarkmedia.se/vaxelnord/',
      description: 'IVR phone system with Asterisk 20.6 SIP integration and React admin panel for call flow management.',
      tech: ['Node.js', 'Asterisk', 'SIP', 'React'],
      credentials: [
        { label: 'Admin Panel', user: 'admin', pass: 'VaxelNord2026!' }
      ],
      github: 'https://github.com/anirudhatalmale6-alt/vaxelnord-ivr',
      paths: {
        server: 'API on server',
        pm2: 'vaxelnord-api (port 3101)'
      },
      docs: 'Asterisk 20.6 PBX integration. React admin panel for IVR flow management. Needs SIP trunk to go live.'
    },
    {
      name: 'MitSign',
      icon: 'fa-file-signature',
      color: '#a855f7',
      status: 'Live',
      category: ['business'],
      url: 'https://skylarkmedia.se/mitsign/',
      github: 'https://github.com/anirudhatalmale6-alt/mitsign',
      description: 'Digital document signing platform for secure electronic signatures.',
      tech: ['Node.js', 'Express', 'PDF'],
      credentials: [
        { label: 'Admin', user: 'admin', pass: 'Admin2024!' }
      ],
      paths: {
        server: '/var/www/skylarkmedia/mitsign/',
        pm2: 'mitsign'
      },
      docs: 'Upload documents, add signature fields, send for signing, track status.'
    },
    {
      name: 'Vikarly',
      icon: 'fa-users',
      color: '#22c55e',
      status: 'Live',
      category: ['business'],
      url: 'https://skylarkmedia.se/vikarly/',
      github: 'https://github.com/anirudhatalmale6-alt/vikarly',
      description: 'Temp agency staffing management platform for shift scheduling and worker management.',
      tech: ['Node.js', 'Express', 'SQLite'],
      credentials: [
        { label: 'Admin', user: 'admin', pass: 'Admin2024!' }
      ],
      paths: {
        server: '/var/www/vikarly/',
        pm2: 'vikarly'
      },
      docs: 'Staff profiles, shift scheduling, availability management, agency dashboard.'
    },
    {
      name: 'Momentum Journal',
      icon: 'fa-book',
      color: '#0ea5e9',
      status: 'Live',
      category: ['business'],
      url: 'https://skylarkmedia.se/journal/',
      github: 'https://github.com/anirudhatalmale6-alt/momentum-journal',
      description: 'Digital journal and diary system for care facilities with structured entries and reporting.',
      tech: ['Node.js', 'Express'],
      credentials: [
        { label: 'Admin', user: 'admin', pass: 'Admin2024!' }
      ],
      paths: {
        server: '/var/www/momentum-journal/',
        pm2: 'momentum-journal (port 3003)'
      },
      docs: '23 diary categories, 13 plan templates. Journal entries with timestamps, categories, and staff attribution.'
    },
    {
      name: 'Bergman Coding Website',
      icon: 'fa-code',
      color: '#64748b',
      status: 'Live',
      category: ['business'],
      url: 'https://skylarkmedia.se/bc/',
      description: 'Company website with admin panel, security features, GDPR compliance, cookie consent, privacy policy.',
      tech: ['HTML', 'CSS', 'JS', 'PHP'],
      credentials: [
        { label: 'Admin Panel', user: 'admin', pass: 'BergmanAdmin2026!' }
      ],
      paths: {
        server: '/var/www/skylarkmedia/bc/',
        admin: '/bc/admin/'
      },
      docs: 'Static HTML site with PHP admin panel. Features: cookie consent (GDPR), privacy policy, video section, footer social links, security section, E2E encryption info, 2FA info, cybersecurity section.'
    },
    {
      name: 'TapIn Android App',
      icon: 'fa-mobile-alt',
      color: '#7c3aed',
      status: 'Live',
      category: ['business'],
      url: 'https://skylarkmedia.se/downloads/TapIn-CheckIn-v1.0.apk',
      description: 'Android kiosk check-in/checkout app with NFC support. Full-screen kiosk mode prevents user from leaving the app.',
      tech: ['Android', 'Java', 'NFC'],
      credentials: [
        { label: 'Admin PIN', user: '(tap logo 5x)', pass: '1234' }
      ],
      github: 'https://github.com/anirudhatalmale6-alt/tapin-android',
      paths: {
        apk: '/var/www/skylarkmedia/downloads/TapIn-CheckIn-v1.0.apk',
        source: '/var/lib/freelancer/projects/40289839/tapin-android/'
      },
      docs: 'Kiosk mode (SYSTEM_UI_FLAG_IMMERSIVE_STICKY). NFC foreground dispatch. Connects to /id/ backend API. Device owner setup: adb shell dpm set-device-owner se.skylarkmedia.tapin/.DeviceAdminReceiver'
    },
    {
      name: 'bKorkortsteori.se',
      icon: 'fa-car',
      color: '#1db954',
      status: 'Live',
      category: ['ai', 'business'],
      url: 'https://bkorkortsteori.se',
      github: 'https://github.com/anirudhatalmale6-alt/bkorkortsteori',
      description: 'Swedish driving theory quiz app with 8 languages, AI tutor, Stripe payments, 5 license categories (Car, MC, Truck, Bus, Taxi).',
      tech: ['PHP 8.4', 'MySQL 8.4', 'jQuery', 'Stripe', 'Gemini AI'],
      credentials: [
        { label: 'Admin Panel', user: 'admin@bkorkortsteori.se', pass: 'Admin2024!' },
        { label: 'Test User', user: 'test@gmail.com', pass: '123456' }
      ],
      paths: {
        server: 'Loopia WebSupport (shell.r103.websupport.se:28403)',
        sshUser: 'uid6217407',
        sshPass: 'c7726d29cb',
        webRoot: '~/bkorkortsteori.se/web/',
        db: 'MySQL: bkorkortsteori / Cf0t7Z9Bt5'
      },
      docs: '8 languages (SE, EN, DA, NO, AR, UR, HI, Dari). 5 course categories. Google OAuth login. Gemini AI tutor (premium). Stripe payments (TEST mode, 200kr/yr Car, 300kr/yr All). Admin panel at /admin/. Translation system with t()/tt()/tx() helpers.'
    },
    {
      name: 'KRRC',
      icon: 'fa-graduation-cap',
      color: '#d946ef',
      status: 'Live',
      category: ['business'],
      url: 'https://skylarkmedia.se/krrc/',
      github: 'https://github.com/anirudhatalmale6-alt/krrc',
      description: 'Educational platform.',
      tech: ['Node.js', 'Express'],
      credentials: [
        { label: 'Admin', user: 'admin', pass: 'Admin2024!' }
      ],
      paths: {
        server: '/var/www/krrc/',
        pm2: 'krrc (port 3006)'
      },
      docs: 'Educational content management and delivery platform.'
    }
  ];
}

function loginPage(error) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Project Hub - Login</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#0d1b2a;color:#e0e0e0;min-height:100vh;display:flex;align-items:center;justify-content:center}
.login-card{background:#1b2838;border-radius:16px;padding:48px;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,0.4);border:1px solid rgba(0,212,255,0.1)}
.logo{text-align:center;margin-bottom:32px}
.logo-icon{width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#00d4ff,#6366f1);display:inline-flex;align-items:center;justify-content:center;font-size:28px;color:#fff;margin-bottom:12px}
.logo h1{font-size:22px;color:#00d4ff;font-weight:700}
.logo p{color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px}
.form-group{margin-bottom:20px}
label{display:block;font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:6px;font-weight:500}
input{width:100%;padding:12px 16px;background:#0d1b2a;border:1px solid rgba(255,255,255,0.15);border-radius:10px;color:#fff;font-size:15px;font-family:inherit;outline:none;transition:border-color 0.2s}
input:focus{border-color:#00d4ff}
button{width:100%;padding:14px;background:linear-gradient(135deg,#00d4ff,#6366f1);border:none;border-radius:10px;color:#fff;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;transition:opacity 0.2s}
button:hover{opacity:0.9}
.error{background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#ef4444;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;text-align:center}
</style>
</head>
<body>
<div class="login-card">
  <div class="logo">
    <div class="logo-icon">B</div>
    <h1>Bergman Coding AB</h1>
    <p>Project Hub - Admin Access</p>
  </div>
  ${error ? '<div class="error">' + error + '</div>' : ''}
  <form method="POST" action="${BASE}/login">
    <div class="form-group">
      <label>Username</label>
      <input type="text" name="username" placeholder="Enter username" autofocus required>
    </div>
    <div class="form-group">
      <label>Password</label>
      <input type="password" name="password" placeholder="Enter password" required>
    </div>
    <button type="submit">Login</button>
  </form>
</div>
</body>
</html>`;
}

function dashboardPage() {
  const projects = getProjects();
  const liveCount = projects.filter(p => p.status === 'Live').length;
  const aiCount = projects.filter(p => p.category.includes('ai')).length;
  const githubCount = projects.filter(p => p.github).length;

  const projectCards = projects.map(p => {
    const credRows = (p.credentials || []).map(c =>
      `<tr><td>${c.label}</td><td><code>${c.user}</code></td><td><code class="pass">${c.pass}</code> <span class="copy-btn" onclick="copyText('${c.pass.replace(/'/g,"\\'")}')">copy</span></td></tr>`
    ).join('');

    const pathRows = p.paths ? Object.entries(p.paths).map(([k,v]) =>
      `<div class="path-item"><span class="path-label">${k}:</span> <code>${v}</code></div>`
    ).join('') : '';

    const techTags = (p.tech || []).map(t => `<span class="tech-tag">${t}</span>`).join('');

    const statusClass = p.status === 'Live' ? 'status-live' : p.status === 'Beta' ? 'status-beta' : 'status-dev';

    const buttons = [];
    if (p.url) buttons.push(`<div class="url-info"><i class="fas fa-link"></i> <code>${p.url}</code> <span class="copy-btn" onclick="copyText('${p.url.replace(/'/g,"\\'")}')">copy</span></div>`);
    if (p.github) buttons.push(`<div class="url-info"><i class="fab fa-github"></i> <code>${p.github}</code> <span class="copy-btn" onclick="copyText('${p.github.replace(/'/g,"\\'")}')">copy</span></div>`);

    return `<div class="project-card" data-name="${p.name.toLowerCase()}" data-cats="${p.category.join(',')}" data-status="${p.status.toLowerCase()}">
      <div class="card-accent" style="background:${p.color}"></div>
      <div class="card-header">
        <div class="card-icon" style="background:${p.color}20;color:${p.color}"><i class="fas ${p.icon}"></i></div>
        <span class="status-badge ${statusClass}">${p.status}</span>
      </div>
      <h3>${p.name}</h3>
      <p class="card-desc">${p.description}</p>
      <div class="tech-tags">${techTags}</div>
      <div class="section-label">Credentials</div>
      <table class="cred-table"><thead><tr><th>Role</th><th>Username</th><th>Password</th></tr></thead><tbody>${credRows}</tbody></table>
      <div class="section-label">Server Paths</div>
      <div class="paths">${pathRows}</div>
      ${p.docs ? `<div class="section-label">Documentation</div><div class="docs-text">${p.docs}</div>` : ''}
      ${p.github ? `<div class="section-label"><i class="fab fa-github"></i> Source Code</div><div class="github-section"><a href="${p.github}" target="_blank" class="github-link"><i class="fab fa-github"></i> ${p.github}</a><a href="${p.github}/archive/refs/heads/main.zip" class="download-btn" title="Download ZIP"><i class="fas fa-download"></i> Download ZIP</a></div>` : ''}
      <div class="card-buttons">${buttons.join('')}</div>
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Project Hub - Bergman Coding AB</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#0a1628;color:#e0e0e0;min-height:100vh}
.header{background:#0d1b2a;border-bottom:1px solid rgba(0,212,255,0.15);padding:16px 32px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.header-left{display:flex;align-items:center;gap:14px}
.header-logo{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#00d4ff,#6366f1);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#fff}
.header h1{font-size:20px;color:#00d4ff;font-weight:700}
.header p{font-size:12px;color:rgba(255,255,255,0.4)}
.header-right{display:flex;align-items:center;gap:16px}
.badge{background:linear-gradient(135deg,#00d4ff,#6366f1);padding:6px 16px;border-radius:20px;font-size:13px;font-weight:600;color:#fff}
.logout-btn{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);padding:8px 16px;border-radius:8px;color:rgba(255,255,255,0.7);font-size:13px;cursor:pointer;text-decoration:none;transition:all 0.2s}
.logout-btn:hover{background:rgba(239,68,68,0.2);border-color:rgba(239,68,68,0.4);color:#ef4444}
.container{max-width:1400px;margin:0 auto;padding:24px 32px}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.stat-card{background:#1b2838;border-radius:12px;padding:20px;border:1px solid rgba(255,255,255,0.06)}
.stat-card .stat-val{font-size:28px;font-weight:800;color:#00d4ff}
.stat-card .stat-label{font-size:12px;color:rgba(255,255,255,0.4);margin-top:4px;text-transform:uppercase;letter-spacing:0.5px}
.filters{display:flex;align-items:center;gap:12px;margin-bottom:24px;flex-wrap:wrap}
.search-input{background:#1b2838;border:1px solid rgba(255,255,255,0.1);padding:10px 16px 10px 40px;border-radius:10px;color:#fff;font-size:14px;width:300px;outline:none;font-family:inherit;position:relative}
.search-wrap{position:relative}
.search-wrap i{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.3);font-size:14px}
.filter-btn{padding:8px 18px;border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.6);transition:all 0.2s;font-family:inherit}
.filter-btn.active,.filter-btn:hover{background:#00d4ff;color:#fff;border-color:#00d4ff}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:20px}
.project-card{background:#1b2838;border-radius:14px;padding:0;border:1px solid rgba(255,255,255,0.06);overflow:hidden;transition:transform 0.2s,box-shadow 0.2s}
.project-card:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.3)}
.card-accent{height:3px;width:100%}
.card-header{display:flex;align-items:center;justify-content:space-between;padding:20px 20px 0}
.card-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px}
.status-badge{padding:4px 12px;border-radius:12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
.status-live{background:rgba(16,185,129,0.15);color:#10b981;border:1px solid rgba(16,185,129,0.3)}
.status-beta{background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.3)}
.status-dev{background:rgba(99,102,241,0.15);color:#6366f1;border:1px solid rgba(99,102,241,0.3)}
.project-card h3{padding:12px 20px 0;font-size:17px;font-weight:700;color:#fff}
.card-desc{padding:6px 20px 0;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.5}
.tech-tags{padding:10px 20px 0;display:flex;flex-wrap:wrap;gap:6px}
.tech-tag{background:rgba(255,255,255,0.06);padding:3px 10px;border-radius:6px;font-size:11px;color:rgba(255,255,255,0.5)}
.section-label{padding:14px 20px 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#00d4ff}
.cred-table{width:calc(100% - 40px);margin:0 20px;border-collapse:collapse;font-size:12px}
.cred-table th{text-align:left;padding:6px 8px;color:rgba(255,255,255,0.4);font-weight:500;border-bottom:1px solid rgba(255,255,255,0.08)}
.cred-table td{padding:6px 8px;border-bottom:1px solid rgba(255,255,255,0.04)}
.cred-table code{background:rgba(0,212,255,0.1);padding:2px 8px;border-radius:4px;font-size:12px;color:#00d4ff;font-family:'Courier New',monospace}
.cred-table .pass{color:#f59e0b;background:rgba(245,158,11,0.1)}
.copy-btn{font-size:10px;color:rgba(255,255,255,0.3);cursor:pointer;padding:2px 6px;border-radius:4px;transition:all 0.2s}
.copy-btn:hover{background:rgba(0,212,255,0.2);color:#00d4ff}
.paths{padding:0 20px;font-size:12px}
.path-item{padding:4px 0;color:rgba(255,255,255,0.5)}
.path-label{color:rgba(255,255,255,0.3);font-weight:600;text-transform:capitalize}
.path-item code{font-family:'Courier New',monospace;color:rgba(255,255,255,0.7);font-size:11px}
.docs-text{padding:0 20px 4px;font-size:12px;color:rgba(255,255,255,0.45);line-height:1.6}
.github-section{padding:4px 20px 8px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.github-link{color:#00d4ff;font-size:12px;text-decoration:none;display:flex;align-items:center;gap:6px;word-break:break-all}
.github-link:hover{text-decoration:underline}
.download-btn{background:rgba(16,185,129,0.15);color:#10b981;border:1px solid rgba(16,185,129,0.3);padding:5px 14px;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:5px;transition:all 0.2s;white-space:nowrap}
.download-btn:hover{background:rgba(16,185,129,0.25)}
.card-buttons{padding:12px 20px 16px;display:flex;flex-direction:column;gap:6px}
.url-info{font-size:12px;color:rgba(255,255,255,0.5);display:flex;align-items:center;gap:8px}
.url-info i{color:rgba(255,255,255,0.3);width:14px;text-align:center}
.url-info code{font-family:'Courier New',monospace;color:rgba(255,255,255,0.6);font-size:11px;word-break:break-all}
.footer{text-align:center;padding:40px;color:rgba(255,255,255,0.3);font-size:12px;border-top:1px solid rgba(255,255,255,0.06);margin-top:40px}
.toast{position:fixed;bottom:20px;right:20px;background:#10b981;color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:500;opacity:0;transition:opacity 0.3s;z-index:1000;pointer-events:none}
.toast.show{opacity:1}
@media(max-width:900px){.stats-row{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:1fr}.search-input{width:100%}.filters{flex-direction:column;align-items:stretch}}
</style>
</head>
<body>
<div class="header">
  <div class="header-left">
    <div class="header-logo">B</div>
    <div><h1>Bergman Coding AB</h1><p>Project Hub &mdash; All Projects &amp; Documentation</p></div>
  </div>
  <div class="header-right">
    <span class="badge">${projects.length} Projects</span>
    <a href="${BASE}/logout" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
  </div>
</div>
<div class="container">
  <div class="stats-row">
    <div class="stat-card"><div class="stat-val">${projects.length}</div><div class="stat-label">Total Projects</div></div>
    <div class="stat-card"><div class="stat-val">${liveCount}</div><div class="stat-label">Live Projects</div></div>
    <div class="stat-card"><div class="stat-val">${aiCount}</div><div class="stat-label">AI-Powered</div></div>
    <div class="stat-card"><div class="stat-val">${githubCount}</div><div class="stat-label">GitHub Repos</div></div>
  </div>
  <div class="filters">
    <div class="search-wrap"><i class="fas fa-search"></i><input type="text" class="search-input" placeholder="Search projects..." oninput="filterProjects()"></div>
    <button class="filter-btn active" onclick="setFilter('all',this)">All</button>
    <button class="filter-btn" onclick="setFilter('live',this)">Live</button>
    <button class="filter-btn" onclick="setFilter('ai',this)">AI-Powered</button>
    <button class="filter-btn" onclick="setFilter('media',this)">Media</button>
    <button class="filter-btn" onclick="setFilter('business',this)">Business</button>
  </div>
  <div class="grid">${projectCards}</div>
</div>
<div class="footer">&copy; ${new Date().getFullYear()} Bergman Coding AB (Sverige) &mdash; Powered by Skylarkmedia Infrastructure</div>
<div class="toast" id="toast">Copied!</div>
<script>
let currentFilter='all';
function setFilter(f,btn){
  currentFilter=f;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  filterProjects();
}
function filterProjects(){
  const q=document.querySelector('.search-input').value.toLowerCase();
  document.querySelectorAll('.project-card').forEach(c=>{
    const name=c.dataset.name;
    const cats=c.dataset.cats;
    const status=c.dataset.status;
    let show=true;
    if(q&&!name.includes(q))show=false;
    if(currentFilter==='live'&&status!=='live')show=false;
    if(currentFilter==='ai'&&!cats.includes('ai'))show=false;
    if(currentFilter==='media'&&!cats.includes('media'))show=false;
    if(currentFilter==='business'&&!cats.includes('business'))show=false;
    c.style.display=show?'':'none';
  });
}
function copyText(t){
  navigator.clipboard.writeText(t).then(()=>{
    const toast=document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),1500);
  });
}
</script>
</body>
</html>`;
}

module.exports = app;
