## Debugging

### Flipper

You can install [Flipper](https://fbflipper.com/) that will help you visualize the application's logs and network information.

We recommend installing the **plugin** `react-query-native-devtools` to analyze react query. This plugin is available through `Manage Plugins` > `Install Plugins`: `react-query-native-devtools`. This should work without further configuration for both platforms.

### Detailed logs

If you want more detailed application logs, you can still access the logs with ADB: `adb logcat` on **Android**, or use the **Logcat** tab in Android Studio.

For **iOS**, you can use the console logs in Xcode.
