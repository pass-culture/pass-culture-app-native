import { Platform } from 'react-native'

import { STORE_LINK } from 'features/forceUpdate/constants'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics/provider'
import { getAppBuildVersion } from 'libs/packageJson'

const QUERY_PARAMETER_THAT_CLEAR_STUFF = 'force'

const clearStorageAndReload = (): void => {
  sessionStorage.clear()
  localStorage.clear()

  const location = globalThis.window.location
  const url = new URL(location.href)
  url.searchParams.set(QUERY_PARAMETER_THAT_CLEAR_STUFF, Date.now().toString()) // force to bypass HTML cache
  location.assign(url)
}

async function openStore() {
  await analytics.logClickForceUpdate(getAppBuildVersion())
  await openUrl(STORE_LINK)
}

export const onPressStoreLink = Platform.select({
  web: clearStorageAndReload,
  default: openStore,
})
