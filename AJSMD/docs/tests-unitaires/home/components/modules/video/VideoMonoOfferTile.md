---
title: VideoMonoOfferTile
slug: /features/home/components/modules/video/videomonooffertile.native.test.tsx/videomonooffertile
---

# VideoMonoOfferTile

## Vue d'ensemble

Le composant `VideoMonoOfferTile` est une tuile interactive affichant une offre vidéo. Il permet aux utilisateurs d'accéder à une offre spécifique en cliquant dessus.

## Comportements et Scénarios

### 1. Affichage de base

*   **Description:** Ce scénario décrit le comportement général du composant lors de son rendu initial.
*   **Règles de gestion:**
    *   Le composant doit s'afficher correctement (sans erreurs de rendu).
    *   Le composant doit afficher une image de substitution (placeholder) si l'offre associée ne possède pas d'image.

### 2. Interaction utilisateur - Redirection

*   **Description:** Ce scénario décrit l'interaction de l'utilisateur avec la tuile.
*   **Règles de gestion:**
    *   Lorsque l'utilisateur clique sur la tuile, il doit être redirigé vers la page de l'offre associée.

### 3. Interaction utilisateur - Logging

*   **Description:** Ce scénario décrit la journalisation des événements liés à l'interaction utilisateur.
*   **Règles de gestion:**
    *   Lorsque l'utilisateur clique sur la tuile, l'événement "ConsultOffer" doit être enregistré.
