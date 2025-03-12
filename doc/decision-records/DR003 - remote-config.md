# DR003 - Migration du Remote Config Provider vers `useQuery`

> Statut : Adopté

## Décision

Il a été décidé de remplacer l'approche basée sur un `RemoteConfigProvider` utilisant un `useState` et un `useEffect` par une approche reposant sur `useQuery` de React Query. Les principales modifications sont :

- Remplacement du `RemoteConfigProvider` par un hook `useRemoteConfigQuery` qui gère la récupération des données de manière déclarative avec React Query.
- Utilisation d’un fetcher `fetchRemoteConfig` qui effectue la configuration et le rafraîchissement des valeurs avant de les renvoyer.
- Ajout d’un mécanisme de `retry` automatique en cas d’échec de récupération des données.
- Amélioration de la gestion des erreurs avec des messages plus explicites.
- Réduction significative du code et suppression des effets manuels (`useEffect` et `useState`).

## Contexte

L’implémentation précédente utilisait un `RemoteConfigProvider` qui stockait les valeurs du Remote Config dans un état local (`useState`). L’état était mis à jour via un `useEffect` déclenchant une récupération manuelle des valeurs. Cette approche présentait plusieurs inconvénients :

- L’absence de mécanisme de `retry` automatique en cas d’échec.
- Une gestion des erreurs limitée avec peu de visibilité sur les éventuels problèmes de récupération (avant un simple `console.error`).
- Un code plus verbeux et moins maintenable avec des effets manuels (`useEffect` et `useState`).
- Une responsabilité centralisée dans un provider, compliquant son utilisation dans certaines parties de l’application.

L’utilisation de `useQuery` permet de simplifier cette gestion en offrant un cache performant, une gestion native des erreurs et des tentatives de récupération automatique.

## Alternatives considérées

- **Conserver l'approche `useEffect` et `useState`** :  
  Cette option a été rejetée car elle nécessitait trop de gestion manuelle et ne profitait pas des avantages de React Query.
  
- **Utiliser Zustand ou un autre store global** :  
  Cette option peut être envisagée mais on préfère se diriger vers l'utilisation de `useQuery`.


## Justification

- **Réduction du code** : Suppression des effets manuels et simplification de la récupération des valeurs.
- **Ajout d’un mécanisme de `retry`** : Permet une meilleure résilience en cas d’échec réseau temporaire.
- **Meilleure gestion des erreurs** : Les erreurs sont capturées.
- **Amélioration des performances** : React Query optimise la récupération et le caching, évitant ainsi des appels inutiles.
- **Facilité d'utilisation** : Plus besoin de wrapper l’application avec un provider spécifique, `useRemoteConfigQuery` peut être utilisé directement dans les composants.

## Conséquences

### Positives :

- Code plus concis et facile à maintenir.
- Meilleure robustesse en cas d’échec réseau.
- Suppression du `RemoteConfigProvider`, évitant une surcharge inutile dans l’arborescence des composants.
- Simplification de l’accès aux valeurs du Remote Config.

### Négatives :

- Adaptation nécessaire des composants utilisant l’ancien `RemoteConfigProvider`.
- Nécessité de tester le comportement de React Query avec la configuration Firebase pour s’assurer d’une récupération optimale.

## Actions à mettre en œuvre

- Adapter les composants pour utiliser `useRemoteConfigQuery` au lieu du `RemoteConfigProvider`.
- Mettre à jour la documentation technique pour expliquer la nouvelle approche.
- Surveiller les performances et le bon fonctionnement en production après la mise en place.
