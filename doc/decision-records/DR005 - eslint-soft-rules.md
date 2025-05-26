# DR004 - eslint soft rules

> Statut : Adopté

## Contexte

- De plus en plus de bonnes pratiques sont énoncées mais rien n'empêche les développeurs de ne pas les pratiquer
- La liste des bonnes pratiques étant de plus en plus longue, il est difficile de toutes les retenir
- Nous utilisons les erreurs de linter pour empêcher le développeur d'écrire du code ne suivant pas les bonnes pratiques, nous avons les bonnes pratiques inscrites dans le descriptif de PR, mais nous n'avons pas d'entre deux qui permettrait au développeur d'avoir un feedback rapide sur son code
- Passer une nouvelle règle de lint en erreur force à corriger tous les problèmes et casse la CI, la passer en warn pollue le retour terminal

## Propositions

- Inviter à écrire des nouvelles règles EsLint passées en warn
- Eslint dans le terminal est passé en mode quiet donc les warn n'apparaissent pas (il n'y a actuellement aucun warning Eslint dans le code)
- Bonus à discuter: commande `yarn test:lint:changed` qui affiche les erreurs et warnings seulement des fichiers modifiés sur la branche, on pourrait la déclencher avec un git hook ou Husky?

![Capture d'écran 2025-04-11 à 15 52 18](https://github.com/user-attachments/assets/1fb7355a-af73-406f-80be-a4da7b9144c8)

Ainsi, la totalité des développeurs sont au fait des nouvelles règles et sont invités à les adopter sans que cela soit bloquant
