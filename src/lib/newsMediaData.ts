import { type WPNewsMedia } from "@/lib/wordpress";

export const STATIC_NEWS_MEDIA: WPNewsMedia[] = [
  {
    id: 1,
    slug: "jaw-debuts-at-kingsmen-barbershop",
    title: "Just After Work debuts at Kingsmen Barbershop with 'The Gentleman's Hour'",
    publish_date: "2025-06-23",
    short_description:
      "JAW's debut event at Kingsmen Barbershop brought together 80 entrepreneurs for an evening of live jazz, genuine connection, and community — celebrating the barbershop's first anniversary.",
    category_label: "Gentleman's Code",
    external_link:
      "https://gentlemanscodes.com/grooming/the-gentleman-s-hour-just-after-work-s-debut-kingsmen-barbershop-damansara-heights-1st-anniversary-celebration",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/new1-890x664.webp",
  },
  {
    id: 2,
    slug: "kingsmen-debut-gentlemans-hour",
    title: "Just After Work debuts at Kingsmen Barbershop with 'The Gentleman's Hour'",
    publish_date: "2025-06-23",
    short_description:
      "JAW's debut event at Kingsmen Barbershop — 80 entrepreneurs, live jazz, and genuine connection for the barbershop's first anniversary.",
    category_label: "Gentleman's Code",
    external_link:
      "https://gentlemanscodes.com/grooming/the-gentleman-s-hour-just-after-work-s-debut-kingsmen-barbershop-damansara-heights-1st-anniversary-celebration",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/new1-890x664.webp",
  },
  {
    id: 3,
    slug: "padel-connect-ascaro",
    title: "Padel & Connect at ASCARO: Where networking meets sporting elegance",
    publish_date: "2025-07-06",
    short_description:
      "Where networking meets sporting elegance — JAW takes networking to the court at ASCARO Padel & Social Club.",
    category_label: "Gentleman's Code",
    external_link:
      "https://gentlemanscodes.com/living/padel-connect-at-ascaro-where-networking-meets-sporting-elegance",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/IMG_1099-890x664.webp",
  },
  {
    id: 4,
    slug: "gentlemans-hour-self-care",
    title: "How 'The Gentleman's Hour' Gave Self-Care A Business Agenda",
    publish_date: "2025-09-10",
    short_description:
      "JAW's debut at Kingsmen Barbershop turns wellness into a board meeting — where grooming meets genuine connection.",
    category_label: "Juice Online",
    external_link: "https://juiceonline.com/the-gentlemans-hour/",
    image:
      "https://justafterwork.com/wp-content/uploads/2025/09/57a64395-ad9c-42e2-8896-20ff0d6c2ec8-890x664.jpg",
  },
  {
    id: 5,
    slug: "ascaro-sporty-networking",
    title: "JAW Serves Up Sporty Networking With A Twist At ASCARO Padel & Social Club",
    publish_date: "2025-09-05",
    short_description:
      "JAW serves up the perfect after-work cocktail of sport and connection at ASCARO Padel & Social Club.",
    category_label: "Juice Online",
    external_link:
      "https://juiceonline.com/jaw-serves-up-sporty-networking-with-a-twist-at-ascaro-padel-social-club/",
    image: "https://justafterwork.com/wp-content/uploads/2025/09/jk-890x664.jpg",
  },
];

export function getStaticNewsMediaBySlug(slug: string): WPNewsMedia | undefined {
  return STATIC_NEWS_MEDIA.find((p) => p.slug === slug);
}
