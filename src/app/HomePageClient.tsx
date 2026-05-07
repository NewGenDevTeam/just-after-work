"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import HeroVideo from "@/components/HeroVideo";
import LoadingScreen from "@/components/LoadingScreen";
import Countdown from "@/components/Countdown";
import Logo from "@/components/Logo";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
}

export interface NewsItem {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
}

// ─── Static data (unchanged) ──────────────────────────────────────────────────

const roles = ["Creative", "Founder", "Connector", "Storyteller"];

const NEXT_EVENT = "2025-10-31T19:00:00+08:00";

const events = [
  {
    id: 1,
    title: "RSVP – The Women's Circle",
    venue: "Kuala Lumpur at 19:00",
    description:
      "Think less stiff suit, more inspiring chats, genuine connections and good vibes. This private event is designed for influential women like yourself to unwind and talk about what really matters.",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-15.20.26.jpeg",
    rsvpUrl: "https://docs.google.com/forms/d/e/1FAIpQLSco2nqRX_9OWr_2v8RhGj4Ik0S93DTzGAdO-skZJZP4jWnOJw/viewform?usp=send_form",
  },
];

const founders = [
  {
    name: "Jarrod Solomon",
    role: "Founder",
    image:
      "https://justafterwork.com/wp-content/uploads/2024/05/jarrod-570x696.png",
    bio: "Media tactician and strategy whisperer with 15+ years across FMT News and Sledgehammer Communications. Helps brands scale without selling out — connecting clarity with impact.",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/jarrod-solomon" },
      { label: "Instagram", href: "https://www.instagram.com/jarrod.solomon.39" },
    ],
  },
  {
    name: "Jude Ashvin",
    role: "Co-Founder",
    image:
      "https://justafterwork.com/wp-content/uploads/2024/05/jude-570x696.jpg",
    bio: "Once front and center of Malaysia's live music scene with Rhythm Nation. Turned passion into purpose — decoding the business behind the beat and building Keep It Local Asia.",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/jude-ashvin-034a48147" },
      { label: "Instagram", href: "https://www.instagram.com/judeashvin" },
    ],
  },
];

// ─── Carousel ─────────────────────────────────────────────────────────────────

function Carousel({
  items,
  cardClass,
  autoMs = 4000,
}: {
  items: ReactNode[];
  cardClass: string;
  autoMs?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>();
  const autoTimer = useRef<ReturnType<typeof setInterval>>();
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>();
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const paused = useRef(false);

  const getStep = () => {
    const card = trackRef.current?.querySelector("[data-card]") as HTMLElement | null;
    return card ? card.offsetWidth + 20 : 300;
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    requestAnimationFrame(() => { el.scrollLeft = el.scrollWidth / 3; });

    const onScroll = () => {
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => {
        const { scrollLeft, scrollWidth } = el;
        const third = scrollWidth / 3;
        if (scrollLeft >= third * 2) el.scrollLeft = scrollLeft - third;
        else if (scrollLeft < third) el.scrollLeft = scrollLeft + third;
      }, 100);
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    autoTimer.current = setInterval(() => {
      if (paused.current) return;
      const card = el.querySelector("[data-card]") as HTMLElement | null;
      const s = card ? card.offsetWidth + 20 : 300;
      el.scrollBy({ left: s, behavior: "smooth" });
    }, autoMs);

    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(resetTimer.current);
      clearInterval(autoTimer.current);
      clearTimeout(resumeTimer.current);
    };
  }, [autoMs]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    clearTimeout(resumeTimer.current);
    paused.current = true;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
    el.style.scrollSnapType = "none";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = drag.current.startX - e.clientX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll + dx;
  };

  const onPointerUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const el = trackRef.current;
    if (!el) return;
    el.style.scrollSnapType = "";
    resumeTimer.current = setTimeout(() => { paused.current = false; }, 2000);
  };

  const onClick = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const slide = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * getStep(), behavior: "smooth" });
  };

  const tripled = [...items, ...items, ...items];

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        clearTimeout(resumeTimer.current);
        paused.current = true;
      }}
      onMouseLeave={() => {
        if (!drag.current.active) {
          resumeTimer.current = setTimeout(() => { paused.current = false; }, 600);
        }
      }}
    >
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing select-none touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onClick}
      >
        {tripled.map((item, i) => (
          <div key={i} data-card className={`snap-start shrink-0 ${cardClass}`}>
            {item}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => slide(-1)}
          aria-label="Previous"
          className="w-10 h-10 rounded-full border border-stroke flex items-center justify-center text-muted hover:text-text-primary hover:border-text-primary/50 transition-colors"
        >
          ←
        </button>
        <button
          onClick={() => slide(1)}
          aria-label="Next"
          className="w-10 h-10 rounded-full border border-stroke flex items-center justify-center text-muted hover:text-text-primary hover:border-text-primary/50 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePageClient({
  testimonials,
  news,
}: {
  testimonials: TestimonialItem[];
  news: NewsItem[];
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const handleLoadingComplete = useCallback(() => setIsLoading(false), []);

  useEffect(() => {
    const id = setInterval(
      () => setRoleIndex((p) => (p + 1) % roles.length),
      2000
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    let ctx: { revert: () => void } | null = null;
    (async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          ".name-reveal",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
        ).fromTo(
          ".blur-in",
          { opacity: 0, filter: "blur(10px)", y: 20 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1,
            stagger: 0.1,
            delay: -0.6,
          }
        );
      }, heroRef);
    })();
    return () => ctx?.revert();
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        id="home"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <HeroVideo />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32 pb-24">
          <p className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8">
            COLLECTION &lsquo;26
          </p>

          <div className="name-reveal mb-6 inline-block text-left">
            <Logo variant="hero" />
          </div>

          <p className="blur-in text-lg md:text-2xl text-muted mb-4">
            A{" "}
            <span
              key={roleIndex}
              className="font-display italic text-text-primary animate-role-fade-in inline-block"
            >
              {roles[roleIndex]}
            </span>{" "}
            community in Kuala Lumpur.
          </p>

          <p className="blur-in text-sm md:text-base text-muted max-w-md mx-auto mb-12">
            When work ends, the real game begins. Stylish venues, crafted
            cocktails, and a curated mix of professionals.
          </p>

          <div className="blur-in flex justify-center mb-12">
            <Countdown target={NEXT_EVENT} />
          </div>

          <div className="blur-in inline-flex flex-wrap items-center justify-center gap-4">
            <Link href="/events" className="group relative inline-flex rounded-full">
              <span className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary rounded-full text-sm px-7 py-3.5 transition-all hover:scale-105">
                See Events
              </span>
            </Link>
            <Link href="/contact" className="group relative inline-flex rounded-full">
              <span className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative border-2 border-stroke group-hover:border-transparent bg-bg text-text-primary rounded-full text-sm px-7 py-3.5 transition-all hover:scale-105">
                Reach out
              </span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <span className="text-xs text-muted uppercase tracking-[0.2em]">
            Scroll
          </span>
          <div className="relative w-px h-10 bg-stroke overflow-hidden">
            <div className="absolute inset-0 w-px h-4 accent-gradient animate-scroll-down" />
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section id="about" className="bg-bg py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-stroke" />
                <span className="text-xs text-muted uppercase tracking-[0.3em]">
                  About JAW
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display leading-[0.95] tracking-tight mb-6">
                When work ends,{" "}
                <span className="italic">the real game begins.</span>
              </h2>
              <p className="text-sm md:text-base text-muted mb-4 max-w-md">
                Just After Work is where the office fades and the energy rises.
                At 6 p.m., JAW becomes the meeting point for professionals who
                thrive beyond the nine-to-five — bringing together ambition,
                culture, and nightlife in one seamless flow.
              </p>
              <p className="text-sm md:text-base text-muted mb-8 max-w-md">
                JAW blurs the boundaries of networking and nightlife through
                live performances, brand activations, and bold conversations.
              </p>
              <Link href="/about" className="group relative inline-flex rounded-full">
                <span className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative inline-flex items-center gap-2 bg-surface text-text-primary rounded-full px-6 py-3 text-sm border border-stroke">
                  Learn more about JAW <span className="text-xs">→</span>
                </span>
              </Link>
            </div>
            <div className="md:col-span-6 relative aspect-[4/5] rounded-3xl overflow-hidden border border-stroke">
              <img
                src="https://justafterwork.com/wp-content/uploads/2025/09/IMG_5515-1-1024x769.jpg"
                alt="JAW gathering"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ──────────────────────────────────────────────── */}
      <section id="events" className="bg-bg pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">
              Upcoming Events
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <h2 className="text-4xl md:text-6xl font-display leading-[0.95] tracking-tight max-w-xl">
              Unlocking new{" "}
              <span className="italic">experiences soon</span>
            </h2>
            <Link
              href="/events"
              className="text-xs text-muted hover:text-text-primary uppercase tracking-[0.2em] shrink-0"
            >
              All events →
            </Link>
          </div>

          {events.map((e) => (
            <div
              key={e.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-surface border border-stroke rounded-3xl p-6 md:p-10 mb-5"
            >
              <div className="md:col-span-5">
                <p className="text-xs text-muted uppercase tracking-[0.3em] mb-4">
                  Next Event
                </p>
                <h3 className="text-3xl md:text-5xl font-display italic mb-3">
                  {e.title}
                </h3>
                <p className="text-sm text-muted mb-6">{e.venue}</p>
                <p className="text-sm text-muted mb-8 max-w-md leading-relaxed">
                  {e.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={e.rsvpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex rounded-full"
                  >
                    <span className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative bg-text-primary text-bg rounded-full px-6 py-3 text-sm uppercase tracking-[0.2em] hover:scale-105 transition-transform">
                      RSVP Now
                    </span>
                  </a>
                  <Link
                    href="/events"
                    className="inline-flex items-center rounded-full border border-stroke px-6 py-3 text-sm text-muted hover:text-text-primary transition-colors"
                  >
                    View all events →
                  </Link>
                </div>
              </div>
              <div className="md:col-span-7 relative aspect-[4/3] rounded-2xl overflow-hidden border border-stroke">
                <img
                  src={e.image}
                  alt={e.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOUNDERS TEASER ──────────────────────────────────────────────── */}
      <section id="founders" className="bg-bg pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">The Founders</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <h2 className="text-4xl md:text-6xl font-display leading-[0.95] tracking-tight max-w-xl">
              The duo behind <span className="italic">JAW</span>
            </h2>
            <Link href="/founders" className="text-xs text-muted hover:text-text-primary uppercase tracking-[0.2em] shrink-0">
              Meet the founders →
            </Link>
          </div>
          <Carousel
            cardClass="w-full md:w-[calc(50%_-_10px)]"
            autoMs={5000}
            items={founders.map((f) => (
              <Link key={f.name} href="/founders" className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-stroke block">
                <img
                  src={f.image}
                  alt={f.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <p className="text-xs text-muted uppercase tracking-[0.3em] mb-1">{f.role}</p>
                  <h3 className="text-2xl md:text-3xl font-display italic">{f.name}</h3>
                </div>
              </Link>
            ))}
          />
        </div>
      </section>

      {/* ── TESTIMONIALS — connected to WordPress ────────────────────────── */}
      <section className="bg-bg pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">
              Community
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display leading-[0.95] tracking-tight mb-12 max-w-xl">
            Voices from <span className="italic">the room</span>
          </h2>
          <Carousel
            cardClass="w-full md:w-[calc(50%_-_10px)] lg:w-[calc(33.333%_-_13.333px)]"
            items={testimonials.map((t) => (
              <div className="bg-surface border border-stroke rounded-3xl p-6 md:p-8 flex flex-col">
                <p className="text-sm md:text-base text-muted italic mb-6 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-stroke pt-4">
                  <p className="font-display italic text-text-primary">{t.name}</p>
                  <p className="text-xs text-muted mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          />
        </div>
      </section>

      {/* ── NEWS & MEDIA — connected to WordPress ────────────────────────── */}
      <section id="news" className="bg-bg pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">
              News & Media
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <h2 className="text-4xl md:text-6xl font-display leading-[0.95] tracking-tight max-w-xl">
              Featured <span className="italic">stories</span>
            </h2>
            <Link
              href="/news-media"
              className="text-xs text-muted hover:text-text-primary uppercase tracking-[0.2em] shrink-0"
            >
              All stories →
            </Link>
          </div>
          <Carousel
            cardClass="w-full md:w-[calc(50%_-_10px)] lg:w-[calc(33.333%_-_13.333px)]"
            items={news.map((n) => (
              <a
                href={n.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-surface border border-stroke rounded-3xl overflow-hidden hover:border-text-primary/20 transition-colors block"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {n.image && (
                    <img
                      src={n.image}
                      alt={n.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-muted uppercase tracking-[0.3em] mb-2">{n.date}</p>
                  <h3 className="text-base font-display italic mb-2 line-clamp-2 leading-snug">{n.title}</h3>
                  <p className="text-xs text-muted line-clamp-2 mb-3 leading-relaxed">{n.excerpt}</p>
                  <span className="text-xs text-text-primary">Read ↗</span>
                </div>
              </a>
            ))}
          />
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────────────────────── */}
      <section id="contact" className="bg-bg pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.3em]">Contact</span>
            <span className="w-8 h-px bg-stroke" />
          </div>
          <h2 className="text-4xl md:text-7xl font-display italic leading-[0.95] mb-6">
            Let&apos;s talk{" "}
            <span className="text-gradient">after hours.</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-md mx-auto mb-10">
            Partnerships, press, or general inquiries — we&apos;re always open
            to connecting beyond 9 to 5.
          </p>
          <Link href="/contact" className="group relative inline-flex rounded-full">
            <span className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative bg-text-primary text-bg rounded-full px-8 py-4 text-sm uppercase tracking-[0.2em] hover:scale-105 transition-transform">
              Get in touch ↗
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
