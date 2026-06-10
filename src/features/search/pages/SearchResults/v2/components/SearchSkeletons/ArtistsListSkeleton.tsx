import React from 'react'
import styled from 'styled-components/native'

import {
  ArtistHitPlaceholder,
  HeaderSearchResultsPlaceholder,
} from 'ui/components/placeholders/Placeholders'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const ArtistsListSkeleton = () => {
  return (
    <React.Fragment>
      <HeaderSearchResultsPlaceholder />
      <Column gap={2}>
        <SkeletonContainer>
          <ArtistHitPlaceholder />
        </SkeletonContainer>
        <SkeletonContainer>
          <ArtistHitPlaceholder />
        </SkeletonContainer>
        <SkeletonContainer>
          <ArtistHitPlaceholder />
        </SkeletonContainer>
        <SkeletonContainer>
          <ArtistHitPlaceholder />
        </SkeletonContainer>
      </Column>
    </React.Fragment>
  )
}

const Column = styled(ViewGap)({
  flexDirection: 'column',
})

const SkeletonContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.m,
}))
