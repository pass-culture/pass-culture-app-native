import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { Artist } from 'features/venue/types'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { Typo } from 'ui/theme'
import { AVATAR_MEDIUM } from 'ui/theme/constants'

const TITLE = 'Les artistes'

type ArtistSectionProps = {
  artists: Artist[]
  style?: StyleProp<ViewStyle>
  onArtistPlaylistItemPress: (id: string, name: string) => void
  withMargins?: boolean
}

export const ArtistSection = ({
  artists,
  style,
  onArtistPlaylistItemPress,
  withMargins = true,
}: ArtistSectionProps) => {
  return (
    <View style={style}>
      <Container withMargins={withMargins}>
        <Typo.Title3>{TITLE}</Typo.Title3>
        <NumberOfResults nbHits={artists.length} />
      </Container>
      <AvatarList
        data={artists}
        avatarConfig={{ size: AVATAR_MEDIUM }}
        onItemPress={onArtistPlaylistItemPress}
      />
    </View>
  )
}

const Container = styled(View)<{ withMargins: boolean }>(({ theme, withMargins }) => ({
  marginHorizontal: withMargins ? theme.designSystem.size.spacing.xl : 0,
}))
