# Migration Technique - Web Monolith vers App Partagee

## Objectif

Le rendu web Plombier Tunisie doit rester identique fonctionnellement, mais le code ne doit plus vivre dans un seul fichier `AppNavigator.web.tsx`. La cible est une application React Native / React Native Web partagee.

## Principes

- Un composant ou fichier refactore ne doit pas depasser 300 lignes.
- Les composants doivent utiliser React Native primitives quand ils doivent tourner web/mobile.
- Les differences platformes restent dans des wrappers fins: liens web, navigation shell, integrations natives.
- La logique metier et les donnees doivent etre dans Redux, hooks partages ou modules purs.
- Les nouveaux styles utilisent NativeWind/Tailwind utilities avec variantes light/dark.

## Decoupage Cible

```text
src/features/plombier/
  components/
    AppShell.tsx
    BrandLogo.tsx
    LanguageToggle.tsx
    ServiceIcon.tsx
    MetricCard.tsx
    ContactButton.tsx
  screens/
    HomeScreen.tsx
    ServicesScreen.tsx
    ZonesScreen.tsx
    MarketplaceScreen.tsx
    ProfileScreen.tsx
    PaymentScreen.tsx
  admin/
    AdminDashboardScreen.tsx
    AdminListingsScreen.tsx
    AdminCategoriesScreen.tsx
    AdminUsersScreen.tsx
    AdminProfileScreen.tsx
    AdminAnalyticsScreen.tsx
  hooks/
    usePlombierSession.ts
    useSupportContact.ts
  data/
    translations.ts
    coverageCities.ts
```

## Redux Persist

La session ne doit pas dependre uniquement d'un `useState` local.

- `auth.user` persiste l'utilisateur courant.
- `users.items` persiste les utilisateurs demo/admin.
- `parts`, `categories`, `wallet`, `goals` et autres slices restent persistants.
- Les donnees support admin doivent etre stockees dans Redux ou rattachees au profil admin persiste.

## Etapes

1. Stabiliser le web actuel: light mode, langues, support WhatsApp, session Redux.
2. Extraire les donnees statiques: services, villes, metrics, traductions locales.
3. Extraire les composants visuels: shell, navbar, service cards, zone cards, admin cards.
4. Migrer chaque tab web vers un ecran partage React Native.
5. Supprimer les blocs du monolithe au fur et a mesure.
6. Supprimer le code mort et les imports inutilises.

## Acceptance

- `npm run lint` passe.
- `npm test` passe.
- `npx tsc --noEmit` passe.
- `npm run verify-translations` passe.
- `npm run webpack-web-prod` passe.
- Refresh web conserve la session.
- Les ecrans partages fonctionnent web et mobile.
- Ajout des pages légales `Informations`, `Politique de confidentialité`, `Conditions d'utilisation` et `Plan du site` dans la navigation web.
