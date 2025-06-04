---
title: useBookingsReactionHelpers
slug: /features/home/components/helpers/usebookingsreactionhelpers.native.test.ts/usebookingsreactionhelpers
---

# useBookingsReactionHelpers

## Introduction

Cette fonctionnalité gère la logique d'affichage et de masquage des réactions (par exemple, "J'aime", "Je n'aime pas") sur les réservations. Elle s'appuie sur un "Feature Flag" nommé `wipReactionFeature` pour activer ou désactiver son comportement.

## Comportements

### 1. `wipReactionFeature` est activé (true)

Ce scénario représente le comportement actif de la fonctionnalité, lorsque les réactions sur les réservations sont potentiellement visibles.

*   **Scénario 1: Réservations avec des réactions existantes**

    *   Si les réservations ont déjà des réactions associées, la fonction `useBookingsReactionHelpers` doit retourner `shouldNotShow`. Cela signifie que l'interface utilisateur ne devrait pas afficher les options pour ajouter de nouvelles réactions. On suppose ici que la fonctionnalité est soit déjà activée et visible, soit qu'elle n'est pas pertinente pour les réservations qui ont déjà des réactions.

*   **Scénario 2: Réservations sans réactions**

    *   Si des réservations existent et qu'elles n'ont pas encore de réactions, la fonction `useBookingsReactionHelpers` doit retourner `shouldShow`. Cela implique que l'interface utilisateur doit afficher les options pour ajouter des réactions (par exemple, les boutons "J'aime", "Je n'aime pas").

### 2. `wipReactionFeature` est désactivé (false)

Ce scénario représente le comportement inactif de la fonctionnalité, lorsque les réactions sur les réservations ne sont pas censées être visibles ou gérées.

*   **Comportement Général**

    *   La fonction `useBookingsReactionHelpers` doit retourner `false`. Cela indique que toute la logique liée aux réactions est désactivée. L'interface utilisateur ne doit pas afficher les options pour ajouter des réactions, et aucun code lié aux réactions ne devrait être exécuté.
