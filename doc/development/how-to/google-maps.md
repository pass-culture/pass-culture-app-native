# Utilisation de l'API Google Maps

Pour la carte des lieux sur Android, nous utilisons l'API Google Maps. Son fonctionnement nécessite une clé API.

Cette clé API est stockée dans la variable `GOOGLE_MAPS_API_PUBLIC_KEY` des fichiers `.env` (les environnements de test et de pré-production partagent la même clé, tandis que l'environnement de production possède sa propre clé). Elle est utilisée dans le fichier `AndroidManifest.xml` (configuré via le fichier `app/build.gradle`).

Les clés API sont restreintes au nom du paquet de l'application ainsi qu'à l'empreinte SHA-1 du magasin de clés (*keystore*) ; elles sont limitées à l'utilisation du SDK Google Maps pour Android.

La configuration s'effectue sur Google Cloud Platform.

## Pour le développement local

Lors du développement en local, vous utilisez votre propre magasin de clés de débogage (*debug keystore*). Vous devez l'autoriser à utiliser l'API Google Maps.

1) Récupérez l'empreinte SHA-1 de votre magasin de clés de débogage :

```sh
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

2) Sur [Google Cloud Platform > Google Maps Platform > Clés et identifiants, modifiez la clé intitulée « Key for the venue map on Android »](https://console.cloud.google.com/apis/credentials/key/52cc91af-29b1-49d9-b376-184ea50321d7?project=passculture-metier-ehp). Dans la section des restrictions Android, ajoutez le nom du paquet de l'application (correspondant à `ANDROID_APP_ID` ​​dans le fichier `.env.testing`, par exemple `app.passculture.testing` si vous travaillez sur l'environnement de test) ainsi que l'empreinte SHA-1 que vous venez d'obtenir.
