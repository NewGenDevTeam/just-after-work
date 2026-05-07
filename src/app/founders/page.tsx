import { getFounders } from "@/lib/wordpress";
import FoundersClient, { type FounderItem } from "./FoundersClient";

const FALLBACK_FOUNDERS: FounderItem[] = [
  {
    name: "Jarrod Solomon",
    role: "Founder",
    image:
      "https://justafterwork.com/wp-content/uploads/2024/05/jarrod-570x696.png",
    bio: "Media tactician and strategy whisperer with 15+ years across FMT News and Sledgehammer Communications. Helps brands scale without selling out — connecting clarity with impact.",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/jarrod-solomon" },
      {
        label: "Instagram",
        href: "https://www.instagram.com/jarrod.solomon.39",
      },
    ],
  },
  {
    name: "Jude Ashvin",
    role: "Co-Founder",
    image:
      "https://justafterwork.com/wp-content/uploads/2024/05/jude-570x696.jpg",
    bio: "Once front and center of Malaysia's live music scene with Rhythm Nation. Turned passion into purpose — decoding the business behind the beat and building Keep It Local Asia, a love letter to local talent.",
    socials: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/jude-ashvin-034a48147",
      },
      { label: "Instagram", href: "https://www.instagram.com/judeashvin" },
    ],
  },
];

export const revalidate = 60;

export default async function FoundersPage() {
  const wpFounders = await getFounders();

  // Only use WP data when at least one founder has real ACF content
  const hasContent = wpFounders.some((f) => f.role || f.short_bio || f.image);

  const founders: FounderItem[] =
    hasContent
      ? wpFounders.map((f) => {
          const socials: { label: string; href: string }[] = [];
          if (f.linkedin_link) socials.push({ label: "LinkedIn", href: f.linkedin_link });
          if (f.instagram_link) socials.push({ label: "Instagram", href: f.instagram_link });
          return {
            name: f.name,
            role: f.role,
            image: f.image,
            bio: f.short_bio || f.full_bio,
            socials,
          };
        })
      : FALLBACK_FOUNDERS; // fallback until ACF fields are filled in WP

  return <FoundersClient founders={founders} />;
}
