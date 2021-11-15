import { navigateFromRef } from 'features/navigation/navigationRef'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchRouteParams } from 'features/navigation/TabBar/types'
import { SearchView } from 'features/search/enums'
import { SearchState } from 'features/search/types'

function simplifySearchStateForUrlParams(state: Partial<SearchState>) {
  const params: Partial<Record<keyof SearchState, any>> = {}
  if (state.beginningDatetime) params.beginningDatetime = state.beginningDatetime
  if (state.date) params.date = state.date
  if (state.endingDatetime) params.endingDatetime = state.endingDatetime
  if (state.hitsPerPage) params.hitsPerPage = state.hitsPerPage
  if (state.locationFilter) params.locationFilter = state.locationFilter
  if (state.offerCategories && state.offerCategories.length)
    params.offerCategories = state.offerCategories
  if (state.offerIsDuo) params.offerIsDuo = state.offerIsDuo
  if (state.offerIsFree) params.offerIsFree = state.offerIsFree
  if (state.offerIsNew) params.offerIsNew = state.offerIsNew
  if (
    state.offerTypes &&
    (state.offerTypes.isDigital || state.offerTypes.isEvent || state.offerTypes.isThing)
  )
    params.offerTypes = state.offerTypes
  if (state.priceRange) params.priceRange = state.priceRange
  if (state.query) params.query = state.query
  if (state.tags && state.tags.length) params.tags = state.tags
  if (state.timeRange) params.timeRange = state.timeRange
  return params
}

export function writeSearchToUrl(state: SearchRouteParams, view: SearchView): void {
  const params = { ...simplifySearchStateForUrlParams(state), view }
  navigateFromRef(...getTabNavConfig('Search', params))
}
