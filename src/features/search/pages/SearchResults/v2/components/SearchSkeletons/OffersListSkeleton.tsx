import React from 'react'
import styled from 'styled-components/native'

import {
  HeaderSearchResultsPlaceholder,
  HitPlaceholder,
} from 'ui/components/placeholders/Placeholders'

export const OffersListSkeleton = () => {
  return (
    <React.Fragment>
      <HeaderSearchResultsPlaceholder />
      <SkeletonContainer>
        <HitPlaceholder />
      </SkeletonContainer>
      <SkeletonContainer>
        <HitPlaceholder />
      </SkeletonContainer>
      <SkeletonContainer>
        <HitPlaceholder />
      </SkeletonContainer>
    </React.Fragment>
  )
}

const SkeletonContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.m,
}))
