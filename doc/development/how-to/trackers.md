# How to add a tracker

## Why

To have access to analytics we need trackers. In order to do so, we use Firebase to log when an event occurs on user interaction. This standard explains how to implement a tracker on a button.

## Key points

1. Run the script `yarn add:tracker --provider=firebase <TrackerName>` with TrackerName in PascalCase. This will create the files needed for the tracker.

   <details>
   <summary>Manually</summary>
   Add a Firebase event in your code (following alphabetical order)

   a. For Firebase, add your event in [src/libs/firebase/analytics/events.ts](../../src/libs/firebase/analytics/events.ts).
   b. Add a function called `log<YourEvent>` in [src/libs/analytics/logEventAnalytics.ts](../../src/libs/analytics/logEventAnalytics.ts), where you will call the method `logEvent` of `analytics` (from [src/libs/analytics/index.ts](../../src/libs/analytics/index.ts)), with the firebase event name(s). If an event name is not specified for one of these providers, then the event won't be triggered by that provider.

   c. Add a mock of your function in [src/libs/analytics/\_\_mocks\_\_/provider.ts](../../src/libs/analytics/__mocks__/logEventAnalytics.ts)
   </details>

2. Call your analytics function in a callback before giving it as a props to your button

3. Test the behavior in Firebase:

   a. Open the Firebase console and go to the [DebugView](https://console.firebase.google.com/u/4/project/passculture-native/analytics/app/android:app.passculture/debugview)

   b. Find your device in the list (arm64 is for M1, x86_64 for regular macOS)
   b2. If you are connected, you can check your user ID in the debugView to match the one in your cheat codes

   c. Find your event in the occurring event list (it could be a bit slow)

## Mistakes to avoid when following the standard

- Forget to create the mock, you will not be able to test that your function is called
- Not adding your event in the alphabetical order
- Not following the naming standard (PascalCase for Firebase)
- Look in the wrong debugging device in Firebase, to avoid that, try to check other event when navigating on the app before
- Not accepting the app to track your informations during your first opening

# Manually testing tracking

We use DebugView on the Firebase project to view analytics in real-time.

[Here is the link to the DebugView for the testing environnement](https://console.firebase.google.com/project/pc-native-testing/analytics/app/android:app.passculture.testing/debugview/realtime~2Fdebugview%3Ffpn%3D557258398232)

General advice for all platforms:
- To be sure you are looking at the right device, in the events you will see the `user_id` of the user you connected with on your device.

## iOS Simulator
- To allow analytic events to be sent in real-time (not after a certain delay), make sure `-FIRDebugEnabled` is passed as a launch argument for the active scheme (when writing this guide, this argument is committed to the repo)
- On the simulator, make sure you accept the cookies and allow tracking in permissions.
- In the Firebase testing project, go to `DebugView`
- Select the device, it should look something like this: "Apple arm64"

## Android Emulator
- To allow events to be sent in real-time:
```sh
adb shell setprop debug.firebase.analytics.app app.passculture.testing
```
- You only need to run this command once per emulator, but if you change emulator, you will have to run the command again.
- This time the device will be called something like this: `sdk_gphone64_arm64`

## Web App
- Make sure your Ad Blocker is disabled
- Turn on Google Analytics Debugger extension
- In the `DebugView`, you will see your device under "Apple" if you're on a MacBook
- You will also see logs in your Chrome console that look like this:
```
Processing GTAG command: ["config", "G-WMFLLWGV80", {update: true, user_id: "67"}]

Processing GTAG command: ["event", "ModuleDisplayedOnHomePage", {call_id: "b9f9d257-c6c2-4e39-8901-9a086c21bd2a", homeEntryId: "6CRGedke4bdzOG21W4JMt2", hybridModuleOffsetIndex: "3", index: "3", moduleId: "2nxp1f7pw8lTkkt1Iz6yO4", moduleType: "hybrid", offers_1_10: "282,2665,2664", locationType: "undefined", agentType: "browser_computer", app_version: "1.371.0", app_revision: "66791993cdcd", send_to: "G-WMFLLWGV80"}]
```
### Debugging the Web App
Check the Network Tab:
1. Open the Chrome Developer Tools -> **Network** tab.
2. Filter by the text `collect`.
3. Trigger an event in your app.
4. If you see a request turn **Red (Blocked)**, it's an Ad Blocker.
5. If you see the request succeed (204 OK), click it and look at the "Payload". 
6. Look for `_dbg: 1`: if it's present, it will show up in DebugView.