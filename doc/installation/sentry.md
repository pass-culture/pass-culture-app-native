## Error Monitoring with sentry

[Sentry](https://pass-culture.sentry.io/issues/?project=4508839229718608) helps us monitor crash and errors in the application.

### Source maps

To have a better understanding of the potential crashes and errors, we have to provide sentry with the source maps. This helps us see the source of the error in the un-minified bundle.

The build is configured to upload the source maps automatically, on every new release (or new version), but you may want to do it manually. If so, follow along.

### Generate your auth token for Sentry SaaS

> Generate your [own auth `<token>`](https://pass-culture.sentry.io/settings/account/api/auth-tokens/) using the following scope permissions:

- Project: Read & Write
- Team: Read
- Release: No Access (or Admin if you plan on uploading locally built source maps)
- Issue & Event: Read
- Organization: Read
- Member: Read
- Alerts: Read

Your "Permissions Preview" should look like this:

```
event:read
team:read
member:read
project:write
release:admin
organization:read
alerts:read
```

### 🗝 Configure sentry cli

For iOS/Android:

- add a file at the root of your machine `~/.sentryclirc`:

For Sentry SaaS (`url` is no longer needed):

```
[defaults]
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

### 📦 Create the source maps locally (mobile) // if needed

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

### 🚢 Upload the local source maps // if needed

- ⚠️ Make sure to change the version and release:

```bash
node_modules/@sentry/cli/bin/sentry-cli releases files 1.132.3 \
  upload-sourcemaps sourcemaps \
  --dist 1013203 \
  --url-prefix "app:///" \
  --no-rewrite
```

### 📦 Create the source maps locally (web) // if needed

Source maps for the web app are generated during the build if `UPLOAD_SOURCEMAPS_TO_SENTRY` is true.

You can test like this:

```sh
UPLOAD_SOURCEMAPS_TO_SENTRY=true yarn build:testing
```

You should be able to [see the generated source maps](https://pass-culture.sentry.io/settings/projects/jeunes/source-maps/)
