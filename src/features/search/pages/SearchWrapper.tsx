import { useNavigation } from '@react-navigation/native'
import React, { memo, useContext, useEffect, useReducer } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { LocationType } from 'features/search/enums'
import { Action, initialSearchState, searchReducer } from 'features/search/pages/reducer'
import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { RecursivePartial, SearchState } from 'features/search/types'
import { useGeolocation } from 'libs/geolocation'

export interface ISearchContext {
  searchState: SearchState
  stagedSearchState: SearchState
  dispatch: React.Dispatch<Action>
  stagedDispatch: React.Dispatch<Action>
}

export const SearchContext = React.createContext<ISearchContext | null>(null)

export const SearchWrapper = memo(function SearchWrapper({ children }: { children: JSX.Element }) {
  const { position } = useGeolocation()
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState)
  const [stagedSearchState, stagedDispatch] = useReducer(searchReducer, initialSearchState)

  useEffect(() => {
    if (position !== null) {
      const { latitude, longitude } = position
      stagedDispatch({ type: 'LOCATION_AROUND_ME', payload: { latitude, longitude } })
    } else {
      stagedDispatch({ type: 'LOCATION_EVERYWHERE' })
    }
  }, [!position])

  return (
    <SearchContext.Provider value={{ searchState, stagedSearchState, dispatch, stagedDispatch }}>
      {children}
    </SearchContext.Provider>
  )
})

export const useSearch = (): Pick<ISearchContext, 'searchState' | 'dispatch'> => {
  // The searchState is initialized so this can't be null
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { searchState, dispatch } = useContext(SearchContext)!
  return { searchState, dispatch }
}

export const useStagedSearch = (): Pick<ISearchContext, 'searchState' | 'dispatch'> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { stagedSearchState: searchState, stagedDispatch: dispatch } = useContext(SearchContext)!
  return { searchState, dispatch }
}

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

export const sanitizeSearchStateParams = (searchState: RecursivePartial<SearchState> = {}) => {
  const {
    aroundRadius,
    beginningDatetime,
    date,
    endingDatetime,
    geolocation,
    hitsPerPage,
    locationType,
    offerCategories,
    offerTypes,
    offerIsDuo,
    offerIsFree,
    offerIsNew,
    place,
    query,
    showResults,
    tags,
    timeRange,
    venueId,
  } = searchState
  const priceRange = searchState.priceRange ?? [0, MAX_PRICE]

  return {
    ...(aroundRadius ? { aroundRadius } : {}),
    ...(beginningDatetime ? { beginningDatetime } : {}),
    ...(date ? { date } : {}),
    ...(endingDatetime ? { endingDatetime } : {}),
    ...(geolocation ? { geolocation } : {}),
    ...(hitsPerPage ? { hitsPerPage } : {}),
    ...(locationType !== LocationType.EVERYWHERE ? { locationType } : {}),
    offerCategories: offerCategories || [],
    ...(offerIsDuo ? { offerIsDuo } : {}),
    ...(offerIsFree ? { offerIsFree } : {}),
    ...(offerIsNew ? { offerIsNew } : {}),
    ...(offerTypes?.isDigital || offerTypes?.isEvent || offerTypes?.isThing
      ? {
          offerTypes: {
            ...(offerTypes?.isDigital ? { isDigital: offerTypes?.isDigital } : {}),
            ...(offerTypes?.isEvent ? { isEvent: offerTypes?.isEvent } : {}),
            ...(offerTypes?.isThing ? { isThing: offerTypes?.isThing } : {}),
          },
        }
      : {}),
    ...(place ? { place } : {}),
    ...(priceRange[0] > 0 || priceRange[1] < MAX_PRICE ? { priceRange } : {}),
    query: query || '',
    ...(showResults ? { showResults } : {}),
    tags: tags || [],
    ...(timeRange ? { timeRange } : {}),
    ...(venueId ? { venueId } : {}),
  }
}

export const useCommit = (): { commit: () => void } => {
  const { navigate } = useNavigation<UseNavigationType>()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { stagedSearchState } = useContext(SearchContext)!
  return {
    commit() {
      navigate('Search', sanitizeSearchStateParams(stagedSearchState))
    },
  }
}
