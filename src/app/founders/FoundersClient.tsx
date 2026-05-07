"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";

export interface FounderItem {
  name: string;
  role: string;
  image: string;
  bio: string;
  socials: { label: string; href: string }[];
}

export default function FoundersClient({
  founders,
}: {
  founders: FounderItem[];
}) {
  return (
    <div className="pt-32 md:pt-40 pb-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="The Founders"
          title={
            <>
              The duo behind <span className="italic">JAW</span>
            </>
          }
          subtitle="Two operators who decided that networking deserved a remix. Built JAW because the city needed a smarter, looser way to meet."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-16 md:mt-24">
          {founders.map((f, i) => (
            <motion.article
              key={f.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group bg-surface border border-stroke rounded-3xl overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {f.image && (
                  <img
                    src={f.image}
                    alt={f.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="text-xs text-muted uppercase tracking-[0.3em] mb-2">
                    {f.role}
                  </p>
                  <h3 className="text-3xl md:text-5xl font-display italic">
                    {f.name}
                  </h3>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-sm md:text-base text-muted mb-6">{f.bio}</p>
                <div className="flex gap-3">
                  {f.socials.map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-[0.2em] text-muted hover:text-text-primary border border-stroke hover:border-text-primary/30 rounded-full px-4 py-2 transition-colors"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Origin story */}
        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">
                Why JAW
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display leading-[0.95] tracking-tight mb-6">
              Built on <span className="italic">conversations</span>, not
              business cards.
            </h2>
            <p className="text-sm md:text-base text-muted mb-4 max-w-xl">
              We kept noticing the same thing at industry mixers: everyone left
              with cards, no one left with connections. So we built the room we
              wanted to walk into.
            </p>
            <p className="text-sm md:text-base text-muted max-w-xl">
              JAW is what happens when you take the energy of nightlife, the
              ambition of the boardroom, and put them in the same room — at 6
              p.m., on a Wednesday.
            </p>
          </div>
          <div className="md:col-span-5 bg-surface border border-stroke rounded-3xl p-8 md:p-10">
            <p className="text-sm text-muted uppercase tracking-[0.2em] mb-4">
              By the numbers
            </p>
            <div className="space-y-6">
              {[
                { v: "15+", l: "Years combined experience" },
                { v: "95+", l: "Events curated" },
                { v: "200%", l: "Satisfied attendees" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="flex items-baseline gap-4 pb-4 border-b border-stroke last:border-0"
                >
                  <span className="text-4xl md:text-5xl font-display italic text-text-primary">
                    {s.v}
                  </span>
                  <span className="text-sm text-muted">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
