import { CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { fetchEuroOffers } from 'libs/algolia/fetchAlgolia/fetchEuroOffers'
import { usePlaylistItemDimensionsFromLayout } from 'libs/contentful/usePlaylistItemDimensionsFromLayout'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PixelRatio, Text } from 'react-native'
import styled from 'styled-components'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { LENGTH_L, LENGTH_M, MARGIN_DP, RATIO_HOME_IMAGE } from 'ui/theme'

const LENGTH_S = PixelRatio.roundToNearestPixel(6.5 * MARGIN_DP)

export const EuropeanPlaylist = (offers) => {
  const [data, setData] = useState(null)
  const { t } = useTranslation()
  const { itemWidth, itemHeight } = usePlaylistItemDimensionsFromLayout('two-items')

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchEuroOffers()
      console.log(response)
      setData(response)
    }

    fetchData()
  }, [])

  if (!data) {
    return <React.Fragment></React.Fragment>
  }

  return (
    <StyledPassPlaylist
      data={data}
      title={t('playlist')}
      keyExtractor={(item) => item.objectID}
      itemWidth={itemWidth}
      itemHeight={LENGTH_S}
      renderItem={({ item }) => {
        console.log(item)
        return (
          <OfferTile
            categoryId={CategoryIdEnum.MUSEE}
            categoryLabel=""
            subcategoryId={SubcategoryIdEnum.VISITE}
            offerLocation={item._geoloc}
            thumbUrl={item.european_offer.imageUrl}
            width={itemWidth}
            height={itemHeight}
          />
        )
      }}
    />
  )
}

const StyledPassPlaylist = styled(PassPlaylist)({
  paddingBottom: 0,
})
