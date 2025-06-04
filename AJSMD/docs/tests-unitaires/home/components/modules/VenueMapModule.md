---
title: VenueMapModule
slug: /features/home/components/modules/venuemapmodule.native.test.tsx/venuemapmodule
---

# VenueMapModule

Cette documentation décrit le comportement du composant `VenueMapModule`, responsable de l'affichage d'une carte des lieux.

## Comportements et Scénarios

Voici les différents scénarios et les règles de fonctionnement associées :

### 1. Affichage de la Carte des Lieux - Condition d'affichage

*   **Description :** Ce scénario décrit les conditions nécessaires pour que la carte des lieux soit affichée.
*   **Conditions :**
    *   L'utilisateur est localisé.
    *   La fonctionnalité de la carte des lieux est activée (via un "feature flag").
*   **Comportement :**
    *   Le composant `VenueMapModule` affiche le bloc de la carte des lieux.

### 2. Masquage de la Carte des Lieux - Feature Flag Désactivé

*   **Description :** Ce scénario décrit le cas où la fonctionnalité est désactivée.
*   **Conditions :**
    *   Le "feature flag" de la carte des lieux est désactivé.
*   **Comportement :**
    *   Le composant `VenueMapModule` ne doit *pas* afficher le bloc de la carte des lieux.

### 3. Masquage de la Carte des Lieux - Utilisateur Non Localisé

*   **Description :** Ce scénario décrit le cas où l'utilisateur n'est pas localisé (par exemple, les services de géolocalisation sont désactivés ou l'utilisateur n'a pas donné son accord).
*   **Conditions :**
    *   L'utilisateur n'est pas localisé.
*   **Comportement :**
    *   Le composant `VenueMapModule` ne doit *pas* afficher le bloc de la carte des lieux.

### 4. Masquage de la Carte des Lieux - Utilisateur Localisé "Partout"

*   **Description :** Ce scénario décrit le cas où l'application ne peut pas déterminer la localisation précise de l'utilisateur et l'interprète comme "partout".
*   **Conditions :**
    *   L'utilisateur est localisé, mais la localisation n'est pas spécifique (ex: "n'importe où").
*   **Comportement :**
    *   Le composant `VenueMapModule` ne doit *pas* afficher le bloc de la carte des lieux.

### 5. Suivi des Interactions - Consultation de la Carte des Lieux

*   **Description :** Ce scénario décrit le suivi d'un événement quand l'utilisateur interagit avec la carte.
*   **Conditions :**
    *   L'utilisateur appuie sur le bloc de la carte des lieux.
*   **Comportement :**
    *   Le composant doit enregistrer un événement de consultation de la carte des lieux depuis la page d'accueil (ex: via un système de logging).
