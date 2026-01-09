import React, { memo, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { getInteractionTagLabel } from 'features/offer/components/InteractionTag/getInteractionTagLabel'
import { OfferTileProps } from 'features/offer/types'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { getDistance } from 'libs/location/getDistance'
import { useLocation } from 'libs/location/location'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { NAVIGATION_METHOD } from 'shared/constants'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { useABSegment } from 'shared/useABSegment/useABSegment'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { PlaylistCardOffer } from './PlaylistCardOffer'

const UnmemoizedOfferTile = (props: OfferTileProps) => {
  const {
    analyticsFrom,
    width,
    height,
    moduleName,
    moduleId,
    categoryLabel,
    venueId,
    homeEntryId,
    fromOfferId,
    playlistType,
    searchId,
    apiRecoParams,
    index,
    artistName,
    interactionTag,
    navigationMethod = NAVIGATION_METHOD.NAVIGATE,
    containerWidth,
    ...offer
  } = props

  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const prePopulateOffer = usePrePopulateOffer()
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()
  const segment = useABSegment()

  const { offerId, name, date, price, categoryId, thumbUrl, offerLocation, subcategoryId } = props

  const distanceFromOffer = getDistance(
    offerLocation,
    {
      userLocation,
      selectedPlace,
      selectedLocationMode,
    },
    subcategoryId
  )

  const interactionTagLabel = getInteractionTagLabel(interactionTag)
  const accessibilityLabel = tileAccessibilityLabel(TileContentType.OFFER, {
    ...offer,
    categoryLabel,
    distance: distanceFromOffer,
    interactionTagLabel,
  })

  useEffect(() => {
    if (offer) {
      // We pre-populate the query-cache with the data from the search result for a smooth transition
      prePopulateOffer(offer)
    }
  }, [offer, prePopulateOffer])

  function handlePressOffer() {
    triggerConsultOfferLog(
      {
        ...apiRecoParams,
        offerId,
        from: fromOfferId ? 'similar_offer' : analyticsFrom,
        moduleName,
        moduleId,
        venueId,
        homeEntryId,
        fromOfferId,
        playlistType,
        searchId,
        index,
        artistName,
      },
      segment
    )
  }

  return (
    <StyledContainer
      {...getHeadingAttrs(3)}
      testID="OfferTile"
      renderToHardwareTextureAndroid
      shouldRasterizeIOS
      containerWidth={containerWidth}>
      <StyledTouchableLink
        highlight
        navigateTo={{
          screen: 'Offer',
          params: {
            id: offerId,
            from: analyticsFrom,
            moduleName,
            moduleId,
            fromOfferId,
            searchId,
            apiRecoParams: JSON.stringify(apiRecoParams),
            playlistType,
          },
          withPush: navigationMethod === NAVIGATION_METHOD.PUSH,
        }}
        onBeforeNavigate={handlePressOffer}
        onFocus={onFocus}
        onBlur={onBlur}
        isFocus={isFocus}
        accessibilityLabel={accessibilityLabel}>
        <PlaylistCardOffer
          categoryId={categoryId}
          thumbnailUrl={thumbUrl}
          distance={distanceFromOffer}
          interactionTag={interactionTag}
          name={name}
          date={date}
          price={price}
          categoryLabel={categoryLabel}
          width={width}
          height={height}
        />
      </StyledTouchableLink>
    </StyledContainer>
  )
}

export const OfferTile = memo(UnmemoizedOfferTile)

const StyledContainer = styled(View).attrs<{ containerWidth?: number }>({})<{
  containerWidth
}>(({ containerWidth }) => (containerWidth ? { width: containerWidth, alignItems: 'center' } : {}))

const StyledTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  underlayColor: theme.designSystem.color.background.default,
}))<{ isFocus?: boolean }>(({ theme, isFocus }) => ({
  marginVertical: theme.outline.width + theme.outline.offSet,
  borderRadius: theme.designSystem.size.borderRadius.m,
  ...customFocusOutline({
    theme,
    isFocus,
  }),
}))
