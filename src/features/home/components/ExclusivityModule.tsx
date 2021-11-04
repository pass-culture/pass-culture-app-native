import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { PixelRatio } from 'react-native'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { ExclusivityPane } from 'features/home/contentful'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useOffer } from 'features/offer/api/useOffer'
import { analytics } from 'libs/analytics'
import { MARGIN_DP, LENGTH_XL, RATIO_EXCLU, getSpacing } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

export const ExclusivityModule = ({ alt, image, id }: ExclusivityPane) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: offer } = useOffer({ offerId: id })

  const handlePressExclu = useCallback(() => {
    if (typeof id !== 'number') return
    navigate('Offer', { id, from: 'home' })
    analytics.logClickExclusivityBlock(id)
  }, [id])

  const source = useMemo(() => ({ uri: image }), [image])

  if (!offer) return null
  return (
    <TouchableHighlight onPress={handlePressExclu} testID="imageExclu">
      <Image source={source} accessible={!!alt} accessibilityLabel={alt} />
    </TouchableHighlight>
  )
}

const Image = styled(FastImage)(({ theme }) => ({
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  maxHeight: LENGTH_XL,
  height: PixelRatio.roundToNearestPixel((theme.appContentWidth - 2 * MARGIN_DP) * RATIO_EXCLU),
}))

const TouchableHighlight = styled.TouchableHighlight({
  flex: 1,
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  maxHeight: LENGTH_XL,
  marginHorizontal: getSpacing(6),
})
