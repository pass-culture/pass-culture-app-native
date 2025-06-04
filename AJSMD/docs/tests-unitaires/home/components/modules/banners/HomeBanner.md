---
title: HomeBanner
slug: /features/home/components/modules/banners/homebanner.native.test.tsx/homebanner
---

# HomeBanner

Ce document décrit le comportement du composant `<HomeBanner>` et les conditions qui déterminent son affichage.

## Scénarios et Comportements

Voici les différents scénarios et les comportements attendus du composant :

### 1. Feature Flag `showRemoteGenericBanner` Activé

Lorsque le feature flag `showRemoteGenericBanner` est activé, le composant doit afficher une bannière de mise à jour forcée.

*   **Comportement attendu:** Afficher la bannière de mise à jour forcée.

### 2. Utilisateur Non Connecté

Lorsque l'utilisateur n'est pas connecté, le composant doit afficher la bannière d'inscription.

*   **Comportement attendu:** Afficher `SignupBanner`.

### 3. Utilisateur Connecté

Lorsque l'utilisateur est connecté, le composant affiche différents types de bannières en fonction de la réponse d'une requête API.

*   **Comportement attendu:**
    *   Faire un appel API pour obtenir des informations sur la bannière.
    *   En cas de succès de l'appel API, afficher la bannière appropriée en fonction de la réponse.
    *   Notifier les erreurs en cas d'échec de l'appel API.

#### 3.1. Réponse API: `activation banner`

Si l'appel API retourne `activation banner`, afficher la bannière d'activation avec l'icône `BicolorUnlock`.

*   **Comportement attendu:** Afficher la bannière d'activation avec l'icône `BicolorUnlock`.

#### 3.2. Réponse API: `retry_identity_check_banner`

Si l'appel API retourne `retry_identity_check_banner`, afficher la bannière d'activation avec l'icône `ArrowAgain`.

*   **Comportement attendu:** Afficher la bannière d'activation avec l'icône `ArrowAgain`.

#### 3.3. Réponse API: `transition_17_18_banner`

Si l'appel API retourne `transition_17_18_banner`, afficher la bannière d'activation avec l'icône `BirthdayCake`.

*   **Comportement attendu:** Afficher la bannière d'activation avec l'icône `BirthdayCake`.

#### 3.4. Erreur lors de l'appel API

En cas d'échec de la requête API (par exemple, erreur réseau, erreur serveur), afficher une notification d'erreur.

*   **Comportement attendu:** Notifier les erreurs.
