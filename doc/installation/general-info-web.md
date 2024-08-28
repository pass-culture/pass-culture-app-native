## The web app

When this documentation was written, the project was using vite 5.3.1 and react-native-web 0.18.10.
Our web app uses [react-native-web](https://necolas.github.io/react-native-web/docs/) as a base to generate a web app.
Originally, we used webpack to generate the bundle, but in 2024, we decided to use vite for its simplicity and performances.
In this guide, you will find explanations of the main aspects of the vite configuration.

## The vite config

There are 2 main files that contain the configuration for the web app:

- `vite.config.js`
- `public/index.html`

Let's start by breaking down the `vite.config.js` file.

## `vite.config.js`

One of the most important aspects to understanding vite is that depending on if you serve or build, different technologies are used:

- when you serve the app, the underlying technology is `esbuild` (written in Go)
- vite serves source code over native ESM, allowing much better HMR than with webpack.
- when you build the app, Rollup is used (maybe some day, Rolldown, written in Rust will be used instead)

### Defining environment variables

For our vite configuration to work in different environments, we need to define a certain number of variables that will be used throughout the config.
First of all we set `global: 'window'`, then we use `loadEnv` offered by vite to load a .env file and set it to `'process.env': env` to make these variables usable in our app. Lastly, we have to define `__DEV__`.

### Plugins

We of course use the `@vitejs/plugin-react` plugin. It enables fast refresh in development and sets a custom Babel configuration.
Then we wrote a custom plugin to handle libraries with files with a `.js` extension that actually contained `jsx` components. This plugin is not necessary during builds, so we set `apply: 'build'` in the plugin's configuration.
There is also `vite-plugin-html` that allows us to easily pass variables to the entrypoint of our app: `index.html`. These variables are then used to set meta tags. In this plugin's configuration, if we set `entry: '/src/index.tsx'` and `template: 'public/index.html'` we don't need to add `<script type="module" src="/src/index.tsx"></script>` to `public/index.html`.
`@sentry/vite-plugin` is another important plugin that allows us to upload sourcemaps to sentry. The `uploadLegacySourcemaps` options are currently needed since our self-hosted Sentry is using an older version of Sentry. Previously, each developer would have to create a `~/.sentryclirc` file containing their `authToken`. We took this opportunity to mak things easier. Now each developer can simply create a `.env.local` containing a variable `SENTRY_AUTH_TOKEN` that will be used in the sentry plugin.
Lastly, to reset the css, we installed the `reset-css` plugin allowing us to be sure all users will see our app the same. With the webpack config, this css file was directly in our project and we had to load the css and then inject it in the `index.html` through a variable. The `reset-css` plugin makes things much easier. The plugin is imported in `App.web.tsx`.

### Resolving modules

There are a certain number of libs that have `react-native-web` specific versions. We have to make sure the usage of the non-web specific version of libs are replaced by the web-specific version of the lib. The is also an alias that is configured to match the aliases configured in `babel.config.js`.

### Proxy

To avoid CORS errors when attempting to access external domains (for example our own backend API), we had to configure proxies for serving and previewing the app.
If we look in `src/libs/environment/env.web.ts`, we set `API_BASE_URL` to an empty string (when in development mode) so that we don't get CORS errors. When inspecting Chrome's dev tools, it will look like requests to the backend are made to localhost, but that is the proxy intercepting the requests.

### Dependencies optimizations

Vite prebundles your project dependencies before loading your site locally. Vite must convert dependencies that are shipped as CommonJS or UMD into ESM first. Vite also groups libraries, that can have many separate files, into a single module.

We customized the dependency optimization behavior with the following options:

- `optimizeDeps.include`: large dependencies with many internal modules or in CommonJS, they should be put here.
- `optimizeDeps.exclude`: small dependencies and already valid ESM, can be excluded to let the browser load it directly.
- `optimizeDeps.esbuildOptions`: Options to pass to esbuild during the dep scanning and optimization.
  - `jsx: 'transform'`: https://esbuild.github.io/api/#jsx
  - `resolveExtensions`: https://esbuild.github.io/api/#resolve-extensions
  - `loader`: https://esbuild.github.io/api/#loader

### Build options

These options are applied only for vite builds. We specify that we want sourcemaps to be generated to pass them to sentry.
We also have access to the configuration of the underlying commonjs plugin of Rollup. We specify a few options to make the build more reliable.

## `public/index.html`

In this file, we receive variables from `vite.config.js`.
We can use the variables with this syntax: `<%- VARIABLE %>`.
For example, we set the page's title this way:
`<meta name="title" content="<%- TITLE %>" />``
It is in this `public/index.html` file that we also set the robots meta tag, link towards icons, the manifest file, fonts, the appsflyer sdk and more. For the most part, this file was kept as is when transitioning from webpack to vite.

## Building locally

You can build the app locally (with `yarn build:testing` for example), and then use the following command to visualize your build:

```sh
yarn vite preview
```

## TODO list

There are certain number of optimizations/improvements and things that were done in webpack that we didn't think were immediately necessary.

- Chunk protection
- CSP: atm, we haven't added any. In the webpack config we had them.
- Testing older browser and increasing compatibility with `@vitejs/plugin-legacy`
- PWA (it seems that vite generates a manifest but we should make sure the service worker is functioning)
- Web vitals
- Profiling tools (maybe vite offers something)
- BundleAnalyzerPlugin
- DuplicatesPlugin
- It might be worth it to investigate using `@vitejs/plugin-react-swc` in place of `@vitejs/plugin-react``
- Try to solve warnings on `vite serve` and `vite build`
- Using vite's chunking technology to increase initial loading time of the web app

## Troubleshooting (issues meet when setting up vite)

### Circular dependency between chunks

To avoid the circular dependency between chunks, we can simply avoid using the index. For example, in:
`src/libs/firebase/firestore/getCookiesLastUpdate.ts`

```ts
// BEFORE:
import { env } from 'libs/environment' // Using index.ts

// AFTER:
import { env } from 'libs/environment/env' // Direct import
```
