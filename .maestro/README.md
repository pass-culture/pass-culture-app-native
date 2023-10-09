# POC Maestro

[Documentation de Maestro](https:/maestro.mobile.dev/)

## Prérequis

- Avoir Xcode 14 ou plus
- Builder l'app en local

---

## Configuration

[Documentation d'installation](https:/maestro.mobile.dev/getting-started/installing-maestro)

Pour installer Maestro sur Mac OS, Linux or Windows :

```bash
curl -Ls "https:/get.maestro.mobile.dev" | bash
```

Connecter un device virtuel

```bash
brew tap facebook/fb
brew install facebook/fb/idb-companion
idb_companion --udid <UDID-du-device-ou-vous-avez-build-lapp-en-local>
```

Pour obtenir l'UDID des devices virtuels :

```bash
xcrun simctl list
```

Il est possible de ne pas ajouter l'UDID pour démarrer les tests, mais il faut sélectionner le device directement dans une liste de devices proposés.

---

## Run les tests

```bash
yarn start

# Tous les tests natif
maestro test .maestro

# Uniquement un test natif spécifique ex: .maestro/native/SignUp.yml
maestro test .maestro/<nomDuTest.yml>

# Uniquement un test web spécifique ex: .maestro/web/Home.yml
maestro test .maestro/<nomDuTest.web.yml>

# Lancer les tests avec l'utilisation de variables 
maestro test -e USERNAME=${USERNAME} -e USERNAME_UNKNOWN=${USERNAME_UNKNOWN} -e NEW_USERNAME=${NEW_USERNAME} -e NUMBER_PHONE=${NUMBER_PHONE} -e PASSWORD=${PASSWORD} .maestro/


---

## Écrire un test

L'utilisation de [Maestro studio](https:/maestro.mobile.dev/getting-started/maestro-studio) simplifie l'écriture des tests car il permet de voir les différent sélecteurs possible a l'aide d'une interface. Pour démarrer Maestro Studio il faut :

```bash
yarn start
maestro studio
```

Pour écrire un test il faut suivre cette structure

```yml
# .maestro/native/MonTest.yml

appId: your.app.id > Mettre l'ID de l'app que vous voulez tester comme "app.passculture.test". Cette app doit être installé sur le device virtuel.
---
- launchApp
- tapOn: 'Text on the screen'
```

Voici [une liste des commandes](https:/maestro.mobile.dev/api-reference/commands) que nous pouvons utiliser pour écrire les tests.
