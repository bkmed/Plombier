# Plombier Wallet - To Do

## Priorite Haute

- Finaliser les modals fonctionnelles:
  - `AddGoalModal`
  - `AddAccountModal`
  - `EditShortcutModal`
- Ajouter un vrai formulaire d'edition de transaction.
- Ajouter un vrai selecteur de compte dans `AddTransactionSheet`.
- Completer le flow transfer entre deux comptes.
- Ajouter la logique de remboursement/annulation d'une transaction sur le solde.
- Verifier les interactions swipe mobile et hover web de `TransactionRow`.

## Produit

- Ajouter des categories personnalisables.
- Ajouter des budgets editables depuis le profil.
- Ajouter un calendrier de factures.
- Ajouter des recus avec image picker sur native.
- Ajouter l'import CSV.
- Ajouter un onboarding utilisateur.
- Ajouter une page vide plus riche pour un nouvel utilisateur.

## UI

- Raffiner les gradients sur les cartes balance et comptes.
- Harmoniser les modals web et mobile.
- Ajouter les etats loading, empty, error sur chaque page.
- Verifier les espacements mobile petits ecrans.
- Ajouter les polices Manrope/Inter dans le setup web si necessaire.

## i18n

- Completer les traductions natives pour `ar`, `de`, `es`, `zh`, `hi`, `tr`, `it`.
- Ajouter la gestion RTL arabe complete.
- Remplacer les labels hardcodes restants dans les nouveaux ecrans.

## Qualite

- Ajouter tests unitaires pour `walletSlice` et `goalsSlice`.
- Ajouter tests Cypress pour login, quick log, pay bill, hide balances.
- Ajouter tests TypeScript dans CI.
- Nettoyer les anciens tests metier ou les migrer vers wallet.

## Verification

```bash
npx tsc --noEmit
npm run start-web-dev-nossr
npm start
```
