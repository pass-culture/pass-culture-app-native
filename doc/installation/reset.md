# Pour repartir de zéro avec une installation propre de React Native, sans impacter le reste de ton système, voici les étapes à suivre. L’objectif est de nettoyer ton environnement de développement actuel et de réinstaller les outils nécessaires

*made by chatgpt*

## 1. Identify the current environment

Before removing anything, check which versions of Node, npm, React Native CLI, etc. are installed:

```bash
node --version
npm --version
npx react-native --version
watchman --version
java -version
```

## 2. Delete existing tools

It depends on how you have installed the tools (via Homebrew, nvm, etc.).

First make a quick cache and react native process clean:

```bash
npx rn-game-over --all
```

### a) Uninstalling global packages

Adapt if installed with Yarn.

```bash
npm uninstall -global react-native-cli
npm uninstall -global react-native
```

If you use nvm, you can delete versions of Node :

```bash
nvm uninstall <version>
```

### b) Remove Node.js and npm

[The long way : How do I completely uninstall Node.js, and reinstall from begining](https://stackoverflow.com/questions/11177954/how-do-i-completely-uninstall-node-js-and-reinstall-from-beginning-mac-os-x)

It installed itself via Homebrew :

```bash
brew uninstall node
```

If via an official package, delete it from the`/usr/local/bin` :

```bash
sudo rm -rf /usr/local/bin/node
sudo rm -rf /usr/local/lib/node_modules
```

### c) Remove Watchman (if installed)

```bash
brew uninstall watchman
```

### d) Remove Java (if you need to reinstall properly)

```bash
brew uninstall --cask zulu
```

## 3. Clean folders

```bash
rm -rf ~/.watchmanconfig
rm -rf ~/.npm
rm -rf ~/.metro-cache
rm -rf node_modules
rm -rf package-lock.json
```

## 4. Reinstall a clean environment

**PLEASE !!! by default follow our [general instructions](https://github.com/pass-culture/pass-culture-app-native/blob/master/doc/installation/setup.md)**

---

If you encounter any problem then you may follow those steps...

### a) Install Homebrew (if not present)

```bash
/bin/bash -c "$(curl -fsSL <https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh>)"
```

### b) Install Node via nvm (recommended)

```bash
brew install nvm
mkdir ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"' >> ~/.zshrc
source ~/.zshrc

nvm install --lts
nvm use --lts
sudo ln -s $(which node) /usr/local/bin/node
```

### c) Install Watchman

```bash
brew install watchman
```

### d) Install React Native CLI

```bash
npm install -g react-native-cli
```

### e) Install Java (if necessary for Android)

```bash
brew install --cask zulu
```

### f) Install Android Studio (if necessary)

- Download Android Studio from the official site or via brew
- Install the necessary SDKs via the SDK Manager.

## 5. Checking the installation

Creates a test project :

```bash
npx react-native init TestProject
cd TestProject
npx react-native run-ios # or run-android
```
