import React, { memo, useEffect } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { OfferTileProps } from 'features/offer/types'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useDistance } from 'libs/location/hooks/useDistance'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
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
    ...offer
  } = props

  const theme = useTheme()
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const prePopulateOffer = usePrePopulateOffer()

  const { offerId, name, date, price, categoryId, thumbUrl, offerLocation } = props

  const distanceFromOffer = useDistance(offerLocation)

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.OFFER, {
    ...offer,
    categoryLabel,
    distance: distanceFromOffer,
  })

  useEffect(() => {
    if (offer) {
      // We pre-populate the query-cache with the data from the search result for a smooth transition
      prePopulateOffer(offer)
    }
  }, [offer, prePopulateOffer])

  function handlePressOffer() {
    triggerConsultOfferLog({
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
    })
  }

  return (
    <View {...getHeadingAttrs(3)}>
      <StyledTouchableLink
        highlight
        height={height + theme.tiles.maxCaptionHeight.offerTile}
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
          withPush: true,
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
          name={name}
          date={date}
          price={price}
          categoryLabel={categoryLabel}
          width={width}
          height={height}
        />
      </StyledTouchableLink>
    </View>
  )
}

export const OfferTile = memo(UnmemoizedOfferTile)

const StyledTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  underlayColor: theme.colors.white,
}))<{ height: number; isFocus?: boolean }>(({ height, theme, isFocus }) => ({
  marginVertical: theme.outline.width + theme.outline.offSet,
  borderRadius: theme.borderRadius.radius,
  height: height,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))
