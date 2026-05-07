const WP_API =
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WP_API_URL ||
  "https://docker-image-production-ed6e.up.railway.app/wp-json/wp/v2";

// ─── Raw REST API shape ───────────────────────────────────────────────────────

interface WPRaw {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string; alt_text: string }[];
    author?: { name: string; avatar_urls?: Record<string, string> }[];
  };
  meta?: Record<string, unknown>;
  acf?: Record<string, unknown>;
}

// ─── Public types ─────────────────────────────────────────────────────────────

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
}

/** Standard WP blog post — used by /news-media/[slug] detail page */
export interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    author?: { name: string; avatar_urls?: Record<string, string> }[];
  };
  acf?: Record<string, unknown>;
}

export interface WPEvent {
  id: number;
  slug: string;
  title: string;
  date: string;
  event_time: string;
  venue: string;
  description: string;
  rsvp_link: string;
  rsvpUrl: string;
  event_status: string;
  image: string;
}

export interface WPNewsMedia {
  id: number;
  slug: string;
  title: string;
  publish_date: string;
  short_description: string;
  category_label: string;
  external_link: string;
  image: string;
}

export interface WPVideo {
  id: number;
  youtube_url: string;
  embedId: string;
  video_description: string;
  display_order: number;
}

export interface WPFounder {
  id: number;
  slug: string;
  name: string;
  role: string;
  short_bio: string;
  full_bio: string;
  linkedin_link: string;
  instagram_link: string;
  display_order: number;
  image: string;
}

export interface WPTestimonial {
  id: number;
  quote: string;
  person_name: string;
  person_role: string;
  display_order: number;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function wpFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${WP_API}${path}`;
  const res = await fetch(url, {
    ...opts,
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`WP ${res.status}: ${url}`);
  return res.json();
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

function getMeta(raw: WPRaw, key: string): unknown {
  // ACF data lives in `acf` field; `meta` is a secondary fallback
  const acf = raw.acf as Record<string, unknown> | undefined;
  return acf?.[key] ?? raw.meta?.[key];
}

// ACF date picker saves as YYYYMMDD — normalise to YYYY-MM-DD for JS Date
function normalizeDate(raw: string, fallback: string): string {
  if (!raw) return fallback;
  if (/^\d{8}$/.test(raw))
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  return raw;
}

function metaStr(raw: WPRaw, key: string, fallback = ""): string {
  const v = getMeta(raw, key);
  return typeof v === "string" && v ? v : fallback;
}

function metaNum(raw: WPRaw, key: string, fallback = 0): number {
  const v = getMeta(raw, key);
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function featuredImage(raw: WPRaw): string {
  return raw._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";
}

function extractYouTubeId(url: string): string {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/\s]+)/
  );
  return m?.[1] ?? "";
}

function sortByDisplayOrder<T extends { display_order: number }>(
  items: T[]
): T[] {
  if (!items.some((i) => i.display_order > 0)) return items;
  return [...items].sort((a, b) => {
    const ao = a.display_order > 0 ? a.display_order : Infinity;
    const bo = b.display_order > 0 ? b.display_order : Infinity;
    return ao - bo;
  });
}

// ─── Standard WP posts (blog) ─────────────────────────────────────────────────

export async function getPosts(
  params: { perPage?: number; page?: number; category?: string } = {}
): Promise<WPPost[]> {
  const qs = new URLSearchParams({
    per_page: String(params.perPage ?? 12),
    page: String(params.page ?? 1),
    _embed: "true",
  });
  if (params.category) qs.set("categories", params.category);
  try {
    return await wpFetch<WPPost[]>(`/posts?${qs}`);
  } catch (e) {
    console.error("[WP] getPosts:", e);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const qs = new URLSearchParams({ slug, _embed: "true" });
  try {
    const posts = await wpFetch<WPPost[]>(`/posts?${qs}`);
    return posts[0] ?? null;
  } catch (e) {
    console.error("[WP] getPostBySlug:", e);
    return null;
  }
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getEvents(): Promise<WPEvent[]> {
  try {
    const raw = await wpFetch<WPRaw[]>("/events?per_page=20&_embed=true");
    return raw.map((p) => {
      const rsvp = metaStr(p, "rsvp_link");
      return {
        id: p.id,
        slug: p.slug,
        title: stripHtml(p.title.rendered),
        date: normalizeDate(metaStr(p, "event_date"), p.date),
        event_time: metaStr(p, "event_time"),
        venue: metaStr(p, "venue", "TBA"),
        description:
          metaStr(p, "short_description") || stripHtml(p.excerpt.rendered),
        rsvp_link: rsvp,
        rsvpUrl: rsvp || "#",
        event_status: metaStr(p, "event_status", "upcoming"),
        image: featuredImage(p),
      };
    });
  } catch (e) {
    console.error("[WP] getEvents:", e);
    return [];
  }
}

// ─── News & Media ─────────────────────────────────────────────────────────────

export async function getNewsMedia(): Promise<WPNewsMedia[]> {
  try {
    const raw = await wpFetch<WPRaw[]>("/news_media?per_page=20&_embed=true");
    return raw.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: stripHtml(p.title.rendered),
      publish_date: metaStr(p, "publish_date", p.date),
      short_description:
        metaStr(p, "short_description") || stripHtml(p.excerpt.rendered),
      category_label: metaStr(p, "category_label"),
      external_link: metaStr(p, "external_link"),
      image: featuredImage(p),
    }));
  } catch (e) {
    console.error("[WP] getNewsMedia:", e);
    return [];
  }
}

// ─── Videos ───────────────────────────────────────────────────────────────────

export async function getVideos(): Promise<WPVideo[]> {
  try {
    const raw = await wpFetch<WPRaw[]>("/videos?per_page=20&_embed=true");
    const mapped = raw.map((p) => {
      const url = metaStr(p, "youtube_url");
      return {
        id: p.id,
        youtube_url: url,
        embedId: extractYouTubeId(url),
        video_description:
          metaStr(p, "video_description") || stripHtml(p.title.rendered),
        display_order: metaNum(p, "display_order"),
      };
    });
    return sortByDisplayOrder(mapped).filter((v) => v.embedId);
  } catch (e) {
    console.error("[WP] getVideos:", e);
    return [];
  }
}

// ─── Founders ─────────────────────────────────────────────────────────────────

export async function getFounders(): Promise<WPFounder[]> {
  try {
    const raw = await wpFetch<WPRaw[]>("/founders?per_page=20&_embed=true");
    const mapped = raw.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: stripHtml(p.title.rendered),
      role: metaStr(p, "role"),
      short_bio: metaStr(p, "short_bio"),
      full_bio: metaStr(p, "full_bio") || stripHtml(p.content.rendered),
      linkedin_link: metaStr(p, "linkedin_link"),
      instagram_link: metaStr(p, "instagram_link"),
      display_order: metaNum(p, "display_order"),
      image: featuredImage(p),
    }));
    return sortByDisplayOrder(mapped);
  } catch (e) {
    console.error("[WP] getFounders:", e);
    return [];
  }
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<WPTestimonial[]> {
  try {
    const raw = await wpFetch<WPRaw[]>("/testimonials?per_page=20&_embed=true");
    const mapped = raw.map((p) => ({
      id: p.id,
      quote: metaStr(p, "quote") || stripHtml(p.content.rendered),
      person_name: metaStr(p, "person_name") || stripHtml(p.title.rendered),
      person_role: metaStr(p, "person_role"),
      display_order: metaNum(p, "display_order"),
    }));
    return sortByDisplayOrder(mapped);
  } catch (e) {
    console.error("[WP] getTestimonials:", e);
    return [];
  }
}
