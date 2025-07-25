import React from 'react'
import { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { renderInteractionTag } from 'features/offer/components/InteractionTag/InteractionTag'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
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
  containerWidth?: number
}

export const OfferTileWrapper = React.memo(function OfferTileWrapper(props: Props) {
  const { item, hasSmallLayout } = props
  const theme = useTheme()
  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const {
    subcategoryId,
    dates,
    releaseDate,
    isDuo,
    likes,
    chroniclesCount,
    headlineCount,
    name,
    thumbUrl,
  } = item.offer

  const formattedDate = getOfferDates({
    subcategoryId,
    dates,
    releaseDate,
    isPlaylist: true,
  })
  const formattedPrice = getDisplayedPrice(
    item.offer?.prices,
    currency,
    euroToPacificFrancRate,
    formatPrice({
      isFixed: getIfPricesShouldBeFixed(subcategoryId),
      isDuo: !!(isDuo && user?.isBeneficiary),
    })
  )

  const tag = renderInteractionTag({
    theme,
    likesCount: likes,
    chroniclesCount: chroniclesCount,
    headlinesCount: headlineCount,
    hasSmallLayout,
    isComingSoonOffer: getIsAComingSoonOffer(item.offer.bookingAllowedDatetime),
    subcategoryId: item.offer.subcategoryId,
  })

  return (
    <OfferTile
      offerLocation={item._geoloc}
      categoryLabel={labelMapping[subcategoryId]}
      categoryId={mapping[subcategoryId]}
      subcategoryId={subcategoryId}
      offerId={+item.objectID}
      name={name}
      date={formattedDate}
      thumbUrl={thumbUrl}
      price={formattedPrice}
      interactionTag={tag}
      {...props}
    />
  )
})
