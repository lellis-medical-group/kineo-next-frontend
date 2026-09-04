import type { Metadata } from "next";
import { ProfileEditContainer } from "@/components/templates/profile-edit-container";

export const metadata: Metadata = {
  title: "Modifier le profil — Kineo",
  description:
    "Modifiez votre spécialité, votre type de pratique, votre numéro RPPS et la visibilité de votre profil.",
  robots: { index: false },
};

export default function ProfileEditPage() {
  return <ProfileEditContainer />;
}
