import { EMAIL_MAX_LENGTH } from "@/lib/auth-validation";

export interface EmailFieldProps {
  /** Optional id + htmlFor pair (used when a label ref is needed). */
  id?: string;
  name?: string;
}

/** Email form field — shared by the auth forms (signin, signup, forgot-password). */
export function EmailField({ id, name = "email" }: EmailFieldProps) {
  return (
    <label className="flex flex-col gap-2" htmlFor={id}>
      <span className="field-label">Adresse e-mail</span>
      <input
        name={name}
        id={id}
        type="email"
        required
        autoComplete="email"
        maxLength={EMAIL_MAX_LENGTH}
        placeholder="jean.dupont@exemple.fr"
        className="field-input"
      />
    </label>
  );
}
