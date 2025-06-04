---
title: useVerticalVideoPlayer
slug: /features/home/components/modules/video/useverticalvideoplayer.native.test.ts/useverticalvideoplayer
---

```md
# useVerticalVideoPlayer

Cette fonctionnalité fournit une logique réutilisable pour la gestion d'un lecteur vidéo vertical. Elle inclut notamment le contrôle de la lecture, la gestion des événements et le suivi de l'état du lecteur.

## Comportements et Scénarios

Voici les différents comportements et scénarios couverts par `useVerticalVideoPlayer` :

### 1. Arrêt/Lecture de la vidéo

*   **Scénario:** Lorsqu'un appel est fait à `togglePlay`.
*   **Comportement Attendu:**
    *   Si la vidéo est en cours de lecture (état "playing"), l'appel à `togglePlay` met la vidéo en pause.
    *   Une action `videoPaused` doit être journalisée (loggée) lorsque la vidéo était précédemment en cours de lecture.

```
```
