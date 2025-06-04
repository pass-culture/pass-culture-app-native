---
title: useAccountSuspensionStatusQuery
slug: /features/auth/queries/useaccountsuspensionstatusquery.native.test.ts/useaccountsuspensionstatusquery
---

# Documentation : Récupération du statut de suspension de compte

## 🎯 Fonctionnalité Principale

Cette documentation décrit le comportement de la fonctionnalité `useAccountSuspensionStatusQuery` et de la fonction `useAccountSuspensionStatus`, dont le but est de récupérer le statut de suspension d'un compte utilisateur.

## 🚦 Comportements et Scénarios

La fonctionnalité est testée en fonction de deux scénarios principaux :

### 1. Réussite : Statut de suspension existant

Ce scénario décrit ce qui se passe lorsque le système parvient à récupérer le statut de suspension du compte.

-   **Résultat Attendu :** La fonction `useAccountSuspensionStatus` doit renvoyer le statut de suspension du compte.

### 2. Échec : Erreur lors de la récupération du statut

Ce scénario décrit ce qui se passe lorsque la récupération du statut de suspension du compte échoue (par exemple, en raison d'une erreur réseau ou d'un problème côté serveur).

-   **Résultat Attendu :** La fonction `useAccountSuspensionStatus` doit renvoyer `null`.
