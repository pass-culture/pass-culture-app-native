## Error Monitoring with sentry

Sentry helps us monitor crash and errors in the application. See our project [here](https://pass-culture.sentry.io/issues/?project=4508839229718608)

### Source maps

To have a better understanding of the potential crashes and errors, we have to provide sentry with the source maps. This helps us see the source of the error in the un-minified bundle.

The build is configured to upload the source maps automatically, on every new release (or new version), but you may want to do it manually. If so, follow along.

### 🗝 Configure sentry cli

For iOS/Android:

- add a file at the root of your machine `~/.sentryclirc`:

```
[defaults]
url = https://6f8956508939cbd25a8dca7492c194e2@o4508142779564032.ingest.de.sentry.io
org = pass-culture
project = jeunes

[auth]
token=<token>
```

For Web:
Create a new `.env.local` at the root of the repo containing your `SENTRY_AUTH_TOKEN`

```sh
SENTRY_AUTH_TOKEN=your_super_secret_token
```

> Click [here](https://pass-culture.sentry.io/settings/account/api/auth-tokens/) to generate your own auth `<token>`, use the following scope permissions: `event:read`, `event:admin`, `member:read`, `org:read`, `project:read`, `project:releases`, `team:read`, `project:write`, `org:integrations`

### 📦 Create the source maps locally

#### Android

```bash
  npx react-native bundle \
  --platform android \
  --entry-file index.js \
  --dev false \
  --bundle-output sourcemaps/index.android.bundle \
  --sourcemap-output sourcemaps/index.android.bundle.map
```

#### iOS

```bash
  npx react-native bundle \
    --platform ios \
    --entry-file index.js \
    --dev false \
    --bundle-output sourcemaps/main.jsbundle \
    --sourcemap-output sourcemaps/main.jsbundle.map
```

### 🚢 Upload the local source maps

- ⚠️ Make sure to change the version and release:

```bash
node_modules/@sentry/cli/bin/sentry-cli releases files 1.132.3 \
  upload-sourcemaps sourcemaps \
  --dist 1013203 \
  --url-prefix "app:///" \
  --no-rewrite
```
