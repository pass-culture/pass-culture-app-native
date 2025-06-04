---
title: HomeModule
slug: /features/home/components/modules/homemodule.native.test.tsx/homemodule
---

# HomeModule

Cette documentation décrit le comportement du composant `HomeModule`, responsable de l'affichage de la page d'accueil.

## Scénarios et Comportements

Voici les différents scénarios et les comportements attendus pour le `HomeModule`:

*   **Affichage Initial**

    *   Le composant `<HomeModule />` affiche les modules suivants :
        *   `highlightOfferModule`
        *   `BusinessModule`
        *   `CategoryListModule`
        *   `RecommendationModule`
        *   `VideoModule`
        *   `ThematicHighlightModule`
        *   `OffersModule`
        *   `VenuesModule`
        *   `trends module`

    *   Le composant dispatch des "viewable items" pour le module. Ceci suggère qu'il envoie des informations sur les éléments visibles au moment du rendu initial.

**Résumé des Comportements:**

*   Le `HomeModule` sert de point d'entrée pour la page d'accueil, orchestrant l'affichage d'une variété de modules liés à la promotion, à la navigation et aux recommandations de contenu.
*   Il est responsable de l'affichage initial et envoie des données sur les éléments visibles.
