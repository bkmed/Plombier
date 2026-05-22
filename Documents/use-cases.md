# Plombier  - Use Cases

## UC-01 - Se connecter

**Acteur:** utilisateur  
**Objectif:** acceder a son wallet personnel.

Flux principal:

1. L'utilisateur ouvre Plombier.
2. Il saisit email et mot de passe.
3. L'application cree une session locale.
4. La session est stockee dans Redux persist.
5. L'utilisateur arrive sur Home.
6. Si l'utilisateur rafraichit le web ou relance l'app mobile, la session est restauree.

## UC-02 - Ajouter une depense rapide

**Acteur:** utilisateur  
**Objectif:** enregistrer une depense frequente en un geste.

Flux principal:

1. L'utilisateur ouvre Home.
2. Il appuie sur un raccourci, par exemple Cafe ou Transport.
3. Une transaction est creee avec montant, categorie, compte et date.
4. Le solde du compte est mis a jour.
5. Un toast confirme l'ajout.

## UC-03 - Ajouter une transaction manuelle

**Acteur:** utilisateur  
**Objectif:** saisir une depense, un revenu ou un transfer.

Flux principal:

1. L'utilisateur appuie sur le FAB.
2. Il choisit Expense, Income ou Transfer.
3. Il saisit le montant via le numpad.
4. Il choisit la categorie.
5. Il saisit un libelle.
6. Il sauvegarde.

## UC-04 - Consulter l'historique

**Acteur:** utilisateur  
**Objectif:** retrouver une transaction.

Flux principal:

1. L'utilisateur ouvre History.
2. Il recherche par libelle, categorie, note ou tag.
3. Les transactions sont affichees par date.
4. L'utilisateur consulte les totaux par jour.

## UC-05 - Payer une facture recurrente

**Acteur:** utilisateur  
**Objectif:** marquer une facture comme payee.

Flux principal:

1. L'utilisateur ouvre Accounts.
2. Il consulte les factures recurrentes.
3. Il appuie sur Pay Now.
4. La facture est marquee payee.
5. Une transaction de depense est creee.
6. La prochaine date d'echeance est calculee.

## UC-06 - Masquer les soldes

**Acteur:** utilisateur  
**Objectif:** proteger sa confidentialite visuelle.

Flux principal:

1. L'utilisateur appuie sur l'icone oeil dans la TopAppBar.
2. Les soldes sont remplaces par des points.
3. Le parametre est persiste.

## UC-07 - Suivre un objectif

**Acteur:** utilisateur  
**Objectif:** suivre la progression d'une cible d'epargne.

Flux principal:

1. L'utilisateur ouvre Goals.
2. Il consulte l'objectif mis en avant.
3. Il compare montant actuel, cible et progression.
4. Les objectifs termines apparaissent dans Victories.

## UC-08 - Exporter les transactions

**Acteur:** utilisateur  
**Objectif:** recuperer ses donnees.

Flux principal:

1. L'utilisateur ouvre Profile.
2. Il appuie sur Export CSV.
3. L'application genere un CSV avec date, libelle, categorie, montant, compte, tags et note.

## UC-09 - Modifier le contact support admin

**Acteur:** admin  
**Objectif:** changer l'email admin et le numero WhatsApp support.

Flux principal:

1. L'admin ouvre AdminProfile.
2. Il modifie l'email et le numero WhatsApp support.
3. L'application valide le format email et telephone.
4. Les donnees sont sauvegardees dans Redux persist.
5. Les liens WhatsApp du web et du mobile utilisent le nouveau numero.

## UC-09b - Modifier l'identite publique

**Acteur:** admin  
**Objectif:** remplacer "Plombier Tunisie" par son nom/prenom ou un nom commercial, et ajuster les annees d'experience.

Flux principal:

1. L'admin ouvre AdminProfile.
2. Il saisit le titre public du site.
3. Il saisit le nombre d'annees d'experience.
4. L'application valide que le titre n'est pas vide et que l'experience est un nombre coherent.
5. Les valeurs sont sauvegardees dans Redux persist.
6. Le header, le footer, les textes et la barre de statistiques utilisent les nouvelles valeurs.

## UC-10 - Consulter les zones couvertes

**Acteur:** guest, user ou admin  
**Objectif:** savoir quelles villes sont couvertes et contacter le support.

Flux principal:

1. L'utilisateur ouvre Zones.
2. Il consulte Tunis, Ariana, Ben Arous, La Manouba, Sousse, Monastir, Mahdia et Sfax.
3. Il appuie sur WhatsApp support.
4. L'application ouvre `wa.me` avec le numero support persiste.
