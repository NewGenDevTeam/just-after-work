"use client";

import { useState } from "react";
import HeroVideo from "@/components/HeroVideo";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(fd)),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      (e.currentTarget as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="relative min-h-screen pt-32 md:pt-40 pb-16">
      <HeroVideo flip overlay="bg-black/70" />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="text-center mb-16">
          <p className="text-xs text-muted uppercase tracking-[0.3em] mb-4">
            Contact
          </p>
          <h1 className="text-5xl md:text-7xl font-display italic leading-[0.95] mb-6">
            Let&apos;s talk <br />
            <span className="text-gradient">after hours.</span>
          </h1>
          <p className="text-sm md:text-base text-muted max-w-md mx-auto">
            Partnerships, press, or general inquiries — we&apos;re always open
            to connecting beyond 9 to 5.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-7 bg-surface/80 backdrop-blur-md border border-stroke rounded-3xl p-6 md:p-10 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field name="name" label="Name" required />
              <Field name="email" label="Email" type="email" required />
            </div>
            <Field name="company" label="Company (optional)" />
            <Field name="topic" label="What's this about?" />
            <div>
              <label className="block text-xs text-muted uppercase tracking-[0.2em] mb-2">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full bg-bg/50 border border-stroke rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-text-primary/40 transition-colors resize-none"
              />
            </div>

            <label className="flex items-start gap-3 text-xs text-muted">
              <input
                type="checkbox"
                required
                className="mt-0.5 accent-white"
              />
              <span>
                I agree that my submitted data is being collected and stored
                per the{" "}
                <a
                  href="https://justafterwork.com/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary underline"
                >
                  privacy policy
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className="group relative inline-flex rounded-full disabled:opacity-50"
            >
              <span className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative bg-text-primary text-bg rounded-full px-7 py-3.5 text-sm hover:scale-105 transition-transform">
                {status === "sending"
                  ? "Sending…"
                  : status === "sent"
                    ? "Sent ✓"
                    : "Send message"}
              </span>
            </button>

            {status === "error" && (
              <p className="text-xs text-red-400">
                Something went wrong. Try again or email us directly.
              </p>
            )}
          </form>

          {/* Info card */}
          <aside className="md:col-span-5 space-y-5">
            <div className="bg-surface/80 backdrop-blur-md border border-stroke rounded-3xl p-6 md:p-8">
              <p className="text-xs text-muted uppercase tracking-[0.3em] mb-3">
                Email
              </p>
              <a
                href="mailto:jude@justafterwork.com"
                className="text-lg sm:text-2xl font-display italic hover:text-gradient break-all"
              >
                jude@justafterwork.com
              </a>
            </div>

            <div className="bg-surface/80 backdrop-blur-md border border-stroke rounded-3xl p-6 md:p-8">
              <p className="text-xs text-muted uppercase tracking-[0.3em] mb-3">
                Find us
              </p>
              <p className="text-sm text-muted leading-relaxed">
                Kuala Lumpur, Malaysia. <br />
                Pop-ups, padel courts, and rooftops citywide.
              </p>
            </div>

            <div className="bg-surface/80 backdrop-blur-md border border-stroke rounded-3xl p-6 md:p-8">
              <p className="text-xs text-muted uppercase tracking-[0.3em] mb-3">
                Follow
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <a
                  href="https://www.instagram.com/justafterwork/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary hover:underline"
                >
                  Instagram ↗
                </a>
                <a
                  href="https://www.linkedin.com/company/just-after-work"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary hover:underline"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="http://www.facebook.com/profile.php?id=61578132841991"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-primary hover:underline"
                >
                  Facebook ↗
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-muted uppercase tracking-[0.2em] mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full bg-bg/50 border border-stroke rounded-full px-4 py-3 text-sm focus:outline-none focus:border-text-primary/40 transition-colors"
      />
    </div>
  );
}
