---
title: useIsMailAppAvailable.web
slug: /features/auth/helpers/useismailappavailable.web.test.ts/useismailappavailable.web
---

```
# Détection de la disponibilité de l'application de messagerie

## 🧩 Fonctionnalité Principale

La fonctionnalité principale est la détection de la disponibilité d'une application de messagerie sur le système de l'utilisateur. Elle permet à l'application de savoir si un client de messagerie est configuré et accessible.

## 💡 Comportements

### Contexte: Application Web

Ce scénario décrit le comportement de la fonctionnalité au sein d'une application web.

-   **Scénario:** L'application tente de déterminer si une application de messagerie est disponible.
-   **Comportement Attendu:**
    -   `useIsMailAppAvailable` **devrait** retourner `false`.  Cela indique que l'application web, dans ce contexte spécifique, ne détecte pas la présence d'une application de messagerie disponible (ou configurée).
```
