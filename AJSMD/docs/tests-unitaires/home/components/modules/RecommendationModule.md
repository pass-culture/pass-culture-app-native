---
title: RecommendationModule
slug: /features/home/components/modules/recommendationmodule.native.test.tsx/recommendationmodule
---

# RecommendationModule

Cette documentation décrit le comportement du composant `RecommendationModule`.

## Contexte : Affichage du module sur la page d'accueil

Ce contexte détaille les conditions d'affichage et les actions déclenchées par le `RecommendationModule` sur la page d'accueil.

*   **Scénario 1 : Affichage du module requis (`shouldModuleBeDisplayed` est `true`) et offre disponible.**

    *   **Comportement attendu :**
        *   Le `RecommendationModule` doit être affiché.
        *   L'événement `ModuleDisplayedOnHomepage` doit être déclenché (enregistré dans les logs).

*   **Scénario 2 : Non affichage du module (`shouldModuleBeDisplayed` est `false`) et offre potentiellement disponible.**

    *   **Comportement attendu :**
        *   Le `RecommendationModule` ne doit pas être affiché.
        *   L'événement `ModuleDisplayedOnHomepage` ne doit *pas* être déclenché.

*   **Scénario 3 : Absence d'offre (quel que soit `shouldModuleBeDisplayed`).**

    *   **Comportement attendu :**
        *   Le `RecommendationModule` ne doit pas être affiché, car il dépend de la disponibilité d'une offre.
        *   L'événement `ModuleDisplayedOnHomepage` ne doit *pas* être déclenché. (Cela découle implicitement du fait que le module n'est pas affiché.)

