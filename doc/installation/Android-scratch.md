### ✍️ Code signing

Generate a new keystore, for example `testing.keystore`, and place it inside the `android/keystores` directory.

```bash
/opt/jdk-8-latest/bin/keytool  -genkeypair -v -storetype PKCS12 -keystore android/keystores/testing.keystore -alias passculture -keyalg RSA -keysize 2048 -validity 10000 -keypass azerty123 -storepass azerty123
```

Then create a `keystores/testing.keystore.properties` file in `/android/keystores` directory with this configuration (required in `build.gradle`):

```bash
keyAlias=passculture
storeFile=testing.keystore
storePassword=azerty123
keyPassword=azerty123
```


### Build+Install custom APK

Build and install the apk via android debug bridge

```bash
yarn apk:build && yarn apk:install
```
