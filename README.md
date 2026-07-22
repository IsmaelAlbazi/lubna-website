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

## Reservation form

The reservation form (contact section) POSTs to a Vercel serverless function at
`api/reserveren.js`, which emails the reservation via [Resend](https://resend.com).

**Setup (once):**

1. Create a free Resend account and an **API key**.
2. In Vercel → Project → **Settings → Environment Variables**, add:
   - `RESEND_API_KEY` — your Resend key
   - `RESERVATION_TO` — the email address reservations should arrive at
   - `RESERVATION_FROM` *(optional)* — a verified sender like `Lubna <reserveringen@yourdomain.nl>`.
     Without a verified domain, Resend only delivers to your own account email (test mode).
3. Redeploy (any push, or Vercel → Deployments → Redeploy).

Until those vars are set, the form shows a friendly "bel ons" message instead of failing.

*Simpler alternative:* swap the `<form>` to a no-backend service like Web3Forms (just an
access key, no serverless function). Ask and it's a 5-minute change.

## To do

- **Reservation email** → set the env vars above once the target address is decided
- **Food photos** → un-hide the "Uit onze keuken" section (`id="gerechten"`, currently `display:none`) and fill the Impressie gallery
- Optional: custom domain, privacy/AVG note (form collects personal data), LocalBusiness SEO schema

Done: address, phone, opening hours, Instagram, TikTok, Facebook, reservation form.
