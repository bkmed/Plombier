# Migration Plombier vers Plombier Wallet

## Objectif

Transformer l'ancienne base applicative en application wallet personnelle, tout en conservant l'infrastructure technique robuste du projet:

- `App.tsx`
- AuthContext
- ThemeProvider
- ToastProvider
- ModalProvider
- React Navigation
- Redux Toolkit + redux-persist
- abstraction de stockage MMKV/localStorage
- Firebase analytics et notifications

## Changements Realises

### Store

Le double-store a ete supprime. Le store principal est maintenant `src/store/index.ts`.

Reducers wallet ajoutes:

- `wallet`
- `goals`

Le reducer `wallet` gere:

- transactions;
- comptes;
- factures recurrentes;
- parametres wallet;
- raccourcis de saisie.

Le reducer `goals` gere:

- objectifs actifs;
- objectifs termines;
- progression;
- ajout de fonds.

### Navigation

La navigation a ete reduite a six routes principales:

- Home
- History
- Reports
- Accounts
- Goals
- Profile

Sur web, ces routes sont affichees en bottom tabs. Sur mobile, elles sont affichees en drawer.

### Modules Supprimes

Les anciens modules metier non lies au wallet ont ete retires de la navigation, des ecrans, des slices Redux et des wrappers database.

### Nouveaux Composants

- `TopAppBar`
- `TransactionRow`
- `AddTransactionSheet`
- `AddGoalModal`
- `AddAccountModal`
- `EditShortcutModal`

### Services

`analyticsService` expose maintenant:

- `trackWalletScreen`
- `trackTransactionAdded`

`notificationService` expose maintenant:

- `createWalletChannels`
- `scheduleBillReminder`
- `sendBudgetAlert`

`rbacService` a ete simplifie pour le wallet: tous les roles authentifies accedent aux pages wallet principales.

## Etat Actuel

Compile:

```bash
npx tsc --noEmit
```

Serveur web:

```bash
npm run start-web-dev-nossr
```

## Points Restants

- Les modals `AddGoalModal`, `AddAccountModal` et `EditShortcutModal` sont branchees mais doivent etre completees.
- Les traductions non francaises/non anglaises doivent etre enrichies.
- Les anciens tests metier doivent etre remplaces par des tests wallet.
- Les flows image receipt, CSV web download et partage natif doivent etre finalises.
