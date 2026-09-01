"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";

interface ConceptBlueprintProps {
  image: string;
  alt: string;
  tone: string;
  rotation: string;
  labels: readonly string[];
}

export function ConceptBlueprint({
  image,
  alt,
  tone,
  rotation,
  labels,
}: ConceptBlueprintProps) {
  const [isBlueprintVisible, setIsBlueprintVisible] = useState(false);

  return (
    <div
      className={`concept-blueprint relative min-h-[300px] overflow-hidden p-4 sm:min-h-[480px] sm:p-7 lg:col-span-6 ${tone}`}
      data-blueprint-active={isBlueprintVisible ? "true" : "false"}
    >
      <button
        type="button"
        aria-pressed={isBlueprintVisible}
        onClick={() => setIsBlueprintVisible((current) => !current)}
        className="concept-blueprint__toggle absolute right-4 top-4 z-20 min-h-11 border border-ink bg-paper px-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-acid focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-cobalt sm:right-7 sm:top-7"
      >
        {isBlueprintVisible ? "Концепт" : "Структура"} <span aria-hidden="true">↗</span>
      </button>

      <div className={`concept-blueprint__frame relative h-full min-h-[268px] overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:min-h-[424px] ${rotation}`}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="concept-blueprint__image object-cover object-top"
        />
        <div className="concept-blueprint__overlay absolute inset-0 bg-paper/[0.94] p-4 sm:p-6" aria-hidden="true">
          <div className="concept-blueprint__grid h-full border border-cobalt/60">
            {labels.map((label, index) => (
              <div
                key={label}
                className="concept-blueprint__zone flex items-start justify-between border-b border-cobalt/45 p-3 text-xs font-semibold uppercase tracking-[0.12em] text-cobalt last:border-b-0 sm:p-4"
                style={{ "--blueprint-delay": `${index * 40}ms` } as CSSProperties}
              >
                <span>{label}</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
