import React, { useCallback, useEffect } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomeRecommendedOffers } from 'features/home/api/useHomeRecommendedOffers'
import { HomeOfferTile } from 'features/home/components/HomeOfferTile'
import { useHomePosition } from 'features/home/helpers/useHomePosition'
import { RecommendedOffersModule } from 'features/home/types'
import { analytics } from 'libs/analytics'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/dimensions'
import { ContentTypes, DisplayParametersFields } from 'libs/contentful/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { formatDates, formatDistance, getDisplayPrice } from 'libs/parsers'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'

type RecommendationModuleProps = {
  moduleId: string
  displayParameters: DisplayParametersFields
  index: number
  recommendationParameters?: RecommendedOffersModule['recommendationParameters']
  homeEntryId: string | undefined
}

const keyExtractor = (item: Offer) => item.objectID

export const RecommendationModule = (props: RecommendationModuleProps) => {
  const { displayParameters, index, recommendationParameters, moduleId, homeEntryId } = props
  const { position } = useHomePosition()
  const { user: profile } = useAuthContext()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const { offers, RecommendationApiParams } = useHomeRecommendedOffers(
    profile?.id,
    position,
    moduleId,
    recommendationParameters
  )
  const nbOffers = offers?.length ?? 0
  const shouldModuleBeDisplayed = nbOffers > displayParameters.minOffers

  const moduleName = displayParameters.title
  const logHasSeenAllTilesOnce = useFunctionOnce(() =>
    analytics.logAllTilesSeen({ moduleName, numberOfTiles: nbOffers })
  )

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage(
        moduleId,
        ContentTypes.RECOMMENDATION,
        index,
        homeEntryId
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  const renderItem: CustomListRenderItem<Offer> = useCallback(
    ({ item, width, height }) => {
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      return (
        <HomeOfferTile
          categoryLabel={labelMapping[item.offer.subcategoryId]}
          categoryId={mapping[item.offer.subcategoryId]}
          subcategoryId={item.offer.subcategoryId}
          offerId={+item.objectID}
          distance={formatDistance(item._geoloc, position)}
          name={item.offer.name}
          date={formatDates(timestampsInMillis)}
          isDuo={item.offer.isDuo}
          thumbUrl={item.offer.thumbUrl}
          price={getDisplayPrice(item.offer.prices)}
          isBeneficiary={profile?.isBeneficiary}
          moduleName={moduleName}
          moduleId={moduleId}
          width={width}
          height={height}
          homeEntryId={homeEntryId}
          apiRecoParams={RecommendationApiParams}
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      position?.longitude,
      position?.latitude,
      profile?.isBeneficiary,
      labelMapping,
      mapping,
      RecommendationApiParams,
    ]
  )

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(displayParameters.layout)

  if (!shouldModuleBeDisplayed) return <React.Fragment />
  return (
    <PassPlaylist
      testID="recommendationModuleList"
      title={displayParameters.title}
      subtitle={displayParameters.subtitle}
      data={offers ?? []}
      itemHeight={itemHeight}
      itemWidth={itemWidth}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={logHasSeenAllTilesOnce}
    />
  )
}
