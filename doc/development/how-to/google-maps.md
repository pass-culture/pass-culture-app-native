# Use Google Maps API

For the venue map on Android, we use the Google Maps API. It needs an API key to work.

The API key is stored in the .env files. It is used in the `AndroidManifest.xml` file (set up by the `app/build.gradle` file).

The API keys are restricted to the app's package name and SHA-1 fingerprint of the keystore, and, can only use the Maps SDK for Android.

They are configured in the Google Cloud Platform.

## For local development

When developing in local, you are using your own debug keystore. You need to allow it to use the Google Maps API.

1) Get the SHA-1 fingerprint of the debug keystore:

```sh
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

2) On [Google Cloud Platform > Google Maps Platform > Keys and credentials, edit "Key for the venue map on Android"](https://console.cloud.google.com/apis/credentials/key/52cc91af-29b1-49d9-b376-184ea50321d7?project=passculture-metier-ehp), and add on the Android restrictions the package name (from .env.testing if you're developing on testing) and the SHA-1 fingerprint just obtained.
