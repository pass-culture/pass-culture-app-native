import React, { FC, PropsWithChildren } from 'react'

import { NoSearchResult } from 'features/search/components/NoSearchResult/NoSearchResult'
import { useSearch } from 'features/search/context/SearchWrapper'
import { useNavigateToSearchFilter } from 'features/search/helpers/useNavigateToSearchFilter/useNavigateToSearchFilter'
import { useSearchArtistsQuery } from 'features/search/queries/useSearchArtists/useSearchArtistsQuery'
import { useSearchOffersQuery } from 'features/search/queries/useSearchOffersQuery/useSearchOffersQuery'
import { useSearchVenuesQuery } from 'features/search/queries/useSearchVenuesQuery/useSearchVenuesQuery'
import { FetchSearchResultsArgs } from 'features/search/types'
import { locationActions } from 'libs/locationV2/location.store'

export const NoSearchResultContainer: FC<
  PropsWithChildren<{ searchFilters: FetchSearchResultsArgs }>
> = ({ children, searchFilters }) => {
  const { searchState } = useSearch()
  const { navigateToSearchFilter } = useNavigateToSearchFilter()

  const { data: hasOffersData } = useSearchOffersQuery(searchFilters, {
    select: (offersResponse) => !!offersResponse.pages[0]?.offersResponse.nbHits,
  })

  const { data: hasVenuesData } = useSearchVenuesQuery(searchFilters, {
    select: (venuesResponse) =>
      !!(
        (venuesResponse?.venuesResponse?.hits.length ?? 0) +
        (venuesResponse.venueNotOpenToPublic?.hits.length ?? 0)
      ),
  })

  const { data: hasArtistsData } = useSearchArtistsQuery(searchFilters, {
    select: (artistsResponse) => !!artistsResponse?.artistsResponse.nbHits,
  })

  if (!hasOffersData && !hasVenuesData && !hasArtistsData)
    return (
      <NoSearchResult
        setSelectedLocationMode={locationActions.setLocationMode}
        searchState={searchState}
        setPlace={locationActions.setPlace}
        navigateToSearchFilter={navigateToSearchFilter}
      />
    )

  return <React.Fragment>{children}</React.Fragment>
}
