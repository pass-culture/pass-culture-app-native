import React, { memo, useCallback, useEffect, useState } from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { useExcluOffer } from 'features/home/api/useExcluOffer'
import { shouldDisplayExcluOffer } from 'features/home/components/ExclusivityModule.utils'
import { ContentTypes, ExclusivityPane } from 'features/home/contentful'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { analytics } from 'libs/firebase/analytics'
import { useGeolocation } from 'libs/geolocation'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { MARGIN_DP, LENGTH_XL, RATIO_EXCLU, Spacer, getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

export interface ExclusivityModuleProps extends ExclusivityPane {
  homeEntryId: string | undefined
  index: number
}

const UnmemoizedExclusivityModule = ({
  title,
  alt,
  image: imageURL,
  id,
  moduleId,
  display,
  homeEntryId,
  index,
}: ExclusivityModuleProps) => {
  const [isFocus, setIsFocus] = useState(false)
  const { data: offer } = useExcluOffer(id)
  const { position } = useGeolocation()
  const maxPrice = useMaxPrice()

  const handlePressExclu = useCallback(() => {
    if (typeof id !== 'number') return
    analytics.logExclusivityBlockClicked({ moduleName: title, moduleId })
    analytics.logConsultOffer({ offerId: id, moduleName: title, moduleId, from: 'exclusivity' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const shouldModuleBeDisplayed = shouldDisplayExcluOffer(display, offer, position, maxPrice)

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage(moduleId, ContentTypes.EXCLUSIVITY, index, homeEntryId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return <React.Fragment />

  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <ImageContainer>
        <StyledTouchableLink
          highlight
          navigateBeforeOnPress
          navigateTo={
            typeof id === 'number' ? { screen: 'Offer', params: { id, from: 'home' } } : undefined
          }
          onPress={handlePressExclu}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          isFocus={isFocus}
          testID="imageExclu">
          <Image url={imageURL} accessible={false} accessibilityLabel={alt} />
        </StyledTouchableLink>
      </ImageContainer>
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

export const ExclusivityModule = memo(UnmemoizedExclusivityModule)

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
  ...customFocusOutline(theme, theme.colors.black, isFocus),
}))

const Image = styled(FastImage)(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.radius,
  maxHeight: LENGTH_XL,
  height: PixelRatio.roundToNearestPixel((theme.appContentWidth - 2 * MARGIN_DP) * RATIO_EXCLU),
}))
