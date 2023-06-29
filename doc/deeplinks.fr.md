# Deeplinks

Doc officielle : https://developer.android.com/training/app-links/verify-android-applinks

Il est important de tester les deeplinks après de grosses mises à jour,
ou lorsque l'on change de CI (ou les paramètres de CI).

Pour se faire, l'idéal serait de les tester sur les 3 environnements : testing + staging + prod.

## Mise en place
### En local, sur un commit spécifique

Tout d'abord il faut se mettre sur le commit

```shell
git checkout v1.244.4
```

Ensuite on installe les dépendences comme d'habitude et on build l'app :
```shell
yarn install
./android/gradlew assembleStagingRelease -p android # or assembleApptestingRelease
```

Il faut démarrer l'émulateur ou connecter son téléphone pour pouvoir
lancer des commandes `adb`.

On installe l'`apk` fraîchement créé :
```shell
adb install android/app/build/outputs/apk/staging/release/app-staging-release.apk # Staging
adb install android/app/build/outputs/apk/apptesting/release/app-apptesting-release.apk # Testing
```

### Avec une release AppCenter
Installer la release comme indiqué dans la documentation https://github.com/pass-culture/pass-culture-app-native/blob/master/doc/development/e2e.md#provide-an-apk

## Test manuel

Enfin c'est le moment de tester :
```shell
adb shell pm get-app-links app.passculture.staging
adb shell pm get-app-links app.passculture.testing
```

L'output ressemble à quelque chose comme ça lorsqu'il y a une erreur :
```
app.passculture.staging:
    ID: ffa985ae-4a1c-4822-a087-47803e674fce
    Signatures: [14:E7:31:E4:B1:20:25:F2:EB:51:80:8D:B0:C9:A2:51:AB:A2:1B:DD:E5:37:F7:92:9A:63:D8:03:FD:6F:F6:6C]
    Domain verification state:
      app.staging.passculture.team: 1024
```

Et lorsqu'elle est valide :
```
  app.passculture.staging:
    ID: 6714d97d-6261-4667-8320-5f849914cd5b
    Signatures: [38:C3:22:9D:88:B2:0C:AE:22:92:01:EE:6E:28:D1:DD:0E:EA:06:7E:5E:88:C3:8E:41:28:07:AD:E3:39:AB:F1]
    Domain verification state:
      app.staging.passculture.team: verified
```

C'est le meilleur moyen, celui qui est le plus fiable pour tester que les deeplinks fonctionnent.
