import { StarIcon } from "@/components/atoms/icons";
import { SectionHeading } from "@/components/atoms/section-heading";
import { TestimonialCard } from "@/components/molecules/testimonial-card";
import { testimonialsSection } from "@/lib/marketing";

export function TestimonialsSection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title={testimonialsSection.title} />
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <span className="text-primary">
              <StarIcon />
            </span>
            <span className="font-bold text-foreground">
              {testimonialsSection.rating}
            </span>
            {testimonialsSection.ratingLabel}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonialsSection.items.map((testimonial) => (
            <TestimonialCard
              key={testimonial.author}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
