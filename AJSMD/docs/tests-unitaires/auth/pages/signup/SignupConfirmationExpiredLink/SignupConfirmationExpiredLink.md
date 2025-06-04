---
title: SignupConfirmationExpiredLink
slug: /features/auth/pages/signup/signupconfirmationexpiredlink/signupconfirmationexpiredlink.native.test.tsx/signupconfirmationexpiredlink
---

# SignupConfirmationExpiredLink

## 🔄 Vue d'ensemble de la fonctionnalité

Le composant `SignupConfirmationExpiredLink` gère l'expérience utilisateur lorsqu'un lien de confirmation d'inscription a expiré. Il affiche une interface pour informer l'utilisateur et lui permettre de prendre des mesures, comme revenir à la page d'accueil ou renvoyer l'e-mail de confirmation.

## 🚦 Comportements et Scénarios

### 1. Navigation après l'expiration du lien

Ce scénario décrit le comportement lorsque l'utilisateur accède à la page via un lien de confirmation expiré.

*   **Comportement attendu:**
    *   Le composant `SignupConfirmationExpiredLink` doit s'afficher pour informer l'utilisateur que son lien a expiré.

### 2. Retour à la page d'accueil

Ce scénario décrit ce qui se passe lorsque l'utilisateur clique sur le bouton de retour à la page d'accueil.

*   **Comportement attendu:**
    *   Lorsque l'utilisateur clique sur le bouton "Retour à la page d'accueil", il est redirigé vers la page d'accueil (par exemple, `/`).

### 3. Renvoi de l'e-mail de confirmation - Succès

Ce scénario décrit le comportement lorsque l'utilisateur demande à renvoyer l'e-mail de confirmation et que la requête est un succès.

*   **Comportement attendu:**
    *   Après avoir cliqué sur le bouton "Renvoyer l'e-mail" et si la requête réussit, l'utilisateur est redirigé vers la page indiquant que l'e-mail de confirmation a été envoyé (par exemple, la page "SignupConfirmationEmailSent").

### 4. Renvoi de l'e-mail de confirmation - Échec

Ce scénario décrit le comportement lorsque l'utilisateur demande à renvoyer l'e-mail de confirmation et que la requête échoue.

*   **Comportement attendu:**
    *   Après avoir cliqué sur le bouton "Renvoyer l'e-mail" et si la requête échoue, l'utilisateur **ne doit pas** être redirigé vers la page de confirmation d'envoi d'e-mail (par exemple, la page "SignupConfirmationEmailSent"). Le composant doit probablement afficher un message d'erreur à l'utilisateur. (Ce comportement n'est pas explicitement décrit, mais est déductible de la description.)
