"use client";

import type { ComponentProps, KeyboardEvent } from "react";
import { useState } from "react";

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
          <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
          <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
          <path d="m2 2 20 20" />
        </>
      )}
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 20h16a2 2 0 0 0 1.73-2" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function PasswordInput({
  className = "",
  onKeyDown,
  onKeyUp,
  onBlur,
  onInput,
  ...props
}: ComponentProps<"input">) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const syncCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(event.getModifierState("CapsLock"));
  };

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`field-input pr-14 ${className}`}
        onKeyDown={(event) => {
          syncCapsLock(event);
          onKeyDown?.(event);
        }}
        onKeyUp={(event) => {
          syncCapsLock(event);
          onKeyUp?.(event);
        }}
        onBlur={(event) => {
          setCapsLock(false);
          onBlur?.(event);
        }}
        onInput={onInput}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={
          visible ? "Masquer le mot de passe" : "Afficher le mot de passe"
        }
        className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:text-foreground"
      >
        <EyeIcon open={visible} />
      </button>

      {capsLock && (
        <output className="mt-1.5 flex items-center gap-1.5 text-xs text-warning">
          <AlertIcon />
          Verr. Maj activé : les lettres seront en majuscules
        </output>
      )}
    </div>
  );
}
