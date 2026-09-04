import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
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
      <Card className="w-full max-w-md p-10 text-center">
        <h1 className="text-5xl font-medium tracking-[-0.02em]">404</h1>
        <p className="mt-4 text-sm text-muted">
          Cette page n’existe pas ou a été déplacée.
        </p>
        <Button href="/" className="mt-6">
          <ArrowLeftIcon className="h-4 w-4" />
          Retour à l’accueil
        </Button>
      </Card>
    </main>
  );
}
