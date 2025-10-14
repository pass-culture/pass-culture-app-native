import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { SkeletonTile } from 'ui/components/placeholders/SkeletonTile'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

const VENUE_THUMBNAIL_SIZE = getSpacing(14)

export const VenueBlockSkeleton: React.FC = () => {
  const { designSystem } = useTheme()
  return (
    <Container testID="venue-block-skeleton-container" gap={4}>
      <SkeletonTile
        width={VENUE_THUMBNAIL_SIZE}
        height={VENUE_THUMBNAIL_SIZE}
        borderRadius={designSystem.size.borderRadius.s}
      />
      <TilesContainer gap={2}>
        <SkeletonTile width={150} height={16} borderRadius={designSystem.size.borderRadius.s} />
        <SkeletonTile width={200} height={16} borderRadius={designSystem.size.borderRadius.s} />
      </TilesContainer>
    </Container>
  )
}

const Container = styled(ViewGap)({
  flexDirection: 'row',
  maxWidth: 500,
})

const TilesContainer = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
}))
