import { Linking } from 'react-native'

import { Action, initialSearchState } from 'features/search/context/reducer'
import { applyDeeplinkLocationFilter } from 'features/search/helpers/applyDeeplinkLocationFilter'
import { getSearchResultsParamsFromUrl } from 'features/search/helpers/getSearchResultsParamsFromUrl'

export { LOCATION_CHANGED_BY_DEEPLINK_MESSAGE } from 'features/search/helpers/applyDeeplinkLocationFilter'

/*
  Cold start only: Linking.getInitialURL() is the URL that launched the app.
  A link opened while the app is already running is handled by
  subscribeToSearchDeeplinkLocation, which updates the location store.
  This function should be called only once when the app is mounted.
*/
export const loadSearchFiltersFromUrl = async (dispatch: (action: Action) => void) => {
  /*
   ** when SearchWrapper is deleted:
   ** - remove the dispatch argument, use a searchStore action in the function body
   ** - move this call in App.tsx
   */
  const initialURL = await Linking.getInitialURL()
  if (!initialURL) return

  const params = await getSearchResultsParamsFromUrl(initialURL)
  if (!params) return

  dispatch({
    type: 'SET_STATE',
    payload: { ...initialSearchState, ...params },
  })

  if (params.locationFilter) applyDeeplinkLocationFilter(params.locationFilter)
}
