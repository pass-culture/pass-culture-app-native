/**
 * Demo is here for testing and training purpose
 * Run tests with WDIO_DEMO=true to run demo instead of app tests
 */
export const demo = {
  wdio: {
    baseUrl: 'http://the-internet.herokuapp.com',
  },
  browser: {
    specs: '**/wdio-demo/**/specs/**/browser*.spec.ts',
  },
  app: {
    specs: '**/wdio-demo/**/specs/**/app*.spec.ts',
  },
  android: {
    capabilities: {
      'appium:app':
        'https://github.com/webdriverio/native-demo-app/releases/download/v0.4.0/Android-NativeDemoApp-0.4.0.apk',
      'appium:appWaitActivity': 'com.wdiodemoapp.MainActivity',
    },
  },
  ios: {
    capabilities: {
      'appium:app':
        'https://github.com/webdriverio/native-demo-app/releases/download/v0.4.0/iOS-Simulator-NativeDemoApp-0.4.0.app.zip',
    },
  },
}
