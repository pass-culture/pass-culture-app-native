## Error Monitoring with sentry

Sentry helps us monitor crash and errors in the application. See our project [here](https://sentry.passculture.team/organizations/sentry/issues/?project=6)

### Source maps

To have a better understanding of the potential crashes and errors, we have to provide sentry with the source maps. This helps us see the source of the error in the un-minified bundle.

The build is configured to upload the source maps automatically, on every new release (or new version), but you may want to do it manually. If so, follow along.

### 🗝 Configure sentry cli

- add a file `~/.sentryclirc`:

```
[defaults]
url = https://sentry.passculture.team/
org = sentry
project = application-native

[auth]
token=<token>
```

> Click [here](https://sentry.passculture.team/settings/account/api/auth-tokens/) to generate your own auth `<token>`, use the following scope permissions: `event:read`, `event:admin`, `member:read`, `org:read`, `project:read`, `project:releases`, `team:read`, `project:write`, `org:integrations`

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
