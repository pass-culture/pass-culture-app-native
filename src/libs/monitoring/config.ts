import { ReactNativeOptions } from '@sentry/react-native'
import { Platform } from 'react-native'
import CodePush from 'react-native-code-push'

import { env } from 'libs/environment/env'
import { getAppBuildVersion, getAppVersion } from 'libs/packageJson'

import { ReactNativeTracing, ReactNavigationInstrumentation } from './sentry'

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new ReactNavigationInstrumentation()

export async function getSentryConfig() {
  let update
  try {
    update = await CodePush.getUpdateMetadata()
  } catch (error) {
    // silent fail
  }

  let release = `${getAppVersion()}-${Platform.OS}`
  if (update) {
    release += `+codepush:${update.label}`
  }
  const dist = `${getAppBuildVersion()}-${Platform.OS}`

  return {
    dsn: env.SENTRY_DSN,
    environment: __DEV__ ? 'development' : env.ENV,
    release,
    dist,
    tracesSampleRate: Number(env.SENTRY_TRACES_SAMPLE_RATE || 1),
    sampleRate: Number(env.SENTRY_SAMPLE_RATE || 1),
    attachScreenshot: true,
    integrations: [new ReactNativeTracing({ routingInstrumentation })],
    _experiments: {
      // profilesSampleRate is relative to tracesSampleRate.
      // Here, we'll capture profiles for 1% of transactions.
      profilesSampleRate: Number(env.SENTRY_PROFILES_SAMPLE_RATE || 1),
    },
    enableAppHangTracking: false,
    ignoreErrors: [
      'Non-Error promise rejection captured with value: Timeout', // Sentry Issue: APPLICATION-NATIVE-77ZQ
    ],
  } satisfies ReactNativeOptions
}
