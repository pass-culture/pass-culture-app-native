import { getStateFromPath } from '@react-navigation/native'
import { Linking } from 'react-native'

import { getNestedNavigationFromState } from 'features/navigation/navigators/RootNavigator/linking/getNestedNavigationFromState'
import { isScreen } from 'features/navigation/navigators/RootNavigator/types'
import { Action, initialSearchState } from 'features/search/context/reducer'
import { LocationMode } from 'libs/location/types'
import { locationStore } from 'libs/locationV2/location.store'

/*
  The initial search state is loaded from the URL parameters.
  This function should be called only once when the app is mounted.
*/
export const loadSearchFiltersFromUrl = async (dispatch: (action: Action) => void) => {
  /*
   ** when SearchWrapper is deleted:
   ** - remove the dispatch argument, use a searchStore action in the function body
   ** - move this call in App.tsx
   */
  const initialURL = await Linking.getInitialURL()
  if (initialURL) {
    // Defer linking import to call time, breaking the circular dep with SearchWrapper.
    // - Web (Vite): `require` is not defined, so we use `import()`
    // - Jest/Node: prefer `require()` to avoid dynamic import needing vm modules
    const hasRequire = typeof require === 'function'
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const { linking } = hasRequire
      ? require('features/navigation/navigators/RootNavigator/linking/linking')
      : await import('features/navigation/navigators/RootNavigator/linking/linking')
    const url = new URL(initialURL)
    const state = getStateFromPath(`${url.pathname}${url.search}`, linking.config)
    const [nestedScreen, params] = getNestedNavigationFromState(state)
    if (isScreen('SearchResults', nestedScreen, params) && params) {
      dispatch({
        type: 'SET_STATE',
        payload: { ...initialSearchState, ...params },
      })

      const { locationFilter } = params
      if (locationFilter) {
        if (locationFilter.locationType === LocationMode.AROUND_ME) return

        locationStore.actions.setLocationMode(locationFilter.locationType)
        if (locationFilter.locationType === LocationMode.AROUND_PLACE) {
          locationStore.actions.setPlace(locationFilter.place)
          locationStore.actions.setAroundPlaceRadius(locationFilter.aroundRadius)
        }
      }
    }
  }
}
