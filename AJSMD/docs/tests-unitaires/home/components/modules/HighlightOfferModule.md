---
title: HighlightOfferModule
slug: /features/home/components/modules/highlightoffermodule.native.test.tsx/highlightoffermodule
---

# HighlightOfferModule

Cette documentation décrit le comportement du module `HighlightOfferModule`, un composant d'affichage pour les offres promotionnelles.

## Comportements par contexte/scénario

Voici les différents scénarios et le comportement attendu du module :

**1. Affichage initial et absence d'offre**

*   **Description:** Le module est initialisé et tente d'afficher une offre.
*   **Comportement attendu:**
    *   Si aucune offre correspondante n'est trouvée, le module ne doit rien afficher (ne pas rendre d'élément).
    *   Un événement d'analyse (analytics) doit être envoyé pour signaler l'affichage du module.

**2. Interaction avec le module - Navigation vers la page de l'offre**

*   **Description:** L'utilisateur interagit avec le module, par exemple en appuyant sur un bouton ou en cliquant sur une zone spécifique.
*   **Comportement attendu:**
    *   L'appui sur le module doit naviguer l'utilisateur vers la page de l'offre correspondante.

**3. Affichage de la date de publication - Avec publicationDate future et displayPublicationDate à true**

*   **Description:** L'offre possède une date de publication future et la configuration `displayPublicationDate` est définie sur `true`.
*   **Comportement attendu:**
    *   La date de publication doit être affichée dans le module.

**4. Affichage de la date de publication - Avec publicationDate future et displayPublicationDate à false**

*   **Description:** L'offre possède une date de publication future et la configuration `displayPublicationDate` est définie sur `false`.
*   **Comportement attendu:**
    *   La date de publication ne doit pas être affichée dans le module.
