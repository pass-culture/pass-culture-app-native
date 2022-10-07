# How to add a Firebase tracker

## Why

To have access to analytics we need trackers. In order to do so, we use Firebase to log when a event occurs in every user app. This standard explains how to implement a tracker on a button.

## Key points

1. Add Firebase event in your code (following alphabetical order)

   a. Add your event in [src/libs/firebase/analytics/events.ts](../../src/libs/firebase/analytics/events.ts)

   b. Add a function called `log<YourEvent>`in [src/libs/firebase/analytics/analytics.ts](../../src/libs/firebase/analytics/analytics.ts)

   c. Add a mock of your function in [src/libs/firebase/analytics/mocks/analytics.ts](src/libs/firebase/analytics/mocks/analytics.ts)

2. Call your analytics function in a callback before giving it as a props to your button

```jsx
const acceptNotifications = useCallback(() => {
        analytics.logAcceptNotifications()
        onHideModal()
      }, [onHideModal])

    ...

    <ButtonPrimary wording="Activer les notifications" onPress={acceptNotifications} />
```

3. Test the behaviour in Firebase

   a. Open the Firebase console and go to the [DebugView](https://console.firebase.google.com/u/4/project/passculture-native/analytics/app/android:app.passculture/debugview)

   b. Find your device in the list (arm64 is for M1, x86_64 for regular macOS)

   c. Find your event in the occuring event list (it could be a bit slow)

## Mistakes to avoid when following the standard

- Forget to create the mock, you will not be able to test that your function is called
- Not adding your event in the alphabetical order
- Not using a callback to call log function
- Look in the wrong debugging device, to avoid that, try to check other event when navigating on the app before
