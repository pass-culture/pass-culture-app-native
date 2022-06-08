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

Change the variable `API_BASE_URL` to http://localhost in `.env.testing`

#### Webapp

To launch the web application, run `yarn start:web:testing`.

#### Mobile app

To make the mobile app request the backend, you either need to rebuild the application, OR you can change [this line](https://github.com/pass-culture/pass-culture-app-native/blob/984aaf165b1c31e6d51c27692ea2e2db6b5a5ac8/src/api/api.ts#L7):

```diff
-   basePath: env.API_BASE_URL,
+   basePath: 'http://localhost',
```

> Make sure your are logged out before changing that. Indeed, the user ids will differ between your backend and the database of testing.

### Limitations

Since the backend differs between local / testing, you won't:

- have the pictures of the offers.
- be able to access the detail of an offer (wrong id)
- hence book an offer, or favorite it.

However, you can still access the app and should be able to work around those limitations.
