---
title: VideoMultiOfferTile
slug: /features/home/components/modules/video/videomultioffertile.native.test.tsx/videomultioffertile
---

# VideoMultiOfferTile

Cette documentation décrit le comportement du composant `VideoMultiOfferTile`. Ce composant est responsable de l'affichage et de l'interaction avec les offres vidéo.

## Comportements et Scénarios

Les comportements du composant `VideoMultiOfferTile` sont définis pour une interaction utilisateur simple et claire.

### 1. Interaction avec l'offre

Ce scénario décrit le comportement principal du composant lors de l'interaction de l'utilisateur avec une offre.

*   **Action:** L'utilisateur appuie (ou clique) sur le `VideoMultiOfferTile`.
*   **Résultat attendu:**
    *   **Redirection:** L'utilisateur est redirigé vers l'offre correspondante. Cela implique une navigation vers une autre page ou une autre section de l'application, en fonction de la configuration de l'offre.
    *   **Logging:** Un événement de type `ConsultOffer` est enregistré.  Cela permet de suivre les interactions des utilisateurs avec les offres. L'événement doit probablement contenir des informations pertinentes sur l'offre consultée (ID, type, etc.).
