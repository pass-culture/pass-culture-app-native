# The web app

When this documentation was written, the project was using vite 5.3.1 and react-native-web 0.18.10.
Our web app uses [react-native-web](https://necolas.github.io/react-native-web/docs/) as a base to generate a web app.

We decided to use vite the following reasons:

- its simplicity and performances,
- to have "real" hot swapping (webpack would reload the whole page when changes were made),
- our configuration of webpack was outdated and required starting from scratch in any case.

In this guide, you will find explanations of the main aspects of the vite configuration.

## The vite config

There are 2 main files that contain the configuration for the web app:

- `vite.config.js`
- `src/index.html`

Let's start by breaking down the `vite.config.js` file.

## `vite.config.js`

One of the most important aspects to understanding vite is that depending on if you serve or build, different technologies are used:

- when you serve the app, the underlying technology is `esbuild` (written in Go)
- vite serves source code over native ESM, very performant HMR.
- when you build the app, Rollup is used (maybe some day, Rolldown, written in Rust will be used instead)

### Defining environment variables

For our vite configuration to work in different environments, we need to define a certain number of variables that will be used throughout the config.

First of all we set `global: 'window'`, then we use `loadEnv` offered by vite to load a .env file and set it to `'process.env': whiteListEnv(env)` to make these variables usable in our app.

The `whiteListEnv` simply iterates over a list of authorized variables (the ones in `.env`), eliminating any variables that might be present in the CI, potentially exposing secrets.

Vite offers a security mechanism by only exposing variables with the prefix `VITE_`, but since we didn't want to rename all the variables in the different `.env` and in the app, we had to find another way.

Lastly, we have to define `__DEV__`.

### Plugins

You can run the `vite-bundle-analyzer` by adding a local environnement variable like this:

```sh
export ANALYZE_BUNDLE=toto && yarn vite build
```

You can set `ANALYZE_BUNDLE` to any value, as long as it's set it will start the bundler analyzer at `localhost:8888`. It can be useful to see what assets/files are bulking up your web app, and use this information to split files from the main bundle with dynamic imports (using `Suspense` and `lazy` from `react`).

We of course use the `@vitejs/plugin-react` plugin. It enables fast refresh in development and sets a custom Babel configuration.

Then we wrote a custom plugin to handle libraries with files with a `.js` extension that actually contained `jsx` components. This plugin is only necessary during builds, so we set `apply: 'build'` in the plugin's configuration.

There is also `vite-plugin-html` that allows us to easily pass variables to the entrypoint of our app: `index.html`. These variables are then used to set meta tags. In this plugin's configuration, if we set `entry: '/src/index.tsx'` and `template: 'src/index.html'` we don't need to add `<script type="module" src="/src/index.tsx"></script>` to `src/index.html`.

`@sentry/vite-plugin` is another important plugin that allows us to upload sourcemaps to sentry. Locally, it is deactivated unless you set the `UPLOAD_SOURCEMAPS_TO_SENTRY` environment variable to true.

To send events to Sentry from local environnement we have to create a `.env.local` (loaded automatically by `vite`) containing a variable `SENTRY_AUTH_TOKEN` that is used in the sentry plugin.

Lastly, to reset the css, we installed the `reset-css` plugin allowing us to be sure all users will see our app the same. With the webpack config, this css file was directly in our project and we had to load the css and then inject it in the `index.html` through a variable. The `reset-css` plugin makes things much easier. The plugin is imported in `App.web.tsx`.

### Resolving modules

There are a certain number of libs that have `react-native-web` specific versions. We have to make sure the usage of the non-web specific version of libs are replaced by the web-specific version of the lib. There is also an alias that is configured to match the aliases configured in `babel.config.js`.

### Proxy

To avoid CORS errors when attempting to access external domains (for example our own backend API), we had to configure proxies for serving and previewing the app.
If we look in `src/libs/environment/env.web.ts`, we set `API_BASE_URL` to an empty string (when in development mode) so that we don't get CORS errors. When inspecting Chrome's dev tools, it will look like requests to the backend are made to localhost, but that is the proxy intercepting the requests.

### Dependencies optimizations

Vite prebundles your project dependencies before loading your site locally. Vite must convert dependencies that are shipped as CommonJS or UMD into ESM first. Vite also groups libraries, that can have many separate files, into a single module.

We customized the dependency optimization behavior with the following options:

- `optimizeDeps.include`: large dependencies with many internal modules or in CommonJS, they should be put here.
- `optimizeDeps.exclude`: small dependencies and already valid ESM, can be excluded to let the browser load it directly.
- `optimizeDeps.esbuildOptions`: Options to pass to esbuild during the dependency scanning and optimization.
  - `jsx: 'transform'`: https://esbuild.github.io/api/#jsx
  - `resolveExtensions`: https://esbuild.github.io/api/#resolve-extensions
  - `loader`: https://esbuild.github.io/api/#loader

### Build options

These options are applied only for vite builds. We specify that we want sourcemaps to be generated to pass them to sentry.
We also have access to the configuration of the underlying commonjs plugin of Rollup.

We specify a few options :

- `transformMixedEsModules`: We set to true if require calls should be transformed to imports in mixed modules. This is useful with modules that contain a mix of ES import statements and CommonJS require expressions.

  Without this option set to true, we would get errors in the browser like the following:

  ```
  Uncaught ReferenceError: require is not defined at styled-components.native.esm.js:6259:19
  ```

- `extensions`: For extensionless imports, search for extensions other than .js in the order specified. Note that you need to make sure that non-JavaScript files are transpiled by another plugin first.

  For some reason, without this option we get the following errors in the browser:

  ```
  Error enabling offline persistence...
  Uncaught (in promise) FirebaseError: Failed to obtain exclusive access to the persistence layer...
  ```

## `src/index.html`

In this file, we receive variables from `vite.config.js`.
The template engine used by our plugin `vite-plugin-html` is EJS (Embedded JavaScript).
We can use the variables with this syntax: `<%- VARIABLE %>`.
For example, we set the page's title this way:

`<meta name="title" content="<%- TITLE %>" />`

It is in this `src/index.html` file that we also set several meta tags.

## Building locally

You can build the app locally (with `yarn build:testing` for example), and then use the following command to visualize your build:

```sh
yarn vite preview --mode=testing
```

Keep in mind to [do the following change to not run into CORS errors](./general-info-web.md#requests-blocked-by-cors-policy).

If you use the command `yarn vite build`, vite defaults to using the production values for environnement variables. It's usually better to use the commands available in `package.json` and make a mindful choice of what environnement you want you build to run in.

## Browser compatibility

We currently tested/support the browsers specified in `src/web/SupportedBrowsersGate.tsx`.

If needed, increase compatibility with `@vitejs/plugin-legacy` (you will need to install `terser` for the plugin to work)

## TODO list

There are certain number of optimizations/improvements and things that were done in webpack that we didn't think were immediately necessary:

SHOULD HAVE:

- Try to solve all warnings on `vite serve` and `vite build`
- CSP: atm, we haven't added any. In the webpack config we had them.

COULD HAVE:

- Using vite's chunking technology (or any other chunking technology) to reduce the initial loading time of the web app
- Chunk protection (check there isn't any bundle issues and protect against future issues)
- Depending on the compatibility with older browsers, update `src/web/SupportedBrowsersGate.web.test.tsx` and `package.json.browserList`

COULD BE NICE TO HAVE:

- Web vitals
- Performance Monitoring:
  - Profiling tools (maybe vite offers something): atm we use lighthouse
  - BundleAnalyzerPlugin and update `doc/development/optimization.md`
- DuplicatesPlugin (used to be in Webpack, investigate is we need one in vite)
- It might be worth it to investigate using `@vitejs/plugin-react-swc` in place of `@vitejs/plugin-react` (for development mode)
- For the CI Guild: either include all the build commands (for the web) in the `package.json` (which means adding a command for vite preview) or remove them and create a separate script

## Troubleshooting (issues meet when setting up vite)

### Build warning: Circular dependency between chunks

To avoid the circular dependency between chunks, we can simply avoid using the index. For example, in:
`src/libs/firebase/firestore/getCookiesLastUpdate.ts`

```diff
-import { env } from 'libs/environment' // Using index.ts
+import { env } from 'libs/environment/env' // Direct import
```

### Build error: JavaScript heap out of memory

When running the vite build command, at some point we were getting the following error:
`JavaScript heap out of memory`
As a temporary workaround, we had to use the command line argument `max_old_space_size` to increase the available memory.
See [the issue here](https://github.com/vitejs/vite/issues/2433).

For example, in `package.json`:

```json
"build": "NODE_OPTIONS=--max-old-space-size=16384 vite build",
```

While writing these lines, it would seem that we are no longer running into the error with the current configuration.
But we might need it again when adding the `@vitejs/plugin-legacy` since it increases the number of builds (creating different builds for older browsers).

### Requests blocked by CORS policy

When you build locally and try to preview the web app, you will see errors in the browser console:

```
Access to fetch at 'https://backend.passculture.app/native/v1/settings' from origin 'http://localhost:4173' has been blocked by CORS policy
```

As a workaround, go to `src/libs/environment/env.web.ts` and change:

```diff
-API_BASE_URL: __DEV__ ? '' : (process.env.API_BASE_URL as string),
+API_BASE_URL: '',
```

Then re-build the app, and preview it.
