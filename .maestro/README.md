# Maestro

[Documentation de Maestro](https://maestro.mobile.dev/)

## Prérequis

- Pouvoir builder l'app en local pour [Android](/doc/installation/Android.md) et [iOS](/doc/installation/iOS.md)
- Java [11.0.20.1](/doc/installation/Android.md#troubleshooting)
- Xcode 14 ou plus

## Installation commune à toutes les plateformes

[Documentation d'installation complète](https://maestro.mobile.dev/getting-started/installing-maestro)

> Résumé: Pour lancer les tests Android, vous n'avez qu'a installer la CLI maestro. Pour le web, vous devez avoir le ChromeDriver en plus. C'est la version iOS simulateur qui demande le plus de préparatifs. Il faut installer l'idb, et lui passer l'id du simulateur.

**Il n'est pas possible de lancer les tests sur un iOS physique pour le moment.**

Tableau récapitulatif des besoins de chaque plateforme pour lancer les tests:

|                  | Build local | CLI | adb | idb | ChromeDriver |
| ---------------- | ----------- | --- | --- | --- | ------------ |
| Android Virtuel  | ✓           | ✓   | ✓   | ✗   | ✗            |
| Android Physique | ✓           | ✓   | ✓   | ✗   | ✗            |
| iOS Virtuel      | ✓           | ✓   | ✗   | ✓   | ✗            |
| iOS Physique     | -           | -   | -   | -   | -            |
| Web              | ✗           | ✓   | ✗   | ✗   | ✓            |

### Installer la CLI Maestro

Pour installer Maestro sur Mac OS, Linux ou Windows :

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

## Mise en place spécifique à Android

Téléphone à utilisé (virtuel et physique): Samsung Galaxy S9 (SM-G960F) && OS Android 10

Sur téléphone physique, il se peut que vous deviez accepter l'installation via USB de `dev.mobile.maestro` lors du lancement des tests.

### Installer ADB

Lorsque vous avez installé Android Studio, `platform-tools` (qui inclut `adb`) est installé par défaut.

Si la commande `adb --version` ne marche pas chez vous, assurez-vous d'avoir ajouté `platform-tools` à [vos variables d'environnement](README.md#troubleshooting).

#### Pourquoi a-t-on besoin d'ADB ?

Les devices Android font des requêtes aux adresses suivantes :
||Simulateur|Physique|
|--|--|--|
|Android|10.0.2.2|localhost|

Pour rediriger les requêtes faites sur ces adresses-là vers notre machine, nous utilisons la commande `adb reverse`. Cette commande nous permet d'exposer un port de notre device Android à notre machine, et est nécessaire pour rediriger les requêtes faites sur `10.0.2.2:<port>` ou `localhost:<port>` sur notre device Android vers `localhost:<port>` sur notre machine.

### Lancez votre build local

Lancez `yarn start` si le build est déjà présent sur votre appareil, sinon `yarn android:testing` (ou `yarn android:staging`).

> La commande `maestro test` va détecter et utiliser automatiquement un émulateur local ou un appareil physique connecté en USB.

Vous êtes prêts pour lancer les tests Maestro Android.

## Mise en place spécifique à iOS

Au moment d'écrire cette documentation, [il n'est pas possible de lancer maestro sur un appareil iOS physique](https://maestro.mobile.dev/getting-started/installing-maestro#connecting-to-your-device).

Simulateur utilisé: iPhone 14 Pro && OS 16.6.1

### Installer IDB (iOS)

Installez `idb` (iOS Development Bridge):

```bash
brew tap facebook/fb
brew install facebook/fb/idb-companion
```

### Lancez votre build local

Si vous avez déjà l'application buildée localement sur votre emulateur, lancez la commande `yarn start`, et sur le simulateur, ouvrez l'application. L'instance de Metro de la command `yarn start` devrait se connecté à votre emulateur. Si vous avez pas buildée avant, lancez `yarn ios:testing` ou `yarn ios:staging` selon l'environnement.

### Obtenir l'UDID des devices virtuels

Il faut que le simulateur où vous avez buildé votre application soit démarré.

```bash
xcrun simctl list | grep "(Booted)"
```

Qui renvoie la ligne du device avec Booted:

```bash
iPhone SE (3rd generation) (0669277D-1C16-461C-86DD-EF81E8C46E03) (Booted)
```

Copiez le UDID de votre simulateur (le contenu des sécondes paranthèses) et executez la commande suivante:

```bash
idb_companion --udid <UDID-du-device-ou-vous-avez-build-lapp-en-local>
```

Tant que vous ne changez pas de simulateur de test, vous n'aurez pas à refaire les commandes ci-dessus.

Vous pouvez procéder au lancement des tests sur iOS!

## Mise en place spécifique au Web

### Installer ChromeDriver

Regardez la version de Chrome que vous utilisez.

Allez chercher la version de ChromeDriver correspondante [ici](https://googlechromelabs.github.io/chrome-for-testing/#stable).

Sur MacBook, si vous avez une erreur de type `org.openqa.selenium.remote.NoSuchDriverException: Unable to obtain: Capabilities`, il faut que vous installiez Rosetta:

```bash
softwareupdate --install-rosetta
```

### Ajouter ChromeDriver au PATH (optionnel)

Si vous êtes obligé de lancer ChromeDriver manuellement à chaque redémarrage de votre ordinateur, vous pouvez ajouter ChromeDriver à vos variables d'environement pour faciliter son utilisation.

- Déplacez le fichier téléchargé dans `/usr/local/bin`.

La commande ci-dessous part du principe que vous allez téléchargé et décompressé la version arm64 du driver dans `/Downloads`.

```
sudo mv Downloads/chromedriver-mac-arm64/chromedriver /usr/local/bin
```

- Ajoutez le chemin au fichier téléchargé au `PATH`:

Mettez la ligne suivante à la fin de de votre fichier de configuration du terminal (~/.zshrc si vous utilisez zsh):

```
export PATH="/usr/local/bin/chromedriver:$PATH"
```

### Configuration supplémentaire

Les tests sont lancés à partir de testing/staging, vous n'avez pas besoin de lancer l'app web localement.

## Lancement des tests

Il faut avoir soit:

- Un émulateur Android avec l'application buildé localement
- Un téléphone physique Android avec l'application buildé localement
- Un simulateur iOS avec l'application buildé localement
- Pour le web, les tests se font à partir de https://app.testing.passculture.team ou https://app.staging.passculture.team et ne requirent pas de build local.

```bash
# Commandes pour lancer tous les tests sur les différents environnements, plateformes et target
yarn test:e2e:android:staging
yarn test:e2e:android:staging:cloud
yarn test:e2e:ios:staging
yarn test:e2e:ios:staging:cloud
yarn test:e2e:web:staging
yarn test:e2e:android:testing
yarn test:e2e:ios:testing
yarn test:e2e:web:testing

# Commande pour lancer un test spécifique
yarn test:e2e:android:staging .maestro/tests/subFolder/commons/LaunchApp.yml
yarn test:e2e:android:staging:cloud --app-file <Path of your ipa/app or apk> .maestro/tests/
```

## Lancer un test simple sur le web

Admettons que nous voulions tester que la version testing du web se lance bien.

S'il n'existe pas encore, duplicons le fichier `.yml` pour lancer l'application que nous souhaitons tester pour en créer un pour le web.

Le fichier d'origine s'appelle `.maestro/tests/reusableFlows/LaunchApp.yml`, créons donc `.maestro/tests/reusableFlows/LaunchApp.web.yml`.

Dans ce fichier, remplaçons l'application que vise les tests par l'url du site web de testing. Au final nous aurons:

```yml
appId: https://app.testing.passculture.team
---
- launchApp:
    appId: 'https://app.testing.passculture.team'
    clearState: true
```

Maintenant, lançons le test que nous venons de créer:

```bash
maestro test .maestro/tests/reusableFlows/LaunchApp.web.yml
```

La commande ci-dessus lancera une fenêtre Chrome dans lequel on verra la banière suivante: `Chrome is being controlled by an automated test software`. Le site pass Culture devrait apparaître bièvement avant de se refermer.

Dans le terminal d'où nous avons lancer le test, nous devrions voir:

```yml
║
║  > Flow
║
║    ✅  Launch app "https://app.testing.passculture.team" with clear state
```

Le test à été lancé avec succès et a réussi toutes les tâches qu'il devait accomplir.

Admettons que nous voulions nous assurer que la pop-up des cookies apparaisent bien, et si elle apparaît, que nous puissions accepter les cookies. Au test précédent, nous rajouterions:

```
- assertVisible: 'Respect de ta vie privée'
- tapOn: 'Tout accepter'
```

Si on relance notre script de test avec ces deux nouvelles lignes, nous devrions voir la page web se lancer, et si la boîte d'acceptation des cookies apparaît, elle devrait se fermer en soulignant "Tout accepter" pendant un instant.

Dans notre terminal, à la fin du test nous devrions avoir:

```yml
║  > Flow
║
║    ✅  Launch app "https://app.testing.passculture.team" with clear state
║    ✅  Assert that "Respect de ta vie privée" is visible
║    ✅  Tap on "Tout accepter"
```

Évidemment, il est préferable de ne pas rajouter ces deux nouvelles lignes dans `.maestro/tests/reusableFlows/LaunchApp.web.yml`, mais de créer un nouvel fichier qui aurait pour responsabilité de tester les cookies (voir `.maestro/tests/reusableFlows/features/cookies/CookiesConsent.yml`). Ensuite on créerait un nouveau flow qui reprendrait le lancement de l'app et le test des cookies.

## Organisation des tests avec les tags

Les tests Maestro sont organisés avec un système de tags qui permet de catégoriser et de filtrer les tests selon différents critères. Les principaux tags utilisés sont :

- `local` : Tests qui peuvent être exécutés en local
- `nightlyAndroid` : Tests spécifiques pour les runs nocturnes sur Android
- `nightlyIOS` : Tests spécifiques pour les runs nocturnes sur iOS
- `squad-conversion` : Tests liés aux parcours de conversion
- `squad-activation` : Tests liés aux parcours d'activation
- `squad-decouverte` : Tests liés aux parcours de découverte

Pour lancer des tests avec un tag spécifique, vous pouvez utiliser l'option

## Lancer les tests avec l'utilisation de variables

```bash
maestro test \
  --env MAESTRO_VALID_EMAIL=${VALID_EMAIL} \
  --env MAESTRO_INVALID_EMAIL=${INVALID_EMAIL} \
  --env MAESTRO_UNREGISTERED_EMAIL=${UNREGISTERED_EMAIL} \
  --env MAESTRO_NUMBER_PHONE=${NUMBER_PHONE} \
  --env MAESTRO_PASSWORD=${PASSWORD} \
  --env MAESTRO_PHYSICAL_OFFER=${PHYSICAL_OFFER} \
  --env MAESTRO_EVENT_OFFER=${EVENT_OFFER} \
  --env MAESTRO_MESSAGE_CODE_VALIDATION_TELEPHONE=${MESSAGE_CODE_VALIDATION_TELEPHONE} \
  .maestro/
```

## Écrire un test avec Maestro studio

L'utilisation de [Maestro studio](https://maestro.mobile.dev/getting-started/maestro-studio) simplifie l'écriture des tests car il permet de voir les différent sélecteurs possible a l'aide d'une interface. Pour démarrer Maestro Studio il faut :

```bash
yarn start
maestro studio
```

Pour écrire un test il faut suivre cette structure :

```yml
appId: your.app.id > Mettre l'ID de l'app que vous voulez tester comme "app.passculture.staging".
---
- launchApp
- tapOn: 'Text on the screen'
```

Voici [une liste des commandes](https://maestro.mobile.dev/api-reference/commands) que nous pouvons utiliser pour écrire les tests.

## Tester des trackers

Il faut ajouter le flow suivant dans le scenario de test pour tester un tracker
En remplacant `NomDeVotreEvent` par le nom de l'event que vous souhaitez tester

```yaml
- runFlow:
    when:
      true: ${MAESTRO_RUN_TRACKING_TESTS}
    file: subFolder/analytics/verifyTracking.yml
    env:
      EXPECTED_ANALYTICS_CALL: 'NomDeVotreEvent'
      MAESTRO_MOCK_ANALYTICS_SERVER: ${MAESTRO_MOCK_ANALYTICS_SERVER}
```

### Limites

Le serveur étant très simple, il ne supporte l'exécution que d'un test à la fois

# **Troubleshooting**

### **Android**

<details>
  <summary>command not found adb</summary>
  <br/>
Pour vérifier si adb est installé il faut exécuter :

```bash
~/Library/Android/sdk/platform-tools/adb
```

Il imprimera la version d'ADB et le chemin. Copier le chemin d'installation d'adb, qui peut ressembler à `(/Users/user-name/Library/Android/sdk/platform-tools/adb)`.

Puis ouvrir le fichier `.zshrc` et ajouter comme ceci (ne pas ajouter `platform-tools/adb` dans `export ANDROID_HOME`):

```bash
export ANDROID_HOME=/Users/user-name/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$PATH
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/tools/bin:$PATH
```

Enfin, redémarrer le terminal.

</details>
<details>
  <summary>Unable to launch app app.passculture.staging: null</summary>
  <br/>

Fermer maestro studio et relancer le test.

</details>
