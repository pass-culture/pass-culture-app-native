import React, { PropsWithChildren } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferBodyImagePlaceholder } from 'features/offer/components/OfferBodyImagePlaceholder'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { TypoDS, getSpacing } from 'ui/theme'

type ChronicleOfferInfoProps = PropsWithChildren<{
  imageUrl: string
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
  children,
}: ChronicleOfferInfoProps) => {
  const { imageStyle } = useOfferImageContainerDimensions()

  return (
    <View style={[style, { maxWidth: imageStyle.width }]}>
      <View style={imageStyle}>
        <OfferBodyImagePlaceholder categoryId={categoryId ?? CategoryIdEnum.LIVRE} />
        <OfferImage style={imageStyle} url={imageUrl} />
      </View>
      <TextWrapper>
        <TypoDS.Title3 numberOfLines={1}>{title}</TypoDS.Title3>
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

const StyledTitle3 = styled(TypoDS.Title3)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const TextWrapper = styled.View({
  paddingVertical: getSpacing(4),
})
