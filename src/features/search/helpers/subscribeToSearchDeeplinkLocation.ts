import { Linking } from 'react-native'

import { applyDeeplinkLocationFilter } from 'features/search/helpers/applyDeeplinkLocationFilter'
import { getSearchResultsParamsFromUrl } from 'features/search/helpers/getSearchResultsParamsFromUrl'

export const applyLocationFromSearchDeeplink = async (url: string) => {
  const params = await getSearchResultsParamsFromUrl(url)
  if (params?.locationFilter) applyDeeplinkLocationFilter(params.locationFilter)
}

export const subscribeToSearchDeeplinkLocation = () => {
  const subscription = Linking.addEventListener('url', ({ url }) => {
    void applyLocationFromSearchDeeplink(url)
  })

  return () => subscription.remove()
}
