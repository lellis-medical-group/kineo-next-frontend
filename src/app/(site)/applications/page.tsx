import type { Metadata } from "next";
import { ApplicationsContainer } from "@/components/templates/applications-container";

export const metadata: Metadata = {
  title: "Mes candidatures — Kineo",
  description:
    "Suivez l'état de vos candidatures aux annonces de remplacement : envoyée, vue, présélectionnée, acceptée ou refusée.",
};

export default function ApplicationsPage() {
  return <ApplicationsContainer />;
}
