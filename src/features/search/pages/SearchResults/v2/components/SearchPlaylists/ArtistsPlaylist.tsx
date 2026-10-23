import { useIsFocused } from '@react-navigation/native'
import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { styled } from 'styled-components/native'

import { hasActiveSearchFilters } from 'features/search/queries/helpers'
import { selectSearchArtists } from 'features/search/queries/useSearchArtists/selectors/selectSearchArtists'
import { useSearchArtistsQuery } from 'features/search/queries/useSearchArtists/useSearchArtistsQuery'
import { FetchSearchResultsArgs } from 'features/search/types'
import { asArtistId, asSearchId, logViewItem } from 'libs/analytics/helpers/logViewItem'
import { analytics } from 'libs/analytics/provider'
import { NumberOfItems } from 'shared/NumberOfItems/NumberOfItems'
import { ObservedPlaylist } from 'shared/ObservedPlaylist/ObservedPlaylist'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { SeeAllButton } from 'ui/components/SeeAllButton/SeeAllButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { AVATAR_MEDIUM } from 'ui/theme/constants'

const playlistTitle = 'Les artistes'

type ArtistSectionProps = {
  style?: StyleProp<ViewStyle>
  searchId: string | undefined
  withMargins?: boolean
  searchFilters: FetchSearchResultsArgs
}

export const ArtistsPlaylist = ({
  style,
  searchId,
  withMargins = false,
  searchFilters,
}: ArtistSectionProps) => {
  const isFocused = useIsFocused()
  const { data: artistsResponse = [] } = useSearchArtistsQuery(searchFilters, {
    select: (data) => selectSearchArtists(data),
  })

  const onBeforeNavigate = () => {
    void analytics.logClickSeeAll({ type: 'artists', moduleName: playlistTitle, from: 'search' })
  }

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistArtists' as const,
    params: { title: playlistTitle, subtitle: undefined, originDetails: 'searchResults' },
  }

  const handleOnArtistPlaylistItemPress = (artistId: string, artistName: string) => {
    void analytics.logConsultArtist({ artistId, artistName, searchId, from: 'search' })
  }

  const hasSelectedSearchFilters = hasActiveSearchFilters(searchFilters)
  if (!artistsResponse.length || hasSelectedSearchFilters) return null

  return (
    <View style={style}>
      <HeaderContainer withMargins={withMargins}>
        <SeeAllButtonContainer gap={3}>
          <TitleContainer>
            <Typo.Title3>{playlistTitle}</Typo.Title3>
          </TitleContainer>
          <View>
            <SeeAllButton
              playlistTitle={playlistTitle}
              data={{
                onBeforeNavigate,
                navigateToVerticalPlaylist,
                hideSearchSeeAll: true,
              }}
            />
          </View>
        </SeeAllButtonContainer>
        <NumberOfItems nbItems={artistsResponse.length} />
      </HeaderContainer>
      <ObservedPlaylist
        onItemViewed={({ index, item }) => {
          if (!isFocused || !searchId) return
          void logViewItem({
            origin: 'search',
            playlistIndex: 0,
            index,
            type: 'artist',
            id: asArtistId(item.id),
            playlistId: 'searchResultsArtistPlaylist',
            originId: asSearchId(searchId),
          })
        }}>
        {({ listRef, handleViewableItemsChanged }) => (
          <AvatarList
            listRef={listRef}
            onViewableItemsChanged={handleViewableItemsChanged}
            data={artistsResponse}
            avatarConfig={{ size: AVATAR_MEDIUM }}
            onItemPress={handleOnArtistPlaylistItemPress}
            withMargins={withMargins}
          />
        )}
      </ObservedPlaylist>
    </View>
  )
}

const HeaderContainer = styled.View<{ withMargins: boolean }>(({ theme, withMargins }) => ({
  marginHorizontal: withMargins ? theme.contentPage.marginHorizontal : 0,
}))

const TitleContainer = styled.View({
  flex: 1,
})

const SeeAllButtonContainer = styled(ViewGap)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'baseline',
})
