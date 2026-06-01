# Analyse des bugs et tickets par feature et squad

_Période analysée : jusqu'à 2025-11-23T11:02:59.754995_

## Méthodologie

- Attribution d'un ticket à un feature : heuristique sur `Components`, `Labels`, `Summary`, `Description` via matching sur les noms de dossiers dans `CODEOWNERS`.
- Origine Sentry : détection heuristique si le mot `sentry` apparaît dans les champs du ticket (reporter, description, labels).
- Régression (bug venant de la correction d'un autre bug) : si le champ personnalisé "Si régression" vaut `Oui/True` ou si le texte contient "régress".
- Limitations : attribution imparfaite si les tickets ne mentionnent pas explicitement le feature; certains Sentry-links peuvent être absents.

## Méthode de calcul des colonnes

Chaque colonne des tableaux est calculée par agrégation des tickets Jira et des métriques de code :

- **Tickets, Bugs total, Bugs Sentry, Bugs non-Sentry** : sommes directes des tickets et bugs associés à chaque squad ou feature.
- **Story pts avg, Avg criticity** : moyennes pondérées par le nombre de tickets ou bugs.
- **Nombre de features** : nombre de features rattachés à la squad.
- **Nombre de composant react** : nombre total de fichiers détectés comme composants React (fichiers exportant une fonction ou classe avec du JSX) dans les features de la squad.
- **Nombre de hook** : nombre total d’appels à des hooks React (ex : useState, useEffect, useCallback, etc.) dans le code des features de la squad.
- **CI (Complexité/Interdépendance)** : score composite calculé à partir de la criticité moyenne, de la complexité cyclomatique (analyse du code) et de l’interdépendance des modules (Madge). Le CI est calculé pour chaque feature, puis agrégé pour la squad.

**À propos de Madge :**
Madge est utilisé pour mesurer l’interdépendance des modules (nombre de liens entre fichiers/features). Cette métrique est intégrée dans le calcul du CI pour chaque feature, mais n’est pas affichée directement dans la table squad (elle est visible dans la table par feature).

## Résultats — Derniers 18 mois

### Par feature

| Feature | Squad | Tickets | Story pts avg | Bugs total | % de bugs | Bugs Sentry | Bugs non-Sentry | Avg criticity | Nombre de composant react du module | Nombre de hook du module | Avg cyclomatic |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| accessibility | JEUNES - Conversion | 10 | 4.75 | 1 | 10.0% | 0 | 1 | 3.00 | 2 | 11 | 6.33 |
| artist | JEUNES - Découverte | 16 | 2.60 | 0 | 0.0% | 0 | 0 |  | 7 | 5 | 6.14 |
| auth | JEUNES - Activation | 10 | 4.00 | 1 | 10.0% | 1 | 0 | 2.00 | 51 | 133 | 10.39 |
| birthdayNotifications | JEUNES - Conversion | 4 |  | 0 | 0.0% | 0 | 0 |  | 2 | 4 | 6.83 |
| bonification | JEUNES - Activation | 28 | 4.50 | 0 | 0.0% | 0 | 0 |  | 12 | 10 | 9.11 |
| bookOffer | JEUNES - Conversion | 19 | 3.62 | 3 | 15.8% | 1 | 2 | 2.33 | 33 | 53 | 16.97 |
| bookings | JEUNES - Conversion | 8 | 1.50 | 2 | 25.0% | 2 | 0 | 2.00 | 78 | 49 | 11.77 |
| cookies | JEUNES - Activation | 2 | 5.00 | 1 | 50.0% | 0 | 1 | 2.00 | 16 | 28 | 9.34 |
| culturalSurvey | JEUNES - Activation | 10 | 3.00 | 1 | 10.0% | 1 | 0 | 5.00 | 10 | 17 | 7.09 |
| deeplinks | JEUNES - Découverte | 4 | 2.17 | 0 | 0.0% | 0 | 0 |  | 0 | 0 | 6.50 |
| favorites | JEUNES - Découverte | 2 | 5.00 | 0 | 0.0% | 0 | 0 |  | 12 | 36 | 9.08 |
| forceUpdate | JEUNES - Activation | 14 | 5.33 | 6 | 42.9% | 3 | 3 | 3.00 | 4 | 7 | 5.44 |
| gtlPlaylist | JEUNES - Conversion | 15 | 5.50 | 1 | 6.7% | 0 | 1 | 2.00 | 7 | 0 | 10.37 |
| home | JEUNES - Découverte | 22 | 2.64 | 0 | 0.0% | 0 | 0 |  | 89 | 163 | 12.54 |
| identityCheck | JEUNES - Activation | 4 | 4.00 | 3 | 75.0% | 3 | 0 | 3.33 | 71 | 92 | 8.60 |
| internal | JEUNES - Découverte | 4 | 2.00 | 0 | 0.0% | 0 | 0 |  | 12 | 31 | 10.16 |
| location | JEUNES - Conversion | 7 | 3.67 | 1 | 14.3% | 0 | 1 | 2.00 | 19 | 30 | 11.59 |
| maintenance | JEUNES - Activation | 2 | 5.00 | 0 | 0.0% | 0 | 0 |  | 2 | 3 | 6.83 |
| notifications | JEUNES - Activation | 1 |  | 0 | 0.0% | 0 | 0 |  | 1 | 0 | 4.33 |
| offer | JEUNES - Découverte | 18 | 1.70 | 3 | 16.7% | 0 | 3 | 3.00 | 127 | 208 | 12.51 |
| onboarding | JEUNES - Activation | 4 | 4.00 | 0 | 0.0% | 0 | 0 |  | 21 | 6 | 5.43 |
| profile | JEUNES - Activation | 3 |  | 0 | 0.0% | 0 | 0 |  | 100 | 111 | 8.99 |
| reactions | JEUNES - Découverte | 17 | 2.25 | 0 | 0.0% | 0 | 0 |  | 6 | 12 | 9.63 |
| remoteBanners | JEUNES - Activation | 7 | 2.75 | 0 | 0.0% | 0 | 0 |  | 4 | 0 | 7.00 |
| search | JEUNES - Conversion | 19 | 1.83 | 1 | 5.3% | 0 | 1 | 2.00 | 115 | 255 | 15.08 |
| subscription | JEUNES - Activation | 1 |  | 0 | 0.0% | 0 | 0 |  | 19 | 27 | 10.28 |
| trustedDevice | JEUNES - Activation | 6 | 3.50 | 0 | 0.0% | 0 | 0 |  | 10 | 8 | 7.35 |
| unknown | unknown | 115 | 3.96 | 7 | 6.1% | 1 | 6 | 2.57 |  |  |  |
| venue | JEUNES - Découverte | 9 | 3.00 | 2 | 22.2% | 2 | 0 | 3.50 | 39 | 55 | 10.56 |
| venueMap | JEUNES - Découverte | 1 | 5.00 | 0 | 0.0% | 0 | 0 |  | 22 | 54 | 9.37 |

### Par squad

| Squad | Tickets | Story pts avg | Bugs total | Avg criticity | Bugs Sentry | Bugs non-Sentry | Nombre de features | Nombre de composant react des features | Nombre de hook des features | Avg cyclomatic |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| @pass-culture/jeunes-activation | 0 | 4.07 | 12 | 3.08 | 8 | 4 | 0 | 0 | 0 |  |
| @pass-culture/jeunes-conversion | 0 | 3.22 | 9 | 2.22 | 3 | 6 | 0 | 0 | 0 |  |
| @pass-culture/jeunes-decouverte | 0 | 2.59 | 5 | 3.20 | 2 | 3 | 0 | 0 | 0 |  |
| JEUNES - Activation | 182 | 4.11 | 4 | 2.25 | 1 | 3 | 0 | 339 | 466 |  |
| JEUNES - Conversion | 116 | 1.50 | 0 |  | 0 | 0 | 0 | 256 | 402 |  |
| JEUNES - Devs | 19 | 5.00 | 1 | 3.00 | 0 | 1 | 0 | 0 | 0 |  |
| JEUNES - Découverte | 65 | 5.00 | 2 | 3.00 | 0 | 2 | 0 | 333 | 585 |  |

## Résultats — Derniers 6 mois

### Par feature

| Feature | Squad | Tickets | Story pts avg | Bugs total | % de bugs | Bugs Sentry | Bugs non-Sentry | Avg criticity | Nombre de composant react du module | Nombre de hook du module | Avg cyclomatic |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| accessibility | JEUNES - Conversion | 5 | 5.00 | 1 | 20.0% | 0 | 1 | 3.00 | 2 | 11 | 6.33 |
| artist | JEUNES - Découverte | 11 | 2.75 | 0 | 0.0% | 0 | 0 |  | 7 | 5 | 6.14 |
| auth | JEUNES - Activation | 6 |  | 1 | 16.7% | 1 | 0 | 2.00 | 51 | 133 | 10.39 |
| birthdayNotifications | JEUNES - Conversion | 1 |  | 0 | 0.0% | 0 | 0 |  | 2 | 4 | 6.83 |
| bonification | JEUNES - Activation | 28 | 4.50 | 0 | 0.0% | 0 | 0 |  | 12 | 10 | 9.11 |
| bookOffer | JEUNES - Conversion | 15 | 3.40 | 3 | 20.0% | 1 | 2 | 2.33 | 33 | 53 | 16.97 |
| bookings | JEUNES - Conversion | 5 | 1.00 | 1 | 20.0% | 1 | 0 | 2.00 | 78 | 49 | 11.77 |
| cookies | JEUNES - Activation | 2 | 5.00 | 1 | 50.0% | 0 | 1 | 2.00 | 16 | 28 | 9.34 |
| culturalSurvey | JEUNES - Activation | 6 | 3.00 | 1 | 16.7% | 1 | 0 | 5.00 | 10 | 17 | 7.09 |
| deeplinks | JEUNES - Découverte | 4 | 2.17 | 0 | 0.0% | 0 | 0 |  | 0 | 0 | 6.50 |
| favorites | JEUNES - Découverte | 2 | 5.00 | 0 | 0.0% | 0 | 0 |  | 12 | 36 | 9.08 |
| forceUpdate | JEUNES - Activation | 11 | 5.50 | 5 | 45.5% | 2 | 3 | 3.20 | 4 | 7 | 5.44 |
| gtlPlaylist | JEUNES - Conversion | 7 |  | 1 | 14.3% | 0 | 1 | 2.00 | 7 | 0 | 10.37 |
| home | JEUNES - Découverte | 16 | 3.10 | 0 | 0.0% | 0 | 0 |  | 89 | 163 | 12.54 |
| identityCheck | JEUNES - Activation | 4 | 4.00 | 3 | 75.0% | 3 | 0 | 3.33 | 71 | 92 | 8.60 |
| internal | JEUNES - Découverte | 4 | 2.00 | 0 | 0.0% | 0 | 0 |  | 12 | 31 | 10.16 |
| location | JEUNES - Conversion | 4 | 3.67 | 1 | 25.0% | 0 | 1 | 2.00 | 19 | 30 | 11.59 |
| maintenance | JEUNES - Activation | 1 |  | 0 | 0.0% | 0 | 0 |  | 2 | 3 | 6.83 |
| offer | JEUNES - Découverte | 14 | 0.75 | 3 | 21.4% | 0 | 3 | 3.00 | 127 | 208 | 12.51 |
| onboarding | JEUNES - Activation | 2 |  | 0 | 0.0% | 0 | 0 |  | 21 | 6 | 5.43 |
| profile | JEUNES - Activation | 2 |  | 0 | 0.0% | 0 | 0 |  | 100 | 111 | 8.99 |
| reactions | JEUNES - Découverte | 12 | 2.25 | 0 | 0.0% | 0 | 0 |  | 6 | 12 | 9.63 |
| remoteBanners | JEUNES - Activation | 2 |  | 0 | 0.0% | 0 | 0 |  | 4 | 0 | 7.00 |
| search | JEUNES - Conversion | 11 | 1.25 | 1 | 9.1% | 0 | 1 | 2.00 | 115 | 255 | 15.08 |
| subscription | JEUNES - Activation | 1 |  | 0 | 0.0% | 0 | 0 |  | 19 | 27 | 10.28 |
| trustedDevice | JEUNES - Activation | 5 | 3.67 | 0 | 0.0% | 0 | 0 |  | 10 | 8 | 7.35 |
| unknown | unknown | 74 | 4.31 | 5 | 6.8% | 1 | 4 | 2.60 |  |  |  |
| venue | JEUNES - Découverte | 6 | 2.33 | 1 | 16.7% | 1 | 0 | 5.00 | 39 | 55 | 10.56 |
| venueMap | JEUNES - Découverte | 1 | 5.00 | 0 | 0.0% | 0 | 0 |  | 22 | 54 | 9.37 |

### Par squad

| Squad | Tickets | Story pts avg | Bugs total | Avg criticity | Bugs Sentry | Bugs non-Sentry | Nombre de features | Nombre de composant react des features | Nombre de hook des features | Avg cyclomatic |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| @pass-culture/jeunes-activation | 0 | 4.38 | 11 | 3.18 | 7 | 4 | 0 | 0 | 0 |  |
| @pass-culture/jeunes-conversion | 0 | 2.71 | 8 | 2.25 | 2 | 6 | 0 | 0 | 0 |  |
| @pass-culture/jeunes-decouverte | 0 | 2.64 | 4 | 3.50 | 1 | 3 | 0 | 0 | 0 |  |
| JEUNES - Activation | 120 | 4.40 | 3 | 2.33 | 1 | 2 | 0 | 339 | 466 |  |
| JEUNES - Conversion | 77 | 2.00 | 0 |  | 0 | 0 | 0 | 256 | 402 |  |
| JEUNES - Devs | 11 | 5.00 | 0 |  | 0 | 0 | 0 | 0 | 0 |  |
| JEUNES - Découverte | 54 | 5.00 | 2 | 3.00 | 0 | 2 | 0 | 333 | 585 |  |

### Raisons détaillées — Derniers 18 mois

| Raison détaillée | Bugs | % | Bar | Avg criticité |
|---|---:|---:|---|---:|
| API contract / response change | 13 | 39.4% | `██████████████████████████████` | 2.85 |
| Crash / Unhandled exception | 5 | 15.2% | `███████████` | 3.40 |
| Payment / Reservation flow | 5 | 15.2% | `███████████` | 2.40 |
| Navigation / Deep link | 4 | 12.1% | `█████████` | 2.75 |
| UI rendering / visual glitch | 2 | 6.1% | `████` | 2.50 |
| Data inconsistency / sync | 2 | 6.1% | `████` | 2.00 |
| Rate limit / Throttling | 1 | 3.0% | `██` | 2.00 |
| Performance regression | 1 | 3.0% | `██` | 3.00 |

### Raisons détaillées — Derniers 6 mois

| Raison détaillée | Bugs | % | Bar | Avg criticité |
|---|---:|---:|---|---:|
| API contract / response change | 10 | 35.7% | `██████████████████████████████` | 3.00 |
| Crash / Unhandled exception | 5 | 17.9% | `███████████████` | 3.40 |
| Navigation / Deep link | 4 | 14.3% | `████████████` | 2.75 |
| Payment / Reservation flow | 4 | 14.3% | `████████████` | 2.50 |
| UI rendering / visual glitch | 2 | 7.1% | `██████` | 2.50 |
| Rate limit / Throttling | 1 | 3.6% | `███` | 2.00 |
| Performance regression | 1 | 3.6% | `███` | 3.00 |
| Data inconsistency / sync | 1 | 3.6% | `███` | 2.00 |

## Remarques et limites

- Attribution automatique peut être incomplète — vérifier manuellement features critiques.
- Heuristiques Sentry et régression peuvent produire faux positifs/négatifs.
