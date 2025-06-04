---
title: VideoModule
slug: /features/home/components/modules/video/videomodule.native.test.tsx/videomodule
---

# VideoModule

Ce document décrit le comportement et les règles de gestion du composant `VideoModule`.

## Contexte Général

Ce contexte décrit le comportement général du composant, sans condition spécifique.

*   **Rendu correct:** Le composant `VideoModule` doit s'afficher et s'intégrer correctement dans l'interface utilisateur.
*   **Affichage modal:** Lors d'un clic sur la vignette (thumbnail) de la vidéo, le composant doit ouvrir une modal contenant la vidéo.
*   **Événement `ModuleDisplayedOnHomePage`:** L'événement `ModuleDisplayedOnHomePage` doit être envoyé lorsque le composant est rendu et visible sur la page.
*   **Événement `ModuleDisplayedOnHomePage` (conditionnel):** L'événement `ModuleDisplayedOnHomePage` **ne doit pas** être envoyé si le module n'est pas rendu (par exemple, si des conditions empêchent son affichage).

## Scénario : Offres Multiples

Ce contexte décrit le comportement lorsque le `VideoModule` affiche plusieurs offres.

*   **Rendu du composant `MultiOfferComponent`:** Si le module présente plusieurs offres, il doit utiliser le composant `MultiOfferComponent` pour les afficher.
*   **Bouton "Voir plus" (conditionnel):**
    *   Le bouton "Voir plus" doit s'afficher si le module propose plus de trois offres.
    *   Le bouton "Voir plus" ne doit pas s'afficher si le module propose trois offres ou moins.

## Scénario : Offre Unique

Ce contexte décrit le comportement lorsque le `VideoModule` affiche une seule offre.

*   **Rendu du composant `OneOfferComponent`:** Si le module présente une seule offre, il doit utiliser le composant `OneOfferComponent` pour l'afficher.

## Scénario : Adaptation au Viewport

Ce contexte décrit l'adaptation du `VideoModule` à la taille de l'écran.

*   **Design Mobile:** Si la fenêtre du navigateur est définie pour un affichage mobile, le composant `VideoModule` doit adopter une mise en page optimisée pour les écrans mobiles.
*   **Design Desktop:** Si la fenêtre du navigateur est définie pour un affichage desktop, le composant `VideoModule` doit adopter une mise en page optimisée pour les écrans de bureau.
