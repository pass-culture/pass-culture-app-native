import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { Artist } from 'features/venue/types'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { Typo, getSpacing } from 'ui/theme'
import { AVATAR_MEDIUM } from 'ui/theme/constants'

const TITLE = 'Les artistes'

type ArtistSectionProps = {
  artists: Artist[]
}

export const ArtistSection = ({ artists }: ArtistSectionProps) => {
  return (
    <View>
      <Title>{TITLE}</Title>
      <NumberOfResults nbHits={artists.length} />
      <AvatarList
        data={artists}
        avatarConfig={{ size: AVATAR_MEDIUM, borderWidth: 4 }}
        onItemPress={() => false}
      />
    </View>
  )
}

const Title = styled(Typo.Title3)({
  marginHorizontal: getSpacing(6),
})
