# Veetarag Patil — Portfolio

A static, interactive portfolio site (HTML/CSS/JS, no build step).

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
# Python
python -m http.server 8000
# then visit http://localhost:8000
```

## Enable the contact form (Web3Forms — free)

1. Go to https://web3forms.com and enter your email to get a free **Access Key**.
2. Open `index.html`, find this line in the contact form:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
   ```
3. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your real key.

Until a key is set, the form falls back to opening the visitor's mail client (mailto).

## Deploy

### GitHub Pages
```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/veetaragpatil/portfolio.git
git push -u origin main
```
Then in the repo: **Settings → Pages → Source: main / root**. Your site goes live at
`https://veetaragpatil.github.io/portfolio/`.

### Netlify (drag & drop)
Go to https://app.netlify.com/drop and drag the `portfolio` folder in. Instant URL.

## Assets
- `assets/headshot.png` — profile photo
- `assets/Veetarag-Patil-Resume.pdf` — downloadable resume
