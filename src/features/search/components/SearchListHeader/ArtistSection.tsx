import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { styled } from 'styled-components/native'

import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { Artist } from 'features/venue/types'
import { analytics } from 'libs/analytics/provider'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { Typo } from 'ui/theme'
import { AVATAR_MEDIUM } from 'ui/theme/constants'

const TITLE = 'Les artistes'

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
  const handleOnArtistPlaylistItemPress = (artistId: string, artistName: string) => {
    void analytics.logConsultArtist({
      artistId,
      artistName,
      searchId,
      from: 'search',
    })
  }

  return (
    <View style={style}>
      <TitleContainer withMargins={withMargins}>
        <Typo.Title3>{TITLE}</Typo.Title3>
        <NumberOfResults nbHits={artists.length} />
      </TitleContainer>
      <AvatarList
        data={artists}
        avatarConfig={{ size: AVATAR_MEDIUM }}
        onItemPress={handleOnArtistPlaylistItemPress}
        withMargins={withMargins}
      />
    </View>
  )
}

const TitleContainer = styled.View<{ withMargins: boolean }>(({ theme, withMargins }) => ({
  marginHorizontal: withMargins ? theme.contentPage.marginHorizontal : 0,
}))
