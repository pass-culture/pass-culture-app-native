import React from 'react'
import { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getTagConfig } from 'features/offer/components/InteractionTag/getTagConfig'
import { InteractionTag } from 'features/offer/components/InteractionTag/InteractionTag'
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
  hasSmallLayout?: boolean
}

export const OfferTileWrapper = (props: Props) => {
  const { item, hasSmallLayout } = props
  const theme = useTheme()
  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const formattedDate = getOfferDates(
    item.offer.subcategoryId,
    item.offer.dates,
    item.offer.releaseDate,
    true
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

  const tagConfig = getTagConfig({
    theme,
    likesCount: item.offer.likes,
    chroniclesCount: item.offer.chroniclesCount,
    headlinesCount: item.offer.headlineCount,
    hasSmallLayout,
    isComingSoonOffer: item._tags?.includes('is_future'),
  })

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
      interactionTag={tagConfig ? <InteractionTag {...tagConfig} /> : null}
      {...props}
    />
  )
}
