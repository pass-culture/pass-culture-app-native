## Installation - iOS

After setting up your [environment][1], you can follow the steps below to run the **pass Culture** mobile application on iOS.

### Further installation process

To install iOS modules (pods), we use Cocoapods (dependency manager). It is built with Ruby, so make sure it is installed on your computer.

We use [bundler][2] to install our Ruby gems. You can install it with `gem install bundler`.

Now you can install Cocoapods with `bundle install`. This will install the gems.

To install the pods, and create the Pods folder, run:

- `bundle exec pod install` inside the folder `/ios`
- you may be asked to run `bundle exec pod repo update`

### 🔥 Firebase setup

You will need to add the `GoogleService-Info.plist` file in the `ios` directory. You can get a copy of the testing configuration one through the password manager, or directly through the Firebase console inside `Project Settings`.

### 🚀 Run the app

To run the app, simply run: `yarn ios:testing`.
This will also start the metro server. If not, run `yarn start` in another tab.

### Start the app on your Apple device (with Xcode)

In order to launch the app in your Apple device, you need to follow these steps:

Download the iOS certificates to your computer:

1. Create an Apple Developer passCulture account (https://developer.apple.com/).
2. Connect to the Apple Developper account with Xcode.
3. Get invited to the Apple Developer group by an Admin.
4. Download the private key via fastlane:
   `bundle exec fastlane ios download_certificates --env testing`
5. Add the URL of the private certificates git repository named "pass-culture-app-native-certificates".
6. Get the `match repo passphrase` on 1password in the "Tech" vault.

Connect your device to the computer and run `yarn ios:testing --device` or use the Xcode interface. Choose a scheme (your device) and click the Run button in the toolbar. More info [here][3].

[1]: ./setup.md
[2]: https://bundler.io/bundle_install.html
[3]: https://developer.apple.com/documentation/xcode/running-your-app-in-the-simulator-or-on-a-device
