/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')
const paths = require('./paths');
const { name, version } = require('../../package.json')

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve('./paths')];

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in webpack configuration.
const REACT_APP = /^REACT_APP_/i;

// We use REACT_APP_DOT_ENV_* suffix to detect our dotenv environment variable and inject them without any suffix
const REACT_APP_DOT_ENV = /^REACT_APP_DOT_ENV_/i;

const NODE_ENV = process.env.NODE_ENV;
const ENV = process.env.ENV;
if (!NODE_ENV) {
    throw new Error('The NODE_ENV environment variable is required but was not specified.');
}

const gitRevisionPlugin = new GitRevisionPlugin({
    commithashCommand: 'rev-parse --short HEAD'
})

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
    `${paths.dotenv}.${ENV || NODE_ENV}.local`,
    `${paths.dotenv}.${ENV || NODE_ENV}`,
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    NODE_ENV !== 'test' && `${paths.dotenv}.local`,
    paths.dotenv,
].filter(Boolean);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
        const parsedWithoutPrefix = require('dotenv').config({
            path: dotenvFile,
        }).parsed
        const parsed = {}
        Object.keys(parsedWithoutPrefix).forEach((key) => {
            parsed[!REACT_APP.test(key) ? `REACT_APP_DOT_ENV_${key}` : key] = parsedWithoutPrefix[key]
        })
        require('dotenv-expand')({ parsed });
    }
});

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebook/create-react-app/issues/253.
// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of webpack shims.
// https://github.com/facebook/create-react-app/issues/1023#issuecomment-265344421
// We also resolve them to make sure all tools using them work consistently.
const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter((folder) => folder && !path.isAbsolute(folder))
  .map((folder) => path.resolve(appDirectory, folder))
  .join(path.delimiter);

function getClientEnvironment(publicUrl) {
    const raw = Object.keys(process.env)
      .filter((key) => REACT_APP.test(key))
      .reduce(
        (env, key) => {
            env[REACT_APP_DOT_ENV.test(key) ? key.replace('REACT_APP_DOT_ENV_', '') : key] = process.env[key];
            return env;
        },
        {
            // Useful for determining whether we’re running in production mode.
            // Most importantly, it switches React into the correct mode.
            NODE_ENV: process.env.NODE_ENV || 'development',
            // Useful for resolving the correct path to static assets in `public`.
            // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
            // This should only be used as an escape hatch. Normally you would put
            // images into the `src` and `import` them in code to get their paths.
            PUBLIC_URL: publicUrl,
            // We support configuring the sockjs pathname during development.
            // These settings let a developer run multiple simultaneous projects.
            // They are used as the connection `hostname`, `pathname` and `port`
            // in webpackHotDevClient. They are used as the `sockHost`, `sockPath`
            // and `sockPort` options in webpack-dev-server.
            WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
            WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
            WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
            // Our envs
            NAME: name,
            VERSION: version,
            COMMIT_HASH: gitRevisionPlugin.commithash(),
            BRANCH: gitRevisionPlugin.branch(),
            LAST_COMMIT_DATETIME: gitRevisionPlugin.lastcommitdatetime(),
        },
      );
    // Stringify all values so we can feed into webpack DefinePlugin
    const stringified = {
        'process.env': Object.keys(raw).reduce((env, key) => {
            env[key] = JSON.stringify(raw[key]);
            return env;
        }, {}),
    };

    return { raw, stringified };
}

module.exports = getClientEnvironment;
