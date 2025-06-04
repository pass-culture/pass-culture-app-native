---
title: getVideoPlayerDimensions
slug: /features/home/components/helpers/getvideoplayerdimensions.native.test.ts/getvideoplayerdimensions
---

```md
# getVideoPlayerDimensions

## Description

Cette fonctionnalité a pour objectif de déterminer les dimensions (largeur et hauteur) à utiliser pour l'affichage d'un lecteur vidéo, en adaptant ces dimensions en fonction du contexte d'affichage (mobile ou desktop).

## Comportements par contexte

### Contexte : Vue Mobile

*   **Règle de gestion :**
    *   La fonction `getVideoPlayerDimensions` doit renvoyer un ensemble de dimensions (largeur et hauteur) optimisé pour l'affichage sur un écran mobile. Les valeurs spécifiques de largeur et de hauteur ne sont pas précisées ici, mais il est implicite qu'elles seront adaptées pour un rendu visuel optimal sur les appareils mobiles.

### Contexte : Vue Desktop

*   **Règle de gestion :**
    *   La fonction `getVideoPlayerDimensions` doit renvoyer un ensemble de dimensions (largeur et hauteur) optimisé pour l'affichage sur un écran de bureau. Les valeurs spécifiques de largeur et de hauteur ne sont pas précisées ici, mais il est implicite qu'elles seront adaptées pour un rendu visuel optimal sur les écrans de bureau.

