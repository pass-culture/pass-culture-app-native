## Installation - iOS

**After setting up your [environment](./setup.md)**, you can follow the steps below to run the **pass Culture** mobile application on iOS.

### Further installation process

If you encounter errors during this setup, refer to the Troubleshooting section at the end of this document.

- **install `node`**

  - with NVM to have the right version

  ```sh
  brew install nvm
  nvm install
  nvm use
  ```

  - **AND** with Brew to have XCode build's steps (`Bundle React Native code and images` and `Upload Debug Symbols to Sentry`) working

  ```sh
  brew install node
  ```

  - then we will use node v16 and put it by default:

  ```
  nvm install v16
  nvm use v16
  nvm alias default v16
  ```

- **install RVM (Ruby Version Manager) and Ruby**

  To install iOS modules (pods), we use CocoaPods (dependency manager). It is built with Ruby, so make sure it is installed on your computer, otherwise:

  - install RVM with:

  ```sh
  curl -sSL https://raw.githubusercontent.com/rvm/rvm/master/binscripts/rvm-installer | bash -s stable
  ```

  - install a version of Ruby that's 2.7.5 or higher (version of Ruby is indicated in the [Gemfile](/Gemfile) on the root of the repo) with:

  ```sh
  rvm install "version"
  rvm use "version"
  ```

- **install bundler**

  - We use [bundler](https://bundler.io/bundle_install.html) to install our Ruby gems, install it with:

  ```sh
  gem install bundler
  ```

  - Now you can install CocoaPods, that will install the gems, with:

  ```sh
  bundle install
  ```

- **install the pods, and create the Pods folder**

  ```sh
  pushd ios
  bundle exec pod install
  popd
  ```

  you may be asked to run:

  ```sh
  pushd ios
  bundle exec pod repo update
  popd
  ```

If `bundle exec pod install` didn't work, check in Xcode -> Settings -> Locations if you have a Command line tools installed, then revalidate the Command line tools by clicking it.

### 🔥 Firebase setup

You will need to add the `GoogleService-Info.plist` file in the `ios` directory. You can get a copy of the testing configuration one through the password manager, or directly through the Firebase console inside `Project Settings`.

### 🔨Setup Xcode

In order to launch the app in the Simulator or on your external Apple device, you need to follow these steps:

1. Create an [Apple Developer passCulture account](https://developer.apple.com/)

2. You need to use the 14.2 Xcode version, you can download it [here](https://developer.apple.com/download/all/?q=xcode%2014.2) with an Apple Developer account (follow the 1st step).

3. Install a simulator if not already in Xcode

4. Download the iOS certificates to your computer:

   1. Connect to the Apple Developer account with Xcode.
   2. Get invited to the Apple Developer group by an Admin.
   3. Download the private key via fastlane:

   ```sh
   bundle exec fastlane ios download_certificates --env testing
   ```

   4. When required (multiple times), use the git ssh URL of the private certificates repository (available on 1password in the "Tech" vault): `pass-culture-app-native-certificates`.
   5. Get the `match repo passphrase` on 1password in the "Tech" vault.

### 🚀 Run the app with yarn

- For Apple External Device

  Connect your device to the computer and run:

  ```sh
  yarn ios:testing --device
  ```

  or use the Xcode interface. Choose a scheme (like testing), then a device and click the `Run` button in the toolbar.

- For Xcode Simulator

  Run:

  ```sh
  yarn ios:testing
  ```

  or use the Xcode interface.

  This will also start the metro server. If not, run in another tab:

  ```sh
  yarn start
  ```

### 😤 Troubleshooting

<details>
  <summary>env: node: No such file or directory
  Command PhaseScriptExecution failed with a nonzero exit code</summary>

If this error pops up while trying to build with Xcode it means that Xcode can’t find Node because the sym-link to Node is not made.

#### First option

Run `ln -s "\$(which node)" /usr/local/bin/node`

If it says “File exists”, `rm /usr/local/bin/node` and rerun the command above.

Drawback ❌: This sym-link will be obsolete as soon as the path of your node instance changes. To prevent this, you can command above to your .bashrc. Thus, the command will be run each time you open a new terminal

#### Second option

Add node with brew: `brew install node`

Drawback ❌: If you were using a node version manager (nvm, fnm, ...) you will now have two different node instances

</details>

<details>
  <summary>❌ error: An organization slug is required (provide with --org)</summary>

This error means that the ~/.sentryclirc file has not been added correctly. Please run through [this tutorial again](https://github.com/pass-culture/pass-culture-app-native/blob/master/doc/installation/sentry.md#-configure-sentry-cli)

</details>

<details>
  <summary>sentry reported an error: Invalid Token (http status: 401)</summary>

This error means that the sentry token you generated is invalid. Please run through [this tutorial again](https://github.com/pass-culture/pass-culture-app-native/blob/master/doc/installation/sentry.md#-configure-sentry-cli) and be careful with the scope permissions 😉

</details>

<details>
  <summary>The application's Info.plist does not contain a valid CFBundleVersion</summary>

Make sure you installed jq so the CFBundleVersion can be automatically filled.

If it is installed but you still have the error, maybe Xcode doesn't find it: run `which jq`. If it does NOT print `/usr/local/bin/jq`, run `ln -s (which jq) /usr/local/bin/jq` to create a sym-link that Xcode will find.

</details>

<details>
  <summary>No binary rubies available for: osx/13.5/arm64/ruby-3.0.0.
Continuing with compilation.</summary>

https://stackoverflow.com/questions/42735805/what-does-no-binary-rubies-available-mean

</details>

<details>
  <summary> After the `bundle exec fastlane ios download_certificates --env testing` command, you gave the SSH git repository link and it's not doing anything.</summary>
    It might be an issue with your ssh (for example if you only cloned the repository through http), try to clone the repository elsewhere using ssh and try again.
</details>

<details>
  <summary>`/.rvm/gems/ruby-2.7.5/gems/nap-1.1.0/lib/rest/error.rb:76:in 'require': cannot load such file -- openssl (LoadError)`
  </summary>
Try to change the openssl version you're on:

```sh
openssl version
```

if it's not 1.1:

```sh
brew install openssl@1.1
```

```sh
brew unlink openssl@3
```

```sh
brew link openssl@1.1
```

check if the link worked:

```sh
brew link openssl@1.1
```

</details>
