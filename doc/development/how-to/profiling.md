# Profilage

Effectuez toujours vos sessions de profilage sur des versions de production (« release builds ») :

- En mode débogage, le code JS est servi par le « bundler » Metro et inclut des fonctionnalités spécifiques au développement. En version de production, il est minifié.
- Lorsque `__DEV__ === true`, React Native effectue des vérifications supplémentaires (mode strict, validations, journaux, etc.), ce qui alourdit le fonctionnement en mode débogage.
- Les fonctionnalités de développement (menu de développement, rechargement à chaud/« hot reloading »), en plus d'alourdir le code JS, génèrent une charge supplémentaire en arrière-plan.
- Les outils de débogage et de rapport d'erreurs (LogBox, connexion aux outils de développement) ajoutent une charge de travail supplémentaire en mode débogage.

Si vous utilisez une version de débogage, les performances observées ne seront pas représentatives de l'expérience utilisateur finale.

## Android Studio

J'ai rencontré les problèmes suivants en essayant d'utiliser un émulateur :

- Pour ajouter le certificat proxy, le téléphone ou l'émulateur ne doit pas comporter Google Play.
- Pour exécuter l'application en mode « profileable », le téléphone ou l'émulateur doit comporter Google Play.

Compte tenu de ces contraintes, la solution la plus simple consiste à utiliser un appareil Android physique.

Nous allons utiliser l'outil « System Tracing » (suivi système) intégré à Android Studio :
https://developer.android.com/studio/profile

Configuration :

- Connectez le téléphone et assurez-vous que le débogage USB est activé dans les paramètres de l'appareil.
- Ouvrez le dossier `android` du projet dans Android Studio.
- Vérifiez que votre appareil est bien sélectionné dans la barre supérieure.
- Sélectionnez la variante appropriée : `View > Tool Windows > Build Variants`.
- Dans le panneau qui s'affiche, sélectionnez `apptestingRelease` pour le module `:app`.
- Dans la barre supérieure, cliquez sur les trois points ⠇ situés à droite du bouton `app⌄`.
- Cliquez sur `Profiler: Run 'app' as profileable (low overhead)`.
- Une fois la compilation terminée, veillez à accepter l'installation de l'application sur votre appareil dans le délai imparti (10 secondes).

Profilage :

- Amenez votre application juste avant la navigation ou l'animation que vous souhaitez analyser.
- Lancez la tâche « Capture System Activities » (Capture des activités système) dans le panneau « Profiler » d'Android Studio.
- Cliquez ensuite sur « Stop recording » (Arrêter l'enregistrement).

Lecture de la trace :

- Interaction
- Affichage (Display)
- Cycle de vie des images/frames (Frame Lifecycle - com.passculture.MainActivity#0)
- Cœurs CPU (8)
- Mémoire du processus (RSS)
- Threads (115)
- Batterie

Pour consulter les détails de chaque catégorie :
https://developer.android.com/studio/profile/cpu-profiler

Nous nous concentrerons principalement sur la section « Display » (Affichage), qui fournit des informations sur la fluidité du rendu de l'interface utilisateur de votre application. https://developer.android.com/studio/profile/jank-detection

Si vous vous rendez dans l'onglet « Enregistrements précédents » (« Past Recordings »), vous pouvez sélectionner votre enregistrement, choisir « Exporter l'enregistrement » (« Export recording »), puis l'ouvrir via https://ui.perfetto.dev/

## Xcode

Il est possible d'utiliser un simulateur pour effectuer un profilage avec Xcode.

Nous allons utiliser l'outil « Time Profiler » :

- Ouvrez Xcode, puis sélectionnez le schéma (par ex. `PassCulture-Testing`) ainsi que votre simulateur.
- Cliquez sur `Product > Profile` (⌘I). L'action « Profile » des schémas effectue automatiquement une compilation en mode `Release` ; il n'est donc pas nécessaire de modifier le schéma (toute modification entraînerait une altération du fichier `.xcscheme` versionné). Vous pouvez fermer Metro. La compilation peut prendre plus de temps que d'habitude (environ 20 minutes).
- Une fois la compilation terminée, l'application « Instruments » s'ouvre. Sélectionnez l'outil « Time Profiler ».
- Assurez-vous que votre appareil et l'application sont bien sélectionnés dans la barre supérieure.
- Cliquez sur le bouton d'enregistrement rouge (en haut à gauche).
- Utilisez l'application.

Interprétation des résultats :

- Au niveau de l'utilisation du processeur (CPU), vous pouvez observer des pics et des chutes.
- Si l'utilisation du processeur reste élevée pendant plusieurs secondes, cela peut indiquer un problème.
- Pour analyser le code JavaScript via les « React Native DevTools », reproduisez le problème dans une version de débogage (debug build) distincte. Le débogueur ne peut pas se connecter à la version « Release » utilisée précédemment ; continuez à utiliser les versions « Release » pour vos mesures de performance.
- J'ai également remarqué des « gels » (hangs) qui mériteraient d'être étudiés.

## Dépannage

### Android Studio

#### @react-native-community/cli config s'est terminé avec le code d'erreur : 126

```sh
> Task :gradle-plugin:settings-plugin:jar
ERROR: autolinkLibrariesFromCommand: process npx @react-native-community/cli config exited with error code: 126
```

Il s'agit d'un problème de permissions :

```sh
chmod u+x node_modules/@react-native-community/cli/build/*.js
```

Source :
https://github.com/react-native-community/cli/issues/2498

#### Version incompatible du plugin Android Gradle

Erreur dans Android Studio lors de la phase de synchronisation (« Sync Phase ») au démarrage :

```
The project is using an incompatible version (AGP 8.7.2) of the Android Gradle plugin. Latest supported version is AGP 8.1.2
```

J'ai mis à jour ma version d'Android Studio et l'erreur a disparu.
