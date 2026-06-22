"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";

const audience = [
  {
    title: "Professionals Who Think Big",
    desc: "Bold conversations and disruptive ideas that move beyond boardrooms into real impact.",
    image: "/images/jaw-event-1.jpg",
  },
  {
    title: "Creatives & Storytellers",
    desc: "Designers, makers, and visionaries who thrive on inspiration and collaboration.",
    image: "/images/jaw-event-3.jpg",
  },
  {
    title: "Founders & Doers",
    desc: "Entrepreneurs and strategists turning ideas into action and partnerships into growth.",
    image: "/images/jaw-gathering.jpeg",
  },
];

const values = [
  {
    title: "Where big ideas begin",
    desc: "Conversations designed to spark ideas that move beyond boardrooms.",
  },
  {
    title: "Scaling without limits",
    desc: "From intimate after-hours gatherings to global online events — without losing the vibe.",
  },
  {
    title: "Connections that count",
    desc: "No name tags. No stiff handshakes. Just curated people, places, and energy.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-32 md:pt-40 pb-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Hero */}
        <SectionHeader
          eyebrow="About JAW"
          title={
            <>
              More than a night out.{" "}
              <span className="italic">It&apos;s a new way in.</span>
            </>
          }
          subtitle="At 6 p.m., JAW becomes the meeting point for professionals who thrive beyond the nine-to-five — bringing together ambition, culture, and nightlife in one seamless flow."
        />

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 md:mt-24">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-surface border border-stroke rounded-3xl p-8"
            >
              <div className="w-10 h-10 rounded-full accent-gradient mb-6 flex items-center justify-center text-bg font-display italic">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="text-2xl font-display italic mb-3">{v.title}</h3>
              <p className="text-sm text-muted">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Who you'll find */}
        <div className="mt-24 md:mt-32">
          <SectionHeader
            eyebrow="The Crowd"
            title={
              <>
                Who you&apos;ll find <span className="italic">at JAW</span>
              </>
            }
            subtitle="Every gathering blurs the line between networking and nightlife. The people who show up are as interesting as they are driven."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mt-12">
            {audience.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group bg-surface border border-stroke rounded-3xl overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display italic mb-2">
                    {a.title}
                  </h3>
                  <p className="text-sm text-muted">{a.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 md:mt-32 text-center bg-surface border border-stroke rounded-3xl py-16 md:py-24 px-6">
          <h2 className="text-3xl md:text-5xl font-display italic mb-4">
            Want to be part of the next one?
          </h2>
          <p className="text-sm md:text-base text-muted mb-8 max-w-md mx-auto">
            Drop us a note or check out the upcoming events.
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/events"
              className="rounded-full bg-text-primary text-bg px-7 py-3.5 text-sm hover:scale-105 transition-transform"
            >
              See events
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-stroke px-7 py-3.5 text-sm hover:scale-105 transition-transform"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
