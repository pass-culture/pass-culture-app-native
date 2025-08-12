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
  onItemPress: (artistName: string) => void
  style?: StyleProp<ViewStyle>
}

export const ArtistSection = ({ artists, onItemPress, style }: ArtistSectionProps) => {
  return (
    <View style={style}>
      <Title>{TITLE}</Title>
      <StyledNumberOfResults nbHits={artists.length} />
      <AvatarList
        data={artists}
        avatarConfig={{ size: AVATAR_MEDIUM, borderWidth: 4 }}
        onItemPress={onItemPress}
      />
    </View>
  )
}

const Title = styled(Typo.Title3)(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))

const StyledNumberOfResults = styled(NumberOfResults)(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))
