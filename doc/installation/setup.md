## Installation - setup

We advise to follow [the guidelines][1] to set up your environment. Select your Development OS and your target OS (Android/iOS).

You'll also need `jq`:

**MacOS**

```sh
brew install jq
```

**Linux with apt as root**

```sh
apt update && apt -y install jq
```

**Building from source (not recommended)**

Read jq documentation https://github.com/stedolan/jq

### Android

For Android, you will need to:

- install `node`, `JDK`
- install Android Studio & Android SDK
- configure `ANDROID_HOME` environment variable
- create an virtual device with Android AVD.

### iOS

For iOS, you will need to:

- install `node`
  - with asdf to have the right version

   ```sh
   brew install asdf
   asdf install
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

To make sure your environment is set up correctly, try to run a template application with [Create React Native App][2] or with [react-native-cli][3].

[1]: https://reactnative.dev/docs/environment-setup
[2]: https://github.com/expo/create-react-native-app
[3]: https://github.com/react-native-community/cli
