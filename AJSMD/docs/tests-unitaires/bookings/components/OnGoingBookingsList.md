---
title: OnGoingBookingsList
slug: /features/bookings/components/ongoingbookingslist.native.test.tsx/ongoingbookingslist
---

---
title: OnGoingBookingsList
slug: /tests/ongoingbookingslist
---

# OnGoingBookingsList - Gestion des réservations en cours

## 🔄 Rafraîchissement des données (Pull to Refresh)

Ce scénario décrit le comportement de la fonctionnalité de rafraîchissement des données dans la liste des réservations en cours.

### Contexte : Connectivité réseau disponible
- **Pré-requis :** Le composant détecte que l'appareil est connecté à Internet ( `netInfo.isConnected && netInfo.isInternetReachable` est vrai).
- **Comportement :**
    - Autorise l'utilisateur à lancer un rafraîchissement des données en tirant vers le bas (pull to refetch).
    - Lors du pull to refetch, le composant tente de récupérer les données de réservation les plus récentes.

### Contexte : Pas de connectivité réseau
- **Pré-requis :** Le composant détecte que l'appareil n'est pas connecté à Internet ( `netInfo.isConnected && netInfo.isInternetReachable` est faux).
- **Comportement :**
    - **Ne permet pas** le rafraîchissement des données en tirant vers le bas.
    - Affiche une snack bar (message court en bas de l'écran) avec le message "Impossible de recharger tes réservations, connecte-toi à internet pour réessayer." lorsque l'utilisateur tente de rafraîchir.

## ⏳ Affichage des placeholders (chargement)

Ce scénario décrit comment le composant gère l'affichage pendant le chargement des données.

### Contexte : Chargement des réservations en cours
- **Comportement :**
    - Affiche un placeholder visuel pendant que les données de réservation sont en cours de chargement.  Ceci indique à l'utilisateur que les informations sont en train d'être récupérées.

### Contexte : Chargement des sous-catégories en cours (non spécifié, mais déduit)
- **Comportement :**
    - Affiche un placeholder visuel pendant que les sous-catégories sont en cours de chargement. Ce comportement est similaire au chargement des réservations.

## 📈 Analytics - Suivi du défilement

Ce scénario décrit le suivi des événements d'analyse liés au défilement de la liste des réservations.

### Contexte : Atteinte du bas de la liste
- **Comportement :**
    - Déclenche l'événement d'analyse `BookingsScrolledToBottom` lorsque l'utilisateur atteint le bas de la liste des réservations.  Ceci permet de mesurer le nombre de fois que l'utilisateur arrive à la fin de la liste.
    - Déclenche l'événement `BookingsScrolledToBottom` **une seule fois** par session de défilement.  Si l'utilisateur continue de faire défiler, l'événement n'est pas répété.  Cela évite les doublons et l'inflation des données d'analyse.
