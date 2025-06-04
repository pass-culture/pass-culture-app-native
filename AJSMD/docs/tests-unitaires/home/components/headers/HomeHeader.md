---
title: HomeHeader
slug: /features/home/components/headers/homeheader.native.test.tsx/homeheader
---

HomeHeader

## Documentation

Cette documentation décrit le comportement du composant `HomeHeader`. Elle détaille les différents scénarios et les règles de gestion associées.

### Scénarios et Comportements

Voici les différents scénarios et les comportements attendus pour le composant `HomeHeader` :

#### 1. Affichage du Sous-Titre

Le sous-titre affiché dans le `HomeHeader` dépend du type d'utilisateur et de son statut :

*   **Utilisateur Ancien Bénéficiaire (ex beneficiary users):**
    *   Sous-titre : "Ton crédit est expiré"
*   **Utilisateur Bénéficiaire (beneficiary users):**
    *   Sous-titre : "Tu as 56 € sur ton pass"
*   **Utilisateur Ancien Bénéficiaire Éligible (eligible ex beneficiary users):**
    *   Sous-titre : "Toute la culture à portée de main"
*   **Utilisateur avec Offre Gratuite Éligible (eligible free offer users):**
    *   Sous-titre : "" (chaine vide)
*   **Utilisateur Général (general users):**
    *   Sous-titre : "Toute la culture à portée de main"
*   **Utilisateur Non Connecté (not logged in users):**
    *   Sous-titre : "Toute la culture à portée de main"

#### 2. Affichage du Widget de Localisation (LocationWidget)

L'affichage du widget de localisation (`LocationWidget`) dépend de la taille de l'écran :

*   **Viewport Desktop (isDesktopViewport est true):**
    *   Le `LocationWidget` **n'est pas affiché**.
*   **Viewport Mobile/Tablette (isDesktopViewport est false):**
    *   Le `LocationWidget` **est affiché**.

#### 3. Affichage du Titre de Localisation (LocationTitleWidget)

L'affichage du titre de localisation (`LocationTitleWidget`) dépend de la taille de l'écran :

*   **Viewport Desktop (isDesktopViewport est true):**
    *   Le `LocationTitleWidget` **est affiché**.
*   **Viewport Mobile/Tablette (isDesktopViewport est false):**
    *   Le `LocationTitleWidget` **n'est pas affiché**.
