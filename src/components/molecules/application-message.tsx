/** Message sent with the application, with an empty-state fallback. */
export function ApplicationMessage({ message }: { message?: string }) {
  return (
    <section>
      <h2 className="text-sm font-bold text-foreground">Votre message</h2>
      {message ? (
        <blockquote className="mt-3 whitespace-pre-line rounded-control bg-surface-2 p-4 text-sm leading-relaxed text-muted">
          {message}
        </blockquote>
      ) : (
        <p className="mt-3 text-sm italic text-muted">
          Aucun message n'a été envoyé avec cette candidature.
        </p>
      )}
    </section>
  );
}
