import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { styled } from 'styled-components/native'

import { Artist } from 'features/venue/types'
import { analytics } from 'libs/analytics/provider'
import { NumberOfItems } from 'shared/NumberOfItems/NumberOfItems'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { SeeAllButton } from 'ui/components/SeeAllButton/SeeAllButton'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { AVATAR_MEDIUM } from 'ui/theme/constants'

const playlistTitle = 'Les artistes'

type ArtistSectionProps = {
  artists: Artist[]
  style?: StyleProp<ViewStyle>
  searchId: string | undefined
  withMargins?: boolean
}

export const ArtistSection = ({
  artists,
  style,
  searchId,
  withMargins = false,
}: ArtistSectionProps) => {
  const onBeforeNavigate = () => {
    void analytics.logClickSeeAll({ type: 'artists', moduleName: playlistTitle, from: 'search' })
  }

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistArtists' as const,
    params: { title: playlistTitle, subtitle: undefined },
  }

  const handleOnArtistPlaylistItemPress = (artistId: string, artistName: string) => {
    void analytics.logConsultArtist({ artistId, artistName, searchId, from: 'search' })
  }

  return (
    <View style={style}>
      <HeaderContainer withMargins={withMargins}>
        <SeeAllButtonContainer gap={3}>
          <TitleContainer>
            <Typo.Title3>{playlistTitle}</Typo.Title3>
          </TitleContainer>
          <SeeAllButton
            playlistTitle={playlistTitle}
            data={{
              onBeforeNavigate,
              navigateToVerticalPlaylist,
              hideSearchSeeAll: true,
            }}
          />
        </SeeAllButtonContainer>
        <NumberOfItems nbItems={artists.length} />
      </HeaderContainer>
      <AvatarList
        data={artists}
        avatarConfig={{ size: AVATAR_MEDIUM }}
        onItemPress={handleOnArtistPlaylistItemPress}
        withMargins={withMargins}
      />
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
  alignItems: 'center',
})
