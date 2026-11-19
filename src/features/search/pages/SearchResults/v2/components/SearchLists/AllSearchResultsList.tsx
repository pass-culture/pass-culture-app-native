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
import { hasActiveSearchFilters } from 'features/search/queries/helpers'
import { selectSearchArtists } from 'features/search/queries/useSearchArtists/selectors/selectSearchArtists'
import { useSearchArtistsQuery } from 'features/search/queries/useSearchArtists/useSearchArtistsQuery'
import { selectSearchVenues } from 'features/search/queries/useSearchVenuesQuery/selectors/selectSearchVenues'
import { useSearchVenuesQuery } from 'features/search/queries/useSearchVenuesQuery/useSearchVenuesQuery'
import { FetchSearchResultsArgs } from 'features/search/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { WebMetaHeader } from 'shared/WebMetaHeader/WebMetaHeader'

type Props = {
  header?: React.ReactNode
  searchFilters: FetchSearchResultsArgs
}

const isWeb = Platform.OS === 'web'

export const AllSearchResultsList: FC<Props> = ({ header, searchFilters }) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)

  const isFocused = useIsFocused()

  const { searchState } = useSearch()

  const enableGridList = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_GRID_LIST)
  const shouldDisplayGridList = enableGridList && !isWeb
  const hasFilters = hasActiveSearchFilters(searchFilters)
  const { data: artists = [] } = useSearchArtistsQuery(searchFilters, {
    select: (data) => selectSearchArtists(data),
  })
  const { data: venues } = useSearchVenuesQuery(searchFilters, {
    select: (data) => selectSearchVenues(data),
  })
  const hasArtistsPlaylist = !hasFilters && artists.length > 0
  const hasVenuesPlaylist =
    !hasFilters && Boolean(venues?.venues.length || venues?.venueNotOpenToPublic?.[0])
  const offersPlaylistIndex = Number(hasArtistsPlaylist) + Number(hasVenuesPlaylist)

  return (
    <React.Fragment>
      {isFocused ? <WebMetaHeader title="Recherche" /> : null}
      <AutoScrollSwitch
        title="Activer le chargement automatique des résultats"
        active={autoScrollEnabled}
        toggle={() => setAutoScrollEnabled((autoScroll) => !autoScroll)}
      />
      <NoSearchResultContainer searchFilters={searchFilters}>
        <Container testID="searchResults">
          <OffersList searchFilters={searchFilters} playlistIndex={offersPlaylistIndex}>
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
                  <VenuesPlaylistContainer
                    withMargins={false}
                    searchFilters={searchFilters}
                    playlistIndex={hasArtistsPlaylist ? 1 : 0}
                  />
                }
                shouldDisplayGridList={shouldDisplayGridList}
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
