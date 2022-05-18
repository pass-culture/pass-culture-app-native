import React, { useCallback, useEffect } from 'react'

import { useHomeRecommendedHits } from 'features/home/api/useHomeRecommendedHits'
import { HomeOfferTile } from 'features/home/atoms'
import { DisplayParametersFields, RecommendationParametersFields } from 'features/home/contentful'
import { getPlaylistItemDimensionsFromLayout } from 'features/home/contentful/dimensions'
import { useUserProfileInfo } from 'features/profile/api'
import { analytics } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { formatDates, formatDistance, getDisplayPrice } from 'libs/parsers'
import { SearchHit } from 'libs/search'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'

type RecommendationModuleProps = {
  displayParameters: DisplayParametersFields
  index: number
  recommendationParameters?: RecommendationParametersFields
}

const keyExtractor = (item: SearchHit) => item.objectID

export const RecommendationModule = (props: RecommendationModuleProps) => {
  const { displayParameters, index, recommendationParameters } = props
  const { position } = useGeolocation()
  const { data: profile } = useUserProfileInfo()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const hits = useHomeRecommendedHits(profile?.id, position, recommendationParameters)
  const nbHits = hits?.length || 0
  const shouldModuleBeDisplayed = nbHits > displayParameters.minOffers

  const moduleName = displayParameters.title
  const logHasSeenAllTilesOnce = useFunctionOnce(() =>
    analytics.logAllTilesSeen(moduleName, nbHits)
  )

  useEffect(() => {
    if (nbHits > 0 && shouldModuleBeDisplayed) {
      analytics.logRecommendationModuleSeen(displayParameters.title, nbHits)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nbHits])

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
          width={width}
          height={height}
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [position, profile?.isBeneficiary]
  )

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(displayParameters.layout)

  if (!shouldModuleBeDisplayed) return <React.Fragment />
  return (
    <PassPlaylist
      testID="recommendationModuleList"
      title={displayParameters.title}
      onDarkBackground={index === 0}
      data={hits || []}
      itemHeight={itemHeight}
      itemWidth={itemWidth}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={logHasSeenAllTilesOnce}
    />
  )
}
