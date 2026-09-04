# Kineo — Frontend Next.js

Interface publique et console membre de la plateforme de remplacement médical Kineo.

## Commandes

```bash
bun install        # installer les dépendances (packageManager: bun)
bun run dev        # serveur de développement (port 3001)
bun run build      # build de production (type-check + compilation Next.js)
bun run lint       # lint + format check (Biome)
bun run format     # format automatique (Biome)
```

## Architecture

Conforme à l'Atomic Design — chaque dossier de `src/components` n'importe que
depuis les niveaux inférieurs ou égaux :

- `atoms/` — primitives visuelles sans logique métier (Button, Card, Spinner, icônes…)
- `molecules/` — assemblages d'atomes (HeaderNav, LoadingState, StatusCard…)
- `organisms/` — blocs autonomes pilotés par les données (SiteHeader, ProfileForm…)
- `templates/` — mise en page et conteneurs « orchestrateurs » (chargement/erreur/données)

Les pages (App Router) `src/app/` sont des coquilles le plus fines possible ;
la logique d'orchestration vit dans `src/components/templates/`.

### Server / Client Components

- Les pages publiques, `error.tsx`, `not-found.tsx` et les layouts statiques
  restent des Server Components.
- Seuls les éléments interactifs portent `"use client"` : authentification,
  formulaires, header (session), conteneurs qui chargent des données.

### Couche de services (`src/lib`)

Les composants ne parlent jamais au backend directement :

- `api-client.ts` — fetch partagé, `ApiError` typé, `notFoundAs` (404 attendus), `extractList`
- `*‑service.ts` — appels API + adaptation vers les types de présentation (`dashboard-service`, `profile-service`)
- Types bruts de l'API dans `types/api.ts` ; types de présentation dans `dashboard.ts` / `profile.ts`
- Constantes et libellés français dans des modules dédiés (`marketing.ts`, `navigation.ts`, `auth-errors.ts`, `format.ts`)

### Conventions

- Routes en anglais dans le code (convention projet), libellés affichés en français
- Les contenus éditoriaux sont séparés des composants (`lib/marketing.ts`)
- Erreurs API mappées en messages français dans `lib/auth-errors.ts` / `lib/profile-service.ts`
- Le thème vit dans `src/app/globals.css` (variables CSS + Tailwind 4)
