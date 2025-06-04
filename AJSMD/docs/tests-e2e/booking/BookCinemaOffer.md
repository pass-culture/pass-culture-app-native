---
title: BookCinemaOffer
slug: /bookcinemaoffer
---

# Réserver une Séance de Cinéma

Ce document vous guide à travers les étapes d'une réservation de séance de cinéma dans l'application.

## 1. Accéder aux Offres et Sélectionner le Cinéma

*   L'utilisateur arrive sur l'écran d'accueil.
*   L'application vérifie que le bouton "Rechercher" est visible.
*   L'utilisateur lance un processus qui configure des éléments sur l'application (probablement des paramètres).
*   L'utilisateur fait défiler l'écran vers le haut pour trouver les offres.
*   L'utilisateur appuie sur l'offre "Séance de cinéma" (index 1, ce qui signifie probablement la première offre de ce type).

## 2. Attendre le Chargement et Choisir la Séance

*   L'application attend que l'animation de chargement se termine.
*   Si l'option "Accéder aux séances" n'est pas immédiatement visible, l'application effectue les actions suivantes en boucle jusqu'à ce qu'elle le soit :
    1.  L'utilisateur appuie sur le bouton "Retour".
    2.  L'application fait défiler l'écran.
    3.  L'utilisateur appuie à nouveau sur "Séance de cinéma" (index 1).
    4.  L'application attend la fin de l'animation de chargement.
*   Une fois "Accéder aux séances" visible, l'utilisateur appuie dessus.
*   L'application affiche l'écran "Trouve ta séance".
*   L'application exécute un processus qui permet de choisir le jour de la séance (probablement la sélection du cinéma et la date).
*   L'utilisateur sélectionne une séance.

## 3. Sélectionner le Prix et Finaliser la Réservation

*   L'utilisateur appuie sur une zone de l'écran pour choisir une séance, probablement liée à une image (identifiée par l'ID 'VenuePreviewImage').
*   Si l'écran affiche "Prix", l'utilisateur sélectionne le premier prix disponible.
*   L'utilisateur appuie sur "Valider le prix".
*   L'application affiche l'écran "Nombre de places".
*   L'utilisateur choisit "Solo".
*   L'utilisateur appuie sur "Finaliser ma réservation".

## 4. Vérifier les Détails et Confirmer

*   L'application affiche "Détails de la réservation".
*   L'utilisateur coche la case "J’ai lu et j’accepte les conditions générales d’utilisation".
*   L'utilisateur fait défiler l'écran pour trouver "Confirmer la réservation".
*   L'utilisateur appuie deux fois sur "Confirmer la réservation".

## 5. Confirmation et Annulation

*   L'application affiche "Réservation confirmée !".
*   L'utilisateur appuie sur "Voir ma réservation".
*   L'application fait défiler l'écran.
*   Si l'option "Annuler ma réservation" est visible, l'utilisateur appuie dessus, puis appuie à nouveau dessus.
*   L'application attend la fin de l'animation.
*   Si "Voir le détail de l’offre" est visible, l'utilisateur appuie dessus puis revient en arrière deux fois pour revenir au point de départ.
