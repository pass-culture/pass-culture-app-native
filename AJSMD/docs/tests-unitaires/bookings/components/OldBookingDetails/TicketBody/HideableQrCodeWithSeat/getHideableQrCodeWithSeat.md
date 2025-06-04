---
title: getHideableQrCodeWithSeat
slug: /features/bookings/components/oldbookingdetails/ticketbody/hideableqrcodewithseat/gethideableqrcodewithseat.native.test.ts/gethideableqrcodewithseat
---

---
title: Affichage du QR Code avec Seat et Gestion de l'Affichage Conditionnel
slug: /tests/getHideableQrCodeWithSeat
---

# getHideableQrCodeWithSeat

Cette fonctionnalité gère l'affichage conditionnel d'un QR Code associé à une réservation, en fonction de divers critères tels que la catégorie de la réservation, l'état d'activation d'une fonctionnalité (Feature Flag) et le moment de l'affichage.

## ⚙️ Comportement de Base

*   **Fonctionnement par défaut:**
    *   La fonction `getHideableQrCodeWithSeat` doit fonctionner correctement avec les paramètres par défaut. (Implique que la fonction accepte des valeurs par défaut pour ses arguments et produit un comportement attendu sans spécification particulière.)

## 🎟️ Comportement en fonction de la visibilité et du contexte de la réservation

### 1. Réservation dans une catégorie qui ne doit pas être cachée

*   **Avant la visibilité :**
    *   Affiche le QR Code. (Quel que soit le contexte, le QR Code est visible par défaut dans cette catégorie avant l'affichage.)

*   **Au moment de la visibilité :**
    *   Affiche le QR Code. (L'affichage persistera lorsque l'élément devient visible.)

### 2. Réservation dans une catégorie qui doit être cachée

*   **Avant la visibilité :**
    *   Cache le QR Code.
    *   Affiche le jour correct.
    *   Affiche l'heure correcte.

*   **Au moment de la visibilité :**
    *   Affiche le QR Code. (Le QR Code devient visible au moment de l'affichage.)

## 🚩 Comportement en fonction du Feature Flag `enableHideTicket`

### 1. Quand `enableHideTicket` est **activé**

*   Le QR Code doit être masqué (comportement non spécifié, mais implicite qu'il doit être masqué/rendu invisible dans une condition générale).

### 2. Quand `enableHideTicket` est **désactivé**

*   Ne doit pas masquer le QR Code (implique que le QR Code est affiché, quel que soit le contexte spécifique de la réservation).
