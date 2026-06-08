import React, { FC } from 'react'
import styled from 'styled-components/native'

import { ArtistsSearchTab } from 'features/search/pages/SearchResults/v2/components/SearchTabs/ArtistsSearchTab'
import { OffersSearchTab } from 'features/search/pages/SearchResults/v2/components/SearchTabs/OffersSearchTab'
import { SearchTabProps } from 'features/search/pages/SearchResults/v2/components/SearchTabs/types'
import { VenuesSearchTab } from 'features/search/pages/SearchResults/v2/components/SearchTabs/VenuesSearchTab'
import { SearchFilter } from 'features/search/queries/useSearchOffersQuery/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = Omit<SearchTabProps, 'isSelected'> & {
  selectedSearchTab: SearchFilter | undefined
}

const SEARCH_TABS_MAP = {
  Offres: OffersSearchTab,
  Lieux: VenuesSearchTab,
  Artistes: ArtistsSearchTab,
}

export const SearchTabs: FC<Props> = ({ searchFilters, selectedSearchTab, onTabPress }) => {
  return (
    <StyledSearchTabContainer gap={1}>
      {Object.keys(SEARCH_TABS_MAP).map((type) => {
        const TabComponent = SEARCH_TABS_MAP[type]

        return (
          <TabComponent
            key={type}
            isSelected={selectedSearchTab === type}
            onTabPress={onTabPress}
            searchFilters={searchFilters}
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
