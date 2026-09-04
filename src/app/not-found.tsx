import { Button } from "@/components/atoms/button";
import { ArrowLeftIcon } from "@/components/atoms/icons";
import { StatusCard } from "@/components/molecules/status-card";

export async function generateMetadata() {
  return {
    title: "404 — Page introuvable | Kineo",
    description: "Cette page n'existe pas ou a été déplacée.",
  };
}

export default function NotFound() {
  return (
    <StatusCard code="404" message="Cette page n’existe pas ou a été déplacée.">
      <Button href="/" className="mt-6">
        <ArrowLeftIcon className="h-4 w-4" />
        Retour à l’accueil
      </Button>
    </StatusCard>
  );
}
