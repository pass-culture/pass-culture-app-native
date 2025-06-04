---
title: TrendsModule
slug: /features/home/components/modules/trendsmodule.native.test.tsx/trendsmodule
---

# TrendsModule

## Vue d'ensemble

Le `TrendsModule` est responsable de l'affichage et de l'interaction avec les blocs de tendances (trends) et les blocs de carte des lieux (venue map). Il gère également la navigation et le suivi des événements pour les analytics.

## Scénarios et comportements

### 1. Affichage initial et rendu

*   **Comportement:**
    *   Le module doit enregistrer des événements d'analyse (analytics) lors du rendu initial.

### 2. Interaction avec le bloc "Venue Map"

*   **Contexte:** L'utilisateur appuie sur un bloc de type "venue map".

    *   **Scénario 1: L'utilisateur n'est *pas* partout (user location is not everywhere).**
        *   **Comportement:**
            *   Le module doit rediriger l'utilisateur vers la page `VenueMap`.
            *   Le module doit réinitialiser le lieu sélectionné dans le store.
            *   Le module doit enregistrer des événements d'analyse (analytics).

    *   **Scénario 2: L'utilisateur est partout (user location is everywhere).**
        *   **Comportement:**
            *   Le module doit ouvrir une modale de sélection de lieu (venue map location modal).
            *   Le module *ne doit pas* enregistrer d'événements d'analyse (analytics).

### 3. Interaction avec le bloc "Trend"

*   **Contexte:** L'utilisateur appuie sur un bloc de type "trend".

    *   **Comportement:**
        *   Le module doit rediriger l'utilisateur vers la page thématique home.
        *   Le module doit enregistrer un événement d'analyse (analytics) : "trends block clicked".

### 4. Suivi des événements "trends block clicked"

*   **Contexte:** Le module doit enregistrer l'évènement "trends block clicked".

    *   **Scénario 1 : Appui sur un bloc trend**
        *   **Comportement :**
            *   Enregistre l'évènement "trends block clicked".

    *   **Scénario 2 : Appui sur un bloc venue map**
        *   **Comportement :**
            *   Enregistre l'évènement "trends block clicked".
