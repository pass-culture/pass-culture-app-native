---
title: SubscribeButtonWithTooltip
slug: /features/home/components/subscribebuttonwithtooltip.native.test.tsx/subscribebuttonwithtooltip
---

# SubscribeButtonWithTooltip

## Vue d'ensemble

Ce composant est un bouton d'abonnement qui affiche une infobulle (tooltip) contextuelle pour guider l'utilisateur vers l'abonnement. L'infobulle s'affiche dans des conditions spécifiques pour maximiser son utilité et minimiser son caractère intrusif.

## Comportements et Scénarios

Voici les comportements attendus du composant, regroupés par scénario:

### 1. Utilisateur non abonné, première interaction

*   **Déclenchement de l'infobulle:** L'infobulle ne doit pas s'afficher immédiatement. Elle doit s'afficher après un délai de 1 seconde suivant l'initialisation du composant.
*   **Durée de l'infobulle:** L'infobulle reste visible pendant 8 secondes après son affichage initial.
*   **Nombre de répétitions:** L'infobulle ne doit pas s'afficher plus de 3 fois au total.
*   **Fermeture manuelle:** L'infobulle doit se cacher lorsque l'utilisateur clique sur le bouton de fermeture.
*   **Blocage de la réapparition:** Après que l'utilisateur a fermé l'infobulle via le bouton de fermeture, celle-ci ne doit plus s'afficher.

### 2. Utilisateur déjà abonné

*   **Absence d'infobulle:** L'infobulle ne doit pas s'afficher du tout si l'utilisateur est déjà abonné.
