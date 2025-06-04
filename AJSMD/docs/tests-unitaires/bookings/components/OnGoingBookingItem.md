---
title: OnGoingBookingItem
slug: /features/bookings/components/ongoingbookingitem.native.test.tsx/ongoingbookingitem
---

```markdown
# OnGoingBookingItem - Documentation Fonctionnelle

## 🎯 Introduction

Cette documentation détaille le comportement de la fonctionnalité `OnGoingBookingItem` qui affiche les informations relatives aux réservations en cours. Elle décrit les règles de gestion et les actions attendues en fonction de différents contextes et scénarios.

## 🗺️ Contexte et Scénarios

Les comportements de `OnGoingBookingItem` varient selon :

1.  **Le contexte de l'événement lié au ticket (événement de retrait sur site ou non).**
2.  **L'échéance de la réservation (proche de l'expiration ou non).**
3.  **Les interactions de l'utilisateur.**

## ⚙️ Comportements Détaillés

### 1.  Scénario : Événement de Retrait sur Site

Ce scénario concerne les `OnGoingBookingItem` associés à un événement de retrait sur site.

**Règles de gestion :**

*   **Affichage des rappels:**
    *   Doit afficher un rappel de retrait (e.g., un message pour rappeler à l'utilisateur de retirer le ticket).
    *   Ne doit **pas** afficher un rappel d'événement (e.g., rappel de l'heure et du lieu de l'événement).

### 2.  Scénario : Absence d'Événement de Retrait sur Site

Ce scénario concerne les `OnGoingBookingItem` qui ne sont **pas** associés à un événement de retrait sur site.

**Règles de gestion :**

*   **Affichage des rappels:**
    *   Ne doit **pas** afficher un rappel de retrait.
    *   Doit afficher un rappel d'événement.

### 3.  Scénario : Messages d'Expiration

Ce scénario concerne l'affichage des messages relatifs à l'expiration des réservations.

**Règles de gestion :**

*   **Affichage des messages d'expiration:**
    *   Doit afficher des messages indiquant l'approche de l'expiration de la réservation.
    *   Doit afficher le message spécifique : "Ta réservation s'archivera dans XX jours" (où XX est le nombre de jours restant avant l'expiration).
    *   Doit afficher d'autres messages pertinents concernant l'expiration (ces messages ne sont pas détaillés, mais la fonctionnalité doit les gérer correctement).

### 4.  Scénario : Interactions avec l'Utilisateur

Ce scénario détaille les actions disponibles pour l'utilisateur lorsqu'il interagit avec le composant.

**Règles de gestion :**

*   **Navigation et interaction:**
    *   Doit permettre à l'utilisateur de naviguer vers la page de détails de la réservation en cliquant sur l'élément.
    *   Doit enregistrer un événement analytique "logViewedBookingPage" lorsque l'utilisateur clique sur l'appel à l'action (CTA - Call To Action).
    *   Doit permettre à l'utilisateur de partager la réservation.
    *   Doit appeler la fonction de partage (share) lorsqu'il appuie sur l'icône de partage.
    *   Doit enregistrer des données analytiques (analytics) lorsque l'utilisateur appuie sur l'icône de partage.
```
