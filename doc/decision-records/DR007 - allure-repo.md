# DR007 - Allure repo(rt)?

> Status : Adopted or Replaced or Withdrawn

## Decision

Extraire l'historique d'Allure Report vers son propre repo

## Context

### Mise en place d'Allure Report

Le [2025-03-07, nous avons mis en place des rapports d'Allure](https://github.com/pass-culture/pass-culture-app-native/pull/7727) comme mentionné dans [ce document DR004 - allure-report](./DR004%20-%20allure-report.md)

Côté pro, GitHub Pages est déjà utilisé pour StoryBook

Nous avons copiés la mise en place, [@bebstein-pass ne comprenait pas pourquoi on voulait faire un repo externe pour stocker les rapports](https://github.com/pass-culture/pass-culture-app-native/pull/7727#discussion_r1970085185) alors que GitHub Pages n'était pas utilisé coté jeunes

Il a donc été décidé de tout mettre dans le meme repo

### Mise en place de l'historisation d'Allure Report

Le [2025-03-25, nous avons mis en place l'historisation des rapports précédents](https://github.com/pass-culture/pass-culture-app-native/pull/7898)

### Un problème de taille

Le 2025-05-27, le repo pèse presque ~3Go, car à chaque commit sur `master` (PR de mergées), on ajoute ~100Mo de rapport d'Allure

L'historique pèse ~2.5Go, soit ~86% du poids total de repo

```sh
# poids du repo
du -sh .git
2,9G    .git
# en octets
du -s .git
6034936 .git

# poids d'un commit d'Allure Report
git switch --detach origin/allure-report
mkdir toto
LAST_COMMIT_ADDED_AND_MODIFIED_FILE_PATHS=$(git log --name-only --diff-filter=AM --pretty=format: -1)
mv $LAST_COMMIT_ADDED_AND_MODIFIED_FILE_PATHS toto/
du -hs toto
 97M    toto

# poids de l'historique
mkdir /tmp/tutu
git init /tmp/tutu
git push /tmp/tutu refs/remotes/origin/allure-report:refs/heads/allure-report
du -hs /tmp/tutu
2,5G    /tmp/tutu
# en octets
du -s /tmp/tutu
5216040 /tmp/tutu
```

Finalement, il serait mieux de faire un repo séparer en conservant l'historique existant dans le nouveau repo

## Alternatives considered

- Laisser le repo grossir vers l'infini est au delà
- Investiguer s'il est possible de réduire le poids de chaque commit d'Allure Report

## Justification

Télécharger ces données :

- ajoute un délai à chaque `fetch` (donc `pull` et souvent `push`)
- consomme de l'espace de stockage
- est inutile car les devs n'ont pas besoin d'accéder aux données en local

## Consequences

Le garbage collector de git s'exécutera automatiquement (déterminé par une heuristique interne de git) et supprimera des postes des devs tout l'historique qui est inutile

## Actions to be implemented

1. Créer un nouveau repo
1. Faire une PR pour changer la pipeline pour qu'elle pousse sur le nouveau repo
1. Demander à ne pas faire de merge durant l'opération suivante

   1. Copier l'historique existant de `pass-culture-app-native` vers le nouveau repo

      ```sh
      git fetch origin && git push git@github.com:pass-culture/pass-culture-LE_NOUVEAU_REPO.git refs/remotes/origin/allure-report:refs/heads/allure-report
      ```

   1. Merge la PR de changement de la pipeline

1. Supprimer la branche `allure-report`
1. Changer les liens pointant vers le rapport d'Allure
