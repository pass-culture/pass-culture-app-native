## Installation - setup

### Install global tools

#### Install `nix` package manager

If you have a pass Culture's computer, which has a proxy that adds a custom certificate, the install may fail

In that case, you will need to install Nix as follows

```sh
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install  --ssl-cert-file '/Library/Application Support'/*/*/data/*cacert.pem
```

If you want more information or if you have a problem you can consult [`nix` package manager installation](https://github.com/DeterminateSystems/nix-installer#the-determinate-nix-installer)

#### Install DirEnv

```sh
brew install direnv
```

If you want more information or if you have a problem you can consult [DirEnv installation](https://direnv.net/)

You will need to add [hook into your user configuration (example: `~/.zshrc`)](https://direnv.net/docs/hook.html)

Start a new terminal to load the new configuration

We advise to **follow [the guidelines](https://reactnative.dev/docs/set-up-your-environment)** to set up your environment by selecting your Development OS and your target OS (Android/iOS).

### Load project environment

```sh
cd ./pass-culture-app-native # if needed
direnv allow
```

The last step can take several tens of minutes, especially the first time

If you got an error when executing `direnv allow` run it twice

### Android

Follow the steps [here](/doc/installation/Android.md).

### iOS

Follow the steps [here](/doc/installation/iOS.md).

### Test setup

To make sure your environment is set up correctly, try to run a template application with [Create React Native App](https://github.com/expo/create-react-native-app) or with [react-native-cli](https://github.com/react-native-community/cli).
