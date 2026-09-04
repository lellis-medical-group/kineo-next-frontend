import type { Metadata } from "next";
import { ProfileCreateContainer } from "@/components/templates/profile-create-container";

export const metadata: Metadata = {
  title: "Créer le profil — Kineo",
  description:
    "Créez votre profil professionnel Kineo : spécialité, type de pratique, numéro RPPS et visibilité.",
  robots: { index: false },
};

export default function ProfileCreatePage() {
  return <ProfileCreateContainer />;
}
