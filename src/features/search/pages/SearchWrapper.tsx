import algoliasearch from 'algoliasearch'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-native'

import {
  Action,
  initialSearchState,
  searchReducer,
  SearchState,
} from 'features/search/pages/reducer'
import { LocationType } from 'libs/algolia'
import { buildSearchParameters } from 'libs/algolia/fetchAlgolia/fetchAlgolia'
import { env } from 'libs/environment'
import { useGeolocation } from 'libs/geolocation'

const SEARCH_DEBOUNCE_MS = 400

export interface ISearchContext {
  searchState: SearchState
  dispatch: React.Dispatch<Action>
}

export const SearchContext = React.createContext<ISearchContext | null>(null)
const searchClient = algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)

export const SearchWrapper = ({ children }: { children: Element }) => {
  const position = useGeolocation()
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState)
  const [debouncedSearchState, setDebouncedSearchState] = useState<SearchState>(searchState)
  const { showResults, ...parameters } = debouncedSearchState

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchState(searchState), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(handler)
  }, [searchState])

  useEffect(() => {
    if (position !== null) {
      const geoloc = { latitude: position.latitude, longitude: position.longitude }
      dispatch({ type: 'LOCATION_TYPE', payload: LocationType.AROUND_ME })
      dispatch({ type: 'SET_POSITION', payload: geoloc })
    }
  }, [!position])

  return (
    <SearchContext.Provider value={{ searchState, dispatch }}>
      <InstantSearch searchClient={searchClient} indexName={env.ALGOLIA_INDEX_NAME}>
        <Configure hitsPerPage={20} />
        {showResults && <Configure {...buildSearchParameters(parameters)} />}
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
