import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { getSpacing, Spacer } from 'ui/theme'

const VENUE_THUMBNAIL_SIZE = getSpacing(14)

export const VenueBlockSkeleton: React.FC = () => {
  return (
    <Container>
      <SkeletonTile width={VENUE_THUMBNAIL_SIZE} height={VENUE_THUMBNAIL_SIZE} borderRadius={4} />
      <Spacer.Row numberOfSpaces={4} />
      <View>
        <Spacer.Column numberOfSpaces={2} />
        <SkeletonTile width={150} height={16} borderRadius={4} />
        <Spacer.Column numberOfSpaces={2} />
        <SkeletonTile width={200} height={16} borderRadius={4} />
      </View>
    </Container>
  )
}

const Container = styled(View)({
  flexDirection: 'row',
  maxWidth: 500,
})
