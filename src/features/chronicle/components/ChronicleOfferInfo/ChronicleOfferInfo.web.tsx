import React, { PropsWithChildren } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { TypoDS, getSpacing } from 'ui/theme'

type ChronicleOfferInfoProps = PropsWithChildren<{
  imageUrl: string
  title: string
  price: string
  style?: StyleProp<ViewStyle>
}>

export const ChronicleOfferInfo = ({
  imageUrl,
  title,
  price,
  style,
  children,
}: ChronicleOfferInfoProps) => {
  const { imageStyle } = useOfferImageContainerDimensions()

  return (
    <View style={[style, { maxWidth: imageStyle.width }]}>
      <FastImage style={imageStyle} url={imageUrl} />
      <TextWrapper>
        <TypoDS.Title3 numberOfLines={1}>{title}</TypoDS.Title3>
        <StyledTitle3>{price}</StyledTitle3>
      </TextWrapper>
      {children}
    </View>
  )
}

const StyledTitle3 = styled(TypoDS.Title3)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const TextWrapper = styled.View({
  paddingVertical: getSpacing(4),
})
