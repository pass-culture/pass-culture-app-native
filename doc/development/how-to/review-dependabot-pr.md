## Relire et merger une PR Dependabot

Objectif : intégrer les PRs Dependabot sans casser l'app, et sans qu'elles bloquent les suivantes.

### Ce que fait Dependabot sur ce repo

La configuration est dans `.github/dependabot.yml`.

- Chaque semaine, Dependabot ouvre des PRs de mise à jour pour 4 sources : npm (racine), npm (`server/`), bundler (`Gemfile` : fastlane, cocoapods) et GitHub Actions. **Au maximum 2 PRs ouvertes par source** : tant qu'elles restent ouvertes, aucune autre mise à jour de cette source n'est proposée.
- Certaines mises à jour sont regroupées dans une seule PR :
  - npm (racine et `server/`) : toutes les `devDependencies` arrivent dans la PR du groupe `dev-dependencies` (titre en `… bump the dev-dependencies group …`). Les `dependencies` restent à une PR par dépendance.
  - GitHub Actions : toutes les actions arrivent dans la PR du groupe `github-actions`.
  - bundler : une PR par dépendance.
- Les titres commencent par `(Dependabot) chore(deps):`, ou `(Dependabot) chore(ci):` pour les GitHub Actions. Ce préfixe est accepté par le check `3 [on_pr] Check PR title format` : pas de ticket Jira à créer ni à ajouter au titre.
- Les mises à jour de sécurité (titres en `… in the npm_and_yarn group`) arrivent en plus, hors de cette limite, et ne passent pas par les groupes de `dependabot.yml`. Elles portent souvent sur des dépendances transitives. Les traiter en priorité.
- `react`, `react-native` et `react-native-web` sont exclus. Leur montée de version suit le [guide de mise à jour de React Native](../../bump-react-native.md).
- Chaque PR reçoit le label `e2e`, qui build l'app iOS et Android (staging) puis lance les tests E2E sur Maestro Cloud.

### 1. Vérifier la CI

- [ ] Les jobs du workflow `2 [pull/pr] Initiate workflow` sont verts (lint, tsc, tests unitaires natifs et web, tests du proxy, deadcode).
- [ ] Les jobs `Build iOS staging and upload to Maestro Cloud` et `Build Android staging and upload to Maestro Cloud` sont verts : l'app build sur iOS et Android.
- [ ] Les checks Maestro (`… (IOS)` et `… (ANDROID)`) sont verts. S'ils sont rouges, ouvrir le rapport Maestro et vérifier que l'échec vient de la dépendance, et pas d'un test déjà rouge sur master (voir les derniers runs planifiés `dev_on_schedule_run_e2e_*`).

Points d'attention :

- **Le check de titre `3 [on_pr] Check PR title format` échoue si le titre ne commence pas par `(Dependabot)`** : c'est le cas de certaines mises à jour de sécurité, et des PRs ouvertes avant l'ajout de ce préfixe (`(BSR)`). Corriger le titre à la main, par exemple `(Dependabot) chore(deps): bump …` (le titre devient le message du commit sur master).
- **Les E2E ne tournent qu'à l'ajout du label `e2e`**, donc à la création de la PR. Après un `@dependabot rebase`, leurs résultats restent sur l'ancien commit. Pour les relancer, retirer puis remettre le label `e2e`.
- **La CI des PRs ne build pas le web** (sauf avec le label `breaking change`). Pour une dépendance utilisée par le web, voir l'étape 4.

### 2. Identifier le type de mise à jour

| PR                                                                             | Ce qu'il faut vérifier                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Groupe `dev-dependencies` (npm racine ou `server/`)                            | Plusieurs dépendances dans une même PR : la liste est dans la description. Appliquer à chacune la ligne qui lui correspond ci-dessous. Le groupe ne contient pas que des outils de lint et de test : Babel, Metro et Vite construisent l'app, et quelques paquets (`react-native-svg-web`, `react-native-web-linear-gradient`…) sont embarqués dans le web. Si une seule dépendance pose problème, voir l'étape 5. |
| GitHub Actions (`chore(ci)`, groupe `github-actions`)                          | Release notes de chaque action de la PR : inputs renommés ou supprimés, version de Node. Beaucoup de workflows ne tournent que sur master ou sur tag (déploiements) : surveiller leur prochain run après le merge.                      |
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

1. Approuver la PR.
2. Merger avec **Squash and merge**.

Si un problème apparaît et ne se corrige pas facilement :

1. Estimer le travail et en discuter avec son lead pour l'embarquer dans une squad.
2. Créer un ticket Jira pour ce travail supplémentaire.
3. **Fermer la PR** avec la commande `@dependabot ignore …` adaptée (voir ci-dessous, ou via les menus de github), et ajouter le lien du ticket en commentaire. Une PR bloquée laissée ouverte occupe l'une des 2 places de sa source et empêche les autres mises à jour.

Dans une PR groupée, si une seule dépendance pose problème, ne pas bloquer tout le groupe : commenter `@dependabot ignore <package> major version` (ou `minor version`, `patch version`, ou sans version pour ignorer toute la dépendance). La PR est fermée, et Dependabot reproposera le groupe sans cette dépendance à son prochain passage. Une fois le ticket traité, `@dependabot unignore <package>` rouvre une PR qui l'inclut.

### Commandes Dependabot

| Commande                                                 | Effet                                                                                                             |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `@dependabot rebase`                                     | Rebase la PR. Ne fonctionne plus si quelqu'un d'autre que Dependabot a poussé sur la branche.                     |
| `@dependabot recreate`                                   | Recrée la PR, en écrasant les modifications faites dessus.                                                        |
| `@dependabot show <dependency name> ignore conditions`   | Affiche les conditions d'ignore de la dépendance.                                                                 |
| `@dependabot ignore this major version`                  | Ferme la PR et n'en propose plus pour cette version majeure (sauf si la PR est rouverte ou la montée faite à la main). |
| `@dependabot ignore this minor version`                  | Ferme la PR et n'en propose plus pour cette version mineure (mêmes exceptions).                                   |
| `@dependabot ignore this dependency`                     | Ferme la PR et n'en propose plus pour cette dépendance (mêmes exceptions).                                        |

Dans une PR groupée (`dev-dependencies`, `github-actions`, mises à jour de sécurité groupées), utiliser plutôt les commandes qui nomment la dépendance, pour n'écarter qu'elle.

| Commande                                                 | Effet                                                                                                             |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `@dependabot ignore <dependency name>`                   | Ferme la PR et ne met plus à jour cette dépendance.                                                               |
| `@dependabot ignore <dependency name> major version`     | Ferme la PR et ne propose plus la version majeure de cette dépendance (de même avec `minor version`, `patch version`). |
| `@dependabot unignore <dependency name>`                 | Ferme la PR, efface les conditions d'ignore de la dépendance et ouvre une nouvelle PR qui l'inclut.               |
| `@dependabot unignore *`                                 | Ferme la PR, efface les conditions d'ignore de toutes les dépendances du groupe et ouvre une nouvelle PR.         |

Fermer une PR avec le bouton de GitHub empêche aussi Dependabot de la recréer.

### Ressources

- [Configuration Dependabot](../../../.github/dependabot.yml)
- [Gérer les PRs de mise à jour des dépendances (doc GitHub)](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/managing-pull-requests-for-dependency-updates)
- [Retrait des commandes de merge Dependabot (changelog GitHub, 27 janvier 2026)](https://github.blog/changelog/2026-01-27-changes-to-github-dependabot-pull-request-comment-commands/)
