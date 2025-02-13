# Pour repartir de zéro avec une installation propre de React Native, sans impacter le reste de ton système, voici les étapes à suivre. L’objectif est de nettoyer ton environnement de développement actuel et de réinstaller les outils nécessaires

🚩 1. Identifier l’environnement actuel

Avant de supprimer quoi que ce soit, vérifie quelles versions de Node, npm, React Native CLI, etc., sont installées :

node -v
npm -v
npx react-native --version
watchman --version
java -version

🔄 2. Supprimer les outils existants

Cela dépend de la manière dont tu as installé les outils (via Homebrew, nvm, etc.).

a) Désinstallation des packages globaux :

npm uninstall -g react-native-cli
npm uninstall -g react-native

b) Supprimer Node.js et npm :

Si installé via Homebrew :

brew uninstall node

Si via un package officiel : supprime-le depuis le dossier /usr/local/bin :

sudo rm -rf /usr/local/bin/node
sudo rm -rf /usr/local/lib/node_modules

c) Supprimer Watchman (si installé) :

brew uninstall watchman

d) Supprimer Java (si besoin de réinstaller proprement) :

brew uninstall --cask temurin

📦 3. Nettoyer les caches

npm cache clean --force
watchman watch-del-all
rm -rf ~/.watchmanconfig
rm -rf ~/.npm
rm -rf ~/.metro-cache
rm -rf node_modules
rm -rf package-lock.json

Si tu utilises nvm, tu peux supprimer les versions de Node :

nvm uninstall <version>

🚀 4. Réinstaller un environnement propre

a) Installer Homebrew (si non présent) :

/bin/bash -c "$(curl -fsSL <https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh>)"

b) Installer Node via nvm (recommandé) :

brew install nvm
mkdir ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"' >> ~/.zshrc
source ~/.zshrc

nvm install --lts
nvm use --lts
sudo ln -s $(which node) /usr/local/bin/node

c) Installer Watchman :

brew install watchman

d) Installer React Native CLI :

npm install -g react-native-cli

e) Installer Java (si nécessaire pour Android) :

brew install --cask temurin

f) Installer Android Studio (si nécessaire) :
 • Télécharge Android Studio depuis le site officiel ou via brew
 • Installe les SDK nécessaires via le SDK Manager.

⚡ 5. Vérification de l’installation

Crée un projet de test :

npx react-native init TestProject
cd TestProject
npx react-native run-ios # ou run-android
