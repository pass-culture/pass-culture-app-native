import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { OfferTileProps } from 'features/offer/types'
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

type Props = Omit<
  OfferTileProps,
  'offerLocation' | 'categoryLabel' | 'categoryId' | 'subcategoryId' | 'offerId' | 'price'
> & {
  item: Offer
}

export const OfferTileWrapper = (props: Props) => {
  const { item } = props

  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const formattedDate = getOfferDates(
    item.offer.subcategoryId,
    item.offer.dates,
    item.offer.releaseDate
  )
  const formattedPrice = getDisplayedPrice(
    item.offer?.prices,
    currency,
    euroToPacificFrancRate,
    formatPrice({
      isFixed: getIfPricesShouldBeFixed(item.offer.subcategoryId),
      isDuo: !!(item.offer.isDuo && user?.isBeneficiary),
    })
  )

  return (
    <OfferTile
      offerLocation={item._geoloc}
      categoryLabel={labelMapping[item.offer.subcategoryId]}
      categoryId={mapping[item.offer.subcategoryId]}
      subcategoryId={item.offer.subcategoryId}
      offerId={+item.objectID}
      name={item.offer.name}
      date={formattedDate}
      thumbUrl={item.offer.thumbUrl}
      price={formattedPrice}
      {...props}
    />
  )
}
