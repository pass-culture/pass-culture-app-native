## e2e

We use webdriver.io as automation framework to test our Web and mobile application.

### Appium

To run app and browser tests on Mobile, you need to run an appium server.

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

For Mac user when you downloaded the version adapted at your Chrome you can extract it and use this command : `mv chromedriver /usr/local/bin`

To install the chromedriver of your choice:

```bash
# Android browser chrome testing
npm install --chromedriver_version="$CHROMEDRIVER_VERSION"
```

For running mobile (iOS or Android) tests, you can start appium server manually (otherwise, use a gui tools listed below):

```bash
appium --relaxed-security
```

In case of problem, there is a useful tool called `appium-doctor`, you can install and run it as follow:

```bash
npm install @appium/doctor --location=global
appium-doctor
```

### App center

You can create an user API token in Account => Account Settings => User API tokens
You can name it APPCENTER_USER_API_TOKEN

### Configuration

We use environment variable to customize the configuration:

| Environment variable             | Type      | Required | Default                 | Description                                             |
|----------------------------------|-----------|----------|-------------------------|---------------------------------------------------------|
| `CI`                             | `boolean` |          | `false`                 | Define if in a CI environment                           |
| `ENVIRONMENT`                    | `string`  | yes      | `staging`               | Define the application environment                      |
| `SPECS`                          | `string`  |          |                         | Define specs for test execution. You can either specify a glob pattern to match multiple files at once or wrap a glob or set of paths into an array using "," delimiter to run them within a single worker process. [Default: run all tests] |
| `WDIO_BASE_URL`                  | `string`  | yes      |                         | URL of the Website to test                              |
| `ANDROID_DEVICE_NAME`            | `string`  |          | `pixel_xl`              | Android device name                                     |
| `ANDROID_PLATFORM_VERSION`       | `string`  |          | `10.0`                  | Android platform version                                |
| `IOS_DEVICE_NAME`                | `string`  |          | `iPhone 13`             | iOS Device Name                                         |
| `IOS_PLATFORM_VERSION`           | `string`  |          | `15.2`                  | iOS platform version                                    |
| `APPIUM_TEST_SERVER_PORT`        | `number`  |          | `4723`                  | Appium service port (if you don't use the default)      |
| `APPIUM_TEST_SERVER_HOST`        | `string`  |          | `127.0.0.1`             | Appium listening interface                              |
| `APPIUM_APP`                     | `string`  | yes      |                         | ipa or apk application to install before running test. Or iOS bundle id if already installed  |
| `APPIUM_APP_WAIT_ACTIVITY`       | `string`  |          |                         | The android apk main activity to start (default: auto)  |
| `APPIUM_APP_PACKAGE`             | `string`  |          |                         | Android bundle id (if app is already installed)         | 
| `APPIUM_APP_ACTIVITY`            | `string`  |          |                         | Android package activity (if app is already installed)  |
| `API_BASE_URL`                   | `string`  |          | `http://localhost:6001` | API base URL needed when e2e toggle features            |
| `END_TO_END_TESTS_EMAIL_ADDRESS` | `string`  | yes      |                         | End to end whitelisted email address                    |

For instance, if you wish to run test for a different android emulator:

```bash
ANDROID_DEVICE_NAME=emulatorxyz \
ANDROID_PLATFORM_VERSION=10 \
yarn e2e:android.app
```

Or if you wish to test http://localhost:3000:


```bash
WDIO_BASE_URL=http://localhost:3000 \
yarn e2e:android.browser
```

You can view all available options in [`e2e/config/environment/env.ts`](../../e2e/config/environment/env.ts).

You can add directly the principal variables in your global environment file :

```bash
export APPCENTER_USER_API_TOKEN="token generated in app center"
export WDIO_BASE_URL="Your principal URL (Ex: http://localhost:3000)"
export ANDROID_PLATFORM_VERSION="Android version in your emulator"
export ANDROID_DEVICE_NAME="Emulator name with adb devices command"
export IOS_PLATFORM_VERSION="16.0" (Maybe it will be necessary to update directly conf files because the variable in output is 16)
export IOS_DEVICE_NAME="iPhone emulator Name"
```

**Drivers**

On your desktop, you must install browser's driver that match your version in order to use test automation, respectively:

- `chromedriver` for Chrome
- `safaridriver` for Safari
- `geckodriver` for Firefox (For Mac user you can use `brew install geckodriver`)

Refer to google to get installation instruction for your system.

**Gmail Client**

In order to login to the e2e mailbox, you must have in the root of the repository:

- `credentials.json`: OAuth2 client (require interactive login)
- `token.json`: OAuth2 Gmail API JWT (can be generated if you have `credentials.json`) 

Only one of the two is required.

### Testing on Android

Two options, either the application is already installed, or you have to provide an apk

#### Provide an apk

You can use an apk, either from appcenter, either one created by building locally.

- To download an `apk` from appcenter, you can do use `yarn appcenter:install`
- Set environment variable `ANDROID_PLATFORM_VERSION` to match your Android platform version of your device.
- You must have a running emulator or physical device available when running `adb devices` 

To build application:

```bash
# assembleStagingRelease or assembleApptestingRelease
ANDROID_GRADLE_TASK=assembleStagingRelease
./android/gradlew ${ANDROID_GRADLE_TASK} -p android

# you can now run tests
APPIUM_APP=./android/app/build/outputs/apk/staging/release/app-staging-release.apk yarn e2e:android.app
```

#### Using already installed application

If the application is already installed, you can test it without providing an apk to install, for instance, for staging app you will do:

```bash
APPIUM_APP_PACKAGE="app.passculture.staging" \
APPIUM_APP_ACTIVITY="com.passculture.MainActivity" \
yarn e2e:android.app
``` 

It will use capability `appium:noReset` to `true`, read more here: https://github.com/appium/appium-uiautomator2-driver#general

### Testing on iOS

- It is not possible to use the `ipa` from appcenter.
- You must use a iOS simulator.
- You must have environment variables `IOS_PLATFORM_VERSION` and `IOS_DEVICE_NAME` that match your device and platform version.
- You must create a test build.
- Simulator must be started and available, see `xcrun simctl list devices`.

To build application:

```bash
cd ios
scheme=PassCulture-Staging
xcodebuild -workspace PassCulture.xcworkspace -scheme ${scheme} -sdk iphonesimulator -configuration Release
last_build_dir=$(ls -tr  ~/Library/Developer/Xcode/DerivedData/ | grep PassCulture | tail -n1)
ditto -ck --sequesterRsrc --keepParent ~/Library/Developer/Xcode/DerivedData/${last_build_dir}/Build/Products/Release-iphonesimulator/PassCulture.app ../PassCulture.zip
cd ..

# you can now run tests
APPIUM_APP=./PassCulture.zip yarn e2e:ios.app
```

> It is not possible to test the iOS application using the development environment (because you cannot erase application cache on iOS, re-running test will fail due to FirstLaunch requirements).

If the application is already installed, you can inspect it (with Appium Inspector) without building the application. For instance, for staging app you will do:

```bash
# or for testing: app.passculture.test
APPIUM_APP="app.passculture.staging" yarn e2e:ios.app
``` 

### Writing tests

We have two types of tests: `app` and `browser`

- `app` is the native application, it runs on iOS or Android
- `browser` is the Web application, it runs on Desktop, iOS and Android browsers
- A test file is called a `suite`, test within a suite are run in their **order of declaration**
- Unless it can only succeed, do not use mocha `before` hook because failure in it won't be considered as a test failure, thus no tests will be reported as failed, instead use a flip variable as in this example:

```ts
import FirstLaunch from '../helpers/FirstLaunch'
import { TabBar } from '../features/navigation/TabBar'
import { didFirstLaunch } from '../helpers/utils/error'

describe('TabBar', () => {
  let ok = false
  let tabBar: TabBar

  before(async () => {
    const theme = getTheme(await browser.getWindowSize())
    tabBar = new TabBar(theme)
  })

  it('should first launch app', async () => {
    ok = await FirstLaunch.init(tabBar)
  })

  it('should click on search', async () => {
    didFirstLaunch(ok)
    await tabBar.search.click()
  })
})
```

### GUI Tools

You can try those:

- GUI inspector for mobile apps: https://github.com/appium/appium-inspector/releases
- Server with GUI in replacement: https://github.com/appium/appium-desktop/releases 
- Alternative GUI inspector for mobile apps: https://digital.ai/products/continuous-testing/appium-studio/

#### Convention

We usually write cross platforms tests (for both `app` and `browser`), 
but we also support `app` or `browser` specific tests. 

Use the following file name convention:

- `app` and `browser`: `*.spec.ts`
- `app`: `*.app.spec.ts`
- `browser`: `*.browser.spec.ts`

#### Utils

This is the documentation of selector: https://webdriver.io/docs/selectors/#accessibility-id

We also have a useful cross platforms selector:

```ts
$$$('Accueil')
```

Is equivalent to, on `app` (iOS and Android):

```ts
$('~Acceuil')
```

and `browser`:

```ts
$('[data-testid="Accueil"]')
```

We could have used `flags.isWeb` to decide which one to use, but this is exactly what does `$$$` 
and this allow to write less verbose selector for our cross platforms cases.

### ~ Selector

The selector used to access component is the `accessibility id` :

- For Android: the `accessibility id` corresponds to the `accessibilityLabel`
- For iOS: the `accessibility id` corresponds to the `testID`.

**We only want to use accessibility id selector, as this is the only way to have cross plateforme selectors.**

If this is not possible, you will have to write platform specific selectors within your e2e tests (for example, for our SetBirthDate, we use 4 different date pickers)

**How to add cross platforms markers in the source code ?**

We have two utilities that can be used:

1. `accessibilityAndTestId`: utilities
2. `useE2eTestId`: react hook


(1) `accessibilityAndTestId` can be used as follows:

```tsx
function ExampleComponent() {
  return <MyComponent {...accessibilityAndTestId('Un texte unique')} />
}
```

Use `accessibilityAndTestId` only if you want `accessibilityLabel` to be set outside e2e execution, **it will then be read by screen readers**.


(2) `useE2eTestId` can be used as follows:

```tsx
function ExampleComponent() {
  const e2eTestId = useE2eTestId('Un texte unique')
  return <MyComponent {...e2eTestId} />
}
```

Use `useE2eTestId` hook only if you don't want `accessibilityLabel` to be set outside e2e execution, **it will never read by screen readers**.


**Some components already implement a cross-platform selector:**

- `AppButton`, `ButtonInsideText`, `ButtonWithLinearGradient`: The `accessibilityLabel` and `testID` are automatically set to the `wording` prop, or to `accessibilityLabel` prop if given. This means that `accessibility id` is the `wording` or `accessibilityLabel`, which allow us to have a cross-platform selector.
- `TouchableOpacity`, `Touchable`, `InternalTouchableLink`, `ExternalTouchableLink`:  The `testID` is automatically set to the `accessibilityLabel` prop. This means that this element needs to have an `accessibilityLabel` if we  want to have a cross-platform selector.

For more information on selectors, please check [this notion page](https://www.notion.so/passcultureapp/Documentation-E2E-S-lecteurs-42cd859559454454a3a4a37ef1e86f41).

**react-native-web**

All UI components imported from react-native, will have a `data-testid` attributes set if a `testID` is set, this is because `react-native-web` do it under the hood.

If you have a web only component, you will have to manually set the `data-testid` to it, or use the `accessibilityAndTestId` utils.

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

