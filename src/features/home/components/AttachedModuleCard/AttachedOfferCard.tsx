import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { AttachedCardDisplay } from 'features/home/components/AttachedModuleCard/AttachedCardDisplay'
import { getExclusivityAccessibilityLabel } from 'features/home/helpers/getExclusivityAccessibilityLabel'
import { useLocation } from 'libs/location'
import { getDistance } from 'libs/location/getDistance'
import { formatDates, getTimeStampInMillis } from 'libs/parsers/formatDates'
import {
  formatPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Offer } from 'shared/offer/types'
import { OfferImage } from 'ui/components/tiles/OfferImage'

type Props = {
  offer: Offer
  shouldFixHeight?: boolean
  comingSoon?: string
}

export const AttachedOfferCard: React.FC<Props> = ({ offer, shouldFixHeight, comingSoon }) => {
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()
  const { offer: attachedOffer } = offer
  const { user } = useAuthContext()
  const mapping = useCategoryIdMapping()
  const categoryId = mapping[attachedOffer.subcategoryId]
  const labelMapping = useCategoryHomeLabelMapping()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const categoryName = labelMapping[attachedOffer.subcategoryId] ?? ''
  const details: string[] = []

  const date = attachedOffer.dates && formatDates(getTimeStampInMillis(attachedOffer.dates))
  const price = getDisplayedPrice(
    attachedOffer.prices,
    currency,
    euroToPacificFrancRate,
    formatPrice({
      isFixed: getIfPricesShouldBeFixed(attachedOffer.subcategoryId),
      isDuo: !!(attachedOffer.isDuo && user?.isBeneficiary),
    })
  )
  const distance = getDistance(offer._geoloc, { userLocation, selectedPlace, selectedLocationMode })
  const distanceLabel = distance ? `à ${distance}` : undefined

  if (date) details.push(date)
  if (price) details.push(price)
  if (!attachedOffer.name) return null

  const accessibilityLabel = getExclusivityAccessibilityLabel({
    offerName: attachedOffer.name,
    offerCategory: categoryName,
    offerDate: date,
    offerPrice: price,
    offerDistance: distanceLabel,
  })

  return (
    <AttachedCardDisplay
      title={attachedOffer.name}
      subtitle={categoryName}
      details={details}
      rightTagLabel={distanceLabel}
      accessibilityLabel={accessibilityLabel}
      bottomBannerText={comingSoon}
      LeftImageComponent={() => (
        <OfferImage
          imageUrl={attachedOffer?.thumbUrl}
          categoryId={categoryId}
          borderRadius={5}
          withStroke
        />
      )}
      shouldFixHeight={shouldFixHeight}
    />
  )
}
