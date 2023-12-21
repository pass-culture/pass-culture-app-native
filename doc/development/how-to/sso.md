# How to test SSO login locally

## On iOS
No special configuration needed. It will work when you run `yarn ios:testing`.

## On Android
You need to create a OAuth Client ID of type Android [here][1], with the following values :
- **Name:** Google Auth Android (dev) - YOUR NAME
- **Package name:** app.passculture.testing
- **SHA-1 fingerprint:** this correspond to the fingerprint of your debug keystore. You can find it by running :
    ```
    keytool -keystore ~/.android/debug.keystore  -list -v
    ```
    The keystore password is `android`.

The SSO will work when you run `yarn android:testing`.

## On Web
- Start the webapp with a local backend, you can refer to [this documentation](./run-local-api.md) to do so.
- You need to add the following environment variables in the `.env.local.secret` file, in the `api` folder of the backend repo : `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, which can be both found [here][2].


[1]: https://console.cloud.google.com/apis/credentials/oauthclient?project=passculture-native
[2]: https://console.cloud.google.com/apis/credentials/oauthclient/605788939445-jbn4bv8q35gdpmg777pfcu055j4ltf4f.apps.googleusercontent.com