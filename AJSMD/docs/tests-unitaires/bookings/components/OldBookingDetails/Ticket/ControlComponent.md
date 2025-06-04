---
title: ControlComponent
slug: /features/bookings/components/oldbookingdetails/ticket/controlcomponent.native.test.tsx/controlcomponent
---

---
title: ControlComponent
slug: /components/controlcomponent
---

# ControlComponent - Documentation

## 🎯 Vue d'ensemble

Le `ControlComponent` est un composant d'interface utilisateur qui gère l'affichage et l'interaction avec des flèches de navigation (précédent et suivant). Il permet de contrôler le passage d'un élément à l'autre dans une séquence, souvent utilisé pour des carrousels, des galeries, ou des formulaires multi-étapes.

## 🎬 Comportements et Scénarios

### 1. Affichage par défaut

*   **Comportement:** Le composant affiche par défaut la flèche "précédent" (prev).

### 2. Affichage des flèches basé sur le type

*   **Scénario:** Le type de flèche à afficher est contrôlé par la propriété `type`.
*   **Comportement:**
    *   Si `type` est égal à "prev", affiche la flèche "précédent".
    *   Si `type` est égal à "next", affiche la flèche "suivant".

### 3. Interaction : onPress

*   **Scénario:** L'utilisateur interagit avec les flèches en les pressant.
*   **Comportement:** Le composant déclenche la fonction `onPress` fournie lorsque l'utilisateur appuie sur une flèche.

### 4. Marges : withMargin

*   **Scénario:** Contrôle l'ajout de marges pour l'espacement des flèches.
*   **Comportement:**
    *   Si `withMargin` est `true` pour le bouton "précédent", le composant affiche le bouton avec une marge à gauche.
    *   Si `withMargin` est `true` pour le bouton "suivant", le composant affiche le bouton avec une marge à droite.
