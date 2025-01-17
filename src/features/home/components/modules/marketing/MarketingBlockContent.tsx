import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { BlackGradient } from 'features/home/components/BlackGradient'
import { MarketingBlockProps } from 'features/home/components/modules/marketing/MarketingBlock'
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
  withGradient,
  gradientHeight,
}: MarketingBlockProps) => {
  return (
    <InternalTouchableLink
      navigateTo={navigateTo}
      onBeforeNavigate={onBeforeNavigate}
      accessibilityLabel={accessibilityLabel}>
      <BackgroundImageContainer>
        {backgroundImageUrl ? (
          <ImageBackground source={{ uri: backgroundImageUrl }}>
            {withGradient ? (
              <BlackGradient height={gradientHeight} testID="black-gradient" />
            ) : null}
          </ImageBackground>
        ) : (
          <ImagePlaceholder>
            {withGradient ? (
              <BlackGradient height={gradientHeight} testID="black-gradient" />
            ) : null}
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

const ImageBackground = styled.ImageBackground({
  height: '100%',
  width: '100%',
  overflow: 'hidden',
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
