import algoliasearch from 'algoliasearch'
import React, { useContext, useEffect, useReducer } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-native'

import {
  Action,
  initialSearchState,
  searchReducer,
  SearchState,
} from 'features/search/pages/reducer'
import { useDebouncedValue } from 'features/search/utils/useDebouncedValue'
import { buildSearchParameters } from 'libs/algolia/fetchAlgolia/fetchAlgolia'
import { env } from 'libs/environment'
import { useGeolocation } from 'libs/geolocation'

const SLIDER_DEBOUNCE_MS = 400

export interface ISearchContext {
  searchState: SearchState
  dispatch: React.Dispatch<Action>
}

// We debounce the query only for those parameters (sliders)
type DebouncedParameters = Pick<SearchState, 'aroundRadius' | 'priceRange' | 'timeRange'>

export const SearchContext = React.createContext<ISearchContext | null>(null)
const searchClient = algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)

export const SearchWrapper = ({ children }: { children: Element }) => {
  const { position } = useGeolocation()
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState)
  const { query, aroundRadius, priceRange, timeRange, ...parameters } = searchState
  const debouncedSliders = useDebouncedValue<DebouncedParameters>(
    { aroundRadius, priceRange, timeRange },
    SLIDER_DEBOUNCE_MS
  )

  useEffect(() => {
    if (position !== null) {
      const { latitude, longitude } = position
      dispatch({ type: 'LOCATION_AROUND_ME', payload: { latitude, longitude } })
    }
  }, [!position])

  const searchParameters = buildSearchParameters({ ...parameters, ...debouncedSliders })

  return (
    <SearchContext.Provider value={{ searchState, dispatch }}>
      <InstantSearch searchClient={searchClient} indexName={env.ALGOLIA_INDEX_NAME}>
        <Configure hitsPerPage={20} />
        <Configure {...searchParameters} query={query} />
        {children}
      </InstantSearch>
    </SearchContext.Provider>
  )
}

export const useSearch = (): ISearchContext => {
  const searchContext = useContext(SearchContext)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return searchContext! // The searchState is initialized so this can't be null
}
