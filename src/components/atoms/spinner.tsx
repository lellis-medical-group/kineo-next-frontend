export interface SpinnerProps {
  /** Taille + couleurs (ex. "h-4 w-4 border-primary/20 border-t-primary"). */
  className?: string;
}

/**
 * Indicateur de chargement circulaire — primitive visuelle sans état.
 * La taille et les couleurs sont injectées par l'appelant pour rester
 * conflict-free (aucune classe utilitaire dupliquée).
 */
export function Spinner({ className = "" }: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 animate-spin rounded-full border-2 ${className}`}
    />
  );
}
