## Installation - iOS

**After setting up your [environment](./setup.md)**, you can follow the steps below to run the **pass Culture** mobile application on iOS.

### Further installation process

If you encounter errors during this setup, refer to the Troubleshooting section at the end of this document.

- **install iOS dependencies**

  - Now you can install CocoaPods in the project `pass-culture-app-native`, that will install the gems, with:

  ```sh
  bundle install
  ```

  ```sh
  cd ios
  bundle exec pod install
  cd ..
  ```

  you may be asked to run:

  ```sh
  cd ios
  bundle exec pod repo update
  cd ..
  ```

If `bundle exec pod install` didn't work, check in Xcode -> Settings -> Locations if you have a Command line tools installed, then revalidate the Command line tools by clicking it.

- **install jq for some xcode scripts**

  ```sh
  brew install jq
  ```

### 🔥 Firebase setup

You will need to add the `GoogleService-Info.plist` file in the `ios` directory. You can get a copy of the testing configuration one through the password manager, or directly through the Firebase console inside `Project Settings`.

### 🔨Setup Xcode

In order to launch the app in the Simulator or on your external Apple device, you need to follow these steps:

1. Create an [Apple Developer passCulture account](https://developer.apple.com/)

2. You need to [install](https://xcodereleases.com) the [version specified in `XCODE_SUPPORTED_VERSION`](../../scripts/check_xcode_version.sh)

3. Install a simulator if not already in Xcode

4. Download the iOS certificates to your computer:

   1. Connect to the Apple Developer account with Xcode.
   1. Get invited to the Apple Developer group by an Admin.
   1. Download the private key via fastlane:

      ```sh
      bundle exec fastlane ios download_certificates --env testing
      ```

   1. When required (multiple times), use the git ssh URL of the private certificates repository
   1. Get the `match repo passphrase` on our password manager in the "Tech" vault.

   1. It might ask your session password twice to continue, it might also ask you to do the previous step twice.

### 🚀 Run the app with yarn

- For Apple External Device

  Connect your device to the computer and run:

  ```sh
  yarn ios:testing --device
  ```

  or use the Xcode interface. Choose a scheme (like testing), then a device and click the `Run` button in the toolbar.
  This will also start the metro server. If not, run in another tab:

```sh
yarn start
```

- For Xcode Simulator

  Run:

  ```sh
  yarn ios:testing
  ```

- Optionnaly for a specific Xcode Simulator

  Run:

  ```sh
  xcrun xctrace list devices
  ```

  ```sh
  yarn ios:testing --udid='the udid of the device you want in the list you got from the previous command'
  ```

### 😤 Troubleshooting

<details>
  <summary><strong>❌ error: An organization slug is required (provide with --org)</strong></summary>

This error means that the `~/.sentryclirc` file has not been added correctly. Please run through [this tutorial again](https://github.com/pass-culture/pass-culture-app-native/blob/master/doc/installation/sentry.md#-configure-sentry-cli).

</details>

<details>
  <summary><strong>sentry reported an error: Invalid Token (http status: 401)</strong></summary>

This error means that the sentry token you generated is invalid. Please run through [this tutorial again](https://github.com/pass-culture/pass-culture-app-native/blob/master/doc/installation/sentry.md#-configure-sentry-cli) and be careful with the scope permissions.

</details>

<details>
  <summary><strong>After the `bundle exec fastlane ios download_certificates --env testing` command, you gave the SSH git repository certificates and it's not doing anything.</strong></summary>
It might be an issue with your ssh (for example if you only cloned the repository through http)
  
1. Try to clone the repository elsewhere using ssh to see if your ssh key is working if it does try again the command.

1. If it's still failing, save your ssh key password in the ssh agent :

   ```sh
   ssh-add ~/.ssh/id_ed25519
   ```

   then try again.

</details>

<details>
  <summary><strong>Pod and cache</strong></summary>

#### Pods may need to be installed again

```bash
cd ios && bundle exec pod install && cd ..
```

#### Cache may need to be cleared and rebuilt

```bash
cd ios && rm -rf ./build && rm -rf ~/Library/Developer/Xcode/DerivedData/* && cd ..
```

</details>
