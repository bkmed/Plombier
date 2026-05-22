# Plombier Tunisie  - Pages and Roles

## Roles

| Role | Description |
| :--- | :--- |
| Guest | Utilisateur non connecte ou visiteur. |
| User | Utilisateur connecte avec wallet personnel, marketplace et favoris. |
| Premium | Future extension pour fonctions avancees. |
| Admin | Role de demonstration/support avec acces complet aux outils de gestion. |

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
| Services | Oui | Oui | Oui | Oui |
| Zones | Oui | Oui | Oui | Oui |
| Marketplace | Oui | Oui | Oui | Oui |
| AdminProfile | Non | Non | Non | Oui |
| AdminAnalytics | Non | Non | Non | Oui |
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

### Services

Prestations plomberie, climatisation, gaz et chauffage. Les cartes utilisent des composants partages et `ServiceIcon`.

### Zones

Villes couvertes, intervention urgente et WhatsApp support configurable.

### Marketplace

Catalogue de pieces d'occasion, filtres, favoris et contact.

### AdminProfile

Edition du titre public du site, des annees d'experience, de l'email admin et du WhatsApp support avec validation client et persistence Redux.

### AdminAnalytics

Revenus, services, regions, leads, taux de conversion et alertes stock.

## Regles RBAC

La version wallet actuelle est volontairement simple:

- Guest accede aux pages publiques et a l'authentification.
- Tout utilisateur authentifie accede aux pages wallet et aux fonctions user.
- Admin accede aux pages de gestion.
- Premium reste reserve aux evolutions futures.
