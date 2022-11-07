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

