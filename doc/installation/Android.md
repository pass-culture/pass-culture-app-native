## Installation - Android

**After setting up your [environment](./setup.md)**, you can follow the steps below to run the **pass Culture** mobile application on Android.

### Further installation process

If you encounter errors during this setup, refer to the Troubleshooting section at the end of this document.

First download Android Studio :

```sh
brew install --cask android-studio
```

Then open [the folder `android`](./android/) in Android Studio.

Finally, open the Android Virtual Devices Manager and select (or create) a Virtual Device with the android version you want to run.

### ✍️ Code signing

- Download `testing.keystore` and `testing.keystore.properties` files from our password manager and place it inside the `/android/keystores` directory.

  _If you do not find `testing.keystore`, contact an admin._

- Modify `testing.keystore.properties` to match with this configuration (required in `build.gradle`) :

  ```
  keyAlias=passculture
  storeFile=testing.keystore
  storePassword=
  keyPassword=
  ```

- Do the same for staging and production.

### Install

In the `.env.local` file (create the file if not exists), add

```sh
SECRET_KEYTOOL_PASSWORD=THE_PASSWORD # replace THE_PASSWORD with the one from our password manager search for "Android keytool password"
```

then in your terminal run :

```sh
sudo xcodebuild -license # read and accept Apple license to be abble to use git inside Android Studio
./scripts/install_certificate_java.sh # this script ask root password
direnv reload
```

If it fails [see troubleshooting](./setup.md#troubleshooting)

### 🔥 Firebase setup

Download the `google-services.json` files from our password manager and place them inside the `android/app/src/<env>` directories. You can also download these files from the Firebase console.

```txt
android/
    app/
        src/
            production/
                google-services.json
            staging/
                google-services.json
            apptesting/
                google-services.json
```

### 🚀 Run the app

To run the app, simply run:

```sh
yarn android:testing
```

This will also start the metro server. If not, run in another tab :

```sh
yarn start
```

### Emulator

#### Download Android image

1. Open Android Studio
1. Open settings
1. In settings, search "Android SDK" and open it
1. Check "Show Package Details" (in bottom right)
1. Unfold some image versions (any [version supported](../../android/build.gradle))
1. Check "Google APIs `*` System Image"

   Where `*` match you CPU architecture that you can know using the following command in the terminal

   ```sh
   uname -m
   ```

   Example: `Google APIs ARM 64 v8a System Image`

   This type of image is known to work unlike to "Google APIs **ATD**" or "Google Play" which are known to have issues

1. Click on "OK", this will download stuff

#### Create an emulator

1. Open Android Studio
1. Open Device Manager
1. Click on "Add a new device"
1. Click on "Create Virtual Device"
1. Choose any hardware
1. Choose [a "Google APIs" image that have been previously downloaded](#download-android-image), you may have to go to the "Other Images" tab

If you have a pass Culture's computer, which has a proxy that adds a custom certificate.

1. Start your emulator at least once
1. Stop your emulator
1. Run in a terminal

   ```sh
   yarn android:testing
   ```

### Troubleshooting

<details>
<summary><strong>No value has been specified for property 'manifestOutputDirectory'</strong></summary>

In Android Studio: File > Settings > Experimental > Gradle -> uncheck "Only sync the active variant" checkbox.

If you encounter an issue with JDK, install using `brew install --cask temurin@17` and add the path `JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home` in .zshrc

</details>
<details>
<summary><strong>Version conflict</strong></summary>

It happens when you try to install with a build number _lower_ than the one already installed.

- Ensure that there is one

```bash
$ yarn run-android | grep 'INSTALL_FAILED_VERSION_DOWNGRADE'
```

- If no line containing `'INSTALL_FAILED_VERSION_DOWNGRADE'` is caught, this is not the problem
- If a line with `'INSTALL_FAILED_VERSION_DOWNGRADE'` is caught
→ **Uninstall the app on your emulator before building**
</details>
<details>
  <summary><strong>General error for building the app on Android Studio</strong></summary>

[See the general troubleshooting section](./setup.md#troubleshooting)

</details>
<details>
  <summary><strong>[M1 & M2 processor] Error while building the app on android with Android Studio : `Android Studio-- Cause: error=86, Bad CPU type in executable` or `Task :app:processApptestingDebugResources FAILED`</strong></summary>

If you get this error on M1 or M2 Mac, installing Rosetta 2 should solve the issue. You can install it with this command : `softwareupdate --install-rosetta`.

Rosetta will allow applications requiring Intel processor to run on M1 & M2 Mac.

</details>
