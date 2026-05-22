# ToDo - Plombier Tunisie / Wallet

## Fait

- Corriger le bloc noir en light mode sur le web.
- Ajouter le cycle langue `FR -> AR -> EN`.
- Ajouter `ServiceIcon` et remplacer les emojis services.
- Ajouter le bouton `Voir tout`.
- Ajouter les cles de traduction web services/admin.
- Ajouter edition email admin et WhatsApp support avec validation.
- Ajouter edition du titre public et des annees d'experience par admin.
- Ajouter villes couvertes + bouton WhatsApp support dans Zones.
- Ajouter donnees supplementaires dans Analytics admin.
- Persister la session web dans Redux auth pour eviter la deconnexion au refresh.
- Mettre a jour README et documents projet.
- ✅ ajouter ces pages :
    1-la Informations
    2-Politique de confidentialité
    3-Conditions d'utilisation
    4-Plan du site
- ✅ Implémentation partagée native/web pour les écrans légaux avec `LegalScreen` et `LegalContent`.
- ✅ wire gallery screens into navigation et accessibilité via header + footer
- ✅ Gestion web galerie : ajout, modification, suppression et validation des formulaires.
- ✅ Titre web dynamique synchronisé avec `PlombierSettingsState.businessName`.
- ✅ les catégories contiennent une image : ajout de l'upload photo de catégorie
- ✅ ajouter une rubrique utilisateur pour galerie photo réelle avec titre, sous-titre, description et upload administrateur

## A Faire / TODO

- Decouper `AppNavigator.web.tsx` en composants partages web/mobile (max de ce file 300ligne aussi).
- Garder les nouveaux fichiers sous 300 lignes.
- Migrer Services, Zones, Marketplace, AdminProfile et AdminAnalytics vers `src/features/plombier`.
- Remplacer le state local durable par Redux persist.
- Supprimer le code inutilise apres migration.
- Verifier web et mobile apres chaque tranche.



 