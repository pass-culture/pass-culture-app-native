import React, { memo } from 'react'
import { PixelRatio, View } from 'react-native'
import styled from 'styled-components/native'

import { OfferTileProps } from 'features/offer/types'
import { analytics } from 'libs/analytics'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { ImageCaption } from 'ui/components/ImageCaption'
import { ImageTile } from 'ui/components/ImageTile'
import { OfferCaption } from 'ui/components/OfferCaption'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, MARGIN_DP } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const UnmemoizedOfferTile = (props: OfferTileProps) => {
  const {
    analyticsFrom,
    width,
    height,
    moduleName,
    moduleId,
    isBeneficiary,
    categoryLabel,
    venueId,
    homeEntryId,
    fromOfferId,
    shouldUseAlgoliaRecommend,
    playlistType,
    searchId,
    ...offer
  } = props

  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const prePopulateOffer = usePrePopulateOffer()
  const { offerId, name, distance, date, price, isDuo } = offer
  const accessibilityLabel = tileAccessibilityLabel(TileContentType.OFFER, {
    ...offer,
    categoryLabel,
  })

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    prePopulateOffer(offer)
    analytics.logConsultOffer({
      offerId,
      from: fromOfferId ? 'similar_offer' : analyticsFrom,
      moduleName,
      moduleId,
      venueId,
      homeEntryId,
      fromOfferId,
      shouldUseAlgoliaRecommend,
      playlistType,
    })
  }

  return (
    <View {...getHeadingAttrs(3)}>
      <StyledTouchableLink
        highlight
        height={height + MAX_OFFER_CAPTION_HEIGHT}
        navigateTo={{
          screen: 'Offer',
          params: {
            id: offerId,
            from: analyticsFrom,
            moduleName,
            moduleId,
            fromOfferId,
            searchId,
          },
          withPush: true,
        }}
        onBeforeNavigate={handlePressOffer}
        onFocus={onFocus}
        onBlur={onBlur}
        isFocus={isFocus}
        accessibilityLabel={accessibilityLabel}>
        <Container>
          <OfferCaption
            imageWidth={width}
            name={name}
            date={date}
            isDuo={isDuo}
            isBeneficiary={isBeneficiary}
            price={price}
          />
          <View>
            <ImageTile
              width={width}
              height={height - IMAGE_CAPTION_HEIGHT}
              uri={offer.thumbUrl}
              onlyTopBorderRadius
            />
            <ImageCaption
              height={IMAGE_CAPTION_HEIGHT}
              width={width}
              categoryLabel={categoryLabel}
              distance={distance}
            />
          </View>
        </Container>
      </StyledTouchableLink>
    </View>
  )
}

export const OfferTile = memo(UnmemoizedOfferTile)

const IMAGE_CAPTION_HEIGHT = PixelRatio.roundToNearestPixel(MARGIN_DP)
const MAX_OFFER_CAPTION_HEIGHT = getSpacing(18)

const Container = styled.View({ flexDirection: 'column-reverse' })

const StyledTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  underlayColor: theme.colors.white,
}))<{ height: number; isFocus?: boolean }>(({ height, theme, isFocus }) => ({
  marginVertical: theme.outline.width + theme.outline.offSet,
  borderRadius: theme.borderRadius.radius,
  height: height,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))
