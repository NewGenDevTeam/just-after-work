import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { getPosts, stripHtml } from "@/lib/wordpress";
import { formatDate } from "@/lib/utils";

// Fallback while CMS is being set up
const FALLBACK_POSTS = [
  {
    slug: "padel-connect",
    title: "Padel & Connect at ASCARO",
    excerpt: "Where networking meets sporting elegance.",
    date: "2025-09-15",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/IMG_1099-890x664.webp",
    external: "https://gentlemanscodes.com/living/padel-connect-at-ascaro-where-networking-meets-sporting-elegance",
  },
  {
    slug: "gentlemans-hour",
    title: "How 'The Gentleman's Hour' Gave Self-Care A Business Agenda",
    excerpt: "JAW's debut at Kingsmen Barbershop turns wellness into a board meeting.",
    date: "2025-09-10",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/57a64395-ad9c-42e2-8896-20ff0d6c2ec8-890x664.jpg",
    external: "https://juiceonline.com/the-gentlemans-hour/",
  },
  {
    slug: "ascaro-padel-social",
    title: "Sporty Networking With A Twist At ASCARO Padel & Social Club",
    excerpt: "JAW serves up the perfect after-work cocktail of sport and connection.",
    date: "2025-09-05",
    image: "https://justafterwork.com/wp-content/uploads/2025/09/jk-890x664.jpg",
    external:
      "https://juiceonline.com/jaw-serves-up-sporty-networking-with-a-twist-at-ascaro-padel-social-club/",
  },
  {
    slug: "kingsmen-debut",
    title: "JAW debuts at Kingsmen Barbershop",
    excerpt: "The Gentleman's Hour kicks off Kingsmen's anniversary in style.",
    date: "2025-08-22",
    image: "https://justafterwork.com/wp-content/uploads/2025/09/new1-890x664.webp",
    external:
      "https://gentlemanscodes.com/grooming/the-gentleman-s-hour-just-after-work-s-debut-kingsmen-barbershop-damansara-heights-1st-anniversary-celebration",
  },
];

const VIDEOS = [
  {
    id: "M5c2b4wA6rE",
    title: "JAW Featured Video 1",
  },
  {
    id: "7VXMOfnKw7w",
    title: "JAW Featured Video 2",
  },
  {
    id: "-A9TEPUOTfc",
    title: "JAW Featured Video 3",
  },
];

export const revalidate = 60;

export default async function NewsPage() {
  const wpPosts = await getPosts({ perPage: 12 });

  const posts =
    wpPosts.length > 0
      ? wpPosts.map((p) => ({
          slug: p.slug,
          title: stripHtml(p.title.rendered),
          excerpt: stripHtml(p.excerpt.rendered).slice(0, 140),
          date: p.date,
          image: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
          external: undefined as string | undefined,
        }))
      : FALLBACK_POSTS;

  return (
    <div className="pt-32 md:pt-40 pb-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Featured Videos Section */}
        <div className="mb-20">
          <SectionHeader
            eyebrow="Media Highlights"
            title={
              <>
                Featured <span className="italic">videos</span>
              </>
            }
            subtitle="Watch our latest moments and community highlights."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-16">
            {VIDEOS.map((video) => (
              <div
                key={video.id}
                className="group bg-surface border border-stroke rounded-3xl overflow-hidden hover:border-text-primary/20 transition-colors"
              >
                <div className="relative w-full aspect-video bg-bg">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    className="absolute inset-0 w-full h-full rounded-3xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* News Stories Section */}
        <SectionHeader
          eyebrow="News & Media"
          title={
            <>
              Featured <span className="italic">stories</span>
            </>
          }
          subtitle="Press, partnerships, and recaps from the JAW community."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-16">
          {posts.map((post, i) => {
            const href = post.external ?? `/news-media/${post.slug}`;
            const isExternal = !!post.external;
            const Wrapper = isExternal ? "a" : Link;
            const linkProps = isExternal
              ? { href, target: "_blank", rel: "noopener noreferrer" }
              : { href };
            return (
              <Wrapper
                key={`${post.slug}-${i}`}
                {...linkProps}
                className="group bg-surface border border-stroke rounded-3xl overflow-hidden hover:border-text-primary/20 transition-colors"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs text-muted uppercase tracking-[0.3em] mb-3">
                    {formatDate(post.date)}
                  </p>
                  <h3 className="text-xl font-display italic mb-2 group-hover:text-text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="inline-block mt-4 text-xs text-text-primary">
                    Read {isExternal ? "↗" : "→"}
                  </span>
                </div>
              </Wrapper>
            );
          })}
        </div>

        {wpPosts.length === 0 && (
          <p className="text-center text-xs text-muted mt-16">
            Showing fallback content. Connect WordPress in{" "}
            <code className="text-text-primary">
              NEXT_PUBLIC_WP_API_URL
            </code>{" "}
            to load live posts.
          </p>
        )}
      </div>
    </div>
  );
}
