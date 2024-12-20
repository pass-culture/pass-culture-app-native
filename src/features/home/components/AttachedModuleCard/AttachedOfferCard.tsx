import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { AttachedCardDisplay } from 'features/home/components/AttachedModuleCard/AttachedCardDisplay'
import { getExclusivityAccessibilityLabel } from 'features/home/helpers/getExclusivityAccessibilityLabel'
import { useGetPacificFrancToEuroRate } from 'libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate'
import { useDistance } from 'libs/location/hooks/useDistance'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { Offer } from 'shared/offer/types'
import { OfferImage } from 'ui/components/tiles/OfferImage'

type Props = {
  offer: Offer
  shouldFixHeight?: boolean
}

export const AttachedOfferCard: React.FC<Props> = ({ offer, shouldFixHeight }) => {
  const { offer: attachedOffer } = offer
  const { user } = useAuthContext()
  const mapping = useCategoryIdMapping()
  const categoryId = mapping[attachedOffer.subcategoryId]
  const labelMapping = useCategoryHomeLabelMapping()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const categoryName = labelMapping[attachedOffer.subcategoryId] ?? ''
  const details = []

  const timestampsInMillis = attachedOffer.dates?.map((timestampInSec) => timestampInSec * 1000)
  const date = formatDates(timestampsInMillis)
  const price = getDisplayedPrice(
    attachedOffer.prices,
    currency,
    euroToPacificFrancRate,
    attachedOffer.isDuo && user?.isBeneficiary
  )
  const distance = useDistance(offer._geoloc)
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
