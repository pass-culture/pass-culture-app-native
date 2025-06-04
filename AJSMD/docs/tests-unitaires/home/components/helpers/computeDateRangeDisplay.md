---
title: computeDateRangeDisplay
slug: /features/home/components/helpers/computedaterangedisplay.native.test.ts/computedaterangedisplay
---

# computeDateRangeDisplay

Cette fonctionnalité a pour objectif de formater une plage de dates pour l'affichage. Elle prend en compte les dates de début et de fin et renvoie une chaîne de caractères formatée représentant la plage de dates.

## Comportements et Scénarios

La fonctionnalité `computeDateRangeDisplay` se comporte différemment selon que les dates de début et de fin sont différentes ou identiques.

### Dates Différentes

*   **Scénario:** Les dates de début et de fin sont différentes.
*   **Comportement Attendu:** La fonction retourne une chaîne de caractères formatée qui représente la plage de dates, par exemple, "date de début - date de fin". Le format précis des dates de début et de fin n'est pas spécifié mais sera déterminé par l'implémentation de la fonction et peut être personnalisable.

### Dates Identiques (Même Jour)

*   **Scénario:** Les dates de début et de fin sont les mêmes.
*   **Comportement Attendu:** La fonction retourne une chaîne de caractères formatée représentant une seule date, car la date de début et de fin coïncident.  Le format précis de la date n'est pas spécifié, mais sera déterminé par l'implémentation de la fonction et peut être personnalisable.
