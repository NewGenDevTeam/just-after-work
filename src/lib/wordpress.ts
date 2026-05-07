/**
 * WordPress headless CMS integration.
 *
 * Set NEXT_PUBLIC_WP_API_URL in your .env (e.g. https://cms.justafterwork.com/wp-json/wp/v2)
 *
 * In WordPress admin, install plugin "Advanced Custom Fields" + "ACF to REST API"
 * if you want custom fields on posts (event date, venue, etc.).
 */

const WP_API =
  process.env.NEXT_PUBLIC_WP_API_URL ||
  "https://justafterwork.com/wp-json/wp/v2";

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
}

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

async function wpFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${WP_API}${path}`;
  const res = await fetch(url, {
    ...opts,
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(3000),
  });
  if (!res.ok) {
    throw new Error(`WP fetch failed (${res.status}): ${url}`);
  }
  return res.json();
}

export async function getPosts(params: {
  perPage?: number;
  page?: number;
  category?: string;
} = {}): Promise<WPPost[]> {
  const search = new URLSearchParams({
    per_page: String(params.perPage ?? 12),
    page: String(params.page ?? 1),
    _embed: "true",
  });
  if (params.category) search.set("categories", params.category);
  try {
    return await wpFetch<WPPost[]>(`/posts?${search.toString()}`);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const search = new URLSearchParams({ slug, _embed: "true" });
  try {
    const posts = await wpFetch<WPPost[]>(`/posts?${search.toString()}`);
    return posts[0] ?? null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export interface WPEvent {
  id: number;
  slug: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  image: string;
  rsvpUrl: string;
}

/**
 * Events come from a custom post type "event" — register via CPT UI plugin in WP.
 * Falls back to local data if WordPress isn't reachable yet.
 */
export async function getEvents(): Promise<WPEvent[]> {
  try {
    const posts = await wpFetch<WPPost[]>(
      "/event?per_page=20&_embed=true"
    );
    return posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title.rendered,
      date: (p.acf?.event_date as string) ?? p.date,
      venue: (p.acf?.venue as string) ?? "TBA",
      description: p.excerpt.rendered.replace(/<[^>]+>/g, ""),
      image: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
      rsvpUrl: (p.acf?.rsvp_url as string) ?? `#`,
    }));
  } catch {
    // Fallback while CMS is being set up
    return [];
  }
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "").trim();
}
