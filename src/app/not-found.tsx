import Link from "next/link";
import { ArrowLeftIcon } from "@/components/atoms/icons";

export async function generateMetadata() {
  return {
    title: "404 — Page introuvable | Kineo",
    description: "Cette page n'existe pas ou a été déplacée.",
  };
}

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 text-foreground">
      <div className="card p-10 w-full max-w-md text-center">
        <h1 className="text-5xl font-medium tracking-[-0.02em]">404</h1>
        <p className="mt-4 text-sm text-muted">
          Cette page n’existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="btn btn-primary mt-6"
          aria-label="Retour à l’accueil"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}
