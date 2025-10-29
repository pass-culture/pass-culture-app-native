import { ReactNativeOptions } from '@sentry/react-native'
import { Platform } from 'react-native'

import { env } from 'libs/environment/env'
import { getAppBuildVersion, getAppVersion } from 'libs/packageJson'

import { reactNavigationIntegration } from './sentry'

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const sentryReactNavigationIntegration = reactNavigationIntegration()

export function getSentryConfig() {
  const release = `${getAppVersion()}-${Platform.OS}`
  const dist = `${getAppBuildVersion()}-${Platform.OS}`

  return {
    dsn: env.SENTRY_DSN,
    environment: __DEV__ ? 'development' : env.ENV,
    release,
    dist,
    tracesSampleRate: Number(env.SENTRY_TRACES_SAMPLE_RATE || 1),
    sampleRate: Number(env.SENTRY_SAMPLE_RATE || 1),
    attachScreenshot: true,
    integrations: [sentryReactNavigationIntegration],
    _experiments: {
      // profilesSampleRate is relative to tracesSampleRate.
      // Here, we'll capture profiles for 1% of transactions.
      profilesSampleRate: Number(env.SENTRY_PROFILES_SAMPLE_RATE || 1),
    },
    enableAppHangTracking: false,
    ignoreErrors: [
      'Non-Error promise rejection captured with value: Timeout', // Sentry Issue: APPLICATION-NATIVE-77ZQ
      'Could not decrypt data with alias', // Sentry Issue: APPLICATION-NATIVE-1GTFR
      'Could not encrypt data with alias:', // Sentry Issue: APPLICATION-NATIVE-1GTGN
      'No keychain is available. You may need to restart your computer.', // Sentry Issue: APPLICATION-NATIVE-1GTTT
    ],
  } satisfies ReactNativeOptions
}
