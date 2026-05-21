# Plombier Wallet - Pages and Roles

## Roles

| Role | Description |
| :--- | :--- |
| Guest | Utilisateur non connecte. |
| User | Utilisateur connecte avec wallet personnel. |
| Premium | Future extension pour fonctions avancees. |
| Admin | Role de demonstration/support avec acces complet. |

## Matrice d'Acces

| Page | Guest | User | Premium | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Login | Oui | Non | Non | Non |
| Sign Up | Oui | Non | Non | Non |
| Forgot Password | Oui | Non | Non | Non |
| Home | Non | Oui | Oui | Oui |
| History | Non | Oui | Oui | Oui |
| Reports | Non | Oui | Oui | Oui |
| Accounts | Non | Oui | Oui | Oui |
| Goals | Non | Oui | Oui | Oui |
| Profile | Non | Oui | Oui | Oui |
| AddTransactionSheet | Non | Oui | Oui | Oui |
| AddGoalModal | Non | Oui | Oui | Oui |
| AddAccountModal | Non | Oui | Oui | Oui |
| EditShortcutModal | Non | Oui | Oui | Oui |

## Pages Principales

### Home

Dashboard quotidien: liquidite, alertes, quick log et activite recente.

### History

Historique des transactions avec recherche, filtres visuels et regroupement par jour.

### Reports

Analyse financiere: cash flow, repartition, budgets et export.

### Accounts

Gestion des comptes et factures recurrentes.

### Goals

Suivi des objectifs d'epargne actifs et termines.

### Profile

Preferences, raccourcis, export, reset et deconnexion.

## Regles RBAC

La version wallet actuelle est volontairement simple:

- Guest accede uniquement aux pages d'authentification.
- Tout utilisateur authentifie accede aux pages wallet.
- Premium et Admin sont reserves aux evolutions futures.
