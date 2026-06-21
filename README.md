# Veetarag Patil — Portfolio

A modern, interactive personal portfolio for **Veetarag Vardhaman Patil**, a Network
Engineer and Computer Science student. The site is themed like an enterprise
**datacenter control panel** — clean, structured, and trustworthy — and is built as a
fast, dependency-free static website.

🌐 **Live site:** [veetaragpatil.dev](https://veetaragpatil.dev)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Running Locally](#running-locally)
- [Contact Form (Web3Forms)](#contact-form-web3forms)
- [Deployment (GitHub Pages + Custom Domain)](#deployment-github-pages--custom-domain)
- [Customization](#customization)
- [Roadmap](#roadmap)

---

## Overview

The portfolio presents Veetarag's profile, skills, experience, and lab projects through
an interactive, single-page experience. The visual language borrows from networking and
infrastructure — terminals, server racks, topology diagrams, packet flows, and a live
network mesh — to reinforce the brand of a network engineer.

**Aesthetic:** Slate greys, crisp whites, and a "Cisco blue" + amber accent palette.
**Typography:** `Inter` for body text, `JetBrains Mono` for IPs, code, and labels.
**Theme:** Light/dark toggle with the user's choice saved in the browser.

---

## Features

### Landing / Hero
- **Boot sequence** — a datacenter-style boot log types out on first visit, then fades
  into the site (shown once per browser session).
- **Dynamic role text** — cycles through "Network Engineer", "Infrastructure Architect",
  and "Automation Specialist".
- **Live status ticker** — real-time clock and a simulated packets-per-second readout.
- **"Open to opportunities"** availability badge for recruiters.
- **Professional headshot** with a 3D parallax tilt on mouse move, a scanning animation,
  and floating skill tags (OSPF, BGP, Python, VLAN).
- **CTAs:** Explore Topologies, Initiate Ping (contact), and Resume download.

### Interactive UI
- **Custom RJ45 cursor** — a network-jack icon appears over clickable elements (desktop).
- **Interactive network mesh** background — nodes drift, connect with glowing lines, and
  react to the cursor.
- **Scroll progress bar** and smooth section reveals on scroll.

### Content Sections
- **About ("The Core")** — bio plus an interactive **server rack** (click U1–U4 units to
  expand Education, Experience, Certifications, Achievements) and animated stat counters.
- **Skill Matrix** — node grid where hovering routes a packet and reveals the tool stack
  (Routing & Switching, Network Security, Cloud Networking, Automation, Monitoring, OS).
- **Projects dashboard** — Enterprise Campus Architecture, Automated Provisioning Script,
  and Homelab Datacenter & IDS. Cards expand on hover to reveal tech stack and links.

### Network Toolkit (live tools)
- **Subnet calculator** — enter any CIDR (e.g. `192.168.1.0/24`) to instantly compute the
  network address, subnet mask, broadcast, host range, usable hosts, and wildcard mask.
- **Interactive terminal** — visitors can type real commands: `help`, `whoami`, `skills`,
  `projects`, `ping <host>`, `contact`, `resume`, `clear` — with command history.

### Contact
- **SSH-styled contact form** wired to **Web3Forms** for real email delivery, with a
  graceful `mailto` fallback and friendly status messages.
- Glowing links to **Email**, **GitHub**, and **LinkedIn**.

### Quality
- Fully **responsive** (desktop, tablet, mobile) with a mobile nav menu.
- **Accessibility**: semantic markup, ARIA labels, focus states, and a
  `prefers-reduced-motion` fallback that disables animations.
- **SEO**: meta description, Open Graph / Twitter tags, canonical URL, and an inline SVG
  favicon of the network-node logo.

---

## Tech Stack

- **HTML5** — semantic markup, no framework.
- **CSS3** — custom properties (theming), grid/flex layouts, animations.
- **Vanilla JavaScript** — canvas mesh, custom cursor, typed text, accordion, counters,
  subnet calculator, terminal, and form handling.
- **Web3Forms** — serverless contact form delivery.
- **GitHub Pages** — static hosting with a custom domain and automatic HTTPS.

No build step, no dependencies, no package manager required.

---

## Project Structure

```
portfolio/
├── index.html      # Page markup and all sections
├── styles.css      # Theme tokens, layout, components, animations, responsive rules
├── script.js       # All interactivity (mesh, cursor, tools, form, etc.)
├── CNAME           # Custom domain for GitHub Pages (veetaragpatil.dev)
├── README.md       # This file
├── .gitignore
└── assets/
    ├── headshot.png                # Profile photo
    └── Veetarag-Patil-Resume.pdf   # Downloadable resume
```

---

## Running Locally

The site is fully static — just open `index.html` in a browser, or serve it:

```bash
# Python (recommended — needed for the contact form fetch to work)
python -m http.server 8000
# then visit http://localhost:8000
```

> Tip: opening `index.html` directly via `file://` works for most features, but serving
> over `http://` is recommended so the contact form's network request behaves correctly.

---

## Contact Form (Web3Forms)

The form delivers messages straight to the inbox via Web3Forms (free, no backend).

1. Get a free access key at [web3forms.com](https://web3forms.com).
2. In `index.html`, set the key on the hidden field inside the contact form:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
   ```
3. If no valid key is present, the form automatically falls back to opening the visitor's
   email client (`mailto`).

A hidden honeypot field (`botcheck`) is included to reduce spam.

---

## Deployment (GitHub Pages + Custom Domain)

This site is deployed to **GitHub Pages** on the custom domain **veetaragpatil.dev**.

### 1. Push the code
```bash
git remote add origin https://github.com/veetaragpatil/veetaragpatil.dev.git
git push -u origin main
```

### 2. Enable Pages
In the repo: **Settings → Pages → Build and deployment**
- **Source:** Deploy from a branch
- **Branch:** `main` / `root`

The `CNAME` file sets the custom domain automatically.

### 3. DNS records (at the domain registrar)
**Apex domain** (`@`) — four A records:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
**www** — one CNAME record:
```
www  →  veetaragpatil.github.io
```

### 4. HTTPS
In **Settings → Pages**, wait for the DNS check to pass, then enable **Enforce HTTPS**.
GitHub provisions the TLS certificate automatically.

---

## Customization

- **Colors / theme:** edit the CSS custom properties under `:root`, `[data-theme="dark"]`,
  and `[data-theme="light"]` in `styles.css`.
- **Roles in hero:** edit the `roles` array in `script.js`.
- **Terminal commands:** edit the `commands` object in `script.js`.
- **Content:** all text lives directly in `index.html`.
- **Resume / photo:** replace the files in `assets/`.

---

## Roadmap

Potential future enhancements:
- Compress / resize the headshot image for faster mobile loading.
- Dedicated case-study pages per project (topology diagrams, configs, screenshots).
- Link live GitHub repositories to each project card.
- Add a certifications timeline with target dates.

---

© Veetarag Vardhaman Patil · Bangalore, India
