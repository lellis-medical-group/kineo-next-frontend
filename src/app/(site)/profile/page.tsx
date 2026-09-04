import type { Metadata } from "next";
import { ProfileContainer } from "@/components/templates/profile-container";

export const metadata: Metadata = {
  title: "Profil — Kineo",
  description:
    "Gérez votre profil professionnel Kineo : spécialité, type de pratique, numéro RPPS et visibilité.",
};

export default function ProfilePage() {
  return <ProfileContainer />;
}
