---
title: VenueTile
slug: /features/home/components/modules/venues/venuetile.native.test.tsx/venuetile
---

# VenueTile Component

## Vue d'ensemble

Le composant `VenueTile` est responsable d'afficher une représentation visuelle et interactive d'un lieu (venue). Il affiche des informations clés sur le lieu et permet à l'utilisateur de naviguer vers la page de détail du lieu. Il intègre également le suivi analytique des interactions utilisateur.

## Comportements et Scénarios

Voici les différents contextes et comportements attendus du composant :

### 1. Affichage et Navigation

*   **Scénario :** Affichage initial du `VenueTile`.
    *   **Comportement :**
        *   Le composant affiche les informations de base du lieu.
        *   Si le lieu n'a pas d'image, le composant affiche un placeholder visuel (image par défaut).
        *   Le composant est cliquable.
        *   Cliquer sur le `VenueTile` redirige l'utilisateur vers la page de détail du lieu.

### 2. Suivi Analytique - Interaction de base

*   **Scénario :** L'utilisateur clique sur le `VenueTile`.
    *   **Comportement :**
        *   Un événement analytique `ConsultVenue` est déclenché.

### 3. Suivi Analytique - Avec identifiant de page d'accueil

*   **Scénario :** L'utilisateur clique sur le `VenueTile` et `homeEntryId` est fourni.
    *   **Comportement :**
        *   Un événement analytique `ConsultVenue` est déclenché, incluant le `homeEntryId`.

### 4. Affichage de la distance

*   **Scénario :** L'utilisateur a choisi de partager sa géolocalisation.
    *   **Comportement :**
        *   La distance par rapport à la position de l'utilisateur est affichée sur le `VenueTile`.

### 5. Absence d'affichage de la distance

*   **Scénario :** L'utilisateur a choisi l'option "France Entière" (ou une autre option équivalente qui n'implique pas de géolocalisation).
    *   **Comportement :**
        *   La distance n'est pas affichée sur le `VenueTile`.
