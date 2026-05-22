# Plombier - Presentation Commerciale

## Positionnement

**Plombier ** est une application de gestion financière personnelle concue pour aider les utilisateurs a comprendre leur argent au quotidien: depenses, revenus, comptes, factures recurrentes, budgets et objectifs d'epargne.

Le produit cible les utilisateurs qui veulent une experience simple, rapide et elegante, sans devoir manipuler un tableur ou une application bancaire trop complexe.

## Proposition de valeur

Plombier centralise les gestes essentiels:

- enregistrer une depense en quelques secondes;
- visualiser la liquidite totale;
- suivre les comptes cash, banque, carte et epargne;
- recevoir des alertes sur les factures en retard;
- analyser les habitudes de depense;
- suivre des objectifs comme voyage, materiel, fonds d'urgence ou cadeau important.

## Differenciateurs

- **Une seule base de code** pour Web, iOS et Android.
- **Experience offline-first** grace a MMKV/localStorage.
- **Design premium** adapte a la finance personnelle.
- **Navigation adaptee**: tabs sur web, drawer sur mobile.
- **Confidentialite visuelle** avec masquage global des soldes.
- **Internationalisation** avec francais, anglais, arabe, allemand, espagnol, chinois, hindi, turc et italien.

## Modules Produit

### Tableau de Bord

Le tableau de bord affiche la liquidite totale, les factures en retard, les raccourcis de saisie rapide et les dernieres transactions.

### Historique

L'utilisateur peut rechercher, filtrer et consulter ses transactions groupees par jour.

### Rapports

Les rapports donnent une lecture claire du cash flow, de la repartition des depenses, de la velocite de depense et de l'etat des budgets.

### Comptes

Les comptes representent les poches d'argent: especes, banque, carte de credit et epargne. Les factures recurrentes peuvent etre marquees comme payees depuis cette page.

### Objectifs

Les objectifs permettent de suivre la progression vers une cible financiere et de celebrer les objectifs atteints.

### Profil

Le profil regroupe les preferences d'affichage, devise, masquage des soldes, notifications, raccourcis, export CSV et reinitialisation des donnees.

## Public Cible

- Etudiants et jeunes actifs qui veulent suivre leurs depenses.
- Familles qui veulent maitriser les budgets mensuels.
- Freelances qui veulent separer revenus, depenses et epargne.
- Utilisateurs multi-devises ou mobiles qui veulent une app rapide et simple.

## Modele de Montee en Gamme

Une version premium peut inclure:

- synchronisation cloud multi-appareils;
- pieces jointes et recus illimites;
- budgets avances par categorie;
- prediction de fin de mois;
- export avance;
- widgets mobiles;
- alertes intelligentes.

## Arguments Techniques

- React Native Web et React Native avec une seule base de code partagee.
- Composants decomposes, reutilisables web/mobile, avec une limite cible de 300 lignes par fichier.
- Redux Toolkit pour un etat predictible et une session restaurable.
- redux-persist pour conserver session, profil, wallet, favoris, annonces, categories et support WhatsApp.
- Firebase Analytics et Notifee pour analytics et notifications.
- NativeWind pour une UI coherente et maintenable.

## Engagement Qualite

- Le web ne doit plus dependre d'un seul fichier contenant toute l'application.
- Le rendu web valide doit etre conserve pendant la migration.
- Les memes composants doivent fonctionner sur mobile quand la feature est partagee.
- Les refresh web et relances mobile ne doivent pas deconnecter l'utilisateur.
