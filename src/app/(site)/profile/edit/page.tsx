import type { Metadata } from "next";
import { ProfileFormContainer } from "@/components/templates/profile-form-container";

export const metadata: Metadata = {
  title: "Modifier le profil — Kineo",
  description:
    "Modifiez votre spécialité, votre type de pratique, votre numéro RPPS et la visibilité de votre profil.",
  robots: { index: false },
};

export default function ProfileEditPage() {
  return <ProfileFormContainer />;
}
