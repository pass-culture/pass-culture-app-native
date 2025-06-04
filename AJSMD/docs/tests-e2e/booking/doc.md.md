---
title: doc.md
slug: /doc.md
---

# 🗓️ Gérer ses Réservations

Ce document décrit le parcours utilisateur pour consulter et gérer ses réservations dans l'application.

## 1. Arrivée sur l'écran des Réservations

*   L'application affiche l'écran principal des réservations.
*   Par défaut, une liste des réservations en cours est affichée.

## 2. Exécution de la Requête

*   L'application recherche automatiquement les réservations dès l'ouverture de l'écran, que les informations soient déjà enregistrées ou non.

## 3. Absence de Réservations

*   Si l'utilisateur n'a aucune réservation, l'écran affiche un message indiquant qu'il n'y a aucune réservation pour le moment.

## 4. Navigation entre les Onglets

*   L'écran propose deux onglets : "En cours" et "Terminées".
*   L'utilisateur peut basculer entre les onglets en appuyant sur ceux-ci.

## 5. Affichage des Réservations Terminées

*   En changeant d'onglet pour "Terminées", l'application affiche une réservation qui est terminée.

## 6. Mise à jour des Réactions

*   Lors du passage à l'onglet "Terminées", l'application vérifie les réservations terminées et met à jour les réactions de l'utilisateur pour celles qui n'ont pas encore de réaction.

## 7. Pastille de Notification (Fonctionnalité optionnelle)

*   **Si la fonctionnalité "réactions en cours de développement" est activée** et qu'il existe des réservations terminées sans réaction utilisateur :
    *   Une pastille de notification (un petit indicateur visuel) apparaît pour signaler la présence de réservations à évaluer.
*   **Si la fonctionnalité est désactivée**, aucune pastille n'apparaît, même s'il y a des réservations sans réaction.
*   **Si aucune réservation n'a besoin d'une réaction**, aucune pastille ne s'affiche, même si la fonctionnalité est activée.
