'use strict'
/* eslint-disable */
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware')
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware')
const ignoredFiles = require('react-dev-utils/ignoredFiles')
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware')
const paths = require('./paths')
const getClientEnvironment = require('./env')
const getHttpsConfig = require('./getHttpsConfig')

const host = process.env.HOST || '0.0.0.0'

module.exports = function (proxy, allowedHost) {
  // We will provide `paths.publicUrlOrPath` to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  // Get environment variables to inject into our app.
  const { raw } = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))
  return {
    // Enable gzip compression of generated files.
    compress: true,
    // Enable hot reloading server. It will provide WDS_SOCKET_PATH endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,
    liveReload: true,
    // Use 'ws' instead of 'sockjs-node' on server since we're using native
    // websockets in `webpackHotDevClient`.
    webSocketServer: 'ws',
    // It is important to tell WebpackDevServer to use the same "publicPath" path as
    // we specified in the webpack config. When homepage is '.', default to serving
    // from the root.
    // remove last slash so user can land on `/test` instead of `/test/`
    devMiddleware: {
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },
    watchFiles: paths.appSrc,
    https: getHttpsConfig(),
    host,
    client: {
      overlay: true,
      webSocketTransport: 'ws',
    },
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    allowedHosts: allowedHost,
    // `proxy` is run between `onBeforeSetupMiddleware` and `onAfterSetupMiddleware` `webpack-dev-server` hooks
    proxy,
    onBeforeSetupMiddleware(devServer) {
      // Keep `evalSourceMapMiddleware` and `errorOverlayMiddleware`
      // middlewares before `redirectServedPath` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      devServer.app.use(evalSourceMapMiddleware(devServer.server))
      // This lets us open files from the runtime error overlay.
      devServer.app.use(errorOverlayMiddleware())
    },
    onAfterSetupMiddleware(devServer) {
      // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
      devServer.app.use(redirectServedPath(paths.publicUrlOrPath))

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath))
    },
  }
}
