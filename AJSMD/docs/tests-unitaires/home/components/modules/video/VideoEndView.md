---
title: VideoEndView
slug: /features/home/components/modules/video/videoendview.native.test.tsx/videoendview
---

# VideoEndView

## Vue de Fin de Vidéo - Documentation Technique

Cette documentation décrit le comportement du composant `VideoEndView`, qui s'affiche à la fin de la lecture d'une vidéo.

### 1. Rejouer la Vidéo

**Contexte:** L'utilisateur a terminé de regarder la vidéo et la vue de fin de vidéo est affichée.

**Comportement Attendus:**

*   En appuyant sur le bouton de relecture, la vidéo doit redémarrer.

### 2. Accès à l'Offre

**Contexte:** L'utilisateur interagit avec la vue de fin de vidéo.

**Comportements Attendus:**

*   En appuyant sur le bouton "Voir l’offre" :
    *   La page modale (si elle est affichée) doit se fermer et disparaître.
    *   Un événement de suivi (log) nommé "ConsultOffer" doit être enregistré pour analyser le comportement de l'utilisateur.
