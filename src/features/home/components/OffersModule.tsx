import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { OfferTile, ModuleTitle } from 'features/home/atoms'
import { CustomListRenderItem, Playlist } from 'features/home/components/Playlist'
import { SearchParametersFields, DisplayParametersFields } from 'features/home/contentful'
import { getPlaylistItemDimensionsFromLayout } from 'features/home/contentful/dimensions'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics } from 'libs/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { formatDates, formatDistance, getDisplayPrice } from 'libs/parsers'
import { SearchHit, useParseSearchParameters } from 'libs/search'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
import { ColorsEnum, Spacer } from 'ui/theme'

type OffersModuleProps = {
  search: SearchParametersFields
  display: DisplayParametersFields
  isBeneficiary?: boolean
  position: GeoCoordinates | null
  hits: SearchHit[]
  nbHits: number
  cover: string | null
  index: number
}

const keyExtractor = (item: SearchHit) => item.objectID

export const OffersModule = (props: OffersModuleProps) => {
  const { nbHits, cover, display, search: parameters, position, index, isBeneficiary, hits } = props

  const { navigate } = useNavigation<UseNavigationType>()
  const parseSearchParameters = useParseSearchParameters()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const moduleName = display.title || parameters.title
  const logHasSeenAllTilesOnce = useFunctionOnce(() =>
    analytics.logAllTilesSeen(moduleName, hits.length)
  )

  const renderItem: CustomListRenderItem<SearchHit> = useCallback(
    ({ item, width, height }) => {
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      return (
        <OfferTile
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
          layout={display.layout}
          isBeneficiary={isBeneficiary}
          moduleName={moduleName}
          width={width}
          height={height}
        />
      )
    },
    [position, isBeneficiary, labelMapping, mapping]
  )

  const showSeeMore =
    hits.length < nbHits &&
    !(parameters.tags || parameters.beginningDatetime || parameters.endingDatetime)
  const onPressSeeMore = showSeeMore
    ? () => {
        analytics.logClickSeeMore(moduleName)
        // When we navigate to the search page, we want to show 20 results per page,
        // not what is configured in contentful
        const params = { ...parseSearchParameters(parameters), hitsPerPage: 20 }
        navigate(...getTabNavConfig('Search', params))
      }
    : undefined

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(display.layout)

  const shouldModuleBeDisplayed = hits.length > 0 && nbHits >= display.minOffers
  if (!shouldModuleBeDisplayed) return <React.Fragment />
  return (
    <React.Fragment>
      <ModuleTitle
        title={display.title}
        color={index === 0 ? ColorsEnum.WHITE : ColorsEnum.BLACK}
      />
      <Spacer.Column numberOfSpaces={4} />
      <Playlist
        testID="offersModuleList"
        data={hits}
        itemHeight={itemHeight}
        itemWidth={itemWidth}
        cover={cover}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={logHasSeenAllTilesOnce}
        onPressSeeMore={onPressSeeMore}
      />
    </React.Fragment>
  )
}
