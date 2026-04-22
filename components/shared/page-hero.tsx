type PageHeroProps = {
    title: string;
    subtitle?: string;
    badge?: string;
    primaryCta?: {
      label: string;
      href: string;
    };
    secondaryCta?: {
      label: string;
      href: string;
    };
  };
  
  export function PageHero({
    title,
    subtitle,
    badge,
    primaryCta,
    secondaryCta,
  }: PageHeroProps) {
    return (
      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {badge ? <span className="badge-base mb-4">{badge}</span> : null}
  
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
  
          {subtitle ? (
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
  
          {primaryCta || secondaryCta ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryCta ? (
                <a href={primaryCta.href} className="btn-primary">
                  {primaryCta.label}
                </a>
              ) : null}
  
              {secondaryCta ? (
                <a href={secondaryCta.href} className="btn-secondary">
                  {secondaryCta.label}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    );
  }