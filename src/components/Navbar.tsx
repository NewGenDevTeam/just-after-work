"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About JAW" },
  { href: "/events", label: "Upcoming Events" },
  { href: "/founders", label: "About Founders" },
  { href: "/news-media", label: "News & Media" },
  { href: "/contact", label: "Contact Us" },
];

const searchItems = [
  { label: "Home", href: "/", desc: "Just After Work — landing page" },
  { label: "About JAW", href: "/about", desc: "Our story, values, and the crowd" },
  { label: "Upcoming Events", href: "/events", desc: "The Women's Circle and future gatherings" },
  { label: "About Founders", href: "/founders", desc: "Jarrod Solomon and Jude Ashvin" },
  { label: "News & Media", href: "/news-media", desc: "Press, partnerships, and recaps" },
  { label: "Contact Us", href: "/contact", desc: "Partnerships, press, general inquiries" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
    else setQuery("");
  }, [searchOpen]);

  // Close search and mobile menu on route change
  useEffect(() => { setSearchOpen(false); setMenuOpen(false); }, [pathname]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const results = query.trim().length > 0
    ? searchItems.filter((s) =>
        `${s.label} ${s.desc}`.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  function isActive(link: (typeof navLinks)[number]) {
    if (link.href === "/") return pathname === "/";
    if (link.href === "/news-media") return pathname.startsWith("/news-media") || pathname.startsWith("/news");
    return pathname.startsWith(link.href);
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
        <div
          className={cn(
            "inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface/80 px-2 py-2 transition-shadow",
            scrolled && "shadow-md shadow-black/30"
          )}
        >
          {/* Logo */}
          <a href="/" className="group relative w-12 h-10 shrink-0">
            <span className="absolute inset-0 rounded-full accent-gradient-animated" />
            <span className="absolute inset-[2px] rounded-full bg-bg flex items-center justify-center transition-transform group-hover:scale-110">
              <Logo variant="nav" />
            </span>
          </a>

          <div className="hidden lg:block w-px h-5 bg-stroke mx-1" />

          {/* Nav links — hidden on small screens, visible on lg+ */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs rounded-full px-3 py-1.5 transition-all duration-200 whitespace-nowrap",
                    active
                      ? "text-text-primary bg-stroke/50"
                      : "text-muted hover:text-text-primary hover:bg-stroke/50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:block w-px h-5 bg-stroke mx-1" />

          {/* Search icon */}
          <button
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search"
            className={cn(
              "relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200",
              searchOpen
                ? "bg-stroke/50 text-text-primary"
                : "text-muted hover:text-text-primary hover:bg-stroke/50"
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <div className="hidden lg:block w-px h-5 bg-stroke mx-1" />

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-text-primary hover:bg-stroke/50 transition-all duration-200 ml-1"
          >
            {menuOpen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-bg/95 backdrop-blur-md flex flex-col pt-24 px-6 overflow-y-auto">
          <nav className="flex flex-col">
            {navLinks.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "py-5 text-2xl font-display italic border-b border-stroke transition-colors",
                    active ? "text-text-primary" : "text-muted hover:text-text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm flex flex-col items-center pt-28 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="w-full max-w-xl bg-surface border border-stroke rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-stroke">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-muted focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs text-muted hover:text-text-primary transition-colors"
              >
                Esc
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {query.trim() === "" ? (
                <ul>
                  {searchItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-stroke/30 transition-colors"
                      >
                        <span className="text-sm font-display italic text-text-primary">{item.label}</span>
                        <span className="text-xs text-muted truncate">{item.desc}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : results.length > 0 ? (
                <ul>
                  {results.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-stroke/30 transition-colors"
                      >
                        <span className="text-sm font-display italic text-text-primary">{item.label}</span>
                        <span className="text-xs text-muted truncate">{item.desc}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-6 text-sm text-muted text-center">No results for &ldquo;{query}&rdquo;</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
