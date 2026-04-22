interface SectionTitleProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center";
}

export function SectionTitle({ title, subtitle, badge, align = "center" }: SectionTitleProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {badge && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#6B6B80]">
          {badge}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-7 text-[#A1A1B5]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
