import React from 'react'

import { useSearch } from 'features/search/context/SearchWrapper'
import { SearchLanding } from 'features/search/pages/SearchLanding/SearchLanding'
import { SearchResults } from 'features/search/pages/SearchResults/SearchResults'
import { SearchView } from 'features/search/types'

export function Search() {
  const {
    searchState: { view },
  } = useSearch()

  if (view === SearchView.Landing) {
    return <SearchLanding />
  } else {
    return <SearchResults />
  }
}
