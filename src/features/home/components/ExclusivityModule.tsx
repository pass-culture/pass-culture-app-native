import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo, useState } from 'react'
import { PixelRatio } from 'react-native'
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
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { TouchableLink } from 'ui/web/link/TouchableLink'

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const source = useMemo(() => ({ uri: image }), [image])

  const shouldModuleBeDisplayed = shouldDisplayExcluOffer(display, offer, position, maxPrice)
  if (!shouldModuleBeDisplayed) return <React.Fragment />
  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <ImageContainer>
        <StyledTouchableLink
          highlight
          to={{ screen: 'Offer', params: { id, from: 'home' } }}
          onPress={handlePressExclu}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          isFocus={isFocus}
          testID="imageExclu">
          <Image source={source} accessible={false} accessibilityLabel={alt} />
        </StyledTouchableLink>
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

const StyledTouchableLink = styled(TouchableLink)<{ isFocus?: boolean }>(({ theme, isFocus }) => ({
  borderRadius: theme.borderRadius.radius,
  maxHeight: LENGTH_XL,
  ...customFocusOutline(theme, undefined, isFocus),
}))

const Image = styled(FastImage)(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.radius,
  maxHeight: LENGTH_XL,
  height: PixelRatio.roundToNearestPixel((theme.appContentWidth - 2 * MARGIN_DP) * RATIO_EXCLU),
}))
