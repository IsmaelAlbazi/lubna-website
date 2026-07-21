# Restaurant Lubna — website

Static one-page site for Restaurant Lubna (Midden-Oosterse keuken). Plain HTML/CSS/JS — no build step, no dependencies.

## Structure

```
index.html          # markup
css/styles.css      # all styling
js/main.js          # menu, scroll reveals, typewriter
assets/             # logo, marble texture, favicon (WebP/PNG)
```

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to Vercel via GitHub

1. **Create the GitHub repo and push** (from this folder):

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Lubna website"
   git branch -M main
   git remote add origin https://github.com/<your-user>/lubna-website.git
   git push -u origin main
   ```

   (Create the empty repo first at https://github.com/new — no README, so history stays clean.)

2. **Connect Vercel:** go to https://vercel.com/new, import the repo.
   - Framework preset: **Other** (it's a static site).
   - Build command: *(leave empty)*
   - Output directory: *(leave empty / `.`)*
   - Click **Deploy**.

3. Every `git push` to `main` auto-deploys to production; pull requests get preview URLs.

### Custom domain

In Vercel → Project → **Settings → Domains**, add the restaurant's domain and follow the DNS instructions.

## To do (waiting on client)

- **Food photos** → un-hide the "Uit onze keuken" section (`id="gerechten"`, currently `display:none`) and gallery
- **Facebook link** (block is commented out in the contact + footer — add the URL when found)

Done: address, phone, opening hours, Instagram, TikTok.
