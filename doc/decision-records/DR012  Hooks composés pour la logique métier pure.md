# DR012 : Extraire la logique métier dans des fonctions pures

> Statut : Adopté

## Décision

La logique métier complexe et les calculs d'états dérivés doivent être implémentés dans des **fonctions pures** (des fonctions qui, pour une même entrée, produisent toujours la même sortie, sans effets de bord).

Les **hooks** servent ensuite de "connecteurs" pour utiliser ces fonctions pures au sein de l'écosystème React, notamment avec `useMemo` pour les calculs dérivés ou dans des hooks personnalisés.

## Contexte

Actuellement, la logique métier est souvent mélangée au sein des `Context Wrappers` ou directement dans les composants. Le titre précédent de cet ADR ("Hooks composés pour la logique métier pure") était ambigu et pouvait encourager à placer de la logique directement dans les hooks, ce qui nuit à la testabilité.

## Alternatives considérées

- **Laisser la logique dans les composants ou les hooks :** Rejeté car cela conduit à des composants volumineux, rend les tests unitaires de la logique difficiles (nécessite un environnement React) et viole le principe de responsabilité unique.
- **Utiliser des classes de service :** Rejeté car l'approche par fonctions pures est plus simple et plus idiomatique dans un écosystème fonctionnel comme React.

## Justification

- **Testabilité Extrême :** Une fonction pure est l'unité de code la plus simple à tester. On peut la tester en isolation totale, sans avoir besoin de l'environnement React (`react-testing-library`) ou de mocks complexes.
- **Lisibilité :** La logique métier est clairement séparée de la logique de l'interface (React). Un développeur peut comprendre le calcul métier sans avoir à déchiffrer la syntaxe des hooks.
- **Réutilisabilité :** Une fonction pure peut être utilisée n'importe où dans l'application, pas seulement dans des composants React.

Pour des exemples concrets d'application de ce principe, y compris un refactoring pas à pas d'un module legacy, veuillez consulter le document [exemple.md](../architecture/exemple.md).

## Décisions associées

- **[DR022 : Principe de Responsabilité Unique (SRP)](./DR022%20%20Principe%20de%20Responsabilité%20Unique%20(SRP).md)** : Le SRP est le principe fondamental qui sous-tend l'extraction de la logique métier dans des fonctions pures, garantissant que chaque unité de code a une responsabilité unique.
