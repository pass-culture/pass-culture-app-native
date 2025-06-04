---
title: TicketSwiper
slug: /features/bookings/components/oldbookingdetails/ticket/ticketswiper.native.test.tsx/ticketswiper
---

---
title: TicketSwiper - Affichage et gestion des tickets
slug: /components/ticketswiper
---

# TicketSwiper

## ⚙️ Généralités

Cette fonctionnalité gère l'affichage et l'interaction avec les tickets, en particulier lorsqu'il y a plusieurs tickets à afficher. Elle utilise le composant `<TicketSwiper />` pour afficher les informations relatives aux tickets.

## 🎟️ Comportement du contrôleur Swiper

Le composant `<TicketSwiper />` affiche des contrôles de type "swiper" (navigation par glissement) pour parcourir les différents tickets.

### Scénario : Un seul ticket

- **Condition:** Le nombre de tickets est égal à un.
- **Comportement attendu:** Les contrôles de navigation de type "swiper" ne sont **pas affichés**.

### Scénario : Plusieurs tickets

- **Condition:** Le nombre de tickets est supérieur à un.
- **Comportement attendu:** Les contrôles de navigation de type "swiper" **sont affichés**, permettant à l'utilisateur de naviguer entre les différents tickets.

## 🎫 Affichage des Tickets

Le composant `<TicketSwiper />` affiche les informations de chaque ticket. Le contenu affiché dépend de la présence d'informations de réservation externe.

### Scénario : Absence de réservations externes (externalBookings est null)

- **Condition:** La variable `externalBookings` est nulle.
- **Comportement attendu:** Le ticket est affiché **sans** les informations relatives aux réservations externes.

### Scénario : Absence de réservations externes (externalBookings est un tableau vide)

- **Condition:** La variable `externalBookings` est un tableau vide (`[]`).
- **Comportement attendu:** Le ticket est affiché **sans** les informations relatives aux réservations externes.

### Scénario : Une réservation externe

- **Condition:** Il existe une seule réservation externe.
- **Comportement attendu:** Un seul ticket est affiché, **incluant** les informations relatives à la réservation externe.

### Scénario : Plusieurs tickets à afficher

- **Condition:** Le nombre de tickets est égal au nombre de tickets disponibles.
- **Comportement attendu:** Le composant affiche **autant de tickets** qu'il y en a en nombre.
