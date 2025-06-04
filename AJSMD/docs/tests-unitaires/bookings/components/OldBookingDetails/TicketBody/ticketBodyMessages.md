---
title: ticketBodyMessages
slug: /features/bookings/components/oldbookingdetails/ticketbody/ticketbodymessages.test.ts/ticketbodymessages
---

# ticketBodyMessages

Cette documentation décrit le comportement du composant `ticketBodyMessages`, qui est responsable de la génération de messages spécifiques pour un ticket, en fonction de divers paramètres comme le type de retrait, le délai de retrait, et la date de l'offre.

## Scénarios et Comportements

Voici les différents scénarios et les comportements attendus du composant :

### 1. Messages de Démarrage (getStartMessage)

Ce scénario décrit la génération du message de démarrage du ticket en fonction du type de retrait.

*   **Contexte : Retrait sur Site**
    *   Le composant affiche un message spécifique indiquant que le retrait se fera sur place.

*   **Contexte : Retrait par Email**
    *   Le composant affiche un message spécifique indiquant que le retrait se fera par email.

*   **Contexte : Pas de Type de Retrait Défini**
    *   Le composant ne retourne aucun message de démarrage.

### 2. Messages de Délai (getDelayMessage)

Ce scénario concerne la gestion des messages liés à un éventuel délai de retrait.

*   **Contexte : Délai de Retrait Présent**
    *   Le composant affiche un message spécifique concernant le délai de retrait.

*   **Contexte : Pas de Délai de Retrait**
    *   Le composant ne retourne aucun message de délai.

### 3. Messages d'Email (getEmailMessage)

Ce scénario gère l'affichage de messages liés à la date de l'offre.

*   **Contexte : Date de l'Offre = Aujourd'hui**
    *   Le composant affiche un message spécifique si la date de l'offre est le jour même.

*   **Contexte : Date de l'Offre != Aujourd'hui**
    *   Le composant affiche un message spécifique si la date de l'offre n'est pas le jour même.
