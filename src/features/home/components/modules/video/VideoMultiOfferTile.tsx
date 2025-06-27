import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { PlaylistCardOffer } from 'features/offer/components/OfferTile/PlaylistCardOffer'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { useLocation } from 'libs/location'
import { getDistance } from 'libs/location/getDistance'
import {
  formatPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { getOfferDates } from 'shared/date/getOfferDates'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing } from 'ui/theme'

type Props = {
  offer: Offer
  hideModal: () => void
  analyticsParams: OfferAnalyticsParams
}

export const VideoMultiOfferTile: FunctionComponent<Props> = ({
  offer,
  hideModal,
  analyticsParams,
}) => {
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()
  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const labelMapping = useCategoryHomeLabelMapping()
  const prePopulateOffer = usePrePopulateOffer()
  const mapping = useCategoryIdMapping()
  const { subcategoryId, dates, releaseDate, isDuo, thumbUrl, name } = offer.offer

  const displayPrice = getDisplayedPrice(
    offer?.offer?.prices,
    currency,
    euroToPacificFrancRate,
    formatPrice({
      isFixed: getIfPricesShouldBeFixed(subcategoryId),
      isDuo: !!(isDuo && user?.isBeneficiary),
    })
  )

  const displayDate = getOfferDates({
    subcategoryId,
    dates,
    releaseDate,
  })
  const displayDistance = getDistance(offer._geoloc, {
    userLocation,
    selectedPlace,
    selectedLocationMode,
  })

  const categoryId = mapping[subcategoryId]

  const categoryLabel = labelMapping[subcategoryId]

  return (
    <Container>
      <StyledTouchableLink
        navigateTo={{
          screen: 'Offer',
          params: { id: +offer.objectID },
        }}
        onBeforeNavigate={() => {
          hideModal()
          prePopulateOffer({
            ...offer.offer,
            offerId: +offer.objectID,
            categoryId,
          })
          triggerConsultOfferLog({
            offerId: +offer.objectID,
            ...analyticsParams,
          })
        }}
        testId="multi-offer-tile">
        <PlaylistCardOffer
          categoryId={categoryId}
          thumbnailUrl={thumbUrl}
          distance={displayDistance}
          name={name}
          date={displayDate}
          price={displayPrice}
          categoryLabel={categoryLabel}
          width={getSpacing(26)}
          height={getSpacing(39)}
        />
      </StyledTouchableLink>
    </Container>
  )
}

const Container = styled(View)(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.default,
  borderRadius: getSpacing(2),
}))

const StyledTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  width: theme.tiles.sizes['large'].width,
}))
