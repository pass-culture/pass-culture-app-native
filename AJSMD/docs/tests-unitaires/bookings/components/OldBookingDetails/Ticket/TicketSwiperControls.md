---
title: TicketSwiperControls
slug: /features/bookings/components/oldbookingdetails/ticket/ticketswipercontrols.native.test.tsx/ticketswipercontrols
---

# TicketSwiperControls

Cette documentation décrit le comportement du composant `TicketSwiperControls` et les règles qui régissent l'affichage de ses boutons de navigation (Précédent et Suivant).

**Contexte général:**  Cette fonctionnalité gère la navigation entre les étapes d'un processus, probablement lié à la gestion des tickets.

**Scénarios et Comportements:**

*   **Scénario 1: Navigation dans les étapes (currentStep > 1 & currentStep < numberOfSteps)**

    *   **Description:** L'utilisateur se trouve à une étape autre que la première ou la dernière.
    *   **Comportements Attendus:**
        *   Le bouton "Précédent" est visible.
        *   Le bouton "Suivant" est visible.

*   **Scénario 2: Sur la première étape (currentStep === 1)**

    *   **Description:** L'utilisateur est actuellement sur la première étape du processus.
    *   **Comportements Attendus:**
        *   Le bouton "Précédent" est caché.
        *   Le bouton "Suivant" est visible.

*   **Scénario 3: Sur la dernière étape (currentStep === numberOfSteps)**

    *   **Description:** L'utilisateur est actuellement sur la dernière étape du processus.
    *   **Comportements Attendus:**
        *   Le bouton "Précédent" est visible.
        *   Le bouton "Suivant" est caché.

