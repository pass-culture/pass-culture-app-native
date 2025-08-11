# 🚀 Guide de mise à jour de React Native

Ce document décrit le processus de mise à jour de React Native dans le projet Pass Culture.

## 📝 À copier dans la description de PR

```md
## 🔄 Mise à jour `react-native@<version>`

Link to JIRA ticket: https://passculture.atlassian.net/browse/PC-XXXXX
Les changelogs sont consultables [ici](https://reactnative.dev/versions)

### 📊 État d'avancement (après que la CI soit verte)

- [ ] 🌐 build web `yarn build:testing && yarn vite preview --mode=testing`
- [ ] 🚀 dev web `yarn start:web:testing`
- [ ] 🤖 build android `./gradlew assembleDebug`
- [ ] ⚡ dev android `yarn android:testing`
- [ ] 🍎 dev ios `yarn ios:testing`
- [ ] 📚 build storybook `yarn storybook`
- [ ] 🎨 dev storybook `yarn build-storybook`
- [ ] 🧪 tests e2e
- [ ] 🚀 build environnement de test `yarn trigger:testing:deploy`
- [ ] 🙊 mettre un message sur le canal slack `dev-mobile`

| Tâche                                        | Commande                                                  | Etat attendu                                                          |
| -------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| 🌐 build web                                 | `yarn build:testing && yarn vite preview --mode=testing`  | ✅ succès de la commande + pas d'écran blanc                          |
| 🚀 dev web                                   | `yarn start:web:testing`                                  | ✅ succès de la commande + pas d'écran blanc                          |
| 🤖 build android                             | `./gradlew assembleDebug`                                 | ✅ succès de la commande                                              |
| ⚡ dev android                               | `yarn android:testing`                                    | ✅ succès de la commande + pas d'écran rouge                          |
| 🍎 dev ios                                   | `yarn ios:testing`                                        | ✅ succès de la commande + pas d'écran rouge                          |
| 📚 build storybook                           | `yarn storybook`                                          | ✅ succès de la commande + pas de message d'erreur sur les composants |
| 🎨 dev storybook                             | `yarn build-storybook`                                    | ✅ succès de la commande + pas d'erreur en serveur local              |
| 🧪 tests e2e                                 | ajouter un label `e2e` dans Github après chaque tentative | 👨‍💻 Le QA doit valider que c'est bon de son côté                       |
| 🚀 build environnement de test (après merge) | `yarn trigger:testing:deploy`                             | ✅ Le job passe                                                       |

### ⚠️ Difficultés

### 🔧 Changements majeurs
```

## 📋 Prérequis

Être sur une machine qui a déjà la capacité de faire tourner le projet dans sa version actuelle sur iOS, Android et web.

## 🚀 Processus de mise à jour

### 🔍 Les diffs

- Ouvrir un onglet de [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
- Appliquer toutes les diffs sur le projet, ligne par ligne (même les commentaires)

Il est important de respecter les diffs pour avoir un projet le plus proche possible du template React Native et ainsi faciliter les diffs sur une prochaine montée de version.

⚠️ **Ne pas oublier les binaires** comme les `gradle-wrapper.jar` qu'il faudra télécharger et copier dans le projet.

### 📦 Installation

```bash
rm -rf node_modules
yarn install
yarn postinstall
```

Le `postinstall` mettra en évidence les paquets qui ont été patchés et qui ne sont plus à jour. Dans ce cas, il faudra les patcher pour être en accord avec la nouvelle version.

### 🧪 Les tests

Certains tests (voir quasi tous) peuvent échouer. Cela peut être dû aux mocks, à des snapshots ou des libs qui ont changé d'API.
Tous les tests doivent être au vert avant de passer à la suite.

La CI doit être complètement verte avant de passer aux étapes suivantes.

Bien vérifier les différences de snapshots notamment sur les balises ou les CSS

### 🔧 Faire fonctionner les environnements

#### 🌐 Web

Le plus facile, tester que ça se lance bien en dev et que ça build (peu de chances que ça casse et ce sera déjà derrière nous).

**Est-ce que ça marche en dev ?**

```bash
yarn start:web:testing
```

**Est-ce que ça build ?**

```bash
yarn build:testing
```

**Est-ce que le build fonctionne ?**

```bash
yarn vite preview --mode=testing
```

#### 🤖 Android

##### 🔨 L'installation

À cette étape, on croise les doigts mais ne pas s'attendre à ce que ça build du premier coup. Pas de soucis, ça fait partie du process !

```bash
cd android
./gradlew assembleDebug
```

Si une erreur s'affiche, il faudra débugger et investiguer. On peut s'aider de :

- Stack Overflow
- Les issues GitHub du paquet concerné

Souvent il suffit de faire des mises à jour de paquet ou toucher à des config gradle. En dernier recours, on peut patcher et ouvrir une issue + PR sur le repo concerné.

##### ⚡ Le runtime

Il est très commun que l'app se lance avec un écran rouge ou blanc. Il faudra investiguer si c'est le cas. C'est souvent dû à une incompatibilité de paquets.
Si c'est le cas, regarder si l'erreur est claire (trouvable sur internet), essayer de la corriger au mieux.

Sinon, il est bon de savoir que l'erreur vient d'un code compilé avec peu de chances de trouver précisément d'où ça vient.

On va pouvoir rebuild l'app avec des sourcemaps pour inspecter d'où viendrait l'erreur :

```bash
npx react-native bundle --entry-file index.js --platform android --dev true --bundle-output android/app/src/main/assets/index.android.bundle --sourcemap-output android/app/src/main/assets/index.android.bundle.map
```

Puis :

```bash
# ligne 267
# colonne 13
npx source-map-cli android/app/src/main/assets/index.android.bundle.map 267 13
```

La ligne exacte posant problème dans le code non compilé devrait apparaître.

Si tu vois la première page s'afficher, bingo ! 🎉

#### 🍎 iOS

##### 📱 Les pods

```bash
cd ios
rm Podfile.lock
bundle install
bundle exec pod install
```

Le `Podfile.lock` va poser plus de problème qu'autre chose. Il peut être supprimé et regénéré pour que tous les devs partent sur une nouvelle base.
Il faut bien sûr, comme à chaque étape, s'attendre à des problèmes et les résoudre.

###### 🔨 L'installation

```bash
yarn ios:testing
```

Si un message d'erreur n'est pas assez clair, build depuis Xcode, puis `View > Navigators > Report` et cliquer où il y a une croix rouge (souvent à côté de `build`).

###### ⚡ Le runtime

Pareil que pour Android.

#### 📚 Storybook

```bash
yarn storybook
yarn build-storybook
```

#### 📝 Changelogs

Lire la page web de la release note de cette version afin de :

- comprendre les impacts de la nouvelle version
- faire remonter en synchro tech les nouveautés utilisables par les développeurs
- tester les nouveautés (rapidement) pour s'assurer que cela fonctionne

#### 🧪 QA

Les tests e2e doivent être lancés depuis la CI et la PR doit être approuvée par un membre de la QA.

#### 🫃 La PR devient énorme

Il est commun qu'un bump de react native demande des bumps d'autres libs.
Si ces libs sont compatibles avec la version actuelle de l'app, préférer faire ce changement dans une PR différente.
Ainsi le travail sera mieux suivi par les PM, mieux découpé et plus facile à relire par les pairs

#### 🔀 Merge

À ce stade-là, après une validation d'un tech lead, de la QA et d'un autre développeur expérimenté, on peut merge mais ce n'est pas encore terminé.

#### 📢 Surveiller le canal Slack

Tout fonctionne chez nous mais ça ne marchera sûrement pas aussi facilement sur l'environnement d'un autre dev.
Mettre un message dans dev-mobile pour informer la communauté avec :

```txt
:git-merge: React Native version <version> vient d'être merge
Vous pouvez dès à présent :
- supprimer vos node_modules
- réinstaller vos modules yarn
- réinstaller vos pods
- rebuild le projet sur vos simulateurs
- redémarrer metro avec `--reset-cache`

N'hésitez pas à laisser un petit message si quelque chose ne fonctionne pas chez vous 🚀
```

#### 🚀 Déploiement en testing

Déployer l'app en testing et s'assurer que tout fonctionne.
En tant que dev responsable du bump, il faut également surveiller les deploiements staging et prod car il y a des petits diffs. On peut avoir un deploiement testing qui passe, mais pas staging/prod
