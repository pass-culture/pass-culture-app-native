# Reset installation

To start from scratch with a clean installation of React Native, without impacting the rest of your system, here are the steps to follow. The aim is to clean up your current development environment and reinstall the necessary tools

## 1. Identify the current environment

Before removing anything, check which versions of Node, npm, React Native CLI, etc. are installed:

```bash
node --version
npm --version
npx react-native --version
watchman --version
java --version
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
brew uninstall --cask temurin@17
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

**PLEASE !!! by default follow our [general instructions](./setup.md)**

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

### d) Install Java (if necessary for Android)

```bash
brew install --cask temurin@17
```

### e) Install Android Studio (if necessary)

- Use brew [see general instructions](./Android.md) or Download Android Studio from the official site
- Install the necessary SDKs via the SDK Manager.

## 5. Checking the installation

Creates a test project :

```bash
npx react-native init TestProject
cd TestProject
npx react-native run-ios # or run-android
```
