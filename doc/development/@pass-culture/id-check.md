## Dev en local avec le package @pass-culture/id-check

Dans le repo [**id-check-front**](https://github.com/pass-culture/id-check-front) :

1. `cd packages/id-check`
1. `yarn link`

Dans le repo [**pass-culture-app-native**](https://github.com/pass-culture/pass-culture-app-native) :

1. `yarn link @pass-culture/id-check`
1. `yarn start`

**iOS et android uniquement** : le hot reloading ne fonctionnant pas avec le package linked, il faut kill puis restart metro à chaque fois qu'on veut prendre en compte un changement du code du package `id-check` vis à vis de l'app de développement.

## Mettre à jour le package @pass-culture/id-check

> Attention : pour executer `npm publish`, vous devez être dans le group `@pass-culture` sur npm (voir avec Alexis Pibrac).

Dans le repo [**id-check-front**](https://github.com/pass-culture/id-check-front) :

1. `git checkout master`
1. Ouvrir les 4 `package.json`, et bumper la version dans les 4 fichiers en suivant la convention [**semver**](https://semver.org/).
1. Commiter les 4 `package.json` avec le message suivant : `"bump version to X.X.X"`
1. `git tag vX.X.X`
1. `git push origin vX.X.X`
1. `cd packages/id-check`
1. Vérifier que `cat ~/.npmrc` a le registry suivant de configurer avec votre access token :
   ```bash
   ...
   //registry.npmjs.com/:_authToken=XXXXXXXXXXXXX
   ...
   ```
1. Publier le module sur NPM: `npm publish`

Dans le repo [**pass-culture-app-native**](https://github.com/pass-culture/pass-culture-app-native) :

1. `git checkout master`
1. Ouvrir `package.json` et mettre à jour la version de `@pass-culture/id-check`
1. Executer le script suivant :

```bash
IDCHECK_VERSION=$(cat package.json | jq -r '.["dependencies"]["@pass-culture/id-check"]' | cut -c2-)
JIRA_TICKET_ID=${JIRA_TICKET_ID:-Tech}

rm -rf node_modules
nvm use
yarn --force --registry https://registry.yarnpkg.com
git checkout -b id-check-v${IDCHECK_VERSION}
git add -A
git commit  -n -m "(${JIRA_TICKET_ID}) bump to ${IDCHECK_VERSION} @pass-culture/id-check"
git push origin id-check-v${IDCHECK_VERSION}
```

Ce script créer une feature branche prête à être mergée sur `master`.
Si vous avez des modifications à faire côté app native, c'est la branch pour.
