---
title: CategoryListModule
slug: /features/home/components/modules/categories/categorylistmodule.native.test.tsx/categorylistmodule
---

```md
CategoryListModule

## Aperçu

CategoryListModule est un composant affichant une liste de catégories. Ce document décrit son comportement, spécifiquement quand la fonctionnalité `enableAppV2CategoryBlock` est désactivée (false).

## Comportements

Voici les comportements attendus du `CategoryListModule` en fonction de différents scénarios, lorsque `enableAppV2CategoryBlock` est `false`:

*   **Affichage initial du module**

    *   Le module doit envoyer un événement d'analyse (analytics) lors de son affichage.  Cela permet de suivre les impressions du module et de collecter des données sur son exposition.

*   **Interaction avec les categoryBlock**

    *   Lorsqu'un `categoryBlock` est cliqué:
        *   Le module doit envoyer un événement d'analyse (analytics). Cela permet de suivre les clics sur les categories et d'analyser les interactions des utilisateurs.
        *   Le module doit naviguer vers la page d'accueil thématique.

*   **Affichage des boutons de navigation circulaires**

    *   Les boutons de navigation circulaires ne doivent pas être affichés.  Cette règle vise à masquer des éléments visuels spécifiques dans le cas où la fonctionnalité `enableAppV2CategoryBlock` est désactivée.
```
