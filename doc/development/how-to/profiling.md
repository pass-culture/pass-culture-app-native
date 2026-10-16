# Profiling

Always run release builds during your profiling sessions:

- In debug, the JS code is served by the metro bundler and contains extra development features. In release, it's minified.
- When `__DEV__ === true` `react-native` runs extra checks (strict mode), validations, logs... adding overhead to debug mode.
- The development features (dev menu, hot reloading), on top of bloating the JS, add a background overhead.
- Debugging and error reporting (LogBox, dev tools connection) add extra work in debug.

If you run a debug build, performances are not representative of the final user experience.

## Android Studio

I ran into the following problems when attempting to use a emulator:

- To add the proxy certificate, the phone/emulator can't have the Google Play on it.
- To run the app as profileable the phone/emulator must have Google Play on it.

Considering these constraints, the easiest work around is to use a physical Android device.

We are going to use the built-in System Tracing profiler in the Android Studio:
https://developer.android.com/studio/profile

Setup:

- Attach the phone and make sure USB debugging is activated in the phone's settings.
- Open the project's `android` folder in Android Studio,
- Make sure your device is selected in the top bar,
- Select the right variant: `View > Tool Windows > Build Variants`
- In the pane that opened, select `apptestingRelease` for the `:app` module
- In the top bar click on the 3 dots ⠇ to the right of the `app⌄` button.
- Click `Profiler: Run 'app' as profileable (low overhead)`
- When the build is over, make sure to accept the app installation on you device during the time window (10 seconds).

Profiling:

- Get your app to the point right before the navigation/animation you want to profile
- Start the "Capture System Activities" task in the Android Studio Profiler pane.
- Then press "Stop recording".

Reading the Trace:

- Interaction
- Display
- Frame Lifecycle (com.passculture.MainActivity#0)
- CPU cores (8)
- Process Memory (RSS)
- Threads (115)
- Battery

To see the detail of each category:
https://developer.android.com/studio/profile/cpu-profiler

We will focus mostly on "display": Shows info related to how smooth your app UI renders.
https://developer.android.com/studio/profile/jank-detection

If you go to the "Past Recordings" tab, you can select your recording, and "Export recording" and then open with https://ui.perfetto.dev/

## Xcode

We can use a simulator to profile with Xcode.

We are going to use Time Profiler:

- Open Xcode and select the scheme (e.g. `PassCulture-Testing`) and your simulator.
- Click `Product > Profile` (⌘I). The Profile action of the schemes already builds in `Release`: no need to edit the scheme (editing it changes the committed `.xcscheme` file). You can close metro. The build might take longer than usual (20 minutes).
- When the build is over, Instruments opens. Select the Time Profiler tool.
- Make sure your device and the app are selected in the top bar.
- Click on the red record button (top left)
- Use the app

Interpreting the results:

- In the CPU usage, you can see spikes and drops.
- If the CPU usage is high for several seconds, there could be an issue.
- Then use the Hermes debugger to figure out the issue.
- I also see "hangs" that could be interesting to investigate.

## Troubleshooting

### Android Studio

#### @react-native-community/cli config exited with error code: 126

```sh
> Task :gradle-plugin:settings-plugin:jar
ERROR: autolinkLibrariesFromCommand: process npx @react-native-community/cli config exited with error code: 126
```

It is a permission issue:

```sh
chmod u+x node_modules/@react-native-community/cli/build/*.js
```

Source:
https://github.com/react-native-community/cli/issues/2498

#### Incompatible version of the Android Gradle plugin

Error in Android Studio during the "Sync Phase" (at launch):

```
The project is using an incompatible version (AGP 8.7.2) of the Android Gradle plugin. Latest supported version is AGP 8.1.2
```

I updated my version of Android Studio, and the error disappeared.
