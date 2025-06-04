---
title: TicketSwiperControls
slug: /features/bookings/components/oldbookingdetails/ticket/ticketswipercontrols.native.test.tsx/ticketswipercontrols
---

---
title: TicketSwiperControls
slug: /components/ticketswipercontrols
---

# TicketSwiperControls - Documentation de la Fonctionnalité

Cette documentation détaille le comportement du composant `TicketSwiperControls`, responsable de la navigation dans un flux de tickets.

## 🧭 Navigation dans le Flux de Tickets

Ce contexte décrit le comportement général des boutons de navigation ("Précédent" et "Suivant") en fonction de l'étape actuelle et du nombre total d'étapes.

- **Fonctionnalité Principale:** Contrôle de la navigation entre les étapes d'un processus, probablement en lien avec l'affichage de tickets.

### Scénario : Navigation et Étapes

*   **currentStep** représente l'étape actuelle (un nombre entier, commençant probablement par 1).
*   **numberOfSteps** représente le nombre total d'étapes dans le processus.

#### Comportement des Boutons

*   **Bouton "Précédent":**
    *   **À l'étape 1 (currentStep === 1):** Le bouton "Précédent" est **masqué**.
    *   **À toute autre étape (currentStep > 1):** Le bouton "Précédent" est **affiché**.

*   **Bouton "Suivant":**
    *   **À la dernière étape (currentStep === numberOfSteps):** Le bouton "Suivant" est **masqué**.
    *   **À toute autre étape (currentStep !== numberOfSteps):** Le bouton "Suivant" est **affiché**.

