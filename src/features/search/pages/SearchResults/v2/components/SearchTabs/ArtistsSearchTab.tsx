import React, { FC } from 'react'

import { SearchTab } from 'features/search/pages/SearchResults/v2/components/SearchTabs/SearchTab'
import { SearchTabProps } from 'features/search/pages/SearchResults/v2/components/SearchTabs/types'
import { useSearchArtistsQuery } from 'features/search/queries/useSearchArtists/useSearchArtistsQuery'

export const ArtistsSearchTab: FC<SearchTabProps> = ({ isSelected, onTabPress, searchFilters }) => {
  const { data: nbHits } = useSearchArtistsQuery(searchFilters, {
    select: (artistsResponse) => artistsResponse?.artistsResponse.nbHits,
  })

  if (!nbHits) return null

  return (
    <SearchTab
      testID="artists-search-tab"
      key="artists-search-tab"
      isSelected={isSelected}
      onPress={() => onTabPress('Artistes')}
      title="Artistes"
    />
  )
}
