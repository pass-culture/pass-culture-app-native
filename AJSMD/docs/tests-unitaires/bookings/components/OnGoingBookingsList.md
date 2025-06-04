---
title: OnGoingBookingsList
slug: /features/bookings/components/ongoingbookingslist.native.test.tsx/ongoingbookingslist
---

# OnGoingBookingsList

Ce composant affiche une liste des réservations en cours. Il gère l'actualisation des données, les états de chargement et l'affichage d'erreurs.

## Scénarios et Comportements

### 1. Affichage Initial et Chargement des Données

*   **Comportement:**
    *   Affiche un placeholder pendant le chargement des réservations.
    *   Affiche un placeholder pendant le chargement des sous-catégories.

### 2. Actualisation des Données (Pull-to-Refresh)

*   **Conditions:**
    *   `netInfo.isConnected` : Le dispositif est connecté à un réseau.
    *   `netInfo.isInternetReachable` : Le dispositif peut accéder à Internet.
*   **Comportement:**
    *   Permet l'actualisation des données via un mécanisme de pull-to-refresh si les conditions sont satisfaites.
    *   Tente de refetcher les données lorsque l'utilisateur effectue un pull-to-refresh.
*   **Gestion des Erreurs:**
    *   Affiche une snackbar d'erreur avec le message "Impossible de recharger tes réservations, connecte-toi à internet pour réessayer." si la tentative de pull-to-refresh échoue en raison d'une absence de connexion internet.

### 3. Suivi du Défilement et Analytics

*   **Comportement:**
    *   Déclenche un événement `logEvent "BookingsScrolledToBottom"` une seule fois lorsque l'utilisateur atteint le bas de la liste des réservations.
    *   Cet événement est déclenché uniquement lors du premier "atteinte du bas" de la liste.
