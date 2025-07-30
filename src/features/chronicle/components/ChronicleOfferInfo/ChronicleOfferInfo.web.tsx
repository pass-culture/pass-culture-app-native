import React, { PropsWithChildren } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferBodyImagePlaceholder } from 'features/offer/components/OfferBodyImagePlaceholder'
import { OfferImageContainerDimensions } from 'features/offer/types'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Typo } from 'ui/theme'

type ChronicleOfferInfoProps = PropsWithChildren<{
  imageUrl: string
  imageDimensions: OfferImageContainerDimensions
  title: string
  price: string
  categoryId?: CategoryIdEnum
  style?: StyleProp<ViewStyle>
}>

export const ChronicleOfferInfo = ({
  imageUrl,
  title,
  price,
  style,
  categoryId,
  imageDimensions,
  children,
}: ChronicleOfferInfoProps) => {
  return (
    <View style={[style, { maxWidth: imageDimensions.imageStyle.width }]}>
      <View style={imageDimensions.imageStyle}>
        <OfferBodyImagePlaceholder categoryId={categoryId ?? CategoryIdEnum.LIVRE} />
        {imageUrl ? (
          <OfferImage style={imageDimensions.imageStyle} url={imageUrl} testID="offerImage" />
        ) : null}
      </View>
      <TextWrapper>
        <Typo.Title3 numberOfLines={1}>{title}</Typo.Title3>
        <StyledTitle3>{price}</StyledTitle3>
      </TextWrapper>
      {children}
    </View>
  )
}

const OfferImage = styled(FastImage)({
  position: 'absolute',
  zIndex: 2,
})

const StyledTitle3 = styled(Typo.Title3)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const TextWrapper = styled.View(({ theme }) => ({
  paddingVertical: theme.designSystem.size.spacing.l,
}))
