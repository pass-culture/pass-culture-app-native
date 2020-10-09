import * as Sentry from '@sentry/react-native'

import { env } from 'libs/environment'

// Disable Sentry when executing tests. See Packgage.json script 'test:unit'
if (process.env.JEST !== 'true') {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.ENV,
    release: env.VERSION,
  })
}

export default Sentry
