import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, stripHtml } from "@/lib/wordpress";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const author = post._embedded?.author?.[0]?.name;

  return (
    <article className="pt-32 md:pt-40 pb-16">
      <div className="max-w-[800px] mx-auto px-6 md:px-10">
        <Link
          href="/news"
          className="text-xs text-muted uppercase tracking-[0.3em] hover:text-text-primary transition-colors"
        >
          ← Back to news
        </Link>

        <header className="mt-8 mb-12">
          <p className="text-xs text-muted uppercase tracking-[0.3em] mb-4">
            {formatDate(post.date)}
            {author && <> · {author}</>}
          </p>
          <h1
            className="text-4xl md:text-6xl font-display italic leading-[1.05]"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </header>

        {image && (
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-stroke mb-12">
            <img
              src={image}
              alt={stripHtml(post.title.rendered)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-invert max-w-none
            prose-headings:font-display prose-headings:italic
            prose-p:text-muted prose-p:leading-relaxed
            prose-a:text-text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl prose-img:border prose-img:border-stroke
            prose-blockquote:border-l-2 prose-blockquote:border-text-primary/40
            prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-text-primary"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </div>
    </article>
  );
}
