/**
 * WordPress CMS seed script — development only.
 * Run: node scripts/seed-wordpress.mjs
 * Requires: .env.seed.local (see .env.seed.local.example)
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env.seed.local ─────────────────────────────────────────────────────

const envPath = resolve(__dirname, "..", ".env.seed.local");
if (!existsSync(envPath)) {
  console.error("\n❌  .env.seed.local not found.");
  console.error("   Copy .env.seed.local.example, fill in credentials.\n");
  process.exit(1);
}

const env = Object.fromEntries(
  readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const [k, ...v] = l.split("=");
      return [k.trim(), v.join("=").trim()];
    })
);

const BASE = (env.WP_BASE_URL || "").replace(/\/$/, "");
const USER = env.WP_USERNAME || "";
const PASS = env.WP_APP_PASSWORD || "";
const API  = `${BASE}/wp-json/wp/v2`;
const AUTH = Buffer.from(`${USER}:${PASS}`).toString("base64");

if (!BASE || !USER || !PASS) {
  console.error("❌  Missing WP_BASE_URL, WP_USERNAME, or WP_APP_PASSWORD.");
  process.exit(1);
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

const JSON_HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Basic ${AUTH}`,
};

async function wpGet(path) {
  const r = await fetch(`${API}${path}`, {
    headers: { Authorization: `Basic ${AUTH}` },
  });
  return r.json();
}

/** Create or update a post. Returns the post object or null on error. */
async function upsert(type, title, body) {
  const list = await wpGet(
    `/${type}?search=${encodeURIComponent(title)}&per_page=10&status=any`
  );
  const match = Array.isArray(list)
    ? list.find(
        (p) => (p.title?.rendered || "").toLowerCase() === title.toLowerCase()
      )
    : null;

  const url    = match ? `${API}/${type}/${match.id}` : `${API}/${type}`;
  const action = match ? "↺ updated" : "+ created";

  const r = await fetch(url, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ ...body, status: "publish" }),
  });
  const data = await r.json();

  if (!r.ok) {
    console.log(`  ✗ "${title}" → HTTP ${r.status}:`, JSON.stringify(data).slice(0, 300));
    return null;
  }
  console.log(`  ${action} "${title}" (id: ${data.id})`);
  return data;
}

// ─── Image helpers ────────────────────────────────────────────────────────────

const IMAGE_REPORT = [];

async function uploadImageFromUrl(sourceUrl, filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const mimeMap = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
  const mime = mimeMap[ext] || "image/jpeg";

  let buffer;
  try {
    const res = await fetch(sourceUrl, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      console.log(`  ⚠ Image "${filename}": source HTTP ${res.status} — skipping`);
      IMAGE_REPORT.push({ filename, status: `source HTTP ${res.status} — manual upload needed` });
      return null;
    }
    buffer = await res.arrayBuffer();
  } catch (e) {
    console.log(`  ⚠ Image "${filename}": download failed (${e.message}) — skipping`);
    IMAGE_REPORT.push({ filename, status: `download failed — manual upload needed` });
    return null;
  }

  const upload = await fetch(`${API}/media`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${AUTH}`,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": mime,
    },
    body: buffer,
  });
  const data = await upload.json();
  if (!upload.ok) {
    console.log(`  ⚠ Upload "${filename}": WP HTTP ${upload.status}`);
    IMAGE_REPORT.push({ filename, status: `WP upload HTTP ${upload.status} — manual upload needed` });
    return null;
  }
  console.log(`  📷 Uploaded "${filename}" → media id ${data.id}`);
  IMAGE_REPORT.push({ filename, status: `✓ uploaded (id: ${data.id})` });
  return data.id;
}

// ─── Seed payloads ────────────────────────────────────────────────────────────
// Fields sent under both meta and acf — WordPress uses whichever is registered.
// _imageUrl / _imageFile are stripped before the WP POST; used only for upload.

function fields(obj) {
  return { meta: obj, acf: obj };
}

const EVENTS = [
  {
    title: "RSVP – The Women's Circle",
    content:
      "Just After Work presents “The Women’s Circle”.\n\n" +
      "We’re so excited to invite you to a special, women-only evening curated by Just After Work (JAW). This time, we are collaborating with Malaysia’s first financial planning platform for women, Uno Advisers, who will also be here to give insights into the importance of wealth management.\n\n" +
      "Think less stiff suit, more inspiring chats, genuine connections and good vibes. This private event is designed for influential women like yourself to unwind and talk about what really matters.\n\n" +
      "Theme: Health. Wealth. Connection.\n\n" +
      "When: Friday, 31st October 2025\nTime: 7:00 PM – 11:00 PM\nWhere: Noko Noko, Damansara Heights\n\n" +
      "18-M, Plaza Damansara, Jalan Medan Setia 2, Bukit Damansara, 50490 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur, Malaysia\n\n" +
      "Heads up: This is a private, limited-capacity event, so please RSVP as soon as you can.\n\n" +
      "RSVP your spot by Oct 29.\n\n" +
      "Contact us via WhatsApp +6017 249 3182 for any enquiries.",
    excerpt:
      "A private women-only gathering. Theme: Health. Wealth. Connection. Less stiff suits, more inspiring chats and genuine connections.",
    ...fields({
      event_date:        "20251031",
      event_time:        "7:00 PM – 11:00 PM",
      venue:             "Noko Noko, Damansara Heights",
      short_description:
        "Think less stiff suit, more inspiring chats, genuine connections and good vibes. This private event is designed for influential women like yourself to unwind and talk about what really matters.",
      rsvp_link:         "https://docs.google.com/forms/d/e/1FAIpQLSco2nqRX_9OWr_2v8RhGj4Ik0S93DTzGAdO-skZJZP4jWnOJw/viewform?usp=send_form",
      event_status:      "upcoming",
    }),
    _imageUrl: "https://justafterwork.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-15.20.26.jpeg",
    _imageFile: "womens-circle-event.jpeg",
  },
];

const NEWS_MEDIA = [
  {
    title:   "Padel & Connect at ASCARO: Where networking meets sporting elegance",
    content: "The inaugural Padel & Connect event at ASCARO blended athletic competition with professional relationship-building, creating authentic connections through shared experience rather than conventional small talk.",
    excerpt: "Where networking meets sporting elegance.",
    ...fields({
      publish_date:      "2025-07-06",
      short_description: "Where networking meets sporting elegance — JAW takes networking to the court at ASCARO Padel & Social Club.",
      external_link:     "https://gentlemanscodes.com/living/padel-connect-at-ascaro-where-networking-meets-sporting-elegance",
      category_label:    "Gentleman's Code",
    }),
    _imageUrl: "https://justafterwork.com/wp-content/uploads/2025/09/IMG_1099-890x664.webp",
    _imageFile: "news-padel-ascaro.webp",
  },
  {
    title:   "How 'The Gentleman's Hour' Gave Self-Care A Business Agenda",
    content: "JAW's debut at Kingsmen Barbershop turns wellness into a board meeting, bringing together entrepreneurs and professionals for a grooming masterclass and exclusive networking experience.",
    excerpt: "JAW's debut at Kingsmen Barbershop turns wellness into a board meeting.",
    ...fields({
      publish_date:      "2025-09-10",
      short_description: "JAW's debut at Kingsmen Barbershop turns wellness into a board meeting — where grooming meets genuine connection.",
      external_link:     "https://juiceonline.com/the-gentlemans-hour/",
      category_label:    "Juice Online",
    }),
    _imageUrl: "https://justafterwork.com/wp-content/uploads/2025/09/57a64395-ad9c-42e2-8896-20ff0d6c2ec8-890x664.jpg",
    _imageFile: "news-gentlemans-hour.jpg",
  },
  {
    title:   "JAW Serves Up Sporty Networking With A Twist At ASCARO Padel & Social Club",
    content: "JAW serves up the perfect after-work cocktail of sport and connection at ASCARO Padel & Social Club.",
    excerpt: "JAW serves up the perfect after-work cocktail of sport and connection.",
    ...fields({
      publish_date:      "2025-09-05",
      short_description: "JAW serves up the perfect after-work cocktail of sport and connection at ASCARO Padel & Social Club.",
      external_link:     "https://juiceonline.com/jaw-serves-up-sporty-networking-with-a-twist-at-ascaro-padel-social-club/",
      category_label:    "Juice Online",
    }),
    _imageUrl: "https://justafterwork.com/wp-content/uploads/2025/09/jk-890x664.jpg",
    _imageFile: "news-ascaro-sporty.jpg",
  },
  {
    title:   "Just After Work debuts at Kingsmen Barbershop with 'The Gentleman's Hour'",
    content: "Just After Work hosted its debut networking event at Kingsmen Barbershop, celebrating the barbershop's first anniversary with 80 entrepreneurs, live jazz, and luxury partnerships.",
    excerpt: "The Gentleman's Hour kicks off Kingsmen's anniversary in style.",
    ...fields({
      publish_date:      "2025-06-23",
      short_description: "JAW's debut event at Kingsmen Barbershop — 80 entrepreneurs, live jazz, and genuine connection for the barbershop's first anniversary.",
      external_link:     "https://gentlemanscodes.com/grooming/the-gentleman-s-hour-just-after-work-s-debut-kingsmen-barbershop-damansara-heights-1st-anniversary-celebration",
      category_label:    "Gentleman's Code",
    }),
    _imageUrl: "https://justafterwork.com/wp-content/uploads/2025/09/new1-890x664.webp",
    _imageFile: "news-kingsmen-debut.webp",
  },
];

const VIDEOS = [
  {
    title:   "JAW — Padel & Connect",
    content: "Watch highlights from our Padel & Connect event at ASCARO.",
    ...fields({ youtube_url: "https://www.youtube.com/watch?v=M5c2b4wA6rE", video_description: "Padel & Connect at ASCARO highlights.", display_order: 1 }),
  },
  {
    title:   "JAW — The Gentleman's Hour",
    content: "Inside the Gentleman's Hour at Kingsmen Barbershop.",
    ...fields({ youtube_url: "https://www.youtube.com/watch?v=7VXMOfnKw7w", video_description: "The Gentleman's Hour at Kingsmen.", display_order: 2 }),
  },
  {
    title:   "JAW — Community Highlights",
    content: "A look at the JAW community in action.",
    ...fields({ youtube_url: "https://www.youtube.com/watch?v=-A9TEPUOTfc", video_description: "JAW community highlights reel.", display_order: 3 }),
  },
];

const FOUNDERS = [
  {
    title:   "Jarrod Solomon",
    content: "A media tactician and strategy whisperer with 15+ years' experience at FMT News and Sledgehammer Communications. Jarrod helps brands scale without selling out, connecting clarity with impact.",
    ...fields({
      role:           "Founder",
      short_bio:      "A media tactician and strategy whisperer with 15+ years' experience at FMT News and Sledgehammer Communications. Jarrod helps brands scale without selling out, connecting clarity with impact.",
      full_bio:       "Jarrod Solomon is a media tactician and strategy whisperer with over 15 years of experience across FMT News and Sledgehammer Communications. He helps brands scale without selling out — connecting clarity with impact at every stage.",
      linkedin_link:  "https://www.linkedin.com/in/jarrod-solomon",
      instagram_link: "https://www.instagram.com/jarrod.solomon.39",
      display_order:  1,
    }),
    _imageUrl: "https://justafterwork.com/wp-content/uploads/2024/05/jarrod-570x696.png",
    _imageFile: "founder-jarrod.png",
  },
  {
    title:   "Jude Ashvin",
    content: "Jude Ashvin was once front and center of Malaysia's live music scene with Rhythm Nation. He turned his passion into purpose, decoding the business behind the beat and launching Keep It Local Asia.",
    ...fields({
      role:           "Co-Founder",
      short_bio:      "Once front and center of Malaysia's live music scene with Rhythm Nation. He turned his passion into purpose — decoding the business behind the beat and launching Keep It Local Asia.",
      full_bio:       "Jude Ashvin was once front and center of Malaysia's live music scene with Rhythm Nation. He turned his passion into purpose, decoding the business behind the beat and launching Keep It Local Asia — a love letter to local talent and the communities that back it.",
      linkedin_link:  "https://www.linkedin.com/in/jude-ashvin-034a48147",
      instagram_link: "https://www.instagram.com/judeashvin",
      display_order:  2,
    }),
    _imageUrl: "https://justafterwork.com/wp-content/uploads/2024/05/jude-570x696.jpg",
    _imageFile: "founder-jude.jpg",
  },
];

const TESTIMONIALS = [
  {
    title: "Diana Lecorne Testimonial",
    content: "Just After Work is an inspiring platform where professionals and entrepreneurs connect and share ideas in genuine ways.",
    ...fields({
      quote:        "Just After Work is an inspiring platform where professionals and entrepreneurs connect and share ideas in genuine ways. My first event encouraged genuine networking — I met someone who motivated a personal project.",
      person_name:  "Diana Lecorne",
      person_role:  "Mexican Embassy President",
      display_order: 1,
    }),
  },
  {
    title: "Theeban G Testimonial",
    content: "At Just After Work, there is a very personal touch to the experience.",
    ...fields({
      quote:        "At Just After Work, there somehow is a very personal touch to the experience. It's amazing. I got connected with current developers through connections made at JAW.",
      person_name:  "Theeban G",
      person_role:  "Actor, Fighter & Tech Entrepreneur",
      display_order: 2,
    }),
  },
  {
    title: "Darren Teh Testimonial",
    content: "I met a bunch of really cool people at JAW from entrepreneurs to musicians and media outlets.",
    ...fields({
      quote:        "I met a bunch of really cool people at JAW from entrepreneurs to musicians and media outlets. Meeting people otherwise impossible to encounter — the kind of casual engaging networking that actually works.",
      person_name:  "Darren Teh",
      person_role:  "Vocalist, An Honest Mistake · Fred Perry MY Marketing Head",
      display_order: 3,
    }),
  },
  {
    title: "TC Testimonial",
    content: "JAW and their team truly understands how to bring people together.",
    ...fields({
      quote:        "JAW and their team truly understands how to bring people together creating an environment where professionals can connect, share experiences, and build meaningful relationships. The consistency of quality stands out.",
      person_name:  "TC",
      person_role:  "Gig For Good",
      display_order: 4,
    }),
  },
  {
    title: "Sam Fakhouri Testimonial",
    content: "JAW knows how to turn social gatherings into powerful networking experiences.",
    ...fields({
      quote:        "JAW knows how to turn social gatherings into powerful networking experiences. The energy, organization, and attention to detail are memorable. Partnering with JAW was one of the best decisions we made.",
      person_name:  "Sam Fakhouri",
      person_role:  "Kingsmen Barbershop Owner",
      display_order: 5,
    }),
  },
  {
    title: "Fuad Alhabshi Testimonial",
    content: "Just After Work is a rare gem in Malaysia's networking scene.",
    ...fields({
      quote:        "Just After Work is a rare gem in Malaysia's networking scene. Where professionals from diverse industries and backgrounds connect in settings completely free from corporate stiffness — networking actually becomes fun.",
      person_name:  "Fuad Alhabshi",
      person_role:  "Kyoto Protocol Frontman · Halogen Capital Executive Director",
      display_order: 6,
    }),
  },
  {
    title: "Raja Izz Testimonial",
    content: "JAW brings together people who value authenticity and shared growth.",
    ...fields({
      quote:        "JAW brings together people who value authenticity and shared growth. JAW stands out for reminding us that the best connections are built on genuine friendship — every encounter feels meaningful.",
      person_name:  "Raja Izz",
      person_role:  "GC Magazine",
      display_order: 7,
    }),
  },
];

// ─── Run seed ─────────────────────────────────────────────────────────────────

async function seedWithImages(type, items) {
  for (const p of items) {
    const mediaId = p._imageUrl
      ? await uploadImageFromUrl(p._imageUrl, p._imageFile)
      : null;
    const body = { ...p };
    delete body._imageUrl;
    delete body._imageFile;
    if (mediaId) body.featured_media = mediaId;
    await upsert(type, p.title, body);
  }
}

async function seed() {
  console.log(`\n🌱  Seeding WordPress at ${BASE}\n`);

  console.log("── Events ────────────────────────────────────────────");
  await seedWithImages("events", EVENTS);

  console.log("\n── News & Media ──────────────────────────────────────");
  await seedWithImages("news_media", NEWS_MEDIA);

  console.log("\n── Videos ────────────────────────────────────────────");
  for (const p of VIDEOS) await upsert("videos", p.title, p);

  console.log("\n── Founders ──────────────────────────────────────────");
  await seedWithImages("founders", FOUNDERS);

  console.log("\n── Testimonials ──────────────────────────────────────");
  for (const p of TESTIMONIALS) await upsert("testimonials", p.title, p);
}

// ─── Verify ───────────────────────────────────────────────────────────────────

const CHECK = {
  events:       ["event_date", "event_time", "venue", "short_description", "rsvp_link", "event_status"],
  news_media:   ["publish_date", "short_description", "external_link", "category_label"],
  videos:       ["youtube_url", "video_description", "display_order"],
  founders:     ["role", "short_bio", "linkedin_link", "instagram_link", "display_order"],
  testimonials: ["quote", "person_name", "person_role", "display_order"],
};

async function verify() {
  console.log("\n\n══ Verification ══════════════════════════════════════\n");
  console.log(
    "Endpoint".padEnd(16) +
    "Posts".padEnd(7) +
    "Image".padEnd(10) +
    "Fields found / missing"
  );
  console.log("─".repeat(80));

  for (const [ep, expectedFields] of Object.entries(CHECK)) {
    const items = await wpGet(`/${ep}?per_page=20&_embed=true`);

    if (!Array.isArray(items) || items.length === 0) {
      console.log(`${ep.padEnd(16)}${"0".padEnd(7)}${"—".padEnd(10)}no posts returned`);
      continue;
    }

    const sample = items[0];
    const merged = {
      ...(typeof sample.meta === "object" && !Array.isArray(sample.meta) ? sample.meta : {}),
      ...(typeof sample.acf  === "object" && !Array.isArray(sample.acf)  ? sample.acf  : {}),
    };

    const found   = expectedFields.filter((f) => merged[f] != null && merged[f] !== "");
    const missing = expectedFields.filter((f) => !found.includes(f));
    const hasImage = sample.featured_media > 0 ? "✓ set" : "✗ none";

    const status = missing.length === 0
      ? "✓ all fields present"
      : `✓ ${found.join(", ")}${found.length ? " | " : ""}✗ MISSING: ${missing.join(", ")}`;

    console.log(`${ep.padEnd(16)}${String(items.length).padEnd(7)}${hasImage.padEnd(10)}${status}`);
  }

  if (IMAGE_REPORT.length > 0) {
    console.log("\n── Image upload report ───────────────────────────────");
    for (const { filename, status } of IMAGE_REPORT) {
      console.log(`  ${filename}: ${status}`);
    }
  }

  console.log("\n");
  console.log("If fields show as MISSING → ACF field group needs 'Show in REST API → Yes'");
  console.log("in WordPress Admin → ACF → Field Groups.");
  console.log("If image shows ✗ none → upload manually in WP Admin → Media, then set as featured image.");
  console.log("");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

await seed();
await verify();
