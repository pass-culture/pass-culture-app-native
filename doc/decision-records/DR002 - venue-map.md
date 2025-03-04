# DR002 - carte des lieux

> Statut : Adopté

## Décision

Il a été décidé de refactoriser la page [VenueMap](../../src/features/venueMap/pages/VenueMap/VenueMap.tsx) et ses composants associés pour améliorer la lisibilité, la maintenabilité et la séparation des responsabilités. Les principales actions entreprises sont :

- Réorganisation des responsabilités entre les composants existants ([VenueMapView](../../src/features/venueMap/components/VenueMapView/VenueMapView.tsx) et [VenueMapBottomSheet](../../src/features/venueMap/components/VenueMapBottomSheet/VenueMapBottomSheet.tsx)).

- Refactorisation du [venueMapStore](../../src/features/venueMap/store/venueMapStore.ts) pour une meilleure gestion des données, en fusionnant plusieurs stores en un seul store unique.

- Création d'un nouveau composant conteneur, [VenueMapViewContainer](../../src/features/venueMap/components/VenueMapView/VenueMapViewContainer.tsx), pour gérer les interactions et la communication entre les composants.

## Contexte

La page VenueMap et ses composants associés manquaient de clarté dans la séparation des responsabilités, ce qui rendait le code difficile à maintenir et à faire évoluer. De plus, l'utilisation de plusieurs stores séparés pour gérer les différents aspects de la fonctionnalité (affichage d'une carte avec des points associés à des lieux proposant des offres culturelles) rendait le code verbeux et compliquait la gestion de l'état global. Il était nécessaire d'améliorer la structure et l'organisation du code pour faciliter les développements futurs et améliorer les performances.

## Alternatives considérées

- Conserver la structure existante et optimiser le code en place : Cette option a été rejetée car elle n'aurait pas résolu les problèmes fondamentaux de séparation des responsabilités.

- Réécrire entièrement la fonctionnalité : Cette approche a été jugée trop coûteuse en temps et en ressources, et potentiellement risquée.

- Garder plusieurs stores mais améliorer leur organisation : Cette option a été écartée car elle ne résolvait pas complètement le problème de verbosité et de complexité de gestion de l'état.

## Justification

- Amélioration de la lisibilité et de la maintenabilité du code.

- Meilleure séparation des responsabilités entre les composants.

- Simplification de la gestion de l'état grâce à un store unique pour la fonctionnalité VenueMap.

- Facilitation des tests unitaires et de l'intégration de nouvelles fonctionnalités.

- Réduction de la verbosité du code et amélioration de la cohérence des données.

- Optimisation potentielle des performances grâce à une meilleure gestion des états et des rendus.

## Conséquences

### Positives :

Code plus facile à comprendre et à maintenir.

Meilleure modularité permettant des évolutions futures plus aisées.

Gestion de l'état simplifiée et plus cohérente.

Potentielle amélioration des performances.

### Négatives :

Temps de développement nécessaire pour la refactorisation.

Risque de régression temporaire pendant la phase de transition.

## Actions à mettre en oeuvre

Mettre à jour la documentation technique pour refléter la nouvelle structure, en particulier la gestion de l'état avec le store unique.

Adapter les tests unitaires et d'intégration existants à la nouvelle architecture et au nouveau store.

Surveiller les performances de l'application après la mise en production pour vérifier les améliorations.
