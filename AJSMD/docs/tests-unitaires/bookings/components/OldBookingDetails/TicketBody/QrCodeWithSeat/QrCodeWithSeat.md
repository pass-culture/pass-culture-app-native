---
title: QrCodeWithSeat
slug: /features/bookings/components/oldbookingdetails/ticketbody/qrcodewithseat/qrcodewithseat.native.test.tsx/qrcodewithseat
---

```
# QrCodeWithSeat : Documentation de la Fonctionnalité

## 🎯 Vue d'ensemble

La fonctionnalité `QrCodeWithSeat` a pour objectif d'afficher le numéro de siège sur un QR code, en indiquant le nombre total de sièges.

## ⚙️ Comportements Détaillés

### 1. Affichage de base

*   **Comportement Attendu:**
    *   Doit afficher le numéro de siège sur le nombre total de sièges.
    *   Exemple : "Siège 7/20" (si le siège est le 7 et qu'il y a 20 sièges au total).

### 2. Absence de numéro de siège

*   **Comportement Attendu:**
    *   Doit afficher le numéro de siège si et seulement s'il y a un numéro de siège fourni.
    *   Si aucun numéro de siège n'est fourni, l'élément devrait soit ne rien afficher concernant le siège, soit afficher un message approprié (ex: "Siège non attribué").  La spécificité de l'affichage hors numéro de siège n'est pas définie dans la description initiale.
```
