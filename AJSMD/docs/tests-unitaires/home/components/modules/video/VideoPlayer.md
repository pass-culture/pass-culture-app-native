---
title: VideoPlayer
slug: /features/home/components/modules/video/videoplayer.native.test.tsx/videoplayer
---

# VideoPlayer

## Vue d'ensemble

Cette documentation décrit le comportement attendu du composant `VideoPlayer`. Il s'agit d'un composant de lecture vidéo qui gère l'affichage de la vidéo, la gestion des erreurs et l'analyse.

## Comportements par contexte

Voici les différents scénarios et les comportements attendus du `VideoPlayer` :

### 1. Initialisation et Analyse

*   **Scénario :** Le lecteur vidéo est prêt à être utilisé.
*   **Comportement :**
    *   Le composant doit envoyer un événement d'analyse `logConsultVideo`. Cet événement est essentiel pour le suivi de l'utilisation de la vidéo.

### 2. Gestion des erreurs

*   **Scénario :** Une erreur doit être affichée à l'utilisateur. La variable `showErrorView` est définie sur `true`.
*   **Comportement :**
    *   Le composant doit afficher une vue d'erreur.  Cela permet d'informer l'utilisateur d'un problème et de l'empêcher de voir une interface corrompue.

*   **Scénario :**  Aucune erreur ne doit être affichée à l'utilisateur. La variable `showErrorView` est définie sur `false`.
*   **Comportement :**
    *   Le composant ne doit pas afficher la vue d'erreur. Le lecteur vidéo fonctionne normalement sans indication d'erreur.
