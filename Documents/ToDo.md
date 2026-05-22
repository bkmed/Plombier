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

## A Faire

- Decouper `AppNavigator.web.tsx` en composants partages web/mobile.
- Garder les nouveaux fichiers sous 300 lignes.
- Migrer Services, Zones, Marketplace, AdminProfile et AdminAnalytics vers `src/features/plombier`.
- Remplacer le state local durable par Redux persist.
- Supprimer le code inutilise apres migration.
- Verifier web et mobile apres chaque tranche.

 Update heading and subtitle in AppNavigator.web.tsx (Nos Services)

 Add "Voir tout" link/button after services grid

 Create ServiceIcon component and SVG assets

 Replace emoji divs with ServiceIcon in services cards

 Adjust navbar spacing near language toggle

 Add new translation keys (nos_services, nos_services_subtitle, voir_tout) for FR and EN

 Update admin profile screen to allow editing email and phone

 Update admin analytics screen to include additional data

 Verify UI changes on web build

 Commit and run tests

 Ensure all new components use Tailwind utility classes

 Add dark mode variants for new styles

 Implement client‑side validation for admin email and phone fields

 Review and adjust touch target size for language toggle button

 Update README with new UI changes and translation keys

 Add English translation keys for new UI strings (services_title, services_subtitle, view_all, admin_edit_email, admin_edit_phone)

 Add SVG assets for ServiceIcon component

 Write unit tests for ServiceIcon and new components

 Run lint and fix any issues


 
