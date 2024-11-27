import React from 'react'

import { RecommendationApiParams } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { HomeOfferTile } from 'features/home/components/HomeOfferTile'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { useOfferDates } from 'shared/hook/useOfferDates'
import { Offer } from 'shared/offer/types'

type Props = {
  item: Offer
  width: number
  height: number
  moduleName?: string
  moduleId?: string
  homeEntryId?: string
  apiRecoParams?: RecommendationApiParams
}

export const OfferTileWrapper = ({
  item,
  width,
  height,
  moduleName,
  moduleId,
  homeEntryId,
  apiRecoParams,
}: Props) => {
  const { user } = useAuthContext()

  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const formattedDate = useOfferDates(item)

  const isNewOfferTileDisplayed = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_OFFER_TILE)

  return (
    <HomeOfferTile
      offerLocation={item._geoloc}
      categoryLabel={labelMapping[item.offer.subcategoryId]}
      categoryId={mapping[item.offer.subcategoryId]}
      subcategoryId={item.offer.subcategoryId}
      offerId={+item.objectID}
      name={item.offer.name}
      date={formattedDate}
      isDuo={item.offer.isDuo}
      thumbUrl={item.offer.thumbUrl}
      price={getDisplayPrice(item.offer.prices)}
      isBeneficiary={user?.isBeneficiary}
      moduleName={moduleName}
      moduleId={moduleId}
      homeEntryId={homeEntryId}
      width={width}
      height={height}
      variant={isNewOfferTileDisplayed ? 'new' : 'default'}
      apiRecoParams={apiRecoParams}
    />
  )
}
