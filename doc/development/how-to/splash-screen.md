# Customize the splash screen

Replace `assets/splash-screen/splashscreen.json` and `android/app/src/main/res/raw/splashscreen.json` with the new JSON lottie.

In XCode, replace the `SplashImage` image set in `PassCulture/Images.xcassets` with an image of the first frame of the splashscreen.
This will prevent the display of a black screen while iOS loads the lottie animation. No need for this on Android.

To change the minimum splashscreen duration, update the value of `MIN_SPLASHSCREEN_DURATION_IN_MS` in `src/libs/splashscreen/splashscreen.tsx`, and its copy in `src/libs/splashscreen/splashscreen.native.test.tsx`.
