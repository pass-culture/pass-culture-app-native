import { getStateFromPath } from '@react-navigation/native'

import { getNestedNavigationFromState } from 'features/navigation/navigators/RootNavigator/linking/getNestedNavigationFromState'
import { isScreen } from 'features/navigation/navigators/RootNavigator/types'

export const getSearchResultsParamsFromUrl = async (url: string) => {
  // Deferred so this file does not import the navigator config at module load.
  // Jest cannot evaluate import() without --experimental-vm-modules, so Node uses require().
  const linkingModule =
    typeof require === 'function'
      ? // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('features/navigation/navigators/RootNavigator/linking/linking')
      : await import('features/navigation/navigators/RootNavigator/linking/linking')
  const { linking } = linkingModule
  const parsedUrl = new URL(url)
  const state = getStateFromPath(`${parsedUrl.pathname}${parsedUrl.search}`, linking.config)
  const [nestedScreen, params] = getNestedNavigationFromState(state)
  if (isScreen('SearchResults', nestedScreen, params) && params) return params

  return undefined
}
