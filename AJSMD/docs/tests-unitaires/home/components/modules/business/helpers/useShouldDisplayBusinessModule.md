---
title: useShouldDisplayBusinessModule
slug: /features/home/components/modules/business/helpers/useshoulddisplaybusinessmodule.native.test.ts/useshoulddisplaybusinessmodule
---

# Affichage du Module Business

Cette documentation décrit le comportement du module business et les conditions qui régissent son affichage.

## Contexte Général

Ce composant gère l'affichage d'un module business. Il se base sur une variable `useShouldDisplayBusinessModule` qui détermine si le module doit être rendu.

## Comportements par Scénarios

Voici les différents scénarios et les comportements attendus :

*   **Scénario 1 : Détermination initiale de l'affichage**
    *   **Règle de gestion :**  L'état d'affichage du module business est déterminé par `useShouldDisplayBusinessModule()`.
    *   **Action :**  `showBusinessModule()` est appelée pour afficher le module si les conditions sont réunies (déterminées par `useShouldDisplayBusinessModule()`).  Il n'y a pas d'information sur ces conditions, mais elles sont déterminantes.

