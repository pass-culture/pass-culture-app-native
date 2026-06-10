import React, { FC } from 'react'

import { SearchTab } from 'features/search/pages/SearchResults/v2/components/SearchTabs/SearchTab'
import { SearchTabProps } from 'features/search/pages/SearchResults/v2/components/SearchTabs/types'
import { useSearchOffersQuery } from 'features/search/queries/useSearchOffersQuery/useSearchOffersQuery'

export const OffersSearchTab: FC<SearchTabProps> = ({ isSelected, onTabPress, searchFilters }) => {
  const { data: nbHits } = useSearchOffersQuery(searchFilters, {
    select: (offersResponse) => offersResponse.pages[0]?.offersResponse.nbHits,
  })

  if (!nbHits) return null

  return (
    <SearchTab
      testID="offers-search-tab"
      key="offers-search-tab"
      isSelected={isSelected}
      onPress={() => onTabPress('Offres')}
      title="Offres"
    />
  )
}
