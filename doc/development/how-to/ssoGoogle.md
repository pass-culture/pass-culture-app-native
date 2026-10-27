# Comment tester l'authentification SSO Google en local

## Sur iOS
Non pris en charge pour le moment.

## Sur Android
Vous devez créer un identifiant client OAuth (OAuth Client ID) de type Android [ici][1], avec les valeurs suivantes :
- **Nom :** Google Auth Android (dev) - VOTRE NOM
- **Nom du package :** app.passculture.testing
- **Empreinte SHA-1 :** elle correspond à l'empreinte de votre keystore de débogage (debug keystore). Vous pouvez l'obtenir en exécutant la commande suivante :
```
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Le SSO fonctionnera lorsque vous lancerez la commande `yarn android:testing`.

## Sur le Web
- Lancez l'application web avec un backend local ; vous pouvez consulter [cette documentation](./run-local-api.md) pour savoir comment procéder.
- Vous devez ajouter les variables d'environnement suivantes dans le fichier `.env.local.secret`, situé dans le dossier `api` du dépôt du backend : `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`. Ces informations sont disponibles [sur la console Google][2] ou dans notre gestionnaire de mots de passe, sous l'entrée « Google oAuth client ».

[1]: https://console.cloud.google.com/apis/credentials/oauthclient?project=passculture-native
[2]: https://console.cloud.google.com/apis/credentials/oauthclient/605788939445-jbn4bv8q35gdpmg777pfcu055j4ltf4f.apps.googleusercontent.com
