---
title: getLocalizationCompliance
slug: /features/home/components/modules/business/helpers/getlocalizationcompliance.native.test.ts/getlocalizationcompliance
---

```md
# getLocalizationCompliance

Cette documentation décrit le comportement de la fonctionnalité `getLocalizationCompliance`. Elle détaille les règles et les actions attendues dans différents contextes d'utilisation.

## Contextes et Scénarios

La fonctionnalité `getLocalizationCompliance` est évaluée dans les contextes suivants :

*   **Cas de base :** Vérification du bon fonctionnement de la fonctionnalité.
*   **Avec une locale spécifique :** Vérification du comportement en fonction d'une locale donnée.
*   **Avec des paramètres d'entrée invalides :** Vérification du comportement face à des paramètres incorrects ou manquants.

## Comportements et Règles de Gestion

Voici les comportements attendus pour chaque contexte ou scénario :

### Cas de base

*   **Fonctionnement attendu:** La fonctionnalité doit s'exécuter sans erreurs et renvoyer les données de conformité de la localisation.

### Avec une locale spécifique

*   **Gestion des locales:** La fonctionnalité doit être capable de traiter une locale spécifique.
*   **Retour des données :** Elle doit retourner les données de conformité relatives à la locale fournie.

### Avec des paramètres d'entrée invalides

*   **Gestion des erreurs:** La fonctionnalité doit gérer correctement les erreurs et ne pas planter.
*   **Retour des erreurs spécifiques :**  Elle doit renvoyer des informations d'erreur appropriées, comme un code d'erreur et un message explicatif, signalant la nature du problème (par exemple, paramètre manquant ou invalide).
