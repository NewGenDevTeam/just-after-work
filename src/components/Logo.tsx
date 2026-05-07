interface LogoProps {
  /** "nav" = compact pill badge, "hero" = large homepage mark */
  variant?: "nav" | "hero";
}

export default function Logo({ variant = "hero" }: LogoProps) {
  if (variant === "nav") {
    return (
      <div className="leading-none select-none text-center">
        <div
          className="font-display text-[#EDE8D8]"
          style={{ fontSize: "7px", lineHeight: 1.2, letterSpacing: "0.02em" }}
        >
          Just After
        </div>
        <div
          className="font-script text-[#C9A84C]"
          style={{ fontSize: "15px", lineHeight: 0.9, marginTop: "-1px" }}
        >
          Work
        </div>
      </div>
    );
  }

  return (
    <div className="leading-none select-none">
      <div
        className="font-display text-[#EDE8D8]"
        style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)", lineHeight: 1.05 }}
      >
        Just
      </div>
      <div
        className="font-display text-[#EDE8D8]"
        style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)", lineHeight: 1.05 }}
      >
        After
      </div>
      <div
        className="font-script text-[#C9A84C]"
        style={{
          fontSize: "clamp(5rem, 16vw, 14rem)",
          lineHeight: 0.85,
          marginTop: "-0.05em",
        }}
      >
        Work
      </div>
    </div>
  );
}
