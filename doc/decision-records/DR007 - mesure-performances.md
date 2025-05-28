# DR007 - Measure performances

> Status : Adopted

## Decision

Measure performances:

- during development: `react-native-performance-stats`
- in the CI for each version: `flashlight` (only Android) and `maestro`
- in production: `react-native-performance` and `Firebase Performance Monitoring`

## Context

We often realize that we have performance issues on our app in production. This is way too late. We need to allow developers to easily monitor the performances while coding.
We can also automate performance measures that would run during the e2e maestro tests. That way we can simply incorporate measures to the existing tests for key functionalities like registering a user or booking an offer.
Finally, we would like to measure the TTI. To do so, we need to use `react-native-performance` to access the starting time the native modules and then use a custom event in the JS code. This custom event is triggered when we consider the app to be ready for usage (all elements loaded and it's possible to interact with them). We use `Firebase Performance Monitoring` as a method of saving the data in production. Later, we will consider other measures that we would like to follow.

## Alternatives considered

- During dev: performance monitor from the dev menu
- In CI: no alternative considered
- In Production: build-in measures of `Firebase Performance Monitoring`

## Justification

Developers already have access to a performance monitor from the dev menu of `react-native` debug builds. But this is a graph and unless you are paying attention to it all the time, you might miss dips in performance. With `react-native-performance-stats`, the measures are logged to the metro window, allowing us to have recordings for all of the coding session. It might be interesting to have warnings or errors triggered when performances are bad, so that developers cannot ignore issues that they would face.
For `flashlight` it's only available on Android and atm there are no equivalents for iOS. The main advantage of this tool is that it can be added to our existing e2e tests. The e2e tests' main goal is to detect bugs on the main functionalities of the app. With minimal effort, we can add performance measures to the e2e tests and have rapid feedback before releasing a new version of the app.
Finally, measuring the start time of the app could be done with the exiting measures in `Firebase Performance Monitoring`, but they would not give the whole picture, as they don't measure when the app is actually usable.

## Consequences

The e2e tests will probably take more time to execute.
Developers might take more time on tickets (as they won't be able to push code that degrades performances)
There could be a bigger emphasis on performances on Android, as on iOS we don't have a tool like `flashlight`.
The bundle size might increase a little since we are adding `react-native-performance` to the production code (`react-native-performance-stats` will be in dev dependencies and won't affect the size of the bundle).
But all these measures will allow us to detect performance issues much earlier.

## Actions to be implemented

1. Setup `react-native-performance-stats`
2. Setup `flashlight` in the `maestro` tests
3. Setup `react-native-performance` and use `Firebase Performance Monitoring` (already on project)

## References

https://github.com/hannojg/react-native-performance-stats
http://docs.flashlight.dev/test/maestro/
https://github.com/oblador/react-native-performance/blob/master/packages/react-native-performance/README.md
