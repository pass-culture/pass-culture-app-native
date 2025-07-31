import React, { memo, useEffect } from 'react'
import styled from 'styled-components/native'

import { useHighlightOffer } from 'features/home/api/useHighlightOffer'
import { AccessibleTitle } from 'features/home/components/AccessibleTitle'
import { HighlightOfferModule as HighlightOfferModuleType } from 'features/home/types'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

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
    displayBookingAllowedDatetime,
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
    <StyledViewGap gap={5}>
      <AccessibleTitle title={props.highlightTitle} />
      <MarketingBlockExclusivity
        offer={highlightOffer}
        homeEntryId={homeEntryId}
        backgroundImageUrl={props.image}
        moduleId={props.id}
        shouldDisplayBookingAllowedDatetime={displayBookingAllowedDatetime}
      />
    </StyledViewGap>
  )
}

export const HighlightOfferModule = memo(UnmemoizedHighlightOfferModule)

const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  paddingBottom: theme.home.spaceBetweenModules,
}))
