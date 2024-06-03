import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import {
  AttachedOfferCard,
  AttachedOfferCardProps,
} from 'features/home/components/AttachedOfferCard'
import { mapCategoryToIcon } from 'libs/parsers/category'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { getSpacing } from 'ui/theme'
import { RATIO_MARKETING_BLOCK } from 'ui/theme/grid'

type MarketingBlockProps = Omit<AttachedOfferCardProps, 'onPress'> & {
  accessibilityLabel: string
  navigateTo: InternalNavigationProps['navigateTo']
  backgroundImageUrl?: string
  onBeforeNavigate?: () => void
}

export const MarketingBlockContent = ({
  accessibilityLabel,
  navigateTo,
  onBeforeNavigate,
  title,
  categoryId,
  backgroundImageUrl,
  imageUrl,
  offerLocation,
  price,
  categoryText,
  date,
  withRightArrow,
  showImage,
}: MarketingBlockProps) => {
  const Icon = mapCategoryToIcon(categoryId || null)
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: theme.illustrations.sizes.small,
    color: theme.colors.greyMedium,
  }))``

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
            <StyledIcon />
          </ImagePlaceholder>
        )}
      </BackgroundImageContainer>
      <AttachedOfferCardContainer>
        <AttachedOfferCard
          title={title}
          categoryId={categoryId}
          imageUrl={imageUrl}
          offerLocation={offerLocation}
          price={price}
          categoryText={categoryText}
          date={date}
          withRightArrow={withRightArrow}
          showImage={showImage}
        />
      </AttachedOfferCardContainer>
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

const AttachedOfferCardContainer = styled.View({
  padding: getSpacing(5),
  position: 'absolute',
  width: '100%',
  bottom: 0,
})
