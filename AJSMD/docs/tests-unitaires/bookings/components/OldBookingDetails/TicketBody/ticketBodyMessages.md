---
title: ticketBodyMessages
slug: /features/bookings/components/oldbookingdetails/ticketbody/ticketbodymessages.test.ts/ticketbodymessages
---

---
title: ticketBodyMessages
slug: /tests/ticketbodymessages
---

# ticketBodyMessages - Gestion des messages dans le corps du ticket

Cette documentation décrit le comportement de la fonctionnalité `ticketBodyMessages`, qui gère l'affichage de messages spécifiques dans le corps d'un ticket en fonction de différents contextes, tels que le type de retrait, la présence d'un délai et la date d'offre.

## 🚀 Fonctionnalités principales

*   **Affichage des messages de démarrage :** Affichage de messages introductifs spécifiques en fonction du type de retrait.
*   **Affichage des messages de délai :** Indique la présence d'un délai associé au retrait.
*   **Affichage des messages d'e-mail :** Messages liés à la date de l'offre.

## 🗺️ Scénarios et Comportements

### 1. Affichage des messages de démarrage (`getStartMessage`)

Ce composant affiche un message de démarrage adapté en fonction du type de retrait spécifié.

*   **Scénario : Retrait sur place ("on site")**
    *   Le composant doit afficher le message correct pour un retrait sur place.
*   **Scénario : Retrait par email ("by email")**
    *   Le composant doit afficher le message correct pour un retrait par email.
*   **Scénario : Aucun type de retrait spécifié**
    *   Le composant ne doit **pas** afficher de message de démarrage.

### 2. Affichage des messages de délai (`getDelayMessage`)

Ce composant gère l'affichage des messages liés à un délai éventuel associé au retrait.

*   **Scénario : Délai de retrait présent**
    *   Le composant doit afficher le message correct indiquant la présence d'un délai.
*   **Scénario : Aucun délai de retrait**
    *   Le composant ne doit **pas** afficher de message de délai.

### 3. Affichage des messages d'e-mail (`getEmailMessage`)

Ce composant gère l'affichage des messages liés à la date de l'offre.

*   **Scénario : Date de l'offre est aujourd'hui**
    *   Le composant doit afficher le message correct lorsque la date de l'offre est aujourd'hui.
*   **Scénario : Date de l'offre n'est pas aujourd'hui**
    *   Le composant doit afficher le message correct lorsque la date de l'offre n'est pas aujourd'hui.
