import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo, useState } from 'react'
import { PixelRatio, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

import { shouldDisplayExcluOffer } from 'features/home/components/ExclusivityModule.utils'
import { ExclusivityPane } from 'features/home/contentful'
import { useExcluOffer } from 'features/home/pages/useExcluOffer'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { analytics } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'
import { MARGIN_DP, LENGTH_XL, RATIO_EXCLU, Spacer, getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline'
import { Link } from 'ui/web/link/Link'

export const ExclusivityModule = ({
  alt,
  image,
  id,
  display,
}: Omit<ExclusivityPane, 'moduleId'>) => {
  const [isFocus, setIsFocus] = useState(false)
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: offer } = useExcluOffer(id)
  const { position } = useGeolocation()
  const maxPrice = useMaxPrice()

  const handlePressExclu = useCallback(() => {
    if (typeof id !== 'number') return
    navigate('Offer', { id, from: 'home' })
    analytics.logClickExclusivityBlock(id)
    analytics.logConsultOffer({ offerId: id, from: 'exclusivity' })
  }, [id])

  const source = useMemo(() => ({ uri: image }), [image])

  const shouldModuleBeDisplayed = shouldDisplayExcluOffer(display, offer, position, maxPrice)
  if (!shouldModuleBeDisplayed) return <React.Fragment />
  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <ImageContainer>
        <TouchableHighlight
          onPress={handlePressExclu}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          isFocus={isFocus}
          testID="imageExclu">
          <Link
            to={{ screen: 'Offer', params: { id, from: 'home' } }}
            style={styles.link}
            accessible={false}>
            <Image source={source} accessible={false} accessibilityLabel={alt} />
          </Link>
        </TouchableHighlight>
      </ImageContainer>
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

const Row = styled.View({
  flexDirection: 'row',
  paddingBottom: getSpacing(6),
})

const ImageContainer = styled.View({
  flex: 1,
  maxHeight: LENGTH_XL,
})

const TouchableHighlight = styled.TouchableHighlight<{ isFocus?: boolean }>(
  ({ theme, isFocus }) => ({
    borderRadius: theme.borderRadius.radius,
    maxHeight: LENGTH_XL,
    ...customFocusOutline(theme, isFocus),
  })
)

const Image = styled(FastImage)(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.radius,
  maxHeight: LENGTH_XL,
  height: PixelRatio.roundToNearestPixel((theme.appContentWidth - 2 * MARGIN_DP) * RATIO_EXCLU),
}))

const styles = StyleSheet.create({
  link: {
    flexDirection: 'column',
    display: 'flex',
  },
})
