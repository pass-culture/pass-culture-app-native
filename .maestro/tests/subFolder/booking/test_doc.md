# 📄 Réservations (Comportement testé)

## ✅ Affichage initial

- Le composant doit s’afficher correctement.  
- Par défaut, la **liste des réservations** doit être affichée.  

## 🔄 Exécution de la requête de données

- La requête de récupération des réservations doit **toujours s’exécuter**, que les données soient **en cache ou non**.  

## 🈳 Gestion des cas sans données

- Si aucune réservation n'est disponible, une **vue dédiée "réservations vides"** doit être affichée.  

## 🧭 Navigation via onglets

- L’interface doit proposer **deux onglets** :
  - _"Terminées"_
  - _"En cours"_  

- En changeant d’onglet vers **"Terminées"**, une **réservation terminée** doit être affichée.  

## ♻️ Mise à jour des réactions utilisateur

- Lors d’un **changement d’onglet depuis "Terminées"**, la fonction `updateReactions` doit être appelée.  

- Les réactions utilisateur doivent être **mises à jour** pour les **réservations terminées sans réaction**.  

## 🔔 Pastille de notification (en fonction d’un feature flag)

- Si le **feature flag `wipReactionFeature` est activé** et qu’il y a des réservations **sans réaction utilisateur**, une **pastille doit s’afficher**.  

- Si le **feature flag est désactivé**, **aucune pastille ne doit s’afficher**, même si des réservations sans réaction existent.  

- Si **aucune réservation sans réaction** n’existe, **aucune pastille ne doit s’afficher**, même si le feature flag est activé.  
