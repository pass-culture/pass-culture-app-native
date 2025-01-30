import { Platform } from 'react-native'

import { openUrl } from 'features/navigation/helpers/openUrl'
import { STORE_LINK } from 'features/remoteBanner/constants'
import { analytics } from 'libs/analytics/provider'
import { getAppBuildVersion } from 'libs/packageJson'

async function openStore() {
  await analytics.logClickForceUpdate(getAppBuildVersion())
  await openUrl(STORE_LINK)
}

export const onPressStoreLink = Platform.select({
  web: () => globalThis?.window?.location?.reload(),
  default: openStore,
})
