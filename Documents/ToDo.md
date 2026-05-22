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

## A Faire / TODO
-ajouter ces pages :
    1-la Informations
    2-Politique de confidentialité
    3-Conditions d'utilisation
- Decouper `AppNavigator.web.tsx` en composants partages web/mobile.
- Garder les nouveaux fichiers sous 300 lignes.
- Migrer Services, Zones, Marketplace, AdminProfile et AdminAnalytics vers `src/features/plombier`.
- Remplacer le state local durable par Redux persist.
- Supprimer le code inutilise apres migration.
- Verifier web et mobile apres chaque tranche.
- verifier migration.md aussi
 