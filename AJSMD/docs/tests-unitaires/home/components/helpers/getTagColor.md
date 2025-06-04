---
title: getTagColor
slug: /features/home/components/helpers/gettagcolor.native.test.ts/gettagcolor
---

# getTagColor

Cette fonctionnalité a pour objectif de déterminer la couleur appropriée à afficher pour un tag, en fonction de sa valeur ou de son contexte.

## Scénarios et Comportements

Voici les différents scénarios et les comportements attendus de la fonction `getTagColor` :

*   **Tag par défaut (sans information spécifique)**
    *   Par défaut, si aucun tag spécifique n'est détecté, la fonction doit retourner la couleur "black" (code couleur : noir).

*   **Tag avec valeur "gold"**
    *   Lorsque le tag est associé à la valeur "gold", la fonction doit retourner le code couleur correspondant à l'or (e.g., un code hexadécimal tel que #FFD700).

*   **Tag avec valeur "aquamarine"**
    *   Lorsque le tag est associé à la valeur "aquamarine", la fonction doit retourner le code couleur correspondant à l'aigue-marine (e.g., un code hexadécimal).

*   **Tag avec valeur "skyBlue"**
    *   Lorsque le tag est associé à la valeur "skyBlue", la fonction doit retourner le code couleur correspondant au bleu ciel (e.g., un code hexadécimal).

*   **Tag avec valeur "deepPink"**
    *   Lorsque le tag est associé à la valeur "deepPink", la fonction doit retourner le code couleur correspondant au rose profond (e.g., un code hexadécimal).

*   **Tag avec valeur "coral"**
    *   Lorsque le tag est associé à la valeur "coral", la fonction doit retourner le code couleur correspondant au corail (e.g., un code hexadécimal).

*   **Tag avec valeur "lilac"**
    *   Lorsque le tag est associé à la valeur "lilac", la fonction doit retourner le code couleur correspondant au lilas (e.g., un code hexadécimal).
