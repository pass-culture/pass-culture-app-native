const { getDefaultConfig } = require('@react-native/metro-config')
const { withSentryConfig } = require("@sentry/react-native/metro");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);
module.exports = withSentryConfig(config);