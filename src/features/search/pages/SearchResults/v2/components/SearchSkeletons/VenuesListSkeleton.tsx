import React from 'react'
import styled from 'styled-components/native'

import {
  HeaderSearchResultsPlaceholder,
  VenueHitPlaceholder,
} from 'ui/components/placeholders/Placeholders'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const VenuesListSkeleton = () => {
  return (
    <React.Fragment>
      <HeaderSearchResultsPlaceholder />
      <Row gap={2}>
        <SkeletonContainer>
          <VenueHitPlaceholder />
        </SkeletonContainer>
        <SkeletonContainer>
          <VenueHitPlaceholder />
        </SkeletonContainer>
        <SkeletonContainer>
          <VenueHitPlaceholder />
        </SkeletonContainer>
        <SkeletonContainer>
          <VenueHitPlaceholder />
        </SkeletonContainer>
      </Row>
    </React.Fragment>
  )
}

const Row = styled(ViewGap)(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  flexDirection: 'row',
}))

const SkeletonContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.m,
}))
