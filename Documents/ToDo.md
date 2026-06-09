# Clean du Projet — Conformité Règles Strictes React Native

## Résumé des Violations Trouvées

### 1. Fichiers `.web.tsx` à supprimer/fusionner dans `src/`

| Fichier                                                 | Action                                                                       |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/navigation/AppNavigator.web.tsx`                   | Fusionner dans `AppNavigator.tsx` (déjà un doublon de `WebAppNavigator.tsx`) |
| `src/components/CalendarButton.web.tsx`                 | Fusionner dans `CalendarButton.tsx` (si existe), sinon renommer              |
| `src/services/mocks/vector-icons/MaterialIcons.web.tsx` | Fusionner dans `MaterialIcons.tsx` (si existe), sinon renommer               |

### 2. Balises HTML interdites à remplacer par composants React Native

| Fichier                  | Violations                                                                      | Remplacement                                         |
| ------------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `AppNavigator.web.tsx`   | `<main>`                                                                        | `<View>`                                             |
| `WebAppNavigator.tsx`    | `<main>`                                                                        | `<View>`                                             |
| `HomeScreen.tsx`         | `<section>`, `<img>`, `<svg>`                                                   | `<View>`, `<Image>`, supprimer SVG inline            |
| `ServicesScreen.tsx`     | `<ul>`, `<li>`                                                                  | `<View>`, `<View>` avec bullet                       |
| `AdminAnnonces.tsx`      | `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>`, `<th>`, `<select>`, `<option>` | `<View>` pour table, `Picker` ou boutons pour select |
| `AdminCategories.tsx`    | `<table>`, `<tr>`, `<td>`, `<th>`, `<img>`, `<select>`, `<option>`              | Idem                                                 |
| `AdminUsers.tsx`         | `<table>`, `<tr>`, `<td>`, `<th>`, `<select>`, `<option>`                       | Idem                                                 |
| `AdminGalleryEditor.tsx` | `<img>`, `<ul>`, `<li>`, `<select>`, `<option>`                                 | `<Image>`, `<View>` + `<Text>`                       |

## Stratégie de Remplacement

### Tables → FlatList / View responsive

Les tables HTML `<table>/<tr>/<td>` seront remplacées par :

- **Desktop/Tablette** : une ligne `<View style={styles.row}>` avec `flexDirection: 'row'` par item
- **Mobile** : card `<View>` avec disposition verticale
- Géré via `useWindowDimensions` dans le même fichier

### `<select>/<option>` → Picker natif

Les `<select>` HTML seront remplacés par `Picker` de `@react-native-picker/picker` (déjà compatible Android/iOS/Web).

### `<img>` → `<Image>` de React Native

Remplacement direct par `<Image source={{ uri: ... }}>` avec `resizeMode`.

### `<svg>` inline → Composant SVG existant ou suppression

Le SVG inline dans `HomeScreen.tsx` (icône cœur) sera remplacé par un emoji ou composant `ServiceIcon`.

### `<main>` → `<View>`

Remplacement direct, les classes Tailwind restent identiques.

### `<ul>/<li>` → `<View>` + `<Text>`

Un bullet `•` en `<Text>` + `<Text>` pour le contenu, avec `flexDirection: 'row'`.

## Fichiers `.web.tsx` — Décision

- **`AppNavigator.web.tsx`** : Ce fichier est **identique** à `WebAppNavigator.tsx` (même contenu, même export `AppNavigator`). C'est une duplication pure. → **À supprimer** après avoir vérifié que `WebAppNavigator.tsx` est bien l'original utilisé.
- **`CalendarButton.web.tsx`** : Vérifier si `CalendarButton.tsx` existe. Si oui, fusionner. Sinon, renommer en `CalendarButton.tsx`.
- **`MaterialIcons.web.tsx`** : Vérifier si `MaterialIcons.tsx` existe. Sinon, renommer en `MaterialIcons.tsx`.

## Open Questions

> [!IMPORTANT] > **`@react-native-picker/picker`** : Est-ce que cette dépendance est déjà installée dans le projet ? Si non, elle sera nécessaire pour remplacer les `<select>` dans les formulaires admin. Sinon, les selects seront remplacés par des boutons toggle natifs.

> [!WARNING] > **`AppNavigator.web.tsx` vs `WebAppNavigator.tsx`** : Ces deux fichiers sont quasi-identiques. Lequel est utilisé en production par `index.web.ts` ? Le non-utilisé sera supprimé.

## Proposed Changes

### Fichiers `.web.tsx` à supprimer / renommer

#### [DELETE] `src/navigation/AppNavigator.web.tsx`

Doublon de `WebAppNavigator.tsx`.

#### [MODIFY] `src/components/CalendarButton.web.tsx` → renommer en `CalendarButton.tsx`

#### [MODIFY] `src/services/mocks/vector-icons/MaterialIcons.web.tsx` → renommer en `MaterialIcons.tsx`

---

### Navigation

#### [MODIFY] [WebAppNavigator.tsx](file:///Users/mohamedbenkhedher/Documents/GitHub/Plombier/src/navigation/WebAppNavigator.tsx)

- Remplacer `<main>` → `<View>`

---

### Screens

#### [MODIFY] [HomeScreen.tsx](file:///Users/mohamedbenkhedher/Documents/GitHub/Plombier/src/features/plombier/screens/HomeScreen.tsx)

- Remplacer `<section>` → `<View>`
- Remplacer `<img>` → `<Image source={{ uri: ... }}>`
- Supprimer `<svg>` inline (icône cœur) → remplacer par `<Text>` emoji ♥

#### [MODIFY] [ServicesScreen.tsx](file:///Users/mohamedbenkhedher/Documents/GitHub/Plombier/src/features/plombier/screens/ServicesScreen.tsx)

- Remplacer `<ul>` → `<View>`
- Remplacer `<li>` → `<View style={{ flexDirection: 'row', gap: 6 }}>` + `<Text>•</Text>` + `<Text>`

#### [MODIFY] [AdminAnnonces.tsx](file:///Users/mohamedbenkhedher/Documents/GitHub/Plombier/src/features/plombier/screens/AdminAnnonces.tsx)

- Remplacer `<table>/<thead>/<tbody>/<tr>/<td>/<th>` → `<View>` responsive (header row + data rows)
- Remplacer `<select>/<option>` → `Picker` ou boutons toggle

#### [MODIFY] [AdminCategories.tsx](file:///Users/mohamedbenkhedher/Documents/GitHub/Plombier/src/features/plombier/screens/AdminCategories.tsx)

- Idem table → View responsive
- `<img>` → `<Image>`
- `<select>` → Picker

#### [MODIFY] [AdminUsers.tsx](file:///Users/mohamedbenkhedher/Documents/GitHub/Plombier/src/features/plombier/screens/AdminUsers.tsx)

- Idem table → View responsive
- `<select>` → Picker

#### [MODIFY] [AdminGalleryEditor.tsx](file:///Users/mohamedbenkhedher/Documents/GitHub/Plombier/src/features/plombier/screens/AdminGalleryEditor.tsx)

- `<img>` → `<Image>`
- `<ul>/<li>` → `<View>` + `<Text>`
- `<select>` → Picker

## Verification Plan

### Automated Tests

- `npx tsc --noEmit` — Vérifier qu'il n'y a pas d'erreurs TypeScript après les changements
- `grep -r "<div\|<span\|<p\|<h[1-6]\|<section\|<article\|<header\|<footer\|<main\|<aside\|<ul\|<li\|<table\|<tr\|<td" src/` — Vérifier qu'il ne reste aucune balise HTML

### Manual Verification

- Lancer le projet et vérifier que tous les écrans s'affichent correctement sur Web et Mobile
- Tester les formulaires admin (création/modification/suppression d'annonces, catégories, utilisateurs, galerie)
