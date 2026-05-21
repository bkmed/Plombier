# Cahier des Charges - Plombier Wallet

## 1. Contexte

Plombier Wallet est une application de finance personnelle cross-platform. Elle permet a un utilisateur de suivre ses comptes, ses transactions, ses factures recurrentes, ses budgets et ses objectifs d'epargne depuis le web, iOS et Android.

Le projet conserve une seule base de code React Native / React Native Web afin de reduire les couts de maintenance et garantir une experience coherente.

## 2. Objectifs

- Offrir une vue claire de la liquidite totale.
- Permettre l'ajout rapide d'une depense ou d'un revenu.
- Suivre plusieurs comptes: especes, banque, carte de credit, epargne.
- Gerer les factures recurrentes et les retards.
- Visualiser les rapports mensuels.
- Suivre des objectifs d'epargne.
- Fonctionner sur web et mobile avec les memes fichiers `.tsx`.
- Conserver les donnees localement via redux-persist.

## 3. Plateformes

- Web
- iOS
- Android

## 4. Stack Technique

- React 19
- React Native 0.82
- React Native Web
- React Navigation 7
- Redux Toolkit
- redux-persist
- MMKV sur mobile
- localStorage sur web
- NativeWind / Tailwind
- i18next
- Firebase Analytics
- Notifee

## 5. Architecture

### 5.1 Application

`App.tsx` conserve la chaine de providers:

- Redux Provider
- PersistGate
- ThemeProvider
- AuthProvider
- ToastProvider
- ModalProvider
- SafeAreaProvider
- AppNavigator

### 5.2 Navigation

Routes principales:

- Home
- History
- Reports
- Accounts
- Goals
- Profile

Web:

- bottom tabs.

Mobile:

- drawer navigation.

Modals:

- AddTransactionSheet
- AddGoalModal
- AddAccountModal
- EditShortcutModal

### 5.3 Store

Slices principaux:

- `auth`
- `wallet`
- `goals`
- `notifications`
- `messages`
- `currencies`
- `analytics`
- `users`

## 6. Fonctionnalites

### 6.1 Home

- Message de salutation.
- Carte de liquidite totale.
- Masquage/affichage des soldes.
- Alertes de factures en retard.
- Raccourcis de depense rapide.
- Liste des transactions recentes.
- Bouton flottant d'ajout de transaction.

### 6.2 History

- Recherche locale.
- Filtres visuels.
- Transactions groupees par jour.
- Totaux depense/revenu par groupe.
- Suppression et edition via `TransactionRow`.

### 6.3 Reports

- Cash flow mensuel.
- Repartition des depenses.
- Velocite de depense.
- Budgets actifs.
- Export CSV.

### 6.4 Accounts

- Cartes de comptes.
- Soldes masquables.
- Factures recurrentes.
- Paiement d'une facture avec creation automatique d'une transaction.

### 6.5 Goals

- Objectif principal mis en avant.
- Objectif a faible progression.
- Grille des objectifs actifs.
- Section des objectifs termines.

### 6.6 Profile

- Informations utilisateur.
- Langue.
- Devise.
- Masquage des soldes.
- Notifications.
- Raccourcis.
- Export CSV.
- Reset des donnees.
- Deconnexion.

## 7. Donnees

### Transaction

- type: expense, income, transfer
- amount
- label
- category
- emoji
- accountId
- date
- time
- note
- tags
- status

### Account

- name
- type
- emoji
- color
- balance
- currency
- creditLimit
- dueDate

### Goal

- name
- emoji
- targetAmount
- currentAmount
- deadline
- color
- isCompleted

## 8. Roles

### Guest

- Acces a l'authentification.

### User

- Acces complet au wallet personnel.

### Premium

- Meme base que User, avec futures fonctions avancees.

### Admin

- Acces complet pour demonstration, support ou futures fonctions de gestion.

## 9. Exigences Non Fonctionnelles

- Une seule base de code.
- Pas de nouveau package npm sans validation.
- NativeWind pour les nouveaux ecrans.
- Donnees persistantes localement.
- Analytics gardees derriere `Platform.OS !== 'web'`.
- UI responsive.
- Accessibilite minimale: labels lisibles, contrastes corrects, actions tactiles suffisantes.

## 10. Critere d'Acceptation

- `npx tsc --noEmit` passe.
- Le web demarre avec `npm run start-web-dev-nossr`.
- Les six routes wallet sont visibles.
- Une transaction peut etre ajoutee.
- Une facture peut etre marquee payee.
- Le masquage des soldes fonctionne partout.
- Les objectifs sont affiches.
- Les anciens modules metier ne sont plus references par la navigation.
