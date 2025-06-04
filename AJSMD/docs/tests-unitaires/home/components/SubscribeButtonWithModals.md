---
title: SubscribeButtonWithModals
slug: /features/home/components/subscribebuttonwithmodals.native.test.tsx/subscribebuttonwithmodals
---

# SubscribeButtonWithModals

## Vue d'ensemble

Le composant `SubscribeButtonWithModals` gère le processus d'abonnement aux contenus thématiques, en proposant une interface utilisateur intuitive et en tenant compte de l'état de l'utilisateur (connecté/déconnecté, abonné/non abonné, paramètres de notification).

## Comportements et Scénarios

### 1. Utilisateur Déconnecté

*   **Comportement:**
    *   Clique sur le bouton "S'abonner": Ouvre une modal "logged out" (connexion demandée).
    *   **Explication:** Le composant doit rediriger l'utilisateur vers l'étape de connexion pour s'abonner.

### 2. Utilisateur Connecté et Non Abonné

*   **Comportement:**
    *   Affichage: Affiche le bouton "S'abonner" inactif.
    *   **Explication:** Le bouton est visuellement présent pour indiquer l'abonnement possible, mais inactif pour l'instant.

### 3. Utilisateur Connecté et Déjà Abonné

*   **Comportement:**
    *   Affichage: Affiche le bouton "S'abonner" actif.
    *   **Explication:** L'utilisateur est prêt à interagir avec l'option d'abonnement.

### 4. Utilisateur Connecté et Sans Notifications Activées

*   **Comportement:**
    *   Clique sur le bouton "S'abonner": Ouvre une modal de configuration des notifications.
    *   **Explication:** Invite l'utilisateur à configurer les notifications avant de finaliser l'abonnement.

### 5. Utilisateur Connecté et Déjà Abonné (Clique sur le bouton "S'abonner")

*   **Comportement:**
    *   Clique sur le bouton "S'abonner": Ouvre une modal de désabonnement.
    *   **Explication:** Permet à l'utilisateur de se désabonner.

### 6. Utilisateur Connecté et S'abonne à un Thématique pour la Seconde Fois

*   **Comportement:**
    *   Abonnement réussi: Affiche une modal de succès d'abonnement.
    *   **Explication:** Confirme à l'utilisateur le succès de l'abonnement.

### 7. Utilisateur Connecté et S'abonne à un Thématique Home pour plus de 3 fois

*   **Comportement:**
    *   Abonnement: Affiche un snackbar.
    *   **Explication:** Fournit un feedback discret sur l'action effectuée.

### 8. Utilisateur Non Éligible

*   **Comportement:**
    *   Affichage: N'affiche rien (aucun bouton, ni indication).
    *   **Explication:** Le composant s'adapte à l'éligibilité de l'utilisateur.
