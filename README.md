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

### Rendu serveur / client (RSC)

- La page d'accueil est un **Server Component** : la session est validée côté
  serveur (`lib/server-session.ts` → proxy `/api/auth/get-session`) et la page
  sert soit la console membre, soit le contenu marketing — sans hydratation du
  contenu public ni flash après hydratation. Les pages marketing, `error.tsx`,
  `not-found.tsx` et le layout `(site)` restent des Server Components.
- Seuls les éléments interactifs portent `"use client"` : authentification,
  formulaires, header (session/active route), conteneurs qui chargent des données.
- Le proxy Next 16 (`src/proxy.ts`, ex-middleware) fait un contrôle optimiste
  du cookie de session (`getSessionCookie`) sur `/profile`, `/dashboard`,
  `/settings` ; la validation réelle est faite par le backend à chaque appel API.

### Couche de services (`src/lib`)

Les composants ne parlent jamais au backend directement :

- `api-client.ts` — fetch partagé, `ApiError` typé, `notFoundAs` (404 attendus), `extractList`
- `dashboard/` — service + contrats de présentation + un adaptateur par section
  (`greeting`, `actions`, `stats`, `activity`, `reactivity`) ; point d'entrée `@/lib/dashboard`
- `profile-service.ts` / `profile.ts` — appels API profil et contrats/labels/validations
- Types bruts de l'API dans `types/api.ts` ; types de présentation dans `dashboard/contracts.ts` / `profile.ts`
- Constantes et libellés français dans des modules dédiés (`marketing.ts`, `navigation.ts`, `auth-errors.ts`, `format.ts`)

### Auth & cookies

- Better-Auth vit dans le backend (`kineo-nest-backend/src/lib/auth.ts`) avec
  les défauts de la lib : `better-auth.session_token` (+ `better-auth.session_data`,
  cache signé 5 min). Le frontend n'a **pas** besoin de `BETTER_AUTH_SECRET`
  (les noms sont documentés dans `lib/auth.ts`).
- Côté serveur, la session est résolue en validant les cookies via le proxy
  (`lib/server-session.ts`) ; côté client via `lib/auth-client.ts` (`useSession`…).
- Les erreurs d'auth sont mappées en messages français dans `lib/auth-errors.ts`.

### Utilitaires UI

- `lib/cn.ts` (`tailwind-merge`) — fusion de classes Tailwind avec résolution
  des conflits (le dernier gagne). À utiliser pour toute prop `className` d'un
  composant (voir `Card`, `Button`, `InlineAlert`…).

### Performance

- **Session serveur** (`lib/server-session.ts`) : requêtes anonymes
  court-circuitées avant tout appel réseau (`getSessionCookie`), validation
  directe serveur-à-serveur vers le backend (pas de self-fetch via le proxy),
  déduplication par render pass via React `cache()`.
- **Streaming** : `app/(site)/loading.tsx` streame le shell instantanément sur
  la route dynamique `/` et la rend partiellement préfetchable par `<Link>`.
- **Polices** : `next/font` auto-héberge la police (zéro requête externe,
  préchargement, `display: swap` par défaut).
- **Aucune image bitmap** : les icônes sont des SVG inline ; si des images
  arrivent, utiliser `next/image`.
- Prochaines étapes possibles : activer `cacheComponents: true` (PPR + `use cache`,
  shell statique + contenu dynamique streame), servir le header via RSC
  (supprimerait le `useSession` client — nécessite PPR pour garder les autres
  routes statiques), mesurer les Web Vitals (`useReportWebVitals`).

### Conventions

- Routes en anglais dans le code (convention projet), libellés affichés en français
- Les contenus éditoriaux sont séparés des composants (`lib/marketing.ts`)
- Erreurs API mappées en messages français dans `lib/auth-errors.ts` / `lib/profile-service.ts`
- Le thème vit dans `src/app/globals.css` (variables CSS + Tailwind 4)
