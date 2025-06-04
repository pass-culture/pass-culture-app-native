---
title: OnGoingBookingItem
slug: /features/bookings/components/ongoingbookingitem.native.test.tsx/ongoingbookingitem
---

# OnGoingBookingItem

Cette documentation décrit le comportement du composant `OnGoingBookingItem` dans l'application. Ce composant affiche des informations sur les réservations en cours et gère les interactions de l'utilisateur.

## Contexte: Sur un ticket de retrait sur site (On Site Withdrawal Ticket Event)

Ce contexte concerne l'affichage de l'élément de réservation lorsqu'il est lié à un événement de retrait sur site.

*   **Comportement attendu:**
    *   Affiche un rappel de retrait ("withdrawal reminder").
    *   Ne doit pas afficher de rappel d'événement ("event reminder").
    *   Affiche des messages d'expiration.
        *   Affiche le message d'expiration : "Ta réservation s'archivera dans XX jours".
        *   Affiche tout autre message d'expiration pertinent.

## Contexte: Pas sur un ticket de retrait sur site (Not On Site Withdrawal Ticket Event)

Ce contexte concerne l'affichage de l'élément de réservation lorsqu'il n'est pas lié à un événement de retrait sur site.

*   **Comportement attendu:**
    *   Ne doit pas afficher de rappel de retrait ("withdrawal reminder").
    *   Affiche un rappel d'événement ("event reminder").
    *   Affiche des messages d'expiration.
        *   Affiche le message d'expiration : "Ta réservation s'archivera dans XX jours".
        *   Affiche tout autre message d'expiration pertinent.

## Généralités sur l'affichage des expirations

Indépendamment du contexte, le composant doit toujours afficher les messages d'expiration pertinents pour la réservation.

*   **Comportement attendu:**
    *   Affiche un message d'expiration standard : "Ta réservation s'archivera dans XX jours".
    *   Affiche tous les autres messages d'expiration spécifiques à la réservation.

## Interactions et Actions Utilisateur

Ce contexte décrit les interactions possibles avec le composant `OnGoingBookingItem`.

*   **Comportement attendu:**
    *   **Navigation vers les détails de la réservation:** Cliquer sur le composant `OnGoingBookingItem` doit rediriger l'utilisateur vers la page de détails de la réservation.
    *   **Journalisation d'analyse (CTA click):** Lorsque l'utilisateur clique sur l'appel à l'action (CTA), le composant doit déclencher l'enregistrement d'un événement d'analyse `logViewedBookingPage`.
    *   **Fonctionnalité de partage:** Cliquer sur l'icône de partage doit déclencher la fonction de partage (appel à la fonction `share`).
    *   **Journalisation d'analyse (Share click):** Lorsque l'utilisateur clique sur l'icône de partage, le composant doit déclencher l'enregistrement d'un événement d'analyse.
