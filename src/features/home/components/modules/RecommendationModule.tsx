import React, { useCallback, useEffect } from 'react'

import { useHomeRecommendedHits } from 'features/home/api/useHomeRecommendedHits'
import { HomeOfferTile } from 'features/home/atoms'
import {
  ContentTypes,
  DisplayParametersFields,
  RecommendationParametersFields,
} from 'features/home/contentful'
import { getPlaylistItemDimensionsFromLayout } from 'features/home/contentful/dimensions'
import { useUserProfileInfo } from 'features/profile/api'
import { analytics } from 'libs/firebase/analytics'
import { useGeolocation } from 'libs/geolocation'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { formatDates, formatDistance, getDisplayPrice } from 'libs/parsers'
import { SearchHit } from 'libs/search'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'

type RecommendationModuleProps = {
  moduleId: string
  displayParameters: DisplayParametersFields
  index: number
  recommendationParameters?: RecommendationParametersFields
  homeEntryId: string | undefined
}

const keyExtractor = (item: SearchHit) => item.objectID

export const RecommendationModule = (props: RecommendationModuleProps) => {
  const { displayParameters, index, recommendationParameters, moduleId, homeEntryId } = props
  const { position } = useGeolocation()
  const { data: profile } = useUserProfileInfo()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const hits = useHomeRecommendedHits(profile?.id, position, moduleId, recommendationParameters)
  const nbHits = hits?.length || 0
  const shouldModuleBeDisplayed = nbHits > displayParameters.minOffers

  const moduleName = displayParameters.title
  const logHasSeenAllTilesOnce = useFunctionOnce(() =>
    analytics.logAllTilesSeen(moduleName, nbHits)
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

  const renderItem: CustomListRenderItem<SearchHit> = useCallback(
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
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [position, profile?.isBeneficiary, labelMapping, mapping]
  )

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(displayParameters.layout)

  if (!shouldModuleBeDisplayed) return <React.Fragment />
  return (
    <PassPlaylist
      testID="recommendationModuleList"
      title={displayParameters.title}
      subtitle={displayParameters.subtitle}
      data={hits || []}
      itemHeight={itemHeight}
      itemWidth={itemWidth}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={logHasSeenAllTilesOnce}
    />
  )
}
