import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { getNewsMedia, getVideos, type WPNewsMedia, type WPVideo } from "@/lib/wordpress";
import { formatDate } from "@/lib/utils";

const FALLBACK_POSTS: WPNewsMedia[] = [
  {
    id: 1,
    slug: "padel-connect",
    title: "Padel & Connect at ASCARO",
    publish_date: "2025-09-15",
    short_description: "Where networking meets sporting elegance.",
    category_label: "",
    external_link:
      "https://gentlemanscodes.com/living/padel-connect-at-ascaro-where-networking-meets-sporting-elegance",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/IMG_1099-890x664.webp",
  },
  {
    id: 2,
    slug: "gentlemans-hour",
    title: "How 'The Gentleman's Hour' Gave Self-Care A Business Agenda",
    publish_date: "2025-09-10",
    short_description:
      "JAW's debut at Kingsmen Barbershop turns wellness into a board meeting.",
    category_label: "",
    external_link: "https://juiceonline.com/the-gentlemans-hour/",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/57a64395-ad9c-42e2-8896-20ff0d6c2ec8-890x664.jpg",
  },
  {
    id: 3,
    slug: "ascaro-padel-social",
    title: "Sporty Networking With A Twist At ASCARO Padel & Social Club",
    publish_date: "2025-09-05",
    short_description:
      "JAW serves up the perfect after-work cocktail of sport and connection.",
    category_label: "",
    external_link:
      "https://juiceonline.com/jaw-serves-up-sporty-networking-with-a-twist-at-ascaro-padel-social-club/",
    image: "https://justafterwork.com/wp-content/uploads/2025/09/jk-890x664.jpg",
  },
  {
    id: 4,
    slug: "kingsmen-debut",
    title: "JAW debuts at Kingsmen Barbershop",
    publish_date: "2025-08-22",
    short_description:
      "The Gentleman's Hour kicks off Kingsmen's anniversary in style.",
    category_label: "",
    external_link:
      "https://gentlemanscodes.com/grooming/the-gentleman-s-hour-just-after-work-s-debut-kingsmen-barbershop-damansara-heights-1st-anniversary-celebration",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/new1-890x664.webp",
  },
];

const FALLBACK_VIDEOS: WPVideo[] = [
  { id: 1, youtube_url: "", embedId: "M5c2b4wA6rE", video_description: "JAW Featured Video 1", display_order: 1 },
  { id: 2, youtube_url: "", embedId: "7VXMOfnKw7w", video_description: "JAW Featured Video 2", display_order: 2 },
  { id: 3, youtube_url: "", embedId: "-A9TEPUOTfc", video_description: "JAW Featured Video 3", display_order: 3 },
];

export const revalidate = 60;

export default async function NewsPage() {
  const [wpPosts, wpVideos] = await Promise.all([
    getNewsMedia(),
    getVideos(),
  ]);

  const posts = wpPosts.length > 0 ? wpPosts : FALLBACK_POSTS;
  const videos = wpVideos.length > 0 ? wpVideos : FALLBACK_VIDEOS;

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
            {videos.map((video) => (
              <div
                key={video.id}
                className="group bg-surface border border-stroke rounded-3xl overflow-hidden hover:border-text-primary/20 transition-colors"
              >
                <div className="relative w-full aspect-video bg-bg">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.embedId}`}
                    title={video.video_description}
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
            const href = post.external_link || `/news-media/${post.slug}`;
            const isExternal = !!post.external_link;
            const cardClass =
              "group bg-surface border border-stroke rounded-3xl overflow-hidden hover:border-text-primary/20 transition-colors";
            const cardBody = (
              <>
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
                    {post.category_label
                      ? `${post.category_label} · ${formatDate(post.publish_date)}`
                      : formatDate(post.publish_date)}
                  </p>
                  <h3 className="text-xl font-display italic mb-2 group-hover:text-text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2">
                    {post.short_description}
                  </p>
                  <span className="inline-block mt-4 text-xs text-text-primary">
                    Read {isExternal ? "↗" : "→"}
                  </span>
                </div>
              </>
            );
            return isExternal ? (
              <a
                key={`${post.slug}-${i}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {cardBody}
              </a>
            ) : (
              <Link
                key={`${post.slug}-${i}`}
                href={href}
                className={cardClass}
              >
                {cardBody}
              </Link>
            );
          })}
        </div>

        {wpPosts.length === 0 && (
          <p className="text-center text-xs text-muted mt-16">
            Showing fallback content. Set{" "}
            <code className="text-text-primary">WORDPRESS_API_URL</code> to
            load live posts.
          </p>
        )}
      </div>
    </div>
  );
}
