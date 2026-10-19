# Personnaliser l'écran de démarrage

Remplacez `assets/splash-screen/splashscreen.json` et `android/app/src/main/res/raw/splashscreen.json` par le nouveau lottie JSON.

Dans XCode, remplacez l'image `SplashImage` définie dans `PassCulture/Images.xcassets` par une image de la première image de l'écran de démarrage.
Cela empêchera l'affichage d'un écran noir pendant qu'iOS charge l'animation du lotie. Pas besoin de ça sur Android.

Pour modifier la durée minimale de l'écran de démarrage, mettez à jour la valeur de `MIN_SPLASHSCREEN_DURATION_IN_MS` dans `src/libs/splashscreen/splashscreen.tsx` et sa copie dans `src/libs/splashscreen/splashscreen.native.test.tsx`.
