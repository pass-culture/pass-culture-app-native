---
title: TicketWithdrawal
slug: /features/bookings/components/oldbookingdetails/ticketbody/ticketwithdrawal/ticketwithdrawal.native.test.tsx/ticketwithdrawal
---

---
title: TicketWithdrawal
slug: /components/ticketwithdrawal
---

# TicketWithdrawal

## ⚙️ Comportement général de `<TicketWithdrawal />`

Cette section décrit le comportement général du composant `<TicketWithdrawal />` basé sur la configuration fournie.

### Scénario 1 : Affichage selon le type de retrait

Ce scénario concerne l'affichage de l'icône en fonction du type de retrait spécifié.

*   **Quand le type de retrait est "par email"**
    *   Doit afficher l'icône de retrait par email.

*   **Quand le type de retrait est "sur site"**
    *   Ne doit pas afficher l'icône de retrait par email.

### Scénario 2 : Affichage du délai de retrait

Ce scénario concerne l'affichage du délai de retrait lorsqu'il est spécifié pour un retrait "sur site".

*   **Quand le délai de retrait est spécifié**
    *   Doit afficher le délai de retrait "sur site".

*   **Quand le délai de retrait n'est pas spécifié**
    *   Ne doit pas afficher le délai de retrait "sur site".
