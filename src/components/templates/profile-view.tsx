import { Avatar } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import {
  FileTextIcon,
  PencilIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/atoms/icons";
import { InlineAlert } from "@/components/molecules/inline-alert";
import { ProfileSection } from "@/components/molecules/profile-section";
import { StatRow } from "@/components/molecules/stat-row";
import {
  formatMemberSince,
  PROFILE_TYPE_DESCRIPTIONS,
  PROFILE_TYPE_LABELS,
  SPECIALTY_LABELS,
} from "@/lib/profile";
import type { ApiProfile } from "@/lib/types/api";

type Feedback = "created" | "saved" | null;

/**
 * Profile page (read-only view mode): identity card + read-only sections.
 * Create/edit flows live in their own containers (/profile/create, /profile/edit)
 * and share the ProfileFormPage shell.
 */
export function ProfileView({
  profile,
  userName,
  feedback,
  onEdit,
}: {
  profile: ApiProfile;
  userName: string;
  feedback: Feedback;
  onEdit: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      {feedback === "created" && (
        <div className="mb-6 space-y-4">
          <InlineAlert tone="success">
            Votre profil a été créé avec succès.
          </InlineAlert>
          <Button href="/" size="lg" className="w-full">
            Aller à mon tableau de bord
          </Button>
        </div>
      )}
      {feedback === "saved" && (
        <InlineAlert tone="success" className="mb-6">
          Vos modifications ont été enregistrées.
        </InlineAlert>
      )}

      <Card className="p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={userName} className="h-14 w-14 shrink-0 text-lg" />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight">
                {userName}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {PROFILE_TYPE_LABELS[profile.profileType]} ·{" "}
                {SPECIALTY_LABELS[profile.specialty]}
              </p>
              <p className="mt-1 text-xs text-faint">
                Membre depuis {formatMemberSince(profile.createdAt)}
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={onEdit} className="shrink-0">
            <PencilIcon className="h-4 w-4" />
            Modifier
          </Button>
        </div>
      </Card>

      <div className="mt-6 space-y-6">
        <ProfileSection icon={UsersIcon} title="Pratique">
          <StatRow
            label="Statut"
            value={PROFILE_TYPE_LABELS[profile.profileType]}
          />
          <StatRow
            label="Spécialité"
            value={SPECIALTY_LABELS[profile.specialty]}
          />
          <p className="mt-3 text-sm text-muted">
            {PROFILE_TYPE_DESCRIPTIONS[profile.profileType]}
          </p>
        </ProfileSection>

        <ProfileSection
          icon={FileTextIcon}
          title="Informations professionnelles"
        >
          <StatRow
            label="Numéro RPPS"
            value={profile.rppsNumber ?? "Non renseigné"}
            muted={!profile.rppsNumber}
          />
          <StatRow
            label="Ville principale"
            value={profile.city ?? "Non renseignée"}
            muted={!profile.city}
          />
        </ProfileSection>

        <ProfileSection
          icon={ShieldIcon}
          title="Visibilité"
          description={
            profile.isPublic
              ? "Votre profil apparaît dans l'annuaire public des professionnels de santé."
              : "Votre profil n'apparaît pas dans l'annuaire public."
          }
        >
          <StatRow
            label="Annuaire public"
            value={profile.isPublic ? "Visible" : "Masqué"}
            accent={profile.isPublic}
          />
        </ProfileSection>
      </div>
    </div>
  );
}
