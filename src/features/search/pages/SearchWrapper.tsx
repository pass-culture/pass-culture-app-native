import algoliasearch from 'algoliasearch'
import React, { useContext, useReducer } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch-native'

import {
  Action,
  initialSearchState,
  searchReducer,
  SearchState,
} from 'features/search/pages/reducer'
import { buildSearchParameters } from 'libs/algolia/fetchAlgolia/fetchAlgolia'
import { env } from 'libs/environment'

export interface ISearchContext {
  searchState: SearchState
  dispatch: React.Dispatch<Action>
}

export const SearchContext = React.createContext<ISearchContext | null>(null)
const searchClient = algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_KEY)

export const SearchWrapper = ({ children }: { children: Element }) => {
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState)

  return (
    <SearchContext.Provider value={{ searchState, dispatch }}>
      <InstantSearch searchClient={searchClient} indexName={env.ALGOLIA_INDEX_NAME}>
        <Configure hitsPerPage={20} />
        {searchState && <Configure {...buildSearchParameters(searchState)} />}
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
