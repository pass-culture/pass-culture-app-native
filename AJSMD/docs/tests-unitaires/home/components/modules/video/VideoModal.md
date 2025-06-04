---
title: VideoModal
slug: /features/home/components/modules/video/videomodal.native.test.tsx/videomodal
---

# VideoModal

Cette documentation décrit le comportement du composant `VideoModal`.

## Scénarios et Comportements

### 1. Affichage du Modal

*   **Contexte:** Le modal est visible.
*   **Comportement Attendu:** Le composant `VideoModal` doit s'afficher correctement dans l'interface utilisateur. Cela inclut l'affichage du contenu vidéo, des contrôles (si applicables), et des éléments de l'interface.

### 2. Fermeture du Modal

*   **Contexte:** L'utilisateur interagit avec le bouton de fermeture du modal.
*   **Comportement Attendu:**
    *   Lors de l'appui sur le bouton de fermeture, l'événement `HasDismissedModal` est enregistré (probablement dans la console ou un système de tracking).
    *   Le modal doit se fermer et disparaître de l'interface.
