import React from 'react'
import { Dimensions, Platform } from 'react-native'
import styled from 'styled-components/native'

import { AlgoliaCategory } from 'libs/algolia'
import { mapCategoryToIcon } from 'libs/parsers'
import { OfferBackPlaceholder } from 'ui/svg/OfferBackPlaceholder'
import { OfferPlaceholder } from 'ui/svg/OfferPlaceholder'
import { Rectangle } from 'ui/svg/Rectangle'
import { ColorsEnum, getSpacing, Spacer, getShadow } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface Props {
  imageUrl: string
  category?: AlgoliaCategory | null
}

export const OfferHero: React.FC<Props> = ({ imageUrl, category }) => {
  const { top } = useCustomSafeInsets()
  const CategoryIcon = mapCategoryToIcon(category || null)
  return (
    <HeroContainer>
      {imageUrl ? (
        <BlurImage
          extraHeight={top}
          blurRadius={Platform.OS === 'android' ? 5 : 20}
          resizeMode={'cover'}
          source={{ uri: imageUrl }}
        />
      ) : (
        <OfferBackPlaceholder
          testID="offerBackPlaceholder"
          width={screenWidth}
          height={blurImageHeight + top}
        />
      )}
      <Rectangle size={screenWidth} />
      <ImageContainer>
        {imageUrl ? (
          <Image resizeMode="cover" source={{ uri: imageUrl }} />
        ) : (
          <React.Fragment>
            <OfferPlaceholder testID="offerPlaceholder" width={imageWidth} height={imageHeight} />
            <CategoryIconContainer>
              <Spacer.Flex />
              <CategoryIcon
                testID="categoryIcon"
                size={getSpacing(24)}
                color={ColorsEnum.GREY_MEDIUM}
              />
              <Spacer.Flex />
            </CategoryIconContainer>
          </React.Fragment>
        )}
      </ImageContainer>
      <Spacer.Column numberOfSpaces={18} />
    </HeroContainer>
  )
}
const blurImageHeight = getSpacing(74)

const imageWidth = getSpacing(53)
const imageHeight = getSpacing(79)

/** Add 1 pixel to avoid 1 white pixel on androids */
const screenWidth = Dimensions.get('window').width + 1

const HeroContainer = styled.View({ alignItems: 'center' })
const CategoryIconContainer = styled.View({
  height: '100%',
  width: '100%',
  position: 'absolute',
  alignItems: 'center',
})
const BlurImage = styled.Image<{ extraHeight: number }>(({ extraHeight }) => ({
  height: blurImageHeight + extraHeight,
  width: screenWidth,
}))
const ImageContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(2),
    },
    shadowRadius: getSpacing(3),
    shadowColor: ColorsEnum.BLACK,
    shadowOpacity: 0.2,
  }),
})
const Image = styled.Image({
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  height: imageHeight,
  width: imageWidth,
})
