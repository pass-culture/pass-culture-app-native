import React, { useCallback, useEffect } from 'react'

import { useUserProfileInfo } from 'features/home/api'
import { HomeOfferTile } from 'features/home/atoms'
import { DisplayParametersFields } from 'features/home/contentful'
import { getPlaylistItemDimensionsFromLayout } from 'features/home/contentful/dimensions'
import { useHomeRecommendedHits } from 'features/home/pages/useHomeRecommendedHits'
import { analytics } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { formatDates, formatDistance, getDisplayPrice } from 'libs/parsers'
import { SearchHit } from 'libs/search'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'

type RecommendationModuleProps = {
  display: DisplayParametersFields
  index: number
}

const keyExtractor = (item: SearchHit) => item.objectID

export const RecommendationModule = (props: RecommendationModuleProps) => {
  const { display, index } = props
  const { position } = useGeolocation()
  const { data: profile } = useUserProfileInfo()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const hits = useHomeRecommendedHits(profile?.id, position)
  const nbHits = hits?.length || 0
  const shouldModuleBeDisplayed = nbHits > display.minOffers

  const moduleName = display.title
  const logHasSeenAllTilesOnce = useFunctionOnce(() =>
    analytics.logAllTilesSeen(moduleName, nbHits)
  )

  useEffect(() => {
    if (nbHits > 0 && shouldModuleBeDisplayed) {
      analytics.logRecommendationModuleSeen(display.title, nbHits)
    }
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
    [position, profile?.isBeneficiary]
  )

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(display.layout)

  if (!shouldModuleBeDisplayed) return <React.Fragment />
  return (
    <PassPlaylist
      testID="recommendationModuleList"
      title={display.title}
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
