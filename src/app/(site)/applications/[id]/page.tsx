import type { Metadata } from "next";
import { ApplicationDetailContainer } from "@/components/templates/application-detail-container";

export const metadata: Metadata = {
  title: "Candidature — Kineo",
  description:
    "Détail d'une candidature envoyée : annonce visée, message personnalisé et suivi des statuts.",
};

/** Dedicated application page — routed by application id (UUID). */
export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ApplicationDetailContainer id={id} />;
}
