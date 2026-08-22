import Image from "next/image";

interface LogoProps {
  /** "nav" = compact navbar logo, "hero" = large homepage logo */
  variant?: "nav" | "hero";
}

export default function Logo({ variant = "hero" }: LogoProps) {
      if (variant === "nav") {
        return (
          <img
            src="/jaw-logo.png"
            alt="Just After Work"
            className="h-20 w-auto object-contain"
          />
        );
      }

  return (
    <Image
      src="/jaw-logo.png"
      alt="Just After Work"
      width={500}
      height={500}
      priority
      sizes="(max-width: 928px) 260px, (max-width: 1500px) 28vw, 420px"
      className="mx-auto h-auto w-[clamp(260px,28vw,420px)]"
    />
  );
}
