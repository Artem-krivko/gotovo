import { Section } from "@/components/shared/section";
import { SectionTitle } from "@/components/shared/section-title";

type BenefitsProps = {
  title: string;
  subtitle?: string;
  items: string[];
};

export function Benefits({ title, subtitle, items }: BenefitsProps) {
  return (
    <Section>
      <div className="flex flex-col gap-8 sm:gap-10">
        <SectionTitle title={title} subtitle={subtitle} />

        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item}
              className="rounded-2xl border bg-white p-4 text-sm font-medium shadow-sm sm:p-5 sm:text-base"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}