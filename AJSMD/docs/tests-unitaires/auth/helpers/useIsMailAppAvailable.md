---
title: useIsMailAppAvailable
slug: /features/auth/helpers/useismailappavailable.native.test.ts/useismailappavailable
---

---
title: useIsMailAppAvailable - Détection de la disponibilité des applications de messagerie
slug: /features/useIsMailAppAvailable
---

# useIsMailAppAvailable

Cette fonctionnalité permet de déterminer si une application de messagerie est disponible sur l'appareil de l'utilisateur. Elle est utilisée pour adapter l'expérience utilisateur en fonction de la capacité à lancer une application de messagerie.

## 🤖 Comportement sur Android

### Scénario par défaut

- `useIsMailAppAvailable` **vaut true** par défaut.  Cela signifie que par défaut, le système suppose qu'une application de messagerie est disponible sur Android.

## 🍏 Comportement sur iOS

### Scénario par défaut

- `useIsMailAppAvailable` **vaut false** par défaut.  Cela signifie que par défaut, le système suppose qu'aucune application de messagerie n'est disponible sur iOS.

### Scénario : Application de messagerie disponible

- `useIsMailAppAvailable` **vaut true** lorsque au moins une application de messagerie est installée sur l'appareil iOS.

### Scénario : Échec de la vérification des applications de messagerie

- En cas d'échec de la vérification de la disponibilité des applications de messagerie (par exemple, à cause d'une erreur système), le système doit logger une erreur vers Sentry (un outil de suivi d'erreurs).  Cela permet de surveiller et de corriger les problèmes liés à la détection des applications de messagerie sur iOS.
