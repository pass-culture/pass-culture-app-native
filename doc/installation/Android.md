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

#### Android real device

First, go to the phone setting and activate developpement mode, then put the device on debug mode.

Connect your device to the computer and run:

  ```sh
  yarn android:testing --deviceName
  ```

Click 'transfert de fichier' on the pop up that appeared


#### Emulator

##### Download Android image

If you have a pass Culture's computer, the process below works if you are using the SDK 33.

Starting with the SDK 34, Google increased the security preventing us from using the same method to get the Android emulator to work. For example, if you want to use an emulator with Android 15 (SDK 35) please refer to the guide below.

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

#### Android 34+ and proxy

Important notes: Avoid Rooted Emulators
It is strongly recommended to use a non-rooted emulator. Using a rooted device can introduce unpredictable and hard-to-debug differences between the rooted and non-rooted environments, including potential graphical glitches.

When applying the methods below, it is crucial to test not only our primary application (pass Culture) but also other network-dependent apps (e.g., Chrome). Some methods may enable network access for our app but fail for others.

##### Method 1: Manual Installation (User Certificate Store)

This method involves manually installing the proxy certificate into the emulator's user store. This process must be repeated every time the emulator is cold-booted.

Steps:

- Locate the Certificate
- Copy to Emulator: Drag and drop the `.pem` file directly onto the running emulator window. This will copy it to the emulator's Downloads folder.
- Install the Certificate:
- Open the emulator's Settings.
- Search for and select "Install a certificate".
- Tap on "CA certificate". A warning will appear; tap "INSTALL ANYWAY".
- The file explorer will open. Navigate to the Downloads directory and select the `.pem` file.

Verify Installation:

- In Settings, navigate to "Trusted credentials".
- Switch to the "USER" tab.
- You should see a certificate listed for the proxy.

Configure Network Security:

- Open the following file in your project: android/app/src/main/res/xml/network_security_config.xml.
- Add the following configuration inside the <network-security-config> tag to instruct the app to trust user-installed certificates:

```xml
<network-security-config>
    <base-config>
        <trust-anchors>
            <certificates src="user" />
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

- Build the App: Rebuild and run your application for the changes to take effect.

Disadvantage: You have to re-install the certificate on the emulator after every cold boot of the emulator.

##### Method 2: Automated Installation (Custom Certificate in App Resources)

This method embeds the certificate directly into the app's resources, making the process automatic at build time.

Steps:

- Copy the certificate file into your project's res/raw directory. Use a clear name like proxy_cacert.

```sh
cp $SSL_CERT_FILE android/app/src/main/res/raw/proxy_cacert
```

(Note: $SSL_CERT_FILE should be the path your `.pem` file)

IGNORE The Certificate File:

- This certificate file must not be committed to source control.

Configure Network Security:

- Modify `android/app/src/main/res/xml/network_security_config.xml` to trust the certificate from the raw resources folder.

```xml
<network-security-config>
    <base-config>
        <trust-anchors>
            <certificates src="@raw/proxy_cacert" />
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

- Build the App: Rebuild your application to include the certificate and the new configuration.

Advantage: This process is automated. Once set up, the certificate is included with every local build.

**! Critical: Do Not Commit Configuration Changes !**

Regardless of the method chosen, the changes to `network_security_config.xml` should not be committed to Git.

If this configuration is pushed to the repository, the Continuous Integration (CI) build will fail because it points to a certificate file (proxy_cacert or a user-installed one) that does not exist in the CI environment.

##### Combining Both Methods

It is possible to configure the app to trust certificates from both the user store and the custom raw resource simultaneously. This can be useful for flexible debugging. The `overridePins="true"` attribute is important for this setup.

Combined `network_security_config.xml`:

```xml
<network-security-config>
    <base-config>
        <trust-anchors>
            <certificates src="@raw/proxy_cacert" />
            <certificates src="user" overridePins="true" />
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

Troubleshooting

Network Errors on 3G/Mobile Data
Currently, there is a known issue where network requests fail when the emulator's WiFi is turned off and it is using a simulated mobile data connection (e.g., 3G/4G).
Hypothesis: The certificate configuration may only be valid for traffic routed through WiFi. This issue is still under investigation.

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
