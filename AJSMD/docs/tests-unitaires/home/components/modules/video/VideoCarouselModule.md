---
title: VideoCarouselModule
slug: /features/home/components/modules/video/videocarouselmodule.native.test.tsx/videocarouselmodule
---

# VideoCarouselModule

Ce document décrit le fonctionnement du module VideoCarousel, ainsi que les événements de tracking associés.

## Présentation
Le VideoCarouselModule est un composant affichant une série de vidéos. Il inclut un carrousel pour naviguer entre les vidéos, et potentiellement des offres associées.

## Scénarios et Comportements

### Affichage Initial

*   **Comportement:** Le module affiche une liste de vidéos. Chaque vidéo est représentée par un élément (par exemple, une vignette).
*   **Contenu:** Les titres des vidéos sont affichés. (Exemple : VideoCarouselModule- ${title}
    - ${title}
    - ${title}
    - ${title}
    - ${title}
    - ${title}
    - ${title})
*   **Tracking:**
    *   Le module envoie l'événement `logModuleDisplayedOnHomepage` lors de l'affichage du module sur la page d'accueil.

### Lecture Automatique de la Vidéo

*   **Comportement:** La première vidéo de la liste est lue automatiquement.
*   **Tracking:**
    *   Lorsque la vidéo commence à être lue automatiquement, le module envoie l'événement `logConsultVideo`.

### Navigation entre les Vidéos

*   **Comportement:** L'utilisateur peut naviguer entre les vidéos via des boutons ou d'autres éléments d'interface (ex : flèches, swipe).
*   **Tracking:**
    *   Quand l'utilisateur appuie sur le bouton pour passer à la vidéo suivante, le module envoie l'événement `logConsultVideo`. Cet événement est envoyé à chaque changement de vidéo, qu'elle soit initiée par l'autoplay ou par l'utilisateur.

### Interaction avec les Offres

*   **Comportement:** Le module peut afficher des offres associées aux vidéos (par exemple, des publicités, des suggestions de produits, etc.).
*   **Tracking:**
    *   Lorsque l'utilisateur interagit avec une offre (par exemple, en cliquant dessus), le module envoie l'événement `logConsultOffer`.
