import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import Countdown from "@/components/Countdown";
import { getEvents, type WPEvent } from "@/lib/wordpress";

const FALLBACK_EVENTS: WPEvent[] = [
  {
    id: 1,
    slug: "rsvp-the-womens-circle",
    title: "RSVP - The Women's Circle",
    date: "2025-10-31",
    event_time: "7:00 PM - 11:00 PM",
    venue: "Kuala Lumpur at 19:00",
    description:
      "Think less stiff suit, more inspiring chats, genuine connections and good vibes. This private event is designed for influential women like yourself to unwind and talk about what really matters.",
    rsvp_link: "https://docs.google.com/forms/d/e/1FAIpQLSco2nqRX_9OWr_2v8RhGj4Ik0S93DTzGAdO-skZJZP4jWnOJw/viewform?usp=send_form",
    rsvpUrl: "https://docs.google.com/forms/d/e/1FAIpQLSco2nqRX_9OWr_2v8RhGj4Ik0S93DTzGAdO-skZJZP4jWnOJw/viewform?usp=send_form",
    event_status: "upcoming",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-26-at-15.20.26.jpeg",
  },
];

export const revalidate = 60;

function buildEventTarget(date?: string | null, time?: string | null) {
  if (!date) return "";

  if (date.includes("T")) return date;

  const startTime = time?.split("–")[0]?.split("-")[0]?.trim() || "00:00";

  const match = startTime.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);

  if (!match) {
    return `${date}T00:00:00+08:00`;
  }

  let hour = Number(match[1]);
  const minute = match[2] || "00";
  const period = match[3]?.toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const finalHour = String(hour).padStart(2, "0");

  return `${date}T${finalHour}:${minute}:00+08:00`;
}

export default async function EventsPage() {
  const wpEvents = await getEvents();
  // Deduplicate by slug (belt-and-suspenders in case WP still has duplicates)
  const seen = new Set<string>();
  const deduped = wpEvents.filter((e) => !seen.has(e.slug) && !!seen.add(e.slug));
  const events = deduped.length > 0 ? deduped : FALLBACK_EVENTS;
  const next = events[0];
  const venueDisplay = next.venue;

  return (
    <div className="pt-32 md:pt-40 pb-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Upcoming Events"
          title={
            <>
              Unlocking new <span className="italic">experiences soon</span>
            </>
          }
          subtitle="Curated nights for the people who make their own hours. RSVP early — these go fast."
        />

        {/* Featured countdown */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-surface border border-stroke rounded-3xl p-6 md:p-10">
          <div className="md:col-span-5">
            <p className="text-xs text-muted uppercase tracking-[0.3em] mb-4">
              Next Event
            </p>
            {next.event_status && next.event_status !== "upcoming" && (
              <span className="inline-block text-xs uppercase tracking-[0.2em] text-amber-400 border border-amber-400/30 rounded-full px-3 py-1 mb-3">
                {next.event_status.replace(/_/g, " ")}
              </span>
            )}
            <h3 className="text-3xl md:text-5xl font-display italic mb-3">
              {next.title}
            </h3>
            <p className="text-sm text-muted mb-6">{venueDisplay}</p>
            <p className="text-sm text-muted mb-8 max-w-md leading-relaxed">
              {next.description}
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={next.rsvpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex rounded-full"
              >
                <span className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative bg-text-primary text-bg rounded-full px-6 py-3 text-sm uppercase tracking-[0.2em] hover:scale-105 transition-transform">
                  Register Now
                </span>
              </a>
            </div>
            <Countdown target={buildEventTarget(next.date, next.event_time)} />
          </div>
          <div className="md:col-span-7 relative aspect-[4/3] rounded-2xl overflow-hidden border border-stroke">
            {next.image && (
              <img
                src={next.image}
                alt={next.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* All events */}
        <div className="mt-24">
          <h3 className="text-2xl md:text-3xl font-display italic mb-8">
            All upcoming
          </h3>

          {events.length === 0 ? (
            <p className="text-muted">
              No events scheduled — check back soon, or follow us on Instagram.
            </p>
          ) : (
            <div className="space-y-5">
              {events.map((e) => {
                return (
                  <div
                    key={e.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-surface/40 hover:bg-surface border border-stroke rounded-[40px] sm:rounded-full transition-colors"
                  >
                    <div className="relative w-full sm:w-32 h-40 sm:h-24 rounded-3xl sm:rounded-full overflow-hidden flex-shrink-0">
                      {e.image && (
                        <img
                          src={e.image}
                          alt={e.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 px-2 sm:px-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xl md:text-2xl font-display italic">
                          {e.title}
                        </h4>
                        {e.event_status && e.event_status !== "upcoming" && (
                          <span className="text-[10px] uppercase tracking-[0.15em] text-amber-400 border border-amber-400/30 rounded-full px-2 py-0.5">
                            {e.event_status.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted">{e.venue}</p>
                      <p className="text-sm text-muted mt-2 line-clamp-2 max-w-2xl">
                        {e.description}
                      </p>
                    </div>
                    <Link
                      href={e.rsvpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex rounded-full self-start sm:self-center mr-0 sm:mr-4"
                    >
                      <span className="absolute -inset-[2px] rounded-full accent-gradient-animated opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative bg-text-primary text-bg rounded-full px-5 py-3 text-xs uppercase tracking-[0.2em]">
                        Register Now
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
