import { getTestimonials, getNewsMedia, getEvents } from "@/lib/wordpress";
import HomePageClient, {
  type TestimonialItem,
  type NewsItem,
} from "./HomePageClient";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

// ─── Static fallbacks ─────────────────────────────────────────────────────────

const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Diana Lecorne",
    role: "Mexican Embassy President",
    quote:
      "Just After Work is an inspiring platform where professionals and entrepreneurs connect and share ideas in genuine ways. My first event encouraged genuine networking — I met someone who motivated a personal project.",
  },
  {
    name: "Theeban G",
    role: "Actor, Fighter & Tech Entrepreneur",
    quote:
      "At Just After Work, there somehow is a very personal touch to the experience. It's amazing. I got connected with current developers through connections made at JAW.",
  },
  {
    name: "Darren Teh",
    role: "Vocalist, An Honest Mistake · Fred Perry MY Marketing Head",
    quote:
      "I met a bunch of really cool people at JAW from entrepreneurs to musicians and media outlets. Meeting people otherwise impossible to encounter.",
  },
  {
    name: "TC",
    role: "Gig For Good",
    quote:
      "JAW and their team truly understands how to bring people together creating an environment where professionals can connect, share experiences, and build meaningful relationships.",
  },
  {
    name: "Sam Fakhouri",
    role: "Kingsmen Barbershop Owner",
    quote:
      "JAW knows how to turn social gatherings into powerful networking experiences. The energy, organization, and attention to detail are memorable.",
  },
  {
    name: "Fuad Alhabshi",
    role: "Kyoto Protocol Frontman · Halogen Capital Executive Director",
    quote:
      "Just After Work is a rare gem in Malaysia's networking scene. Where professionals from diverse industries connect in settings completely free from corporate stiffness.",
  },
  {
    name: "Raja Izz",
    role: "GC Magazine",
    quote:
      "JAW brings together people who value authenticity and shared growth. JAW stands out for reminding us that the best connections are built on genuine friendship.",
  },
];

const FALLBACK_NEWS: NewsItem[] = [
  {
    title: "Padel & Connect at ASCARO: Where networking meets sporting elegance",
    excerpt: "Where networking meets sporting elegance — JAW takes networking to the court at ASCARO Padel & Social Club.",
    date: "Jul 6, 2025",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/IMG_1099-890x664.webp",
    href: "https://gentlemanscodes.com/living/padel-connect-at-ascaro-where-networking-meets-sporting-elegance",
  },
  {
    title: "How 'The Gentleman's Hour' Gave Self-Care A Business Agenda",
    excerpt:
      "JAW's debut at Kingsmen Barbershop turns wellness into a board meeting — where grooming meets genuine connection.",
    date: "Sep 10, 2025",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/57a64395-ad9c-42e2-8896-20ff0d6c2ec8-890x664.jpg",
    href: "https://juiceonline.com/the-gentlemans-hour/",
  },
  {
    title: "JAW Serves Up Sporty Networking With A Twist At ASCARO Padel & Social Club",
    excerpt:
      "JAW serves up the perfect after-work cocktail of sport and connection at ASCARO Padel & Social Club.",
    date: "Sep 5, 2025",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/jk-890x664.jpg",
    href: "https://juiceonline.com/jaw-serves-up-sporty-networking-with-a-twist-at-ascaro-padel-social-club/",
  },
  {
    title: "Just After Work debuts at Kingsmen Barbershop with 'The Gentleman's Hour'",
    excerpt:
      "JAW's debut event at Kingsmen Barbershop — 80 entrepreneurs, live jazz, and genuine connection.",
    date: "Jun 23, 2025",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/new1-890x664.webp",
    href: "https://gentlemanscodes.com/grooming/the-gentleman-s-hour-just-after-work-s-debut-kingsmen-barbershop-damansara-heights-1st-anniversary-celebration",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

function buildEventTarget(date: string, eventTime: string): string {
  // date: YYYY-MM-DD; eventTime: "7:00 PM – 11:00 PM" (use start)
  const startRaw = eventTime.split(/[–\-]/)[0].trim();
  const m = startRaw.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return `${date}T19:00:00+08:00`;
  let h = parseInt(m[1], 10);
  const min = m[2];
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return `${date}T${String(h).padStart(2, "0")}:${min}:00+08:00`;
}

export default async function HomePage() {
  const [wpTestimonials, wpNews, wpEvents] = await Promise.all([
    getTestimonials(),
    getNewsMedia(),
    getEvents(),
  ]);

  // Only use WP data when at least one item has real ACF content
  const hasRealTestimonials = wpTestimonials.some((t) => t.quote);
  const testimonials: TestimonialItem[] = hasRealTestimonials
    ? wpTestimonials.map((t) => ({
        name: t.person_name,
        role: t.person_role,
        quote: t.quote,
      }))
    : FALLBACK_TESTIMONIALS;

  const hasRealNews = wpNews.some((n) => n.short_description || n.external_link);
  const news: NewsItem[] = hasRealNews
    ? wpNews.slice(0, 4).map((n) => ({
        title: n.title,
        excerpt: n.short_description,
        date: formatDate(n.publish_date),
        image: n.image,
        href: n.external_link || `/news-media/${n.slug}`,
      }))
    : FALLBACK_NEWS;

  const today = new Date().toISOString().slice(0, 10);
  const nextEvent = wpEvents.find((e) => e.date >= today);
  const nextEventTarget = nextEvent
    ? buildEventTarget(nextEvent.date, nextEvent.event_time)
    : null;

  return (
    <HomePageClient
      testimonials={testimonials}
      news={news}
      nextEventTarget={nextEventTarget}
    />
  );
}
