import Link from "next/link";

type BrandTone = "dark" | "light";

export function BrandMark({
  tone = "dark",
  className = "h-9 w-9",
}: {
  tone?: BrandTone;
  className?: string;
}) {
  const background = tone === "dark" ? "#171712" : "#f2efe7";
  const foreground = tone === "dark" ? "#f2efe7" : "#171712";

  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="40" height="40" fill={background} />
      <path d="M8 8H29V13H14V27H25V23H20V18H31V32H8V8Z" fill={foreground} />
      <rect x="27" y="8" width="5" height="5" fill="#ff5538" />
    </svg>
  );
}

export function BrandLogo({
  tone = "dark",
  className = "",
}: {
  tone?: BrandTone;
  className?: string;
}) {
  const textColor = tone === "dark" ? "text-[#171712]" : "text-[#f2efe7]";
  const focusColor = tone === "dark" ? "focus-visible:outline-[#2656d8]" : "focus-visible:outline-[#d8ff52]";

  return (
    <Link
      href="/"
      aria-label="gotovo — на главную"
      className={`group inline-flex items-center gap-3 focus-visible:outline-3 focus-visible:outline-offset-4 ${focusColor} ${className}`}
    >
      <span className="transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-[1.04]">
        <BrandMark tone={tone} />
      </span>
      <span className={`text-[17px] font-semibold tracking-[-0.065em] ${textColor}`}>
        gotovo<span className="text-[#ff5538]">.</span>
      </span>
    </Link>
  );
}
