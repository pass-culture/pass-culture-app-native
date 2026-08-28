# Maestro

[Documentation de Maestro](https://maestro.mobile.dev/)

## Prérequis

- App buildable en local : [Android](/doc/installation/Android.md) · [iOS](/doc/installation/iOS.md)
- Xcode 16 ou plus

## Installation

### CLI Maestro

```bash
curl -fsSL "https://get.maestro.mobile.dev" | bash
```

### Secrets

Les secrets sont disponibles dans notre gestionnaire de mots de passe sous le nom **`Secrets E2E`**.

Copiez-les dans `.maestro/.env.secret` (créez ce fichier s'il n'existe pas).

## Lancement des tests

```bash
yarn test:e2e
```

Le script guide interactivement à travers les choix suivants :

| Étape | Options |
|---|---|
| **Mode** | `cloud` (recommandé) · `local` |
| **Plateforme** | `android` · `ios` · `web` (local uniquement) |
| **Tags** | Sélection dans la liste des tags existants · tag custom · tous les tests |
| **Application** | Binary ID d'un build uploadé · fichier `.apk`/`.app` local _(cloud uniquement)_ |
| **Nom de run** | Libre, optionnel _(cloud uniquement)_ |

La dernière configuration est mémorisée : au prochain lancement, il est possible de la réutiliser, de modifier quelques paramètres, ou de repartir de zéro.

L'environnement de référence est **staging**. L'environnement testing est trop sandboxé pour être fiable.

> Le mode **cloud est à privilégier** : les runs locales sont plus sujettes aux faux négatifs (réseau, état du simulateur, performances machine).

Les tests se trouvent dans `.maestro/testsV3/`.

## Obtenir un binary ID

Les tests cloud nécessitent un build de debug (`.apk` Android ou `.app` iOS) uploadé sur Maestro.

**Option recommandée — déclencher un build depuis la CI :** posez le label prévu à cet effet sur votre branche. La CI va build et upload l'app, et le binary ID est disponible dans les détails de la run sur le dashboard Maestro.

**Option locale :**

```bash
# Android
ENVFILE=.env.staging ./gradlew assembleDebug
# → android/app/build/outputs/apk/staging/debug/app-staging-debug.apk

# iOS
bundle exec fastlane ios build_e2e --env staging
```

Une fois obtenu, le binary ID ou l'apk/.app peut être réutilisé pour toutes les runs suivantes tant que l'app n'a pas changé.

**Pour un simple fix de test sans modification de l'app, préférez le binary ID de la dernière run du nightly — cela garantit d'être aligné sur master.**

> Le binary ID se trouve sur le [dashboard Maestro](https://app.maestro.dev/) dans les détails d'une run.

## Configuration locale par plateforme

### Android

Buildez l'app une première fois avec `yarn android:staging`, puis `yarn start` pour les runs suivantes.

ADB est requis pour rediriger les ports réseau du device vers la machine hôte. Il est inclus dans Android Studio (`platform-tools`). Vérifiez avec `adb --version`.

### iOS

**Les tests sur iOS physique ne sont pas supportés.**

Buildez l'app une première fois avec `yarn ios:staging`, puis `yarn start` et ouvrez l'app sur le simulateur pour les runs suivantes.

IDB (iOS Development Bridge) est requis :

```bash
brew tap facebook/fb
brew install facebook/fb/idb-companion
```

Récupérez l'UDID du simulateur démarré et lancez `idb_companion` :

```bash
xcrun simctl list | grep "(Booted)"
# → iPhone 16 Pro (XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX) (Booted)

idb_companion --udid <UDID>
```

Tant que vous ne changez pas de simulateur, vous n'aurez pas à relancer ces commandes.

### Web

Les tests web tournent sur `https://app.staging.passculture.team`, aucun build local n'est nécessaire.

## Tags

Les tags identifient le domaine fonctionnel d'un test. Ils correspondent au nom du dossier parent dans `testsV3/` et sont référencés dans le `CODEOWNERS`.

Les tests déclarent leurs tags dans l'en-tête du fichier `.yml` :

```yaml
tags:
  - booking
```

| Tag | Usage |
|-----|-------|
| `auth` | Authentification |
| `bonification` | Crédits et bonification |
| `booking` | Réservation |
| `cookies` | Consentement cookies |
| `onboarding` | Parcours onboarding |
| `profile` | Profil utilisateur |
| `search` | Recherche |
| `offer` | Fiche offre |
| `artist` | Page artiste |
| `web` | Tests web |
| `fix` | Test en cours de correction (éphémère) |
| `refacto` | Test en cours de refactoring (éphémère) |

## Flows communs (`common/`)

Les flows réutilisables sont organisés par catégorie dans `testsV3/common/` :

- **`lifecycle/`** — démarrage (`LaunchApp`), arrêt (`StopApp`), reset keychain iOS (`ClearIOSKeychain`)
- **`deeplinks/`** — navigation par deeplink vers les écrans principaux. `DeepLink.js` doit toujours être appelé en `onFlowStart`
- **`navigation/`** — interactions de navigation récurrentes (tab bar, retour)
- **`cookies/`** — gestion du bandeau cookies
- **`helpers/`** — génération de données de test via l'API E2E (`generateUser.js`, `generateQFResponse.js`, voir sections dédiées)
- **`assertions/`** — assertions réutilisables

## Écrire un test

Structure minimale d'un fichier de test :

```yaml
appId: ${MAESTRO_APP_ID}
tags:
  - mon-tag
onFlowStart:
  - runScript: ../common/deeplinks/DeepLink.js
---
- runFlow: ../common/lifecycle/LaunchApp.yml
- tapOn: 'Texte visible à l'écran'
```

[Liste des commandes disponibles](https://maestro.mobile.dev/api-reference/commands)

[Maestro Studio](https://docs.maestro.dev/maestro-studio/run-tests-with-maestro-studio) permet d'explorer les sélecteurs en live via une application dédiée (l'ancienne commande CLI `maestro studio` n'est plus maintenue).

## Générer un utilisateur de test

La plupart des tests nécessitent un utilisateur bénéficiaire créé à la volée via l'API E2E. Le script `common/helpers/generateUser.js` s'appelle dans `onFlowStart` :

```yaml
onFlowStart:
  - runScript: ../common/deeplinks/DeepLink.js
  - runScript:
      file: ../common/helpers/generateUser.js
      env:
        id_provider: 'UBBLE'
        step: 'BENEFICIARY'
        age: 18
```

Le script expose les variables suivantes utilisables dans le flow :

| Variable | Contenu |
|---|---|
| `output.userId` | ID de l'utilisateur créé |
| `output.userEmail` | Email de l'utilisateur |
| `output.deeplinkIos` | Deeplink de confirmation d'email (iOS) |
| `output.deeplinkAndroid` | Deeplink de confirmation d'email (Android) |

## Mocker le quotient familial

Pour les tests de bonification, `common/helpers/generateQFResponse.js` configure la réponse QF renvoyée par le mock. Il s'appelle après `generateUser.js` :

```yaml
  - runScript:
      file: ../common/helpers/generateQFResponse.js
      env:
        user_id: ${output.userId}
        mock_type: 'OK'
```

Valeurs disponibles pour `mock_type` :

| Valeur | Scénario simulé |
|---|---|
| `OK` | QF valide, dossier accepté |
| `HOUSEHOLDER_OK` | QF valide, déclarant principal |
| `NOT_IN_TAX_HOUSEHOLD` | Utilisateur absent du foyer fiscal |
| `PERSON_NOT_FOUND` | Personne introuvable |
| `APPLICATION_NOT_FOUND` | Dossier introuvable |
| `QUOTIENT_FAMILIAL_TOO_HIGH` | QF trop élevé |

## Tester des trackers

Pour vérifier qu'un event analytics est bien envoyé :

```yaml
- runFlow:
    when:
      true: ${MAESTRO_RUN_TRACKING_TESTS}
    file: ../common/analytics/verifyTracking.yml
    env:
      EXPECTED_ANALYTICS_CALL: 'NomDeVotreEvent'
      MAESTRO_MOCK_ANALYTICS_SERVER: ${MAESTRO_MOCK_ANALYTICS_SERVER}
```

Le serveur mock analytics ne supporte qu'un test à la fois.

## Troubleshooting

<details>
  <summary>command not found: adb</summary>
  <br/>

Ajoutez ces lignes dans `~/.zshrc` puis redémarrez le terminal :

```bash
export ANDROID_HOME=/Users/$USER/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

</details>

<details>
  <summary>Unable to launch app app.passculture.staging: null</summary>
  <br/>

Fermez Maestro Studio et relancez le test.

</details>

<details>
  <summary>Secrets manquants</summary>
  <br/>

Vérifiez que `.maestro/.env.secret` existe et contient tous les secrets E2E.

</details>
