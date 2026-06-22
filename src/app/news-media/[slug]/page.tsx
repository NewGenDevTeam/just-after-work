import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsMediaBySlug } from "@/lib/wordpress";
import { getStaticNewsMediaBySlug } from "@/lib/newsMediaData";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post =
    (await getNewsMediaBySlug(params.slug)) ??
    getStaticNewsMediaBySlug(params.slug);

  if (!post) notFound();

  return (
    <article className="pt-32 md:pt-40 pb-16">
      <div className="max-w-[800px] mx-auto px-6 md:px-10">
        <Link
          href="/news-media"
          className="text-xs text-muted uppercase tracking-[0.3em] hover:text-text-primary transition-colors"
        >
          ← Back to News &amp; Media
        </Link>

        <header className="mt-8 mb-10">
          <p className="text-xs text-muted uppercase tracking-[0.3em] mb-4">
            {post.category_label
              ? `${post.category_label} · ${formatDate(post.publish_date)}`
              : formatDate(post.publish_date)}
          </p>
          <h1 className="text-4xl md:text-5xl font-display italic leading-[1.1]">
            {post.title}
          </h1>
        </header>

        {post.image && (
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-stroke mb-10">
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        {post.short_description && (
          <p className="text-lg text-muted leading-relaxed mb-10">
            {post.short_description}
          </p>
        )}

        {post.external_link && (
          <a
            href={post.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-stroke rounded-full px-6 py-3 text-sm text-text-primary hover:bg-stroke/40 transition-colors"
          >
            Read Full Article ↗
          </a>
        )}
      </div>
    </article>
  );
}
