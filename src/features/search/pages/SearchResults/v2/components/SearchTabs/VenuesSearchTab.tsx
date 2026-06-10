import React, { FC } from 'react'

import { SearchTab } from 'features/search/pages/SearchResults/v2/components/SearchTabs/SearchTab'
import { SearchTabProps } from 'features/search/pages/SearchResults/v2/components/SearchTabs/types'
import { useSearchVenuesQuery } from 'features/search/queries/useSearchVenuesQuery/useSearchVenuesQuery'

export const VenuesSearchTab: FC<SearchTabProps> = ({ isSelected, onTabPress, searchFilters }) => {
  const { data: nbHits } = useSearchVenuesQuery(searchFilters, {
    select: (venuesResponse) =>
      (venuesResponse?.venuesResponse?.hits.length ?? 0) +
      (venuesResponse.venueNotOpenToPublic?.hits.length ?? 0),
  })

  if (!nbHits) return null

  return (
    <SearchTab
      testID="venues-search-tab"
      key="venues-search-tab"
      isSelected={isSelected}
      onPress={() => onTabPress('Lieux')}
      title="Lieux"
    />
  )
}
