# TODO

## Links

- [PC-19996](https://passculture.atlassian.net/browse/PC-19996)
- [MobTime](https://mobtime.hadrienmp.fr/mob/Pass-culture)

---

## Tasks

1. [x] màj la version du package.json
   - avec `fake-X.Y.Z`
2. [x] commit
3. [x] mettre un tag
4. [x] push le tag
5. [ ] dans la pipeline trigger un job particulier "deploy-custom-ios-testing-hard" dans la partie workflows pour voir [Créer une version custom de l’app sur App Center](https://www.notion.so/passcultureapp/Cr-er-une-version-custom-de-l-app-sur-App-Center-836bffb7b19643e4a8fe6de6968191a1)
       a. [ ] deploy sur AppCenter
       b. [ ] ne pas lancer les tests
       c. [ ] disable la version sur AppCenter ?
       https://github.com/microsoft/appcenter-cli -> `appcenter distribute releases edit` => Toggles enabling and disabling the specified release

exemple :
deploy-custom-ios-testing-hard:
filters:
tags:
only: /^fake\/v._/
branches:
ignore: /._/
requires: - checkout-and-install-deps

Dans deploy.sh rajouter la condition :
if [[$CURRENT_TAG =~ fake....$HARD_DEPLOY_TESTING_TAG_REGEX]]; then
success "Not on master but tag found. Deploying to $APP_ENV."

---

## Tasks for another US

- [ ] tout pareil pour staging
