"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { MailIcon, PencilIcon } from "@/components/atoms/icons";
import { InlineAlert } from "@/components/molecules/inline-alert";
import { SubmitButton } from "@/components/molecules/submit-button";
import type { ApiUser } from "@/lib/types/api";
import { changeEmail, mapUserError, updateUserInfo } from "@/lib/user-service";

export function UserInfoFields({ user }: { user: ApiUser }) {
  const router = useRouter();
  const [editing, setEditing] = useState<"name" | "email" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleNameSubmit(formData: FormData) {
    setError("");
    setSuccess("");
    const name = (formData.get("name") as string).trim();
    const image = (formData.get("image") as string).trim() || null;

    try {
      await updateUserInfo({ name, image });
      setSuccess("Informations mises à jour.");
      setEditing(null);
      router.refresh();
    } catch (err) {
      setError(mapUserError(err));
    }
  }

  async function handleEmailSubmit(formData: FormData) {
    setError("");
    setSuccess("");
    const newEmail = (formData.get("email") as string).trim();

    try {
      const { message } = await changeEmail(newEmail);
      setSuccess(message);
      setEditing(null);
      router.refresh();
    } catch (err) {
      setError(mapUserError(err));
    }
  }

  return (
    <div className="space-y-3">
      {success && (
        <InlineAlert as="p" tone="success" className="text-sm">
          {success}
        </InlineAlert>
      )}
      {editing === "email" ? (
        <form
          action={handleEmailSubmit}
          className="flex flex-col gap-2 rounded-lg bg-surface-2 p-3"
        >
          <label className="flex flex-col gap-1.5">
            <span className="field-label">Nouvel email</span>
            <input
              name="email"
              type="email"
              required
              defaultValue={user.email}
              autoComplete="email"
              placeholder="jean.dupont@exemple.fr"
              className="field-input"
            />
          </label>
          {error && (
            <InlineAlert as="p" tone="danger">
              {error}
            </InlineAlert>
          )}
          <div className="flex gap-2">
            <SubmitButton label="Envoyer" pendingLabel="Envoi…" />
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditing(null)}
            >
              Annuler
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between gap-4 rounded-lg bg-surface-2 px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-xs text-muted">Email</p>
            <p className="truncate text-sm font-medium">{user.email}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => {
              setEditing("email");
              setSuccess("");
            }}
          >
            <MailIcon className="h-3.5 w-3.5" />
            Changer
          </Button>
        </div>
      )}

      {editing === "name" ? (
        <form
          action={handleNameSubmit}
          className="flex flex-col gap-2 rounded-lg bg-surface-2 p-3"
        >
          <label className="flex flex-col gap-1.5">
            <span className="field-label">Nom complet</span>
            <input
              name="name"
              type="text"
              required
              defaultValue={user.name ?? ""}
              autoComplete="name"
              placeholder="Dr Jean Dupont"
              className="field-input"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="field-label">Image (URL)</span>
            <input
              name="image"
              type="url"
              defaultValue={user.image ?? ""}
              placeholder="https://exemple.fr/photo.jpg"
              className="field-input"
            />
          </label>
          {error && (
            <InlineAlert as="p" tone="danger">
              {error}
            </InlineAlert>
          )}
          <div className="flex gap-2">
            <SubmitButton label="Enregistrer" pendingLabel="En cours…" />
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditing(null)}
            >
              Annuler
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between gap-4 rounded-lg bg-surface-2 px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-xs text-muted">Nom</p>
            <p className="truncate text-sm font-medium">
              {user.name ?? "Non renseigné"}
            </p>
            {user.image && (
              <p className="truncate text-xs text-faint">{user.image}</p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => {
              setEditing("name");
              setSuccess("");
            }}
          >
            <PencilIcon className="h-3.5 w-3.5" />
            Modifier
          </Button>
        </div>
      )}
    </div>
  );
}
