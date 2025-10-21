# Application du DR019 : Walking Skeleton & Slicing Vertical au module `GenericHome`

Ce document illustre comment le principe du Walking Skeleton et du Découpage Vertical (DR019) peut être appliqué pour la refonte du module `GenericHome`, en s'appuyant sur les étapes détaillées dans `exemple-sf.md`. L'objectif est de livrer de la valeur de manière incrémentale et de dérisquer l'architecture.

---

## Découpage 1 : Le Walking Skeleton (Validation Architecturale)

**Objectif :** Mettre en place le squelette minimal fonctionnel de bout en bout pour valider l'intégration de la nouvelle architecture (feature flag, point d'entrée du nouveau module, pipeline CI/CD).

**Description :** Cette phase se concentre sur l'établissement du "bridge" entre l'ancien et le nouveau code, contrôlé par un feature flag. Le nouveau module (`ModernOnlineHome`) est une coquille vide ou une version très simplifiée qui se monte et se rend sans casser l'application. L'objectif n'est pas de livrer de la valeur métier, mais de prouver que le chemin architectural est viable.

**Correspondance avec `exemple-sf.md` :**

* **Étape 1 : Mise en place du "Bridge" (ACL) et du Feature Flag.**
  * Le `GenericHome.tsx` principal est modifié pour utiliser un feature flag (`USE_MODERN_HOME_MODULE`) afin de basculer entre `LegacyOnlineHome` et `ModernOnlineHome`.
  * `ModernOnlineHome` est initialement une version minimale (par exemple, un simple `Text` affichant "Nouvelle Home en construction") qui confirme que le routing, le montage du composant et le feature flag fonctionnent correctement.
  * **Livrable Clé :** Le feature flag permet de basculer entre l'ancienne et la nouvelle version sans erreur. Un test E2E minimal vérifie que la page `HOME` s'affiche correctement avec le nouveau module activé. Le pipeline CI/CD est au vert pour cette nouvelle branche architecturale.

---

## Découpage 2 : Tranche Verticale #1 (Affichage et Pagination des Modules)

**Objectif :** Livrer la fonctionnalité de base d'affichage des modules de la page d'accueil avec une pagination fonctionnelle, en appliquant les principes de gestion d'état.

**Description :** Cette tranche se concentre sur la récupération et l'affichage des données des modules de la page d'accueil. Elle intègre la gestion de l'état serveur pour la pagination, remplaçant la logique impérative du module legacy.

**Correspondance avec `exemple-sf.md` :**

* **Étape 2 : Construction du "Strangler" - Application de DR011.**
  * Le `ModernOnlineHome` est enrichi pour utiliser `useInfiniteQuery` de React Query pour gérer la pagination des modules.
  * Les modules sont affichés dans une `FlatList` et le chargement des pages suivantes est déclenché par le défilement.
  * **Livrable Clé :** L'utilisateur peut voir les modules de la page d'accueil se charger progressivement en défilant, sans les problèmes de performance ou de complexité du module legacy. Un test d'intégration vérifie la pagination et l'affichage des données.

---

## Découpage 3 : Tranche Verticale #2 (Optimisation de la Logique et Séparation des Responsabilités)

**Objectif :** Améliorer la maintenabilité, la testabilité et la performance du nouveau module en isolant la logique métier, les effets de bord et en séparant clairement l'UI de la logique.

**Description :** Cette tranche se concentre sur l'application des principes de code propre et de séparation des préoccupations pour rendre le module plus robuste et facile à faire évoluer.

**Correspondance avec `exemple-sf.md` :**

* **Étape 3 : Construction du "Strangler" - Application de DR012.** (Extraction de logique métier pure)
* **Étape 4 : Construction du "Strangler" - Application de DR013.** (Isolation des effets de bord)
* **Étape 5 : Construction du "Strangler" - Application de DR014.** (Séparation UI / Logique / Navigation)
* **Étape 6 : Construction du "Strangler" - Application de DR022.** (Extraction du `ListHeaderComponent` pour SRP)
* **Livrable Clé :** Le module `ModernOnlineHome` est désormais structuré avec une logique métier isolée dans des fonctions pures, des effets de bord encapsulés dans des hooks dédiés, et une séparation claire entre le composant de vue (`HomeView`) et son ViewModel (`useHomeViewModel`). La complexité est réduite, la testabilité améliorée, et la performance optimisée grâce à une meilleure gestion des re-renders.
