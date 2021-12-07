## Installation - setup

We advise to follow [the guidelines][1] to setup your environment. Select your Development OS and your target OS (Android/iOS).

### Android

For Android, you will need to:

- install `node`, `JDK`
- install Android Studio & Android SDK
- configure `ANDROID_HOME` environment variable
- create an virtual device with Android AVD.

### iOS

For iOS, you will need to:

- install `node`
  - with NVM to have the right version

   ```sh
   brew install nvm
   nvm install
   nvm use
   ```

  - **AND**
  - with Brew to have XCode build's steps (`Bundle React Native code and images` and `Upload Debug Symbols to Sentry`) working

   ```sh
   brew install node
   ```

- install Xcode and its command line tools
- Install a simulator if not already in Xcode
- install Cocoapods

### Test setup

To make sure your environment is setup correctly, try to run a template application with [Create React Native App][2] or with [react-native-cli][3].

[1]: https://reactnative.dev/docs/environment-setup
[2]: https://github.com/expo/create-react-native-app
[3]: https://github.com/react-native-community/cli
