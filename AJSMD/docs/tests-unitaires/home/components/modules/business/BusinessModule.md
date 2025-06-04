---
title: BusinessModule
slug: /features/home/components/modules/business/businessmodule.native.test.tsx/businessmodule
---

# BusinessModule

Cette documentation décrit le comportement du composant `BusinessModule`. Il affiche une image cliquable et gère des interactions basées sur l'état de l'utilisateur et des conditions spécifiques.

## Scénarios et Comportements

### 1. Affichage de base et interactions utilisateur

*   **Comportement général :** Le composant affiche une image. Le clic sur l'image déclenche des actions.
*   **Action au clic :**
    *   Un événement de journalisation `BusinessBlockClicked` est déclenché.
    *   L'URL configurée pour le module est ouverte dans un nouvel onglet.

### 2. Journalisation conditionnelle de l'affichage du module

*   **Conditions :** L'affichage du module sur la page d'accueil est déterminé par la valeur booléenne `shouldModuleBeDisplayed`.
*   **Comportement :**
    *   Si `shouldModuleBeDisplayed` est `true`, l'événement de journalisation `ModuleDisplayedOnHomepage` est déclenché.
    *   Si `shouldModuleBeDisplayed` est `false`, l'événement de journalisation `ModuleDisplayedOnHomepage` est *également* déclenché. (Cela indique que l'événement doit être déclenché quelle que soit la visibilité du module, ce qui pourrait être utilisé pour suivre des tentatives d'affichage manquées, par exemple).

### 3. Gestion de l'URL et de l'e-mail (utilisateur connecté)

*   **Conditions :**
    *   L'utilisateur est connecté.
    *   Une URL spécifique est configurée pour le module et requiert l'email.
    *   L'email doit être remplacé dans l'URL.
*   **Comportement :**
    *   L'URL configurée est ouverte, avec l'adresse email de l'utilisateur connecté substituée dans l'URL.
    *   Si l'email de l'utilisateur est correct : l'utilisateur est redirigé vers l'URL remplie, sans afficher de snackbar.
    *   Si l'email de l'utilisateur est incorrect (ou si l'utilisateur n'a pas encore d'email dans son profil) : une snackbar est affichée, indiquant l'attente de l'email.

### 4. Gestion de l'URL et de l'e-mail (utilisateur non connecté ou données manquantes)

*   **Conditions :**
    *   Les données de l'utilisateur (en particulier l'email) ne sont pas encore reçues ou l'utilisateur n'est pas connecté.
    *   L'URL configurée nécessite l'email, mais l'email n'est pas disponible.
*   **Comportement :**
    *   Le module s'affiche normalement.
    *   Pas de snackbar affichée.
    *   L'ouverture de l'URL suivra la logique prévue au contexte "Affichage de base et interactions utilisateur".
