# Customize the splash screen

1. Replace `assets/splash-screen/source.png` with the new splash screen (dimensions 3000x5336)
2. Run `react-native set-splash --path "assets/splash-screen/source.png" --background "#ffffff" --resize cover`

Example:

```bash
$ react-native set-splash --path "assets/splash-screen/source.png" --background "#ffffff" --resize contain
$ git status
On branch PC-7938-fix
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   android/app/src/main/java/com/passculture/MainActivity.java
        modified:   android/app/src/main/res/drawable-hdpi/splash_image.png
        modified:   android/app/src/main/res/drawable-mdpi/splash_image.png
        modified:   android/app/src/main/res/drawable-xhdpi/splash_image.png
        modified:   android/app/src/main/res/drawable-xxhdpi/splash_image.png
        modified:   android/app/src/main/res/layout/launch_screen.xml
        modified:   ios/PassCulture/Images.xcassets/SplashImage.imageset/splash@1x.png
        modified:   ios/PassCulture/Images.xcassets/SplashImage.imageset/splash@2x.png
        modified:   ios/PassCulture/Images.xcassets/SplashImage.imageset/splash@3x.png
        modified:   ios/SplashScreen.storyboard
```
