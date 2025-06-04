---
title: DaySelectionCinema
slug: /dayselectioncinema
---

# Consulter les Séances de Cinéma pour une Date Spécifique

Ce document décrit le processus suivi par un utilisateur pour consulter les séances de cinéma disponibles pour une date spécifique.

## 1. Navigation vers les Séances

*   L'utilisateur est dans l'application.
*   L'application vérifie si la date cible (stockée dans une variable nommée `${output.targetDateTest}`) est visible à l'écran.
*   Si la date cible n'est pas immédiatement visible (par exemple, elle n'est pas affichée directement sur l'écran), l'application effectue les actions suivantes en boucle :
    *   L'utilisateur appuie sur le bouton "Retour" pour potentiellement revenir à une vue précédente.
    *   L'application effectue un défilement vers le bas de l'écran.
    *   L'utilisateur appuie sur le bouton "Séance de cinéma".
    *   L'utilisateur appuie sur le bouton "Accéder aux séances".
*   Cette boucle continue jusqu'à ce que la date cible devienne visible.

## 2. Sélection de la Date

*   Lorsque la date cible (${output.targetDateTest}) est visible à l'écran, l'utilisateur appuie dessus pour la sélectionner.
