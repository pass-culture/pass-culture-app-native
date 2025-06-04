---
title: getBusinessUrl
slug: /features/home/components/modules/business/helpers/getbusinessurl.native.test.ts/getbusinessurl
---

```md
# getBusinessUrl

Cette fonctionnalité permet de récupérer l'URL d'une entité métier (entreprise, organisation, etc.).

## Scénarios et Comportements

### 1. Récupération de l'URL Business

*   **Description:** Ce scénario décrit le comportement de base de la fonction `getBusinessUrl`.
*   **Règles de gestion/Comportements:**
    *   La fonction doit retourner une URL valide, correspondant à l'entité métier demandée.

### 2. URL Business en cas de succès

*   **Description:** Ce scénario décrit ce qui se passe lorsque la récupération de l'URL est réussie.
*   **Règles de gestion/Comportements:**
    *   La fonction renvoie une URL au format string.
    *   L'URL récupérée est bien une URL valide et utilisable.

### 3. Validation de l'URL Business (Non spécifié dans la documentation originale, mais implicite)

*   **Description:** Bien que non explicitement décrit, le bon fonctionnement de l'application nécessite une validation de l'URL.
*   **Règles de gestion/Comportements:**
    *   L'URL retournée doit être valide (syntaxiquement correcte) pour être utilisée comme destination.
    *   En cas d'erreur lors de la génération de l'URL, la fonction devrait probablement gérer l'erreur de façon appropriée (par exemple, retourner une valeur par défaut, une erreur ou renvoyer `null`).
```
