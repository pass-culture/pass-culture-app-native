import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { MarketingBlockProps } from 'features/home/components/modules/marketing/MarketingBlock'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { All } from 'ui/svg/icons/bicolor/All'
import { getSpacing } from 'ui/theme'
import { RATIO_MARKETING_BLOCK } from 'ui/theme/grid'

export const MarketingBlockContent = ({
  navigateTo,
  onBeforeNavigate,
  AttachedCardComponent,
  backgroundImageUrl,
  accessibilityLabel,
}: MarketingBlockProps) => {
  return (
    <InternalTouchableLink
      navigateTo={navigateTo}
      onBeforeNavigate={onBeforeNavigate}
      accessibilityLabel={accessibilityLabel}>
      <BackgroundImageContainer>
        {backgroundImageUrl ? (
          <StyledFastImage url={backgroundImageUrl} />
        ) : (
          <ImagePlaceholder>
            <StyledAll />
          </ImagePlaceholder>
        )}
        <AttachedOfferCardContainer>{AttachedCardComponent}</AttachedOfferCardContainer>
      </BackgroundImageContainer>
    </InternalTouchableLink>
  )
}

const BackgroundImageContainer = styled.View(({ theme }) => ({
  maxHeight: getSpacing(118.75),
  height: PixelRatio.roundToNearestPixel(theme.appContentWidth * RATIO_MARKETING_BLOCK),
  backgroundColor: theme.colors.greyLight,
  overflow: 'hidden',
}))

const StyledFastImage = styled(FastImage)({
  height: '100%',
  width: '100%',
})

const ImagePlaceholder = styled.View({
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
})

const StyledAll = styled(All).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.small,
  color: theme.colors.greyMedium,
}))``

const AttachedOfferCardContainer = styled.View({
  padding: getSpacing(5),
  position: 'absolute',
  width: '100%',
  bottom: 0,
})
