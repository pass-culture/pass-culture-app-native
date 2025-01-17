import React, { memo, useEffect } from 'react'
import styled from 'styled-components/native'

import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { HighlightOfferModule as HighlightOfferModuleType } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { Spacer, TypoDS } from 'ui/theme'

import { MarketingBlockExclusivity } from './marketing/MarketingBlockExclusivity'

type HighlightOfferModuleProps = HighlightOfferModuleType & {
  index: number
  homeEntryId: string | undefined
}

const UnmemoizedHighlightOfferModule = (props: HighlightOfferModuleProps) => {
  const {
    id,
    offerId,
    offerEan,
    offerTag,
    isGeolocated,
    aroundRadius,
    index,
    homeEntryId,
    displayPublicationDate,
  } = props

  const highlightOffer = useHighlightOffer({
    id,
    offerId,
    offerEan,
    offerTag,
    isGeolocated,
    aroundRadius,
  })

  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage({
      moduleId: id,
      moduleType: ContentTypes.HIGHLIGHT_OFFER,
      index,
      homeEntryId,
      offers: offerId ? [offerId] : undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!highlightOffer) return null

  return (
    <Container>
      <StyledTitleContainer>
        <StyledTitle>{props.highlightTitle}</StyledTitle>
      </StyledTitleContainer>
      <Spacer.Column numberOfSpaces={5} />
      <MarketingBlockExclusivity
        offer={highlightOffer}
        homeEntryId={homeEntryId}
        backgroundImageUrl={props.image}
        moduleId={props.id}
        shouldDisplayPublicationDate={displayPublicationDate}
      />
    </Container>
  )
}

export const HighlightOfferModule = memo(UnmemoizedHighlightOfferModule)

const Container = styled.View(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))

const StyledTitleContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const StyledTitle = styled(TypoDS.Title3).attrs({
  numberOfLines: 2,
})``
