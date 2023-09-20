## Installation - Android

**After setting up your [environment](./setup.md)**, you can follow the steps below to run the **pass Culture** mobile application on Android.

### Further installation process

If you encounter errors during this setup, refer to the Troubleshooting section at the end of this document.

First download Android Studio and open [the folder `android`](./android/) in Android Studio.

Then open the Android Virtual Devices Manager and select (or create) a Virtual Device with the android version you want to run.

### ✍️ Code signing

- If it does not exist, create the `/android/keystores` directory.
- Download `testing.keystore` and `testing.keystore.properties` files from 1password and place it inside the `/android/keystores` directory.

  _If you do not find `testing.keystore`, contact an admin._

- Modify `testing.keystore.properties` to match with this configuration (required in `build.gradle`) :

  ```
  keyAlias=passculture
  storeFile=testing.keystore
  storePassword=
  keyPassword=
  ```

### 🔥 Firebase setup

Download the `google-services.json` file from 1password and place it inside the `android/app` directory. You can also download this file from the Firebase console.

### 🚀 Run the app

To run the app, simply run:

```sh
yarn android:testing
```

This will also start the metro server. If not, run in another tab :

```sh
yarn start
```

### Troubleshooting

<details>
  <summary>No value has been specified for property 'manifestOutputDirectory'</summary>

In Android Studio: File > Settings > Experimental > Gradle -> uncheck "Only sync the active variant" checkbox.

En cas de soucis avec le JDK installer via `brew install --cask zulu11` et ajouter le chemin `JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home` dans .zshrc

</details>

<details>
  <summary>General error for building the app on Android Studio</summary>

These are the general solutions for errors :

run `cd android && ./gradlew clean` to clear the build directory.

on the root of the repository : `rm -rf node_modules` then `yarn` or `yarn install`, this will delete all the installed modules from the repo then reinstalled it.

If you're on M1 or M2 Mac and the problem still remains, see the error below.

</details>
<br/>
<details>
  <summary>[M1 & M2 processor] Error while building the app on android with Android Studio : `Android Studio-- Cause: error=86, Bad CPU type in executable` or `Task :app:processApptestingDebugResources FAILED`</summary>

If you get this error on M1 or M2 Mac, installing Rosetta 2 should solve the issue. You can install it with this command : `softwareupdate --install-rosetta`.

Rosetta will allow applications requiring Intel processor to run on M1 & M2 Mac.

</details>
