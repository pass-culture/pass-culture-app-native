# Error Monitoring with sentry

Sentry helps us monitor crash and errors in the application. See our project [here](https://logs.passculture.app/organizations/sentry/issues/?project=6)

## Source maps

To have a better understanding of the potential crashes and errors, we have to provide sentry with the source maps. This helps us see the source of the error in the un-minified bundle.

The build is configured to upload the source maps automatically but you may want to do it manually.

To create locally the source maps:

- configure sentry: `yarn sentry:configure`: this will create the necessary credentials for you and `sentry.properties`.
- create the source maps:
  - android: `react-native bundle --platform android --entry-file index.js --dev false --bundle-output index.android.bundle --sourcemap-output index.android.bundle.map`
  - ios: `react-native bundle --platform ios --entry-file index.js --dev false --bundle-output ./ios/main.jsbundle --assets-dest ./ios --sourcemap-output ./sourcemap.js`
- upload the source maps (⚠️ with the correct dist and release):
  - android: `node_modules/@sentry/cli/bin/sentry-cli releases files 1.131.4 upload-sourcemaps --dist 1013104 --strip-prefix /Users/agarcia/passculture/pass-culture-app-native/ --rewrite index.android.bundle index.android.bundle.map`
  - ios: `node_modules/@sentry/cli/bin/sentry-cli releases files 1.131.4 --dist 1013104 upload-sourcemaps sourcemap.js`
