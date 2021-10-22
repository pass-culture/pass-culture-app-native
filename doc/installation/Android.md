## Installation - Android

After setting up your [environment][1], you can follow the steps below to run the **pass Culture** mobile application on Android.

First, open the project `android` in Android Studio. Then open the Android Virtual Devices Manager and select (or create) a Virtual Device with the android version you want to run.

### ✍️ Code signing

Download the appropriate keystore file from 1password, for example `testing.keystore`, and place it inside the `/android/keystores` directory.

Then create a `keystores/testing.keystore.properties` file in `/android/keystores` directory with this configuration (required in `build.gradle`):

```
keyAlias=passculture
storeFile=testing.keystore
storePassword=
keyPassword=
```

### 🔥 Firebase setup

Download the `google-services.json` file (1password) and place it inside the `android/app` directory. You can also download this file from the Firebase console.

### 🚀 Run the app

To run the app, simply run: `yarn android:testing`.
This will also start the metro server. If not, run `yarn start` in another tab.

### Troubleshouting

<details>
  <summary>No value has been specified for property 'manifestOutputDirectory'</summary>

In Android Studio: File > Settings > Experimental > Gradle -> uncheck "Only sync the active variant" checkbox.

</details>

[1]: ./setup.md
