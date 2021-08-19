import { initialSearchState } from 'features/search/pages/reducer'
import { RecursivePartial, SearchState } from 'features/search/types'

export const searchRouteParamsToSearchState = (
  searchRouteParams: RecursivePartial<SearchState>
) => {
  const { offerTypes, ...params } = searchRouteParams
  const searchState: SearchState = {
    ...initialSearchState,
    ...params,
    offerTypes: {
      isDigital: offerTypes?.isDigital || initialSearchState.offerTypes.isDigital,
      isEvent: offerTypes?.isEvent || initialSearchState.offerTypes.isEvent,
      isThing: offerTypes?.isThing || initialSearchState.offerTypes.isThing,
    },
  }
  return searchState
}
