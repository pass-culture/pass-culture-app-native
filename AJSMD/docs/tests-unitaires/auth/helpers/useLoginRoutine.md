---
title: useLoginRoutine
slug: /features/auth/helpers/useloginroutine.native.test.ts/useloginroutine
---

---
# Gestion de l'Authentification et de l'Identification Utilisateur

## 🔑 Fonctionnalité Principale: Authentification et gestion des identités utilisateur.

Cette documentation décrit le comportement de la fonctionnalité d'authentification et de gestion des identités utilisateur, couvrant les processus de connexion, de rafraîchissement des sessions, et les ajustements contextuels liés à l'identité de l'utilisateur.

## ⚙️ Scénarios et Comportements

### 1. Connexion Utilisateur (via `useLoginRoutine`)

Ce scénario décrit le processus complet de connexion d'un utilisateur.

*   **Sauvegarde des Tokens:**
    *   Doit sauvegarder le jeton de rafraîchissement (Refresh Token) pour la persistance de la session.
    *   Doit sauvegarder le jeton d'accès (Access Token) dans un espace de stockage approprié (ex: local storage, cookies) pour l'authentification des requêtes.
    *   Doit planifier la suppression du jeton d'accès lorsque celui-ci expire.

*   **Analytiques:**
    *   Doit enregistrer des événements d'analyse (analytics) pour le suivi des connexions réussies.
    *   Doit enregistrer des événements d'analyse spécifiques, incluant le type d'authentification SSO si celui-ci est utilisé.

### 2. Services Requérant l'ID Utilisateur (via `connectServicesRequiringUserId`)

Ce scénario décrit les actions à effectuer après qu'un utilisateur est connecté et que l'ID utilisateur est disponible.

*   **Identification et Configuration:**
    *   Doit définir l'identifiant de lot (Batch Identifier) pour le suivi et l'identification des opérations par lots.
    *   Doit définir l'ID utilisateur dans les cookies de consentement, afin de respecter les exigences de confidentialité.
    *   Doit consigner l'identifiant utilisateur dans les outils d'analyse pour le suivi des événements.

### 3. Réinitialisation des Contextes (via `resetContexts`)

Ce scénario décrit les ajustements contextuels à effectuer lors d'un changement d'identité utilisateur (connexion ou déconnexion).

*   **Réinitialisation du Contexte de Recherche:**
    *   Doit réinitialiser le contexte de recherche. Ceci est crucial car les résultats de recherche peuvent varier selon l'utilisateur connecté (par exemple, affichage de contenus différents selon l'âge ou les droits de l'utilisateur).

*   **Réinitialisation du Contexte de Vérification d'Identité:**
    *   Doit réinitialiser le contexte de vérification d'identité car l'utilisateur connecté est potentiellement différent de l'utilisateur précédent.
