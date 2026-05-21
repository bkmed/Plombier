# Plombier Wallet - Use Cases

## UC-01 - Se connecter

**Acteur:** utilisateur  
**Objectif:** acceder a son wallet personnel.

Flux principal:

1. L'utilisateur ouvre Plombier.
2. Il saisit email et mot de passe.
3. L'application cree une session locale.
4. L'utilisateur arrive sur Home.

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
