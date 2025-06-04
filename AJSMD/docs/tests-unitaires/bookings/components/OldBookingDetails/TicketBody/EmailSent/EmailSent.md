---
title: EmailSent
slug: /features/bookings/components/oldbookingdetails/ticketbody/emailsent/emailsent.native.test.tsx/emailsent
---

EmailSent

# Documentation de la fonctionnalité EmailSent

Cette documentation décrit le comportement du composant `EmailSent`. Ce composant gère l'affichage d'informations liées à l'envoi d'emails, notamment la présentation d'un bouton pour consulter les emails.

## Scénarios et Comportements

Voici les différents scénarios et les comportements attendus du composant `EmailSent` :

### Scénario 1: Affichage standard

*   **Description:** Ce scénario décrit le comportement par défaut du composant.
*   **Règles de gestion:**
    *   Le composant doit afficher un bouton intitulé "Consulter mes e-mails".
    *   Ce bouton est toujours présent dans ce scénario.

### Scénario 2: Disponibilité de l'application de messagerie

*   **Description:** Ce scénario concerne la détection et la gestion de la disponibilité d'une application de messagerie sur l'appareil de l'utilisateur.
*   **Règles de gestion:**
    *   Si aucune application de messagerie n'est disponible sur le système de l'utilisateur, le composant ne doit pas afficher le bouton permettant d'ouvrir directement l'application de messagerie.
    *   Les détails de l'interaction avec l'application de messagerie (par exemple, ouverture de l'application) ne sont pas décrits dans cette documentation, mais sont conditionnés par la présence de l'application.
