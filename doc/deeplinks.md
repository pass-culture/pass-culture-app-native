# Deeplinks

Official documentation: https://developer.android.com/training/app-links/verify-android-applinks

It's important to test deeplinks after significant updates,
or when switching CI (or CI settings).

Ideally, they should be tested on all 3 environments: testing + staging + prod.

## Setup

### Locally, on a specific commit

Firstly, you need to switch to the commit

```shell
git checkout v1.244.4
```

Then, install the dependencies as usual and build the app:

```shell
yarn install
./android/gradlew assembleStagingRelease -p android # or assembleApptestingRelease
```

You need to start the emulator or connect your phone to be able to
run `adb` commands.

Install the last built `apk`:

```shell
adb install android/app/build/outputs/apk/staging/release/app-staging-release.apk # Staging
adb install android/app/build/outputs/apk/apptesting/release/app-apptesting-release.apk # Testing
```

### With an AppCenter release

Install the release as instructed in the documentation https://github.com/pass-culture/pass-culture-app-native/blob/master/doc/development/e2e.md#provide-an-apk

## Manual Test

You should come back to the initial state to avoid getting bad results:

```shell
# come back to initial state
adb shell pm set-app-links --package app.passculture.staging 0 all

# ask for asset links verification
adb shell pm verify-app-links --re-verify app.passculture.staging
```

Finally, it's time to test:

```shell
adb shell pm get-app-links app.passculture.staging
adb shell pm get-app-links app.passculture.testing
```

The output looks something like this when there's an error:

```
app.passculture.staging:
    ID: ffa985ae-4a1c-4822-a087-47803e674fce
    Signatures: [14:E7:31:E4:B1:20:25:F2:EB:51:80:8D:B0:C9:A2:51:AB:A2:1B:DD:E5:37:F7:92:9A:63:D8:03:FD:6F:F6:6C]
    Domain verification state:
      app.staging.passculture.team: 1024
```

When it is valid, the domain is `verified` (upon install it is `none`):

```
  app.passculture.staging:
    ID: 6714d97d-6261-4667-8320-5f849914cd5b
    Signatures: [38:C3:22:9D:88:B2:0C:AE:22:92:01:EE:6E:28:D1:DD:0E:EA:06:7E:5E:88:C3:8E:41:28:07:AD:E3:39:AB:F1]
    Domain verification state:
      app.staging.passculture.team: verified
```

You can validate that this is working by running this command that should open the app thanks to a deeplink.

```shell
adb shell am start -W -a android.intent.action.VIEW -d https://app.staging.passculture.team/
```

The SHA256 signature must match the one from the APK:

- To check signature of an installed app

```shell
adb shell dumpsys package d | grep passculture -A10
```

- To check signature of a built apk:

```shell
keytool -printcert -jarfile android/app/build/outputs/apk/staging/release/app-staging-release.apk # staging
keytool -printcert -jarfile android/app/build/outputs/apk/apptesting/release/app-apptesting-release.apk # testing
```

The SHA256 must match one served by the web application, eg:

```shell
curl -sS https://app.staging.passculture.team/.well-known/assetlinks.json | jq -r '.[1].target.sha256_cert_fingerprints'
```

This is the fastest and most reliable way to manually test how/why deeplinks are functioning correctly.
