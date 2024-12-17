import { Dispatch } from 'react'

import { DisabilitiesProperties } from 'features/accessibility/types'
import { Action } from 'features/search/context/reducer'
import { SearchState } from 'features/search/types'

export const doAlgoliaRedirect = (
  url: URL,
  searchState: SearchState,
  disabilities: DisabilitiesProperties,
  dispatch: Dispatch<Action>,
  navigateToThematicSearch: (
    newSearchState: SearchState,
    newAccessibilityFilter: DisabilitiesProperties
  ) => void
) => {
  const offerCategories = url.searchParams.get('offerCategories') || ''
  const newSearchState = {
    ...searchState,
    offerCategories: JSON.parse(offerCategories),
    shouldRedirect: false,
  }

  dispatch({
    type: 'SET_STATE',
    payload: newSearchState,
  })

  return navigateToThematicSearch(newSearchState, disabilities)
}
