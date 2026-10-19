## Relire et merger une PR Dependabot

Objectif : intégrer les PRs Dependabot sans casser l'app, et sans qu'elles bloquent les suivantes.

### Ce que fait Dependabot sur ce repo

La configuration est dans `.github/dependabot.yml`.

- Chaque semaine, Dependabot ouvre des PRs de mise à jour pour 4 sources : npm (racine), npm (`server/`), bundler (`Gemfile` : fastlane, cocoapods) et GitHub Actions. **Au maximum 2 PRs ouvertes par source** : tant qu'elles restent ouvertes, aucune autre mise à jour de cette source n'est proposée.
- Les mises à jour de sécurité (titres en `… in the npm_and_yarn group`) arrivent en plus, hors de cette limite. Elles portent souvent sur des dépendances transitives. Les traiter en priorité.
- `react`, `react-native` et `react-native-web` sont exclus. Leur montée de version suit le [guide de mise à jour de React Native](../../bump-react-native.md).
- Chaque PR reçoit le label `e2e`, qui build l'app iOS et Android (staging) puis lance les tests E2E sur Maestro Cloud.

### 1. Vérifier la CI

- [ ] Les jobs du workflow `2 [pull/pr] Initiate workflow` sont verts (lint, tsc, tests unitaires natifs et web, tests du proxy, deadcode).
- [ ] Les jobs `Build iOS staging and upload to Maestro Cloud` et `Build Android staging and upload to Maestro Cloud` sont verts : l'app build sur iOS et Android.
- [ ] Les checks Maestro (`… (IOS)` et `… (ANDROID)`) sont verts. S'ils sont rouges, ouvrir le rapport Maestro et vérifier que l'échec vient de la dépendance, et pas d'un test déjà rouge sur master (voir les derniers runs planifiés `dev_on_schedule_run_e2e_*`).

Points d'attention :

- **Ticket JIRA** : Les PR Dependabot sont créés automatiquement sans ticket associé dans Jira, ce sera la responsabilité de la première personne qui traite la PR dependabot de le créér
- **Le check de titre `3 [on_pr] Check PR title format` échoue sur toutes les PRs Dependabot** : leur titre ne contient pas de ticket Jira (préfixe `(BSR)`, refusé depuis PC-43517, ou aucun préfixe pour certaines mises à jour de sécurité). Mettre le ticket Jira en tête du titre de la PR, à la place de `(BSR)` s'il y est (le titre devient le message du commit sur master).
- **Les E2E ne tournent qu'à l'ajout du label `e2e`**, donc à la création de la PR. Après un `@dependabot rebase`, leurs résultats restent sur l'ancien commit. Pour les relancer, retirer puis remettre le label `e2e`.
- **La CI des PRs ne build pas le web** (sauf avec le label `breaking change`). Pour une dépendance utilisée par le web, voir l'étape 4.

### 2. Identifier le type de mise à jour

| PR                                                                             | Ce qu'il faut vérifier                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub Action (`chore(ci)`)                                                    | Release notes de l'action : inputs renommés ou supprimés, version de Node. Beaucoup de workflows ne tournent que sur master ou sur tag (déploiements) : surveiller leur prochain run après le merge.                                   |
| npm dans `server/` (proxy)                                                     | Job `yarn-tester / yarn_test_proxy` vert. Le proxy est redéployé sur testing au merge : vérifier ensuite qu'une page d'offre partagée affiche toujours ses balises `<meta>`.                                                             |
| bundler (fastlane, cocoapods) | Jobs `Build iOS/Android staging` verts : iOS passe par fastlane, Android lance directement Gradle et ne valide pas les lanes fastlane Android. Surveiller les déploiements OTA testing dès le merge sur master, puis les déploiements natifs testing au prochain tag `testing*`. |
| npm, dépendance transitive (souvent une mise à jour de sécurité)               | `yarn why <package>` pour savoir quelle dépendance l'embarque. Le changelog sert rarement : une CI verte suffit en général.                                                                                                            |
| npm, dépendance JS directe                                                     | Étapes 3 et 4.                                                                                                                                                                                                                         |
| npm, lib React Native avec du code natif (dossier `ios/`, `android/` ou `.podspec` dans le package) | Étapes 3 et 4 quelle que soit la version (même un patch peut casser), et [mettre à jour le `Podfile.lock`](#mettre-à-jour-le-podfilelock). |

### 3. Lire le changelog

- [ ] Lire les release notes et la liste des commits incluses dans la description de la PR. Chercher `BREAKING`, `deprecated`, `removed` et les changements de versions minimales (Node, iOS, Android SDK, React Native).
- [ ] Trouver les usages dans le code : `git grep -n "<package>"` (imports, mais aussi la configuration : `babel.config.js`, `vite.config.js`, `jest/`...).
- [ ] Lire le diff du `yarn.lock` : une mise à jour peut en entraîner d'autres.

Une montée majeure peut casser, mais aussi une montée mineure d'un package en `0.x`.

### 4. Tester manuellement

À faire si :

- c'est une montée majeure (ou mineure d'un package en `0.x`) ;
- le changelog annonce un changement qui touche nos usages ;
- c'est une lib React Native avec du code natif.

Où tester, depuis la branche Dependabot :

- web : ajouter le label `preview` à la PR (déploiement de la PR sur Firebase, environnement testing), ou en local `yarn build:testing && yarn vite preview --mode=testing` ;
- iOS et Android : `yarn install`, puis `yarn ios:testing` / `yarn android:testing`.

Tester les parcours qui utilisent la dépendance (trouvés à l'étape 3). Si tu ne sais pas comment tester une partie du code, demande sur le canal Slack `dev-mobile`.

#### Mettre à jour le Podfile.lock

Dependabot ne lance pas `pod install` : une PR qui met à jour une lib avec du code natif iOS ne met pas à jour `ios/Podfile.lock`.

```sh
git fetch origin
git switch <branche dependabot>
yarn install
cd ios && bundle exec pod install && cd ..
git add ios/Podfile.lock
git commit -m "chore(deps): update Podfile.lock"
git push
```

Dès que quelqu'un d'autre que Dependabot a poussé sur la branche, `@dependabot rebase` ne fonctionne plus et `@dependabot recreate` efface ce commit : il faut rebaser soi-même.

### 5. Merger ou déléguer

Si tout est bon :

1. Mettre le ticket Jira en tête du titre de la PR (à la place de `(BSR)` s'il y est).
2. Approuver la PR.
3. Merger avec **Squash and merge**.

> Les commandes `@dependabot merge`, `@dependabot squash and merge`, `@dependabot cancel merge`, `@dependabot close` et `@dependabot reopen` ne fonctionnent plus depuis le 27 janvier 2026. Utiliser les boutons de GitHub.

Si un problème apparaît et ne se corrige pas facilement :

1. Estimer le travail et en discuter avec son lead pour l'embarquer dans une squad.
2. Créer le ticket Jira.
3. **Fermer la PR** avec la commande `@dependabot ignore …` adaptée (voir ci-dessous), et ajouter le lien du ticket en commentaire. Une PR bloquée laissée ouverte occupe l'une des 2 places de sa source et empêche les autres mises à jour.

### Commandes Dependabot

| Commande                                                 | Effet                                                                                                             |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `@dependabot rebase`                                     | Rebase la PR. Ne fonctionne plus si quelqu'un d'autre que Dependabot a poussé sur la branche.                     |
| `@dependabot recreate`                                   | Recrée la PR, en écrasant les modifications faites dessus.                                                        |
| `@dependabot show <dependency name> ignore conditions`   | Affiche les conditions d'ignore de la dépendance.                                                                 |
| `@dependabot ignore this major version`                  | Ferme la PR et n'en propose plus pour cette version majeure (sauf si la PR est rouverte ou la montée faite à la main). |
| `@dependabot ignore this minor version`                  | Ferme la PR et n'en propose plus pour cette version mineure (mêmes exceptions).                                   |
| `@dependabot ignore this dependency`                     | Ferme la PR et n'en propose plus pour cette dépendance (mêmes exceptions).                                        |

Fermer une PR avec le bouton de GitHub empêche aussi Dependabot de la recréer.

### Ressources

- [Configuration Dependabot](../../../.github/dependabot.yml)
- [Gérer les PRs de mise à jour des dépendances (doc GitHub)](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/managing-pull-requests-for-dependency-updates)
- [Retrait des commandes de merge Dependabot (changelog GitHub, 27 janvier 2026)](https://github.blog/changelog/2026-01-27-changes-to-github-dependabot-pull-request-comment-commands/)
