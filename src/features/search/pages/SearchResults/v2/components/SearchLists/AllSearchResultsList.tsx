import { useIsFocused } from '@react-navigation/native'
import React, { FC, useState } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AutoScrollSwitch } from 'features/search/components/AutoScrollSwitch/AutoScrollSwitch'
import { useSearch } from 'features/search/context/SearchWrapper'
import { NoSearchResultContainer } from 'features/search/pages/SearchResults/v2/components/NoSearchResultContainer'
import { SearchResultsListHeader } from 'features/search/pages/SearchResults/v2/components/SearchLists/components/SearchResultsListHeader'
import { OffersList } from 'features/search/pages/SearchResults/v2/components/SearchLists/OffersList'
import { ArtistsPlaylist } from 'features/search/pages/SearchResults/v2/components/SearchPlaylists/ArtistsPlaylist'
import { VenuesPlaylistContainer } from 'features/search/pages/SearchResults/v2/components/SearchPlaylists/VenuesPlaylistContainer'
import { FetchSearchResultsArgs } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Helmet } from 'libs/react-helmet/Helmet'

type Props = {
  onPressAIFakeDoorBanner: () => void
  enableAIFakeDoor?: boolean
  header?: React.ReactNode
  searchFilters: FetchSearchResultsArgs
}

const isWeb = Platform.OS === 'web'

export const AllSearchResultsList: FC<Props> = ({
  enableAIFakeDoor,
  onPressAIFakeDoorBanner,
  header,
  searchFilters,
}) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)

  const isFocused = useIsFocused()

  const { searchState } = useSearch()

  const enableGridList = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_GRID_LIST)
  const shouldDisplayGridList = enableGridList && !isWeb

  return (
    <React.Fragment>
      {isFocused ? <Helmet title="Recherche | pass Culture" /> : null}
      <AutoScrollSwitch
        title="Activer le chargement automatique des résultats"
        active={autoScrollEnabled}
        toggle={() => setAutoScrollEnabled((autoScroll) => !autoScroll)}
      />
      <NoSearchResultContainer searchFilters={searchFilters}>
        <Container testID="searchResults">
          <OffersList searchFilters={searchFilters}>
            <React.Fragment>
              {header}
              <SearchResultsListHeader
                title="Les offres"
                artistSection={
                  <StyledArtistPlaylists
                    searchId={searchState.searchId}
                    withMargins={false}
                    searchFilters={searchFilters}
                  />
                }
                venuesSection={
                  <VenuesPlaylistContainer withMargins={false} searchFilters={searchFilters} />
                }
                shouldDisplayGridList={shouldDisplayGridList}
                enableAIFakeDoor={enableAIFakeDoor}
                onPressAIFakeDoorBanner={onPressAIFakeDoorBanner}
                searchFilters={searchFilters}
              />
            </React.Fragment>
          </OffersList>
        </Container>
      </NoSearchResultContainer>
    </React.Fragment>
  )
}

const Container = styled.View({
  flex: 1,
})

const StyledArtistPlaylists = styled(ArtistsPlaylist)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
