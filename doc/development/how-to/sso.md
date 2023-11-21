# How to test SSO login locally

## On iOS
No special configuration needed. It will work when you run `yarn ios:testing`.

## On Android
You need to create a OAuth Client ID of type Android [here](1), with the following values :
- **Name:** Google Auth Android (dev) - YOUR NAME
- **Package name:** app.passculture.testing
- **SHA-1 fingerprint:** this correspond to the fingerprint of your debug keystore. You can find it by running :
    ```
    keytool -keystore ~/.android/debug.keystore  -list -v
    ```
    The keystore password is `android`.

The SSO will work when you run `yarn android:testing`.

## On Web
### Configure the webapp
- Copy the `.env.testing` configuration into a `.env.development` file.
- Set the `GOOGLE_CLIENT_ID` environment variable to the development value, which you can find [here](2).
- Start the webapp using the command `yarn start:web:development`.

### Start a local backend
- You can refer to [this documentation](./run-local-api.md) to do so.
- You need to add the following environment variables in the `.env.local.secret` file : `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, which can be both found [here](2).


[1]: https://console.cloud.google.com/apis/credentials/oauthclient?project=passculture-metier-ehp
[2]: https://console.cloud.google.com/apis/credentials/oauthclient/427121120704-de0dejfoe25gg6b3k25kp31rbdff6b8b.apps.googleusercontent.com?authuser=0&project=passculture-metier-ehp