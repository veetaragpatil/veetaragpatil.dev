/* ============ Year ============ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ============ Boot sequence ============ */
(function boot() {
  const boot = document.getElementById('boot');
  const log = document.getElementById('bootLog');
  if (!boot || !log) return;
  // Skip if already shown this session
  if (sessionStorage.getItem('booted')) { boot.classList.add('done'); boot.remove(); return; }

  const lines = [
    "<span class='dim'>[ 0.001 ]</span> initializing veetarag.net ...",
    "<span class='dim'>[ 0.214 ]</span> loading kernel modules <span class='ok'>[ OK ]</span>",
    "<span class='dim'>[ 0.498 ]</span> bringing up eth0 ... 10.0.0.1/24 <span class='ok'>[ OK ]</span>",
    "<span class='dim'>[ 0.872 ]</span> establishing OSPF adjacency <span class='ok'>[ OK ]</span>",
    "<span class='dim'>[ 1.140 ]</span> mounting /portfolio <span class='ok'>[ OK ]</span>",
    "<span class='dim'>[ 1.355 ]</span> system online. welcome.",
  ];
  let i = 0;
  function next() {
    if (i >= lines.length) {
      setTimeout(() => {
        boot.classList.add('done');
        sessionStorage.setItem('booted', '1');
        setTimeout(() => boot.remove(), 600);
      }, 450);
      return;
    }
    log.innerHTML += lines[i] + "\n";
    i++;
    setTimeout(next, 230 + Math.random() * 160);
  }
  next();
})();

/* ============ Live status ticker ============ */
(function ticker() {
  const el = document.getElementById('statusTicker');
  if (!el) return;
  function update() {
    const t = new Date().toLocaleTimeString('en-GB');
    const pps = (Math.random() * 2 + 4).toFixed(1);
    el.textContent = `ONLINE · BANGALORE ${t} · ${pps}k pps`;
  }
  update();
  setInterval(update, 1000);
})();

/* ============ Theme toggle ============ */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ============ Nav: scroll state + mobile menu ============ */
const nav = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');
const progress = document.getElementById('scrollProgress');

function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / h) * 100 + '%';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ============ Typed role text ============ */
const roles = ['Network Engineer', 'Infrastructure Architect', 'Automation Specialist'];
const roleEl = document.getElementById('roleText');
let rIdx = 0, cIdx = 0, deleting = false;

function typeLoop() {
  const word = roles[rIdx];
  cIdx += deleting ? -1 : 1;
  roleEl.textContent = word.slice(0, cIdx);
  let delay = deleting ? 45 : 90;
  if (!deleting && cIdx === word.length) { delay = 1600; deleting = true; }
  else if (deleting && cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; delay = 400; }
  setTimeout(typeLoop, delay);
}
typeLoop();

/* ============ Server rack accordion ============ */
document.querySelectorAll('.rack-unit').forEach((unit) => {
  unit.querySelector('.rack-unit__head').addEventListener('click', () => {
    unit.classList.toggle('open');
  });
});

/* ============ Reveal on scroll ============ */
const revealEls = document.querySelectorAll('.section, .hero__left, .headshot');
revealEls.forEach((el) => el.classList.add('reveal'));
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }),
  { threshold: 0.1 }
);
revealEls.forEach((el) => io.observe(el));

/* ============ Animated counters ============ */
const counters = document.querySelectorAll('.stat strong[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const dur = 1400;
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach((c) => counterIO.observe(c));

/* ============ Subnet calculator ============ */
const cidrInput = document.getElementById('cidrInput');
const subnetOut = document.getElementById('subnetOut');

function ipToInt(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => isNaN(n) || n < 0 || n > 255)) return null;
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}
function intToIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}
function calcSubnet(value) {
  const m = value.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
  if (!m) return { error: 'Format: x.x.x.x/n  (e.g. 192.168.1.0/24)' };
  const ipInt = ipToInt(m[1]);
  const prefix = parseInt(m[2], 10);
  if (ipInt === null) return { error: 'Invalid IP octet (0-255).' };
  if (prefix < 0 || prefix > 32) return { error: 'Prefix must be 0-32.' };
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (ipInt & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const totalHosts = Math.pow(2, 32 - prefix);
  const usable = prefix >= 31 ? (prefix === 31 ? 2 : 1) : totalHosts - 2;
  const firstHost = prefix >= 31 ? network : (network + 1) >>> 0;
  const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;
  return {
    Network: intToIp(network),
    'Subnet Mask': intToIp(mask),
    Broadcast: intToIp(broadcast),
    'Host Range': `${intToIp(firstHost)} – ${intToIp(lastHost)}`,
    'Usable Hosts': usable.toLocaleString(),
    Wildcard: intToIp(~mask >>> 0),
  };
}
function renderSubnet() {
  const res = calcSubnet(cidrInput.value);
  if (res.error) {
    subnetOut.className = 'subnet-out invalid';
    subnetOut.innerHTML = `<div class="subnet-err">✗ ${res.error}</div>`;
    return;
  }
  subnetOut.className = 'subnet-out';
  subnetOut.innerHTML = Object.entries(res)
    .map(([k, v]) => `<div class="subnet-cell"><span class="k">${k}</span><span class="v">${v}</span></div>`)
    .join('');
}
if (cidrInput) {
  cidrInput.addEventListener('input', renderSubnet);
  renderSubnet();
}

/* ============ Interactive terminal ============ */
const termOut = document.getElementById('termOut');
const termInput = document.getElementById('termInput');
const termbox = document.getElementById('termbox');
const history = [];
let histIdx = -1;

const commands = {
  help: () =>
    'Available commands:\n  whoami      who is this\n  skills      tech stack\n  projects    lab work\n  ping <host> reachability test\n  contact     get in touch\n  resume      download CV\n  clear       wipe screen',
  whoami: () => 'veetarag — Network Engineer · Infrastructure Architect · Automation Specialist (Bangalore, IN)',
  skills: () => 'Routing: OSPF, BGP, EIGRP, STP, VLANs\nSecurity: Firewalls, VPN/IPSec, ACLs, IDS/IPS\nCloud: VPCs, SD-WAN, Subnetting\nAutomation: Python, Netmiko, Ansible',
  projects: () => '1. Enterprise Campus Architecture (4 VLANs)\n2. Automated Provisioning Script (Python)\n3. Homelab Datacenter & Snort IDS',
  contact: () => 'email: veetaragpatil333@gmail.com\ngithub: github.com/veetaragpatil\nlinkedin: linkedin.com/in/veetarag-patil',
  resume: () => { window.open('assets/Veetarag-Patil-Resume.pdf', '_blank'); return 'Opening resume.pdf ...'; },
  clear: () => { termOut.innerHTML = ''; return null; },
  ping: (args) => {
    const host = args[0] || 'localhost';
    const lines = [];
    for (let i = 0; i < 4; i++) {
      const t = (Math.random() * 12 + 1).toFixed(1);
      lines.push(`64 bytes from ${host}: icmp_seq=${i} ttl=64 time=${t} ms`);
    }
    return `PING ${host}:\n${lines.join('\n')}\n--- ${host} ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss`;
  },
};

function printLine(html, cls = 'res') {
  const div = document.createElement('div');
  div.className = `line ${cls}`;
  div.innerHTML = html;
  termOut.appendChild(div);
  termbox.scrollTop = termbox.scrollHeight;
}
function escapeHtml(s) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
function runCommand(raw) {
  const input = raw.trim();
  printLine(`<span class="c-prompt">guest@net:~$</span> ${escapeHtml(input)}`, 'cmd');
  if (!input) return;
  history.unshift(input); histIdx = -1;
  const [cmd, ...args] = input.split(/\s+/);
  const fn = commands[cmd.toLowerCase()];
  if (!fn) { printLine(`command not found: ${escapeHtml(cmd)} — type 'help'`); return; }
  const out = fn(args);
  if (out !== null) printLine(escapeHtml(out).replace(/\n/g, '<br>'), cmd === 'whoami' ? 'res accent' : 'res');
}

if (termInput) {
  printLine("Welcome. Type <span class='accent' style='color:var(--accent)'>help</span> to list commands.", 'res');
  termbox.addEventListener('click', () => termInput.focus());
  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { runCommand(termInput.value); termInput.value = ''; }
    else if (e.key === 'ArrowUp') { if (histIdx < history.length - 1) { histIdx++; termInput.value = history[histIdx]; } e.preventDefault(); }
    else if (e.key === 'ArrowDown') { if (histIdx > 0) { histIdx--; termInput.value = history[histIdx]; } else { histIdx = -1; termInput.value = ''; } e.preventDefault(); }
  });
}

/* ============ Contact form ============ */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = (data.get('name') || '').toString().trim();
  const email = (data.get('email') || '').toString().trim();
  const message = (data.get('message') || '').toString().trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !emailOk || !message) {
    status.textContent = '✗ Please fill in your name, a valid email, and a message.';
    status.className = 'ssh__status mono err';
    return;
  }

  const accessKey = (data.get('access_key') || '').toString();
  const hasKey = accessKey && accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY';

  // Fallback to mailto if no Web3Forms key configured yet
  if (!hasKey) {
    status.textContent = '✓ opening mail client...';
    status.className = 'ssh__status mono ok';
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:veetaragpatil333@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
    return;
  }

  status.textContent = '› sending your message...';
  status.className = 'ssh__status mono';
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(data)),
    });
    const json = await res.json();
    if (json.success) {
      status.textContent = '✓ Message sent — thanks! I\'ll get back to you soon.';
      status.className = 'ssh__status mono ok';
      form.reset();
    } else {
      throw new Error(json.message || 'failed');
    }
  } catch (err) {
    status.textContent = '✗ Couldn\'t send your message. Please email me at veetaragpatil333@gmail.com';
    status.className = 'ssh__status mono err';
  }
});

/* ============ Custom cursor ============ */
const cursor = document.getElementById('cursor');
const dot = document.getElementById('cursorDot');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let cx = mx, cy = my;

if (window.matchMedia('(hover: hover)').matches) {
  document.body.classList.add('cursor-ready');
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });
  function followCursor() {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(followCursor);
  }
  followCursor();

  document.querySelectorAll('[data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-link'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-link'));
  });
}

/* ============ Headshot parallax tilt ============ */
(function tilt() {
  const card = document.getElementById('headshot');
  if (!card || !window.matchMedia('(hover: hover)').matches) return;
  const hero = document.getElementById('hero');
  hero.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / r.width;
    const dy = (e.clientY - cy) / r.height;
    card.style.transform = `perspective(800px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`;
  });
  hero.addEventListener('mouseleave', () => { card.style.transform = ''; });
})();

/* ============ Interactive network mesh ============ */
(function mesh() {
  const canvas = document.getElementById('mesh');
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [];
  const mouse = { x: -9999, y: -9999 };

  function color(varName) {
    return getComputedStyle(root).getPropertyValue(varName).trim();
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(70, Math.floor((w * h) / 24000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const lineColor = color('--mesh-line');
    const dotColor = color('--mesh-dot');

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      // attraction to cursor
      const dxm = mouse.x - n.x, dym = mouse.y - n.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < 160) { n.x += dxm * 0.012; n.y += dym * 0.012; }
    }

    // connect cursor to nearby nodes (glowing)
    for (const n of nodes) {
      const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
      if (d < 180) {
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = dotColor;
        ctx.globalAlpha = 1 - d / 180;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // connect nodes to each other
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = lineColor;
          ctx.globalAlpha = (1 - d / 130) * 0.5;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // draw nodes
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
})();
