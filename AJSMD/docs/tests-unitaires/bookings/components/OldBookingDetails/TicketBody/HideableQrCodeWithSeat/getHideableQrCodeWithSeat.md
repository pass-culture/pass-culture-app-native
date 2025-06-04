---
title: getHideableQrCodeWithSeat
slug: /features/bookings/components/oldbookingdetails/ticketbody/hideableqrcodewithseat/gethideableqrcodewithseat.native.test.ts/gethideableqrcodewithseat
---

# getHideableQrCodeWithSeat

Ce document décrit le comportement de la fonctionnalité `getHideableQrCodeWithSeat`, une fonction qui gère l'affichage conditionnel d'un code QR et d'autres informations liées à une réservation.

## Comportements par contexte

Voici les différents contextes et les comportements attendus de la fonctionnalité :

### 1. Affichage initial (avant la visibilité du composant)

Ce contexte décrit ce qui se passe lors du chargement initial du composant `getHideableQrCodeWithSeat`.

*   **Scénario :** Avant que le composant ne soit visible.
    *   **Comportement :**
        *   Affiche le code QR.

### 2. Affichage (après la visibilité du composant)

Ce contexte décrit ce qui se passe après que le composant `getHideableQrCodeWithSeat` est visible.

*   **Scénario :** Lorsque le composant est visible.
    *   **Comportement :**
        *   Affiche le code QR.

### 3. Réservation dans une catégorie non-masquée

Ce contexte décrit le comportement lorsque la réservation appartient à une catégorie qui n'est pas configurée pour être masquée.

*   **Scénario :** Réservation dans une catégorie qui ne doit pas être masquée.
    *   **Comportement :**
        *   **Avant visibilité :**
            *   Masque le code QR.
            *   Affiche le jour correct de la réservation.
            *   Affiche l'heure correcte de la réservation.
        *   **Après visibilité :**
            *   Affiche le code QR.

### 4. Contrôle avec Feature Flag `enableHideTicket`

Ce contexte décrit le comportement en fonction de l'état du Feature Flag `enableHideTicket`.

*   **Scénario :** Lorsque le Feature Flag `enableHideTicket` est activé.
    *   **Comportement :**
        *   [Comportement non spécifié, besoin de plus d'informations pour définir l'action à effectuer en fonction du contexte.]

*   **Scénario :** Lorsque le Feature Flag `enableHideTicket` est désactivé.
    *   **Comportement :**
        *   Ne masque pas le code QR.

### 5. Réservation dans une catégorie masquée

Ce contexte décrit le comportement lorsque la réservation appartient à une catégorie configurée pour être masquée.

*   **Scénario :** Réservation dans une catégorie qui doit être masquée.
    *   [Comportement non spécifié, besoin de plus d'informations pour définir l'action à effectuer en fonction du contexte.]

### 6. Paramètres par défaut

Ce contexte décrit le comportement de la fonction lorsque des paramètres par défaut sont utilisés.

*   **Scénario :** Utilisation avec les paramètres par défaut.
    *   **Comportement :**
        *   La fonction doit fonctionner correctement avec les paramètres par défaut.

