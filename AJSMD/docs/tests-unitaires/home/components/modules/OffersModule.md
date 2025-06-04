---
title: OffersModule
slug: /features/home/components/modules/offersmodule.native.test.tsx/offersmodule
---

# OffersModule

Cette documentation décrit le comportement et les règles de gestion du composant `OffersModule`. Ce module affiche des offres promotionnelles et interagit avec le suivi d'événements et la navigation.

## Comportements du Module

### Affichage sur la page d'accueil

*   **Scénario:** Le module est affiché ou non sur la page d'accueil.
    *   **Règles:**
        *   Si `shouldModuleBeDisplayed` est `true`, le module déclenche un événement de suivi `ModuleDisplayedOnHomepage`.
        *   Si `shouldModuleBeDisplayed` est `false`, le module *ne* déclenche *pas* l'événement de suivi `ModuleDisplayedOnHomepage`.
        *   L'événement `ModuleDisplayedOnHomepage` peut être déclenché avec le type de module `hybrid`.
        *   L'événement `ModuleDisplayedOnHomepage` peut être déclenché avec l'`hybridModuleOffsetIndex` égal à 1 lorsque la playlist ne contient que des offres recommandées (`recommendedOffers`).

### Interaction avec le bouton "See More"

*   **Scénario:** L'utilisateur clique sur le bouton "See More" du module.
    *   **Règles:**
        *   Le module déclenche l'événement de suivi `SeeMoreHasBeenClicked`.
        *   Le module effectue une navigation vers une autre page, en transmettant les paramètres corrects pour l'affichage de plus d'offres.

### Rendu du Module

*   **Scénario:** Le composant est rendu sur la page.
    *   **Règles:**
        *   Le module ne doit pas être rendu si les données sont `undefined`.
        *   Le module doit rendre une playlist hybride si les paramètres incluent des offres recommandées (`recommended parameters`).
        *   Le module ne doit *pas* rendre une playlist hybride si les paramètres n'incluent pas d'offres recommandées.
