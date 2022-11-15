## e2e

We use webdriver.io as automation framework to test our Web and mobile application.

### Appium

To run app and browser tests on Mobile, you will need to run an appium server.

To install appium:

```bash
npm i -g appium@next
```

You will also need the following plugins:

```bash
# Android mobile and browser testing
appium driver install uiautomator2
# iOS mobile testing
appium driver install xcuitest
# iOS browser testing
appium driver install safari
```

Android Google Chrome browser version depend on the Android platform.
You must provide the `chromedriver` specific to your Android device (this can be checked in the google chrome package information of your device).

You can read more on : https://chromedriver.chromium.org/downloads

To install the chromedriver of your choice:

```bash
# Android browser chrome testing
npm install --chromedriver_version="$CHROMEDRIVER_VERSION"
```

For running mobile (iOS or Android) tests, you will have to start appium server:

```bash
appium 
```

In case of problem, there is a useful tool called `appium-doctor`, you can install and run it as follow:

```bash
npm i -g appium-doctor
appium-doctor
```

### Configuration

We use environment variable to customize the configuration:

| Environment variable       | Type      | Required | Default     | Description                                             |
|----------------------------|-----------|----------|-------------|---------------------------------------------------------|
| `CI`                       | `boolean` |          | `false`     | Define if in a CI environment                           |
| `WDIO_DEMO`                | `boolean` |          | `false`     | Run the demo code (must have wdio-demo installed first) |
| `WDIO_BASE_URL`            | `string`  | yes      |             | URL of the Website to test                              |
| `ANDROID_DEVICE_NAME`      | `string`  |          | `Nexus6P`   | Android device name                                     |
| `ANDROID_PLATFORM_VERSION` | `string`  |          | `10.0`      | Android platform version                                |
| `IOS_DEVICE_NAME`          | `string`  |          | `iPhone 13` | iOS Device Name                                         |
| `IOS_PLATFORM_VERSION`     | `string`  |          | `15.2`      | iOS platform version                                    |
| `APPIUM_TEST_SERVER_PORT`  | `number`  |          | `4723`      | Appium service port (if you don't use the default)      |
| `APPIUM_TEST_SERVER_HOST`  | `string`  |          | `127.0.0.1` | Appium listening interface                              |
| `APPIUM_APP`               | `string`  | yes      |             | The builded app to test (iOS zip/Android apk)           |
| `APPIUM_APP_WAIT_ACTIVITY` | `string`  |          |             | The android main activity to start (can be detected)    |

You can view all available options in [`e2e/config/environment/env.ts`](../../e2e/config/environment/env.ts).

**Drivers**

On your desktop, you must install browser's driver that match your version in order to use test automation, respectively:

- `chromedriver` for Chrome
- `safaridriver` for Safari
- `geckodriver` for Firefox

Refer to google to get installation instruction for your system.

**Testing on Android**

- You will need to download an `apk` from appcenter, you can do so using `yarn appcenter:install`
- Real device or the emulator that match defined `ANDROID_PLATFORM_VERSION` must be started and available when running `adb devices`

To build application:

```bash
# assembleStagingRelease or assembleApptestingRelease
ANDROID_GRADLE_TASK=assembleStagingRelease
./android/gradlew ${ANDROID_GRADLE_TASK} -p android

# you can now run tests
APPIUM_APP=./android/app/build/outputs/apk/staging/release/app-staging-release.apk yarn e2e:android.app
``` 

> It is not possible to test the Android application using the development environment 

**Testing on iOS**

- Set `IOS_PLATFORM_VERSION` and  `IOS_DEVICE_NAME` according to your test needs
- Emulator device: You will have to build a test application (see below)
- Physical known device: You will need to download an `ipa` from appcenter, you can do so using `yarn appcenter:install`
- Test device must be connected or simulator must be started, to check: `xcrun simctl list devices`

To build application:

```bash
scheme=PassCulture-Staging
xcodebuild -workspace ios/PassCulture.xcworkspace -scheme ${scheme} -sdk iphonesimulator -configuration Release -quiet | xcpretty
last_build_dir=$(ls -tr  ~/Library/Developer/Xcode/DerivedData/ | grep PassCulture | tail -n1)
ditto -ck --sequesterRsrc --keepParent ~/Library/Developer/Xcode/DerivedData/${last_build_dir}/Build/Products/Release-iphonesimulator/PassCulture.app ./PassCulture.zip

# you can now run tests
APPIUM_APP=./PassCulture.zip yarn e2e:ios.app
```

> It is not possible to test the iOS application using the development environment

### Demo

As of now, we do not have written any tests for ou app, this is why we have a demo mode.

To install the demo, run: 

```bash
yarn e2e:install.demo
```

To run the demo, just prefix an e2e test command (visible in `package.json`), ex:

```bash
WDIO_DEMO=true yarn e2e:browser.chrome
 ```

> iOS and Android app demo will fail some tests in CI, this is known issue.
> 
> See https://github.com/webdriverio/appium-boilerplate/issues/139 and https://github.com/webdriverio/appium-boilerplate/issues/140

### Troubleshooting

**Safari**

You might have this error when running `yarn e2e:browser.safari`:

```bash
ERROR webdriver: Request failed with status 500 due to session not created: Could not create a session: You must enable the ‘Allow Remote Automation’ option in Safari’s Develop menu to control Safari via WebDriver.
```

This can be solved by opening Safari, Develop Menu, then check `Allow Remote Automation` 

### Useful ressources

- https://webdriver.io/docs/what-is-webdriverio
- https://appium.github.io/appium/docs/en/2.0/
- https://github.com/webdriverio/appium-boilerplate
- https://chromedriver.chromium.org/downloads

### Community

If you wish to learn how to write tests, beside GitHub and StackOverflow, 
we have found an active community on Gitter.im: 

- https://gitter.im/webdriverio/webdriverio
- https://gitter.im/appium/appium

