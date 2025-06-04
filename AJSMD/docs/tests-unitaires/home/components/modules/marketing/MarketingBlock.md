---
title: MarketingBlock
slug: /features/home/components/modules/marketing/marketingblock.native.test.tsx/marketingblock
---

# MarketingBlock

Cette documentation décrit le comportement du composant `MarketingBlock`.

## Comportements et Scénarios

Les comportements du `MarketingBlock` sont définis par sa configuration et l'environnement dans lequel il est rendu. Voici les principaux scénarios et les règles associées :

### 1. Affichage en fonction de la taille de l'écran (isDesktopViewport)

Ce scénario gère l'affichage du contenu du bloc en fonction de la taille de l'écran détectée.

*   **Règle:**
    *   Si `isDesktopViewport` est `true`, le composant `MarketingBlock` affiche le contenu `MarketingBlockContentDesktop`.
    *   Si `isDesktopViewport` est `false`, le composant `MarketingBlock` ne doit pas afficher le contenu `MarketingBlockContentDesktop`. On suppose qu'il existe d'autres types de rendu pour les petits écrans qui ne sont pas explicitement définis ici.

### 2. Application du gradient sombre (blackGradient)

Ce scénario décrit comment le composant gère l'application d'un gradient de couleur sur son arrière-plan.

*   **Règle:**
    *   Si `blackGradient` est `true`, le `MarketingBlock` affiche un `backgroundImage` assombri, très probablement par l'application d'un overlay noir.
    *   Si `blackGradient` est `false`, le `MarketingBlock` n'affiche pas de `backgroundImage` assombri. L'arrière-plan est affiché sans modification.
