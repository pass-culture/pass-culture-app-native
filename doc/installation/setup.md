## Installation - setup

We advise to **follow [the guidelines](https://reactnative.dev/docs/environment-setup)** to set up your environment by selecting your Development OS and your target OS (Android/iOS).

[Install `nix` package manager](https://github.com/DeterminateSystems/nix-installer#the-determinate-nix-installer)

[Install DirEnv](https://direnv.net/) (`brew install direnv`) please make sure to [hook into your shell](https://direnv.net/docs/hook.html)

Start a new terminal to load the new configuration

Load environment

```sh
cd ./pass-culture-app-native # if needed
direnv allow
direnv allow # run twice on error
```

### Android

Follow the steps [here](/doc/installation/Android.md).

### iOS

Follow the steps [here](/doc/installation/iOS.md).

### Test setup

To make sure your environment is set up correctly, try to run a template application with [Create React Native App](https://github.com/expo/create-react-native-app) or with [react-native-cli](https://github.com/react-native-community/cli).
