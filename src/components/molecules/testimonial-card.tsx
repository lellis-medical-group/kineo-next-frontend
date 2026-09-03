export interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

export function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-6">
      <blockquote className="text-sm leading-relaxed text-foreground/85">
        « {quote} »
      </blockquote>

      <figcaption className="mt-5">
        <p className="text-sm font-bold">{author}</p>
        <p className="mt-0.5 text-xs text-muted">{role}</p>
      </figcaption>
    </figure>
  );
}
