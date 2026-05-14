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
    <img
      src="/jaw-logo.png"
      alt="Just After Work"
      className="mx-auto w-[520px] max-w-[85vw] object-contain"
    />
  );
}
