import type { ComponentType, ReactNode, SVGProps } from "react";
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
import { StatRow } from "@/components/molecules/stat-row";
import { ProfileForm } from "@/components/organisms/profile-form";
import {
  EMPTY_PROFILE_FORM,
  formatMemberSince,
  PROFILE_TYPE_DESCRIPTIONS,
  PROFILE_TYPE_LABELS,
  type ProfileFormData,
  profileToFormValues,
  SPECIALTY_LABELS,
} from "@/lib/profile";
import type { ApiProfile } from "@/lib/types/api";

type Feedback = "created" | "saved" | null;
type SectionIcon = ComponentType<SVGProps<SVGSVGElement>>;

/** Card with tinted icon header — shared section layout of the view mode. */
function ProfileSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: SectionIcon;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
        >
          <Icon />
        </span>
        <div>
          <h2 className="text-base font-bold">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

/**
 * Profile page layout — three modes:
 * - `view` (default): read-only sections
 * - `edit`: pre-filled, cancellable form
 * - `create`: form for a profile-less account
 * Shell (navbar + footer) is provided by the (site) layout.
 */
export function ProfileView({
  mode,
  profile,
  userName,
  feedback,
  onEdit,
  onCancel,
  onSubmit,
}: {
  mode: "view" | "create" | "edit";
  profile: ApiProfile | null;
  userName: string;
  feedback: Feedback;
  onEdit: () => void;
  onCancel: () => void;
  /** Sends the payload to the API; returns an error message, or undefined on success. */
  onSubmit: (payload: ProfileFormData) => Promise<string | undefined>;
}) {
  if (mode === "create" || !profile) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Card className="p-6 sm:p-8">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Créez votre profil professionnel
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Renseignez votre spécialité et votre type de pratique pour publier
            des annonces et candidater.
          </p>

          <div className="mt-6">
            <ProfileForm
              initialValues={EMPTY_PROFILE_FORM}
              submitLabel="Créer mon profil"
              pendingLabel="Création du profil..."
              onSubmit={onSubmit}
            />
          </div>
        </Card>
      </div>
    );
  }

  if (mode === "edit") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Card className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Modifier le profil
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Mettez à jour vos informations, puis enregistrez.
              </p>
            </div>
            <Button variant="ghost" onClick={onCancel} className="shrink-0">
              Annuler
            </Button>
          </div>

          <div className="mt-6">
            <ProfileForm
              initialValues={profileToFormValues(profile)}
              submitLabel="Enregistrer les modifications"
              pendingLabel="Enregistrement..."
              onSubmit={onSubmit}
            />
          </div>
        </Card>
      </div>
    );
  }

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
