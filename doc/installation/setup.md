## Installation - setup

### Install global tools

#### Install `nix` package manager

You can install it from [Nix installation page](https://docs.determinate.systems/getting-started/).

If you have a pass Culture's computer, which has a proxy that adds a custom certificate, the install may fail. In that case, you will need to install Nix as follows :

```sh
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install --determinate --ssl-cert-file '/Library/Application Support'/*/*/data/*cacert.pem
```

#### Install DirEnv
( can be done while waiting for direnv installation )

1. If you don't already have it, install [brew](https://brew.sh/).
1. Install the executable

   ```sh
   brew install direnv
   ```

   _If you want more information or if you have a problem you can consult [DirEnv installation](https://direnv.net/)._

1. You will need to add [hook into your user configuration (example: `~/.zshrc`)](https://direnv.net/docs/hook.html).

1. Start a new terminal to load the new configuration.

### Load project environment

```sh
cd ./pass-culture-app-native # if needed
direnv allow
```

The last step can take several tens of minutes, especially the first time.

#### Troubleshooting

🚨 If you got the following error when executing `direnv allow` 🚨 

```txt
/nix/store/559pz0w6zlvw8yyxah9s10fhaz400vaj-stdenv-darwin/setup: line 138: pop_var_context: head of shell_variables not a function context
```

Try to upgrade bash

```sh
brew install bash
```

If still doesn't work, run it twice

```sh
direnv allow
```

#### Something is wrong

Try to reload environment

```sh
direnv reload
```

Still wrong ?

```sh
direnv deny
direnv allow
```

Still wrong ?

```sh
direnv deny
git clean -dxf .direnv .devbox .venv ios/Pods
npx rn-game-over --all
direnv allow
```

Still wrong ?

Save the content of the terminal to be able to understand what did wrong

Ask for help

### IOS and Android setup

We advise to **follow [the guidelines](https://reactnative.dev/docs/set-up-your-environment)** to set up your environment by selecting your Development OS and your target OS (Android/iOS).

#### Android

Follow the steps [here](/doc/installation/Android.md).

#### iOS

Follow the steps [here](/doc/installation/iOS.md).

### Test setup

To make sure your environment is set up correctly, try to run a template application with [Create React Native App](https://github.com/expo/create-react-native-app) or with [react-native-cli](https://github.com/react-native-community/cli).
