import { Platform } from 'react-native'

import { E2E_LOCALHOST_ADDRESS, E2E_LOCALHOST_ADDRESS_ANDROID } from 'libs/e2e/constants'
import { getIsE2e } from 'libs/e2e/getIsE2e'
import { env } from 'libs/environment'

import { Configuration } from './gen'
import { DefaultApi } from './gen/api'

const configuration: Configuration = {
  basePath: env.API_BASE_URL,
}

export const api = new DefaultApi(configuration)

// To avoid having to distribute e2e custom build, in e2e, we change the basePath to target e2e backend.
// On Android chrome and Android app, the backend is available on http://10.0.2.2:6001
// For others, the backend is available on http://localhost:6001
getIsE2e().then((isE2e) => {
  if (isE2e) {
    api.setBasePath(
      `http://${
        (Platform.OS === 'web' && /Android/i.test(navigator.userAgent)) || Platform.OS === 'android'
          ? E2E_LOCALHOST_ADDRESS_ANDROID
          : E2E_LOCALHOST_ADDRESS
      }:6001`
    )
  }
})
