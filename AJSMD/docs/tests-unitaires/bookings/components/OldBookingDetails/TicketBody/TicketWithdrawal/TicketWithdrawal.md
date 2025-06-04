---
title: TicketWithdrawal
slug: /features/bookings/components/oldbookingdetails/ticketbody/ticketwithdrawal/ticketwithdrawal.native.test.tsx/ticketwithdrawal
---

# TicketWithdrawal

Ce composant gère l'affichage des informations relatives au retrait de billets, en fonction du type de retrait et de la présence d'un délai.

**Contexte 1 : Retrait par email**

*   **Description:** Ce contexte concerne l'affichage des informations lorsqu'un retrait de billet est configuré pour être effectué par email.

*   **Comportements attendus:**

    *   Afficher l'icône de retrait par email.
    *   Ne pas afficher de délai de retrait, quel que soit le délai configuré.

**Contexte 2 : Retrait sur site sans délai**

*   **Description:** Ce contexte gère l'affichage des informations lorsqu'un retrait de billet est configuré pour être effectué sur site et qu'aucun délai n'est spécifié.

*   **Comportements attendus:**

    *   Ne pas afficher l'icône de retrait par email.
    *   Ne pas afficher le délai de retrait.

**Contexte 3 : Retrait sur site avec délai**

*   **Description:** Ce contexte gère l'affichage des informations lorsqu'un retrait de billet est configuré pour être effectué sur site et qu'un délai est spécifié.

*   **Comportements attendus:**

    *   Ne pas afficher l'icône de retrait par email.
    *   Afficher le délai de retrait.
