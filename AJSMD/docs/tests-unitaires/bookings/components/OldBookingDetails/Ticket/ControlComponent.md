---
title: ControlComponent
slug: /features/bookings/components/oldbookingdetails/ticket/controlcomponent.native.test.tsx/controlcomponent
---

# ControlComponent

Ce composant est responsable de l'affichage de flèches de navigation (précédent et suivant) et de la gestion des événements de clic.

## Comportements et Scénarios

Voici les différents scénarios et les comportements attendus pour `ControlComponent` :

### 1. Affichage par défaut et comportement de base

*   **Description:** Ce scénario décrit le comportement par défaut du composant, sans configuration spécifique.

*   **Règles de gestion:**
    *   Le composant doit afficher la flèche "précédent" par défaut.
    *   Le composant doit déclencher l'événement `onPress` lorsque l'utilisateur clique sur la flèche.

### 2. Affichage des flèches en fonction du type

*   **Description:** Ce scénario définit comment le composant réagit en fonction du type spécifié (précédent ou suivant).

*   **Règles de gestion:**
    *   Si le `type` est défini sur "prev", le composant doit afficher la flèche "précédent".
    *   Si le `type` est défini sur "next", le composant doit afficher la flèche "suivant".
    *   Le composant doit déclencher l'événement `onPress` lorsque l'utilisateur clique sur une flèche (peu importe le type).

### 3. Gestion des marges

*   **Description:** Ce scénario décrit comment le composant gère les marges des boutons de navigation en fonction d'une propriété.

*   **Règles de gestion:**
    *   Si la propriété `withMargin` est définie sur `true` et qu'il s'agit de la flèche "précédent", le composant doit rendre le bouton avec une marge gauche.
    *   Si la propriété `withMargin` est définie sur `true` et qu'il s'agit de la flèche "suivant", le composant doit rendre le bouton avec une marge droite.
