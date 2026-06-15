import React, { FC } from 'react'
import styled from 'styled-components/native'

import { SearchTab } from 'features/search/pages/SearchResults/v2/components/SearchTabs/SearchTab'
import { SearchTabProps } from 'features/search/pages/SearchResults/v2/components/SearchTabs/types'
import { useSearchArtistsQuery } from 'features/search/queries/useSearchArtists/useSearchArtistsQuery'
import { SearchFilter } from 'features/search/queries/useSearchOffersQuery/types'
import { useSearchOffersQuery } from 'features/search/queries/useSearchOffersQuery/useSearchOffersQuery'
import { useSearchVenuesQuery } from 'features/search/queries/useSearchVenuesQuery/useSearchVenuesQuery'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = Omit<SearchTabProps, 'isSelected'> & {
  selectedSearchTab: SearchFilter | undefined
}

export const SearchTabs: FC<Props> = ({ searchFilters, selectedSearchTab, onTabPress }) => {
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

  const searchTabs = [
    hasOffersData && 'Offres',
    hasVenuesData && 'Lieux',
    hasArtistsData && 'Artistes',
  ].filter((tab): tab is SearchFilter => Boolean(tab))

  if (searchTabs.length <= 1) return null

  return (
    <StyledSearchTabContainer gap={1}>
      {searchTabs.map((searchTab) => {
        return (
          <SearchTab
            testID={`${searchTab}-search-tab`}
            key={`${searchTab}-search-tab`}
            isSelected={selectedSearchTab === searchTab}
            onPress={() => onTabPress(searchTab)}
            title={searchTab}
          />
        )
      })}
    </StyledSearchTabContainer>
  )
}

const StyledSearchTabContainer = styled(ViewGap)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginTop: theme.designSystem.size.spacing.l,
}))
