## Installation - setup

### Install global tools

[Install `nix` package manager](https://github.com/DeterminateSystems/nix-installer#the-determinate-nix-installer)

If you have a pass Culture's computer, which has a proxy that adds a custom certificate, the install may fail

In that case, you will need to install Nix as follows

```sh
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install  --ssl-cert-file '/Library/Application Support'/*/*/data/*cacert.pem
```

[Install DirEnv](https://direnv.net/)

```sh
brew install direnv
```

Then please make sure to [hook into your shell](https://direnv.net/docs/hook.html)

Start a new terminal to load the new configuration

We advise to **follow [the guidelines](https://reactnative.dev/docs/set-up-your-environment)** to set up your environment by selecting your Development OS and your target OS (Android/iOS).

### Load project environment

```sh
cd ./pass-culture-app-native # if needed
direnv allow
```

If you got an error when executing `direnv allow` run it twice

### Android

Follow the steps [here](/doc/installation/Android.md).

### iOS

Follow the steps [here](/doc/installation/iOS.md).

### Test setup

To make sure your environment is set up correctly, try to run a template application with [Create React Native App](https://github.com/expo/create-react-native-app) or with [react-native-cli](https://github.com/react-native-community/cli).
