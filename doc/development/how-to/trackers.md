# How to add a tracker

## Why

To have access to analytics we need trackers. In order to do so, we use Firebase and/or Amplitude to log when an event occurs on user interaction. This standard explains how to implement a tracker on a button.

## Key points

1. Run the script `yarn add:tracker --provider=[amplitude|firebase] <TrackerName>` with TrackerName in PascalCase. This will create the files needed for the tracker.

   <details>
   <summary>Manually</summary>
   Add a Firebase and an Amplitude event in your code (following alphabetical order)

      a. For Firebase, add your event in [src/libs/firebase/analytics/events.ts](../../src/libs/firebase/analytics/events.ts). For Amplitude, add your event in [src/libs/amplitude/events.ts](../../src/libs/amplitude/events.ts)

      b. Add a function called `log<YourEvent>` in [src/libs/analytics/logEventAnalytics.ts](../../src/libs/analytics/logEventAnalytics.ts), where you will call the method `logEvent` of `analytics` (from [src/libs/analytics/index.ts](../../src/libs/analytics/index.ts)), with the firebase and/or amplitude event name(s). If an event name is not specified for one of these providers, then the event won't be triggered by that provider.

      c. Add a mock of your function in [src/libs/analytics/\_\_mocks\_\_/provider.ts](../../src/libs/analytics/__mocks__/logEventAnalytics.ts)
   </details>

2. Call your analytics function in a callback before giving it as a props to your button

3. Test the behavior:
   - in Firebase:

      a. Open the Firebase console and go to the [DebugView](https://console.firebase.google.com/u/4/project/passculture-native/analytics/app/android:app.passculture/debugview)

      b. Find your device in the list (arm64 is for M1, x86_64 for regular macOS)
      b2. If you are connected, you can check your user ID in the debugView to match the one in your cheat codes

      c. Find your event in the occurring event list (it could be a bit slow)

   - in Amplitude:

      a. Open the Amplitude [event table](https://data.eu.amplitude.com/passculture/pass%20Culture%20testing/events/main/latest/?view=All)

      b. Sort the table by last seen.

      c. Find your event in the occurring events list (it could be a bit slow)

## Mistakes to avoid when following the standard

- Forget to create the mock, you will not be able to test that your function is called
- Not adding your event in the alphabetical order
- Not following the naming standard (PascalCase for Firebase, snake_case for Amplitude)
- Look in the wrong debugging device in Firebase, to avoid that, try to check other event when navigating on the app before
- Not accepting the app to track your informations during your first opening
