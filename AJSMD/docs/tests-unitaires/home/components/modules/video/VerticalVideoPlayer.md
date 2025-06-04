---
title: VerticalVideoPlayer
slug: /features/home/components/modules/video/verticalvideoplayer.native.test.tsx/verticalvideoplayer
---

# VerticalVideoPlayer - Documentation de la Fonctionnalité

Cette documentation décrit le comportement du composant `VerticalVideoPlayer`.

## Comportements Généraux

Ce contexte décrit les fonctionnalités de base du `VerticalVideoPlayer`.

*   **Fin de la Vidéo:**
    *   Affiche un bouton "Replay" lorsque la vidéo est terminée.
*   **Gestion des Sources Vidéo:**
    *   **Une seule source vidéo:** N'affiche pas de bouton "Next video".
    *   **Plusieurs sources vidéo:** Affiche les boutons "Replay" et "Next video".

## Gestion des Erreurs et des États de la Vidéo

Ce contexte décrit les comportements en fonction de l'état du lecteur vidéo.

*   **Gestion des Erreurs YouTube:**
    *   Affiche une vue d'erreur lorsque le lecteur YouTube rencontre une erreur.
    *   N'affiche pas la vue d'erreur lorsque aucune erreur ne se produit.
*   **État Initial (Vidéo non démarrée):**
    *   Affiche un bouton "Play video".
*   **État de Lecture (Vidéo en cours de lecture):**
    *   Affiche un bouton "Pause".
    *   Affiche un bouton "Sound".
*   **État de Pause (Vidéo en pause):**
    *   Affiche l'élément "Keep watching".
