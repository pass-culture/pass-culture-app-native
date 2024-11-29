import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { OfferTileProps } from 'features/offer/types'
import { useGetDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useOfferDates } from 'shared/hook/useOfferDates'
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

  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const formattedDate = useOfferDates(item)
  const formattedPrice = useGetDisplayPrice(item.offer.prices)

  return (
    <OfferTile
      offerLocation={item._geoloc}
      categoryLabel={labelMapping[item.offer.subcategoryId]}
      categoryId={mapping[item.offer.subcategoryId]}
      subcategoryId={item.offer.subcategoryId}
      offerId={+item.objectID}
      name={item.offer.name}
      date={formattedDate}
      isDuo={item.offer.isDuo}
      thumbUrl={item.offer.thumbUrl}
      price={formattedPrice}
      isBeneficiary={user?.isBeneficiary}
      {...props}
    />
  )
}
