# Just After Work — Landing Page Rebuild

Rebuild of [justafterwork.com](https://justafterwork.com) as a **Next.js (Node.js)** single-page landing with a dark luxury aesthetic (gold/amber accents), smooth animations, and **WordPress as a headless CMS** for blog/event content.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** with the design system from the spec
- **GSAP** + **Framer Motion** for entrance & scroll animations
- **HLS.js** for streaming video backgrounds
- **WordPress REST API** for content (posts, events, custom fields)
- **Railway** for hosting

## Pages

| Route | Purpose |
| --- | --- |
| `/` | **Full single-page landing** — Hero, About, Pillars, Community, Events, Founders, Testimonials, News, Contact |
| `/about` | Extended About page |
| `/events` | Full events list (pulls from WordPress) |
| `/founders` | Jarrod & Jude bios |
| `/news` | News & media (pulls from WordPress) |
| `/news/[slug]` | Individual article from WordPress |
| `/contact` | Contact form + info |

### Style
- **Accent colour**: Gold/amber (`#C9A84C → #8B6914`) — changed from blue to match the professional nightlife brand
- **Fonts**: Instrument Serif (display/italic) + Inter (body)
- **Theme**: Dark luxury — black backgrounds, gold gradients, halftone textures

---

## Part 1 — Run it locally

```bash
# 1. Install Node 20+ if you don't have it
node -v   # should print v20.x or v22.x

# 2. Install dependencies
npm install

# 3. Copy env template
cp .env.example .env.local

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site works **without** WordPress connected — it falls back to hard-coded content. Connect WordPress later (Part 3) to make news and events editable from a CMS.

---

## Part 2 — Push to GitHub

```bash
# From the project folder
cd just-after-work

# Initialize git
git init
git add .
git commit -m "Initial JAW rebuild"

# Create the repo on GitHub (via the website, "New repository", do NOT add README/license)
# Then point this folder at it:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/just-after-work.git
git push -u origin main
```

If you've never pushed to GitHub before, you'll need to authenticate. Easiest way is the **GitHub CLI**:

```bash
brew install gh           # macOS
gh auth login             # follow prompts
gh repo create just-after-work --public --source=. --push
```

That single `gh repo create` command does the create + push in one shot.

---

## Part 3 — Set up WordPress (headless CMS)

You need WordPress hosted **somewhere** (it does not need to be on the same domain — that's the whole point of headless).

### Option A — managed WordPress host (easiest)
Sign up for any of these (free or cheap tiers):
- **WP Engine** — free trial
- **Bluehost / SiteGround** — paid, $3–10/month
- **Cloudways** — pay-as-you-go from ~$10/month

### Option B — self-host on Railway alongside the frontend
Railway has a one-click WordPress template. From your Railway dashboard → **New Project → Deploy a template → search "WordPress"**. Railway will provision MySQL + WordPress for you.

### After WordPress is up:

1. Log into `wp-admin`. Install these plugins:
   - **Advanced Custom Fields (ACF)** — for custom event fields
   - **Custom Post Type UI** — to register the "Event" post type
   - **WPGraphQL** *(optional — only if you want GraphQL instead of REST)*
   - **Contact Form 7** + **CF7 to API** — for the contact form
   - **WP REST Cache** — speeds up the public API

2. **Register the Event post type** (CPT UI → Add New):
   - Slug: `event`
   - Plural: Events
   - Show in REST API: **yes**
   - REST API base slug: `event`

3. **Add ACF fields** to the Event post type:
   - `event_date` (Date Time Picker)
   - `venue` (Text)
   - `rsvp_url` (URL)

4. **Enable ACF in REST**: install plugin "ACF to REST API".

5. **CORS**: WordPress doesn't allow cross-origin requests by default. Add this to your active theme's `functions.php`:

   ```php
   add_action('rest_api_init', function () {
     remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
     add_filter('rest_pre_serve_request', function ($value) {
       header('Access-Control-Allow-Origin: *');
       header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
       header('Access-Control-Allow-Headers: Content-Type, Authorization');
       return $value;
     });
   });
   ```

6. Test: open `https://YOUR_WP_DOMAIN/wp-json/wp/v2/posts` in a browser. You should see JSON.

---

## Part 4 — Deploy to Railway

1. Go to [railway.com](https://railway.com), sign up (free tier is fine to start).
2. **New Project → Deploy from GitHub repo → pick `just-after-work`**.
3. Railway auto-detects Next.js and starts building.
4. Add environment variables in **Variables** tab:
   ```
   NEXT_PUBLIC_WP_API_URL=https://YOUR_WP_DOMAIN/wp-json/wp/v2
   WP_CONTACT_FORM_ENDPOINT=https://YOUR_WP_DOMAIN/wp-json/contact-form-7/v1/contact-forms/123/feedback
   ```
   (replace `123` with your actual Contact Form 7 form ID)
5. Once the build succeeds, click **Settings → Networking → Generate Domain** to get a public URL like `just-after-work.up.railway.app`.
6. To use a custom domain (`justafterwork.com`), add it in Settings → Networking → Custom Domain, then point your DNS CNAME to the Railway-provided target.

### Auto-deploys
Every push to `main` on GitHub will trigger a new Railway deploy automatically. No manual steps.

---

## Customizing content

### Things that live in code (you'll edit & redeploy):
- All landing page sections → `src/app/page.tsx` (top of file — all data arrays)
- Founder bios → `founders` array in `src/app/page.tsx`
- Testimonials → `testimonials` array in `src/app/page.tsx`
- The next-event countdown date → `NEXT_EVENT` constant in `src/app/page.tsx` and `src/app/events/page.tsx`
- Hero video → `src/components/HeroVideo.tsx` (replace the HLS URL with your own Mux/Cloudflare Stream URL)

### Things that come from WordPress (edit in wp-admin, no redeploy needed):
- News articles (Posts in WP)
- Event listings (custom Event post type)

### How the fallback works
If WordPress is unreachable or empty, the News & Events pages show hard-coded content from the source files. As soon as WP returns data, that takes over. You can launch immediately without WordPress, then plug it in later.

---

## Project structure

```
just-after-work/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, fonts, navbar/footer
│   │   ├── page.tsx                # Home
│   │   ├── globals.css             # Design system
│   │   ├── about/page.tsx
│   │   ├── events/page.tsx
│   │   ├── founders/page.tsx
│   │   ├── news/page.tsx
│   │   ├── news/[slug]/page.tsx
│   │   ├── contact/page.tsx
│   │   └── api/contact/route.ts    # Contact form handler
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── HeroVideo.tsx           # HLS background
│   │   ├── SectionHeader.tsx
│   │   ├── PageTransition.tsx
│   │   └── Countdown.tsx
│   └── lib/
│       ├── utils.ts
│       └── wordpress.ts            # WP REST API client
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── railway.json
└── README.md
```

---

## Common issues

**"Module not found: hls.js"** — run `npm install`.

**WordPress images don't load** — add your WP hostname to `next.config.mjs` under `images.remotePatterns`.

**CORS errors when fetching WP** — add the CORS snippet to `functions.php` (Part 3, step 5).

**Railway build fails on `sharp`** — already handled by Nixpacks; if it persists, add `NIXPACKS_NODE_VERSION=20` to env vars.

**Contact form does nothing** — set `WP_CONTACT_FORM_ENDPOINT`, or swap in a service like Resend/Formspree in `src/app/api/contact/route.ts`.

---

## What's next

- Wire up Mailchimp/ConvertKit for the newsletter
- Add `/team/[slug]` dynamic founder pages backed by WP
- Add an admin auth-gated `/dashboard` if you want event RSVPs in-house
- Pull testimonials from WordPress instead of hard-coding
