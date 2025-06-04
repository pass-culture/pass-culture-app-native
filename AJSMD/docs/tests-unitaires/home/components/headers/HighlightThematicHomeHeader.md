---
title: HighlightThematicHomeHeader
slug: /features/home/components/headers/highlightthematichomeheader.native.test.tsx/highlightthematichomeheader
---

# HighlightThematicHomeHeader

Ce document décrit le comportement de la fonctionnalité `HighlightThematicHomeHeader`.

## Comportements

La fonctionnalité `HighlightThematicHomeHeader` a le comportement suivant en fonction de la présence de données d'introduction :

*   **Affichage de l'Introduction avec Titre et Paragraphe**

    *   **Règle:** L'introduction est affichée.
    *   **Condition:** Le composant reçoit à la fois un titre et un paragraphe d'introduction.

*   **Non-Affichage de l'Introduction avec Seulement un Titre**

    *   **Règle:** L'introduction n'est pas affichée.
    *   **Condition:** Le composant reçoit uniquement un titre d'introduction, sans paragraphe.

*   **Non-Affichage de l'Introduction avec Seulement un Paragraphe**

    *   **Règle:** L'introduction n'est pas affichée.
    *   **Condition:** Le composant reçoit uniquement un paragraphe d'introduction, sans titre.
