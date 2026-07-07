# Putting tawhitimedia.nz online

Your site is ready to deploy. We're using **Netlify** — it's free, and it's the
one host that makes your `/admin` editor work **online** (edit from any browser,
no code, no computer setup). Your domain stays with Crazy Domains; we just point
it at Netlify.

There are three one-time setup stages. After that, editing is just: open the
editor → change things → click Publish.

---

## Stage 1 — Put the code on GitHub (~10 min)

Netlify builds your site from a GitHub copy, and the editor saves back to it.

1. Make a free account at **github.com**.
2. Install **GitHub Desktop** (desktop.github.com) — the no-code way to use git.
3. In GitHub Desktop: **File → Add Local Repository** → choose this folder
   (`Documents/Tawhiti Te Momo`). It's already a git repository with your first
   commit made.
4. Click **Publish repository**. Untick "Keep this code private" if you like, or
   leave it private — both work. This uploads your code to GitHub.

## Stage 2 — Connect Netlify (~5 min)

1. Make a free account at **netlify.com** (choose "Sign up with GitHub").
2. **Add new site → Import an existing project → GitHub** → pick your repo.
3. Netlify reads the build settings automatically (from `netlify.toml`). Click
   **Deploy**. In ~1 minute your site is live at a free address like
   `random-name-123.netlify.app`.

## Stage 3 — Turn on the online editor (~5 min)

This makes `tawhitimedia.nz/admin` work from any browser with a login.

1. In your Netlify site: **Integrations** (or Site settings) → search
   **Identity** → **Enable Identity**.
2. Under Identity → **Registration**, set it to **Invite only** (so only you can
   log in).
3. Still under Identity → **Services → Git Gateway → Enable Git Gateway**.
4. Identity → **Invite users** → enter `hello@tawhitimedia.nz`. Check your email
   and click the link to set a password.
5. Done — go to `your-site.netlify.app/admin/`, log in, and edit. Every "Publish"
   updates the live site in about a minute.

---

## Connect your Crazy Domains domain

1. In Netlify: **Domain settings → Add custom domain** → type `tawhitimedia.nz`.
   Netlify shows you the DNS records to add.
2. Log in to **Crazy Domains → Manage your domain → DNS settings**.
3. Add the records Netlify gave you. Usually:
   - An **A record** for `@` → Netlify's IP (Netlify shows the exact number)
   - A **CNAME** for `www` → `your-site.netlify.app`
4. Back in Netlify, click **Verify / Provision certificate**. HTTPS (the padlock)
   turns on automatically and is free.
5. DNS can take anywhere from 10 minutes to a few hours to take effect.

---

## After it's live

- **Editing:** `tawhitimedia.nz/admin/` — change text, swap images/videos, reorder
  reels, all through forms. Click Publish; the site updates itself.
- **Big videos:** the editor uploads them as-is (no compression). For large phone
  or camera exports, it's still best to have them compressed first so the site
  stays fast.
- **Contact form:** the first enquiry ever sent triggers a one-time confirmation
  email from FormSubmit to hello@tawhitimedia.nz — click its link once, and every
  enquiry after that arrives in your inbox automatically.

## The quicker alternative (no online editing)

If you ever just want the site up fast without the editor: run `npm run build`,
then drag the resulting `dist` folder onto app.netlify.com. It deploys instantly —
but you'd edit content on your computer and re-drag each time. The GitHub path
above is what gives you the click-and-publish online editor.
