import { getTestimonials, getNewsMedia } from "@/lib/wordpress";
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
      "JAW creates spaces where real conversations happen. It's where culture and ambition meet in the most natural way.",
  },
  {
    name: "Theeban G",
    role: "Actor, Fighter & Tech Entrepreneur",
    quote:
      "The energy at every JAW event is unlike anything else in KL. You leave with connections that actually matter.",
  },
  {
    name: "Darren Teh",
    role: "Vocalist & Marketing Head",
    quote:
      "Finally, an event where networking feels human. JAW gets that the best deals happen when the tie comes off.",
  },
  {
    name: "Sam Fakhouri",
    role: "Kingsmen Barbershop Owner",
    quote:
      "Partnering with JAW was one of the best decisions we made. They attract the kind of crowd that understands quality.",
  },
  {
    name: "Fuad Alhabshi",
    role: "Kyoto Protocol Frontman & Halogen Capital",
    quote:
      "JAW blurs the line between the creative world and the business world in a way that feels totally effortless.",
  },
  {
    name: "Raja Izz",
    role: "GC Magazine",
    quote:
      "Every issue we cover JAW, we walk away inspired. It's a community that genuinely moves the needle for KL's scene.",
  },
];

const FALLBACK_NEWS: NewsItem[] = [
  {
    title: "Padel & Connect at ASCARO",
    excerpt: "Where networking meets sporting elegance.",
    date: "Sep 15, 2025",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/IMG_1099-890x664.webp",
    href: "https://gentlemanscodes.com/living/padel-connect-at-ascaro-where-networking-meets-sporting-elegance",
  },
  {
    title: "How 'The Gentleman's Hour' Gave Self-Care A Business Agenda",
    excerpt:
      "JAW's debut at Kingsmen Barbershop turns wellness into a board meeting.",
    date: "Sep 10, 2025",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/57a64395-ad9c-42e2-8896-20ff0d6c2ec8-890x664.jpg",
    href: "https://juiceonline.com/the-gentlemans-hour/",
  },
  {
    title: "Sporty Networking With A Twist at ASCARO Padel & Social Club",
    excerpt:
      "JAW serves up the perfect after-work cocktail of sport and connection.",
    date: "Sep 5, 2025",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/jk-890x664.jpg",
    href: "https://juiceonline.com/jaw-serves-up-sporty-networking-with-a-twist-at-ascaro-padel-social-club/",
  },
  {
    title: "JAW Debuts at Kingsmen Barbershop",
    excerpt:
      "The Gentleman's Hour kicks off Kingsmen's anniversary in style.",
    date: "Aug 22, 2025",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/new1-890x664.webp",
    href: "https://gentlemanscodes.com/grooming/the-gentleman-s-hour-just-after-work-s-debut-kingsmen-barbershop-damansara-heights-1st-anniversary-celebration",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [wpTestimonials, wpNews] = await Promise.all([
    getTestimonials(),
    getNewsMedia(),
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

  return <HomePageClient testimonials={testimonials} news={news} />;
}
