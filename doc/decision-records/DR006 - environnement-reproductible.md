# DR006 - Environnement reproductible

> Status : Adopted

## Décision

Il y a souvent des problèmes liés aux setups,
pour éviter ces problèmes,
mon but est d'avoir les setups plus robustes,
en ayant des setups similaires d'une machine à l'autre

Pour avoir des setups plus similaires, ça passe par de la standardisation et des scripts / outillages

Les lockfiles (comme [`yarn.lock`], [`Gemfile.lock`], [`Podfile.lock`]) ont été inventé pour uniformiser ce qui est installé sur les différentes machines,
ce qui augmente la stabilité : c'est très bien

Cependant, les lockfiles que nous avions étaient insuffisants : beaucoup de logiciels installés étaient absents des lockfiles, ne précisaient pas la version requise, ni comment l'installer

[Nix] permet de télécharger des dépendances en ajoutant un lockfile ([`flake.lock`])

[DirEnv] permet d'exécuter des scripts (dont Nix) automatiquement lorsqu'on entre dans le dossier

## Contexte

- les setups de devs sont complexes
- les setups sont instables (des trucs fonctionnent puis ne fonctionnent plus...)
  - lorsque le setup fonctionne, les devs ne veulent plus y toucher par peur de le casser
  - le setup devra changer avec le temps, ne plus y toucher n'est pas une solution durable
  - selon moi, ne plus toucher à quelque chose par peur de le casser est un anti pattern
- les setups sont incohérents entre les différentes machines
  - exemple : on a différentes versions d'Android Studio

    le 2025-04-30, la commande suivante :

    ```sh
    grep buildNumber "/Applications/Android Studio.app/Contents/Resources/product-info.json" | grep -o "[0-9.]+"
    ```

    a donné les résultats suivant sur les machines des devs présent-es

    ```txt
    203.7717.56.2031.7935034
    221.6008.13.2211.9619390
    223.8836.35.2231.10811636
    231.9392.1.2311.1133070
    241.18034.62.2412.12266719
    241.18034.62.2412.12266719
    242.23726.103.2422.12816248
    243.22562.218.2431.13114758
    ```
- tout le monde n'installe pas les outils de la meme manière, pouvant ajouter des difficultés pour garder de la stabilité

Nous avons des setups différents, avec des versions et des façons d'installer très différentes

Lorsqu'un problème est rencontré :

- il m'est très difficile d'investiguer car chaque setup est quasi unique
- les devs résolvent leurs problèmes de manière indépendantes, j'ai plusieurs fois constaté que les devs résolvent les memes problèmes chacun de leurs cotés

## Solutions alternatives considerées

### Rien faire

Laisser chaque dev gérer son environnement, les laisser résoudre les memes problèmes chacun-es dans leur coin

### DevContainer

Les containers ont été conçu pour éxécuter un process par container

[`devcontainer`] fait tourner tout les process dans un meme container,
notamment, le LSP, donc une partie de VSCode

Les containers sont intéressants pour avoir le meme environnement en production et en local

Pour react-native, on ne peut pas déployer dans des containers, donc on perds cet avantage

XCode n'est pas containerisable ou très difficilement et probablement non légalement

Android Studio l'est peut etre sur Mac

Les containers ré-utilisent le noyau Linux déjà chargé en RAM

Sur Mac, il y a un autre kernel, Docker for Mac ajoute une couche de virtualisation pour charger un noyau Linux, ce qui dégrade les performances

### Brew

De mon observation, les personnes qui ont installé des dépendances via [Brew] ne font pas régulièrement de mises à jour

Il est difficile de rollback

Je ne connais pas de mécanisme qui permettrait de pouvoir tester une mise à jour ou de versionner de manière reproductible

## Justification

Lorsqu'une personne a un problème, tout le monde devrait avoir le meme problème ;
si une seule personne trouve la solution, on commit et tout le monde profite de la solution

Versionner nos dépendances permet d'avoir un setup par branche, et donc de pouvoir tester les mises à jour avant de merger et de pouvoir rollback en revenant sur master

Nous avons pu uniformiser les versions de plusieurs de nos dépendances

Si on arrive à versionner toutes nos dépendances, si une MàJ cause un problème, il suffit de revert pour corriger ;
c'est déjà arrivé

[Nix]: https://nixos.org
[DirEnv]: https://direnv.net
[`yarn.lock`]: ../../yarn.lock
[`Gemfile.lock`]: ../../Gemfile.lock
[`Podfile.lock`]: ../../ios/Podfile.lock
[`flake.lock`]: ../../flake.lock
[`devcontainer`]: https://containers.dev
[Brew]: https://brew.sh
