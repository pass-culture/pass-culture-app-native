---
title: TicketSwiper
slug: /features/bookings/components/oldbookingdetails/ticket/ticketswiper.native.test.tsx/ticketswiper
---

# TicketSwiper - Documentation Technique

Cette documentation décrit le comportement du composant `TicketSwiper`, responsable de l'affichage et de la navigation des tickets.

## Scénarios et Comportements

### 1. Affichage du Contrôle de Navigation (Swiper)

Ce scénario concerne la visibilité des contrôles de navigation (flèches, indicateurs) permettant de faire défiler les tickets.

*   **Règle:** Le contrôle de navigation **ne doit pas** s'afficher si un seul ticket est disponible.
*   **Règle:** Le contrôle de navigation **doit** s'afficher si plusieurs tickets sont disponibles (nombre de tickets > 1).

### 2. Affichage des Tickets sans Informations de Réservations Externes

Ce scénario concerne l'affichage des tickets lorsqu'il n'y a pas de réservations externes associées.

*   **Règle:** Le `TicketSwiper` **doit** afficher un ticket sans aucune information de réservations externes si `externalBookings` est `null`.
*   **Règle:** Le `TicketSwiper` **doit** afficher un ticket sans aucune information de réservations externes si `externalBookings` est un tableau vide (`[]`).

### 3. Affichage des Tickets avec une Réservation Externe

Ce scénario concerne l'affichage des tickets lorsqu'il y a une seule réservation externe.

*   **Règle:** Le `TicketSwiper` **doit** afficher un ticket avec les informations de la réservation externe lorsqu'il existe une réservation externe.

### 4. Affichage de Plusieurs Tickets

Ce scénario décrit le comportement du `TicketSwiper` lorsque plusieurs tickets sont disponibles.

*   **Règle:** Le `TicketSwiper` **doit** afficher autant de tickets qu'il y en a.  Chaque ticket devrait potentiellement afficher des informations de réservations externes si elles sont présentes.
