## Develop with a local API

### Backend

To launch the backend, follow the instructions in [backend](https://github.com/pass-culture/pass-culture-main/#api).

In short, if you already set up the repo before:

- get Docker running
- run `pc start-backend` (or restart it if needed)
- run `pc sandbox -n industrial` to populate the database

> ✅ Check: you can access your [local swagger](http://localhost/native/v1/swagger#/default/get_)

Now back to the frontend.

### Frontend

The local API is available on `http://localhost:5001` (flask) and `http://localhost` (nginx, port 80). Use `http://localhost:5001`, so that it matches the `adb reverse` command for Android (see below).

#### Webapp

To launch the web application, run `API_BASE_URL=http://localhost:5001 yarn start:web:testing` (the environment variable overrides the value of `.env.testing`, no need to edit it).

To open the webapp from another device, see [Test the webapp on a real device with ngrok](./test-webapp-on-device-ngrok.md).

#### Mobile app

To make the mobile app request the backend, you either need to change the variable `API_BASE_URL` to `http://localhost:5001` in `.env.testing` and rebuild the application, OR you can change [this line](https://github.com/pass-culture/pass-culture-app-native/blob/master/src/api/api.ts#L7):

```diff
-   basePath: env.API_BASE_URL,
+   basePath: 'http://localhost:5001',
```

> Make sure your are logged out before changing that. Indeed, the user ids will differ between your backend and the database of testing. Do not commit these changes.

### Limitations

Since the backend differs between local / testing, you won't:

- have the pictures of the offers.
- be able to access the detail of an offer (wrong id)
- hence book an offer, or favorite it.

However, you can still access the app and should be able to work around those limitations.

### Android - Network request failed

On an Android device or emulator, `localhost` is the device itself. If you run into the error `Network request failed` when trying to connect an Android device to your backend running locally, forward the port to your computer:

```
adb reverse tcp:5001 tcp:5001
```

On an emulator, you can also use `http://10.0.2.2:5001` (the host machine) instead of `http://localhost:5001`.
